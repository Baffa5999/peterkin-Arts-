/**
 * THE HERO FILM
 * ------------------------------------------------------------------
 * Builds the looping clip that opens the site: five shots cut from five
 * paintings, crossfading, ~21 seconds.
 *
 * Four shots are REAL CAMERA MOVES — a virtual camera pushing in across
 * the actual scans. Every pixel is the artist's paint. The fifth is a
 * generated gallery pull-back, used only on the abstract, where
 * re-rendering reads as motion rather than as damage.
 *
 * TWO RULES THIS SCRIPT NOW ENFORCES
 *
 * 1. NO PAINTING IS EVER CUT. Earlier versions pushed in past the edges
 *    of the work — good cinema, wrong for a portfolio, because a
 *    collector never saw a whole piece. `safeZoom()` computes the
 *    tightest framing that still contains the entire canvas, and every
 *    move stops there. The margin is arithmetic, not eyeballed.
 *
 * 2. IT IS CUT TWICE, IN TWO SHAPES. A 16:9 film in a phone's tall hero
 *    lost 64% of its width to object-cover. So there is a 16:9 cut for
 *    wide screens and a 4:5 cut for phones, each framed for its own
 *    shape. The player picks by viewport and uses object-contain, so
 *    nothing is ever cropped by CSS either — and because the film's wall
 *    is the same near-black as the page, the letterbox is invisible.
 *
 * Run: node scripts/build-film.mjs      (needs ffmpeg on PATH)
 */

import sharp from "sharp";
import { execFileSync } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const WORKS = path.join(process.cwd(), "public", "works");
const TMP = "/tmp/film";
const OUT = path.join(process.cwd(), "public", "film");
const AI_SOURCE = path.join(TMP, "ai-dance.mp4");

const WALL = { r: 11, g: 10, b: 9 };
const FPS = 24;

/** The two shapes the film is cut in. */
const CUTS = [
  { name: "hero-1080", canvasW: 3840, canvasH: 2160, outW: 1920, outH: 1080, crf: 30 },
  { name: "hero-portrait", canvasW: 2400, canvasH: 3000, outW: 1080, outH: 1350, crf: 30 },
];

const SHOTS = [
  { slug: "the-suit", seconds: 5.5, drift: 0 },
  { slug: "ankara", seconds: 5.0, drift: 0.04 },
  { slug: "braids", seconds: 4.5, drift: -0.03 },
  { slug: "saxophone", seconds: 5.0, drift: 0 },
];
const AI_SECONDS = 5.0;
const FADE = 0.9;

/**
 * Hangs a painting on a dark wall, with a soft pool of light behind it
 * and a drop shadow so it sits on the wall rather than on the screen.
 * The work is sized to leave a comfortable margin on every side.
 */
async function hang(slug, canvasW, canvasH) {
  const src = path.join(WORKS, `${slug}.jpg`);
  const meta0 = await sharp(src).metadata();

  /* Fit inside 74% of the canvas so there is wall to move through. */
  const scale = Math.min(
    (canvasW * 0.74) / meta0.width,
    (canvasH * 0.74) / meta0.height,
  );
  const artW = Math.round(meta0.width * scale);
  const artH = Math.round(meta0.height * scale);
  const art = await sharp(src).resize(artW, artH).toBuffer();

  const left = Math.round((canvasW - artW) / 2);
  const top = Math.round((canvasH - artH) / 2);

  const glow = await sharp({
    create: {
      width: canvasW,
      height: canvasH,
      channels: 4,
      background: { ...WALL, alpha: 0 },
    },
  })
    .composite([
      {
        input: await sharp({
          create: {
            width: Math.min(canvasW, Math.round(artW * 1.8)),
            height: Math.min(canvasH, Math.round(artH * 1.3)),
            channels: 4,
            background: { r: 255, g: 244, b: 226, alpha: 0.07 },
          },
        })
          .png()
          .toBuffer(),
        left: Math.max(0, Math.round(canvasW / 2 - artW * 0.9)),
        top: Math.max(0, Math.round(canvasH / 2 - artH * 0.65)),
      },
    ])
    .blur(150)
    .png()
    .toBuffer();

  const shadow = await sharp({
    create: {
      width: artW + 40,
      height: artH + 40,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0.85 },
    },
  })
    .blur(36)
    .png()
    .toBuffer();

  const scene = path.join(TMP, `scene-${slug}-${canvasW}x${canvasH}.png`);
  await sharp({
    create: { width: canvasW, height: canvasH, channels: 3, background: WALL },
  })
    .composite([
      { input: glow, left: 0, top: 0 },
      { input: shadow, left: left - 20, top: top - 4 },
      { input: art, left, top },
    ])
    .png()
    .toFile(scene);

  return { scene, artW, artH, left, top };
}

/**
 * The tightest fraction of the canvas that STILL CONTAINS the whole
 * painting, plus a small breathing margin. This is the guarantee that
 * nothing gets cut — it is derived from the art's real dimensions, so
 * it cannot drift out of date when a painting is replaced.
 */
function safeZoom(art, canvasW, canvasH) {
  const needed = Math.max(art.artW / canvasW, art.artH / canvasH);
  return Math.min(1, needed * 1.12);
}

/**
 * Renders one shot: a window travelling across a still scene.
 * `zoom` is the fraction of the canvas visible; the window always has
 * the output's aspect ratio, and the canvas is built to match it, so
 * width and height scale together.
 *
 * zoompan, not crop: ffmpeg evaluates crop's width and height once at
 * init, so an animated "crop zoom" silently renders a static frame.
 */
function shoot(scene, name, seconds, from, to, cut) {
  const N = Math.round(seconds * FPS);
  const p = `(on/${N - 1})`;
  const E = `(pow(${p},2)*(3-2*${p}))`;
  const z0 = (1 / from.zoom).toFixed(4);
  const z1 = (1 / to.zoom).toFixed(4);
  const z = `${z0}+(${z1}-${z0})*${E}`;
  const cx = `(${from.cx.toFixed(1)}+(${to.cx.toFixed(1)}-${from.cx.toFixed(1)})*${E})`;
  const cy = `(${from.cy.toFixed(1)}+(${to.cy.toFixed(1)}-${from.cy.toFixed(1)})*${E})`;

  /* Clamp so the window can never leave the canvas and expose an edge. */
  const x = `max(0\\,min(iw-iw/zoom\\,${cx}-(iw/zoom/2)))`;
  const y = `max(0\\,min(ih-ih/zoom\\,${cy}-(ih/zoom/2)))`;

  const out = path.join(TMP, `${name}.mp4`);
  execFileSync(
    "ffmpeg",
    [
      "-v", "error", "-y",
      "-loop", "1", "-i", scene,
      "-t", String(seconds),
      "-filter_complex",
      `fps=${FPS},zoompan=z='${z}':x='${x}':y='${y}'` +
        `:d=1:s=${cut.outW}x${cut.outH}:fps=${FPS},format=yuv420p`,
      "-c:v", "libx264", "-preset", "medium", "-crf", "18",
      "-an", out,
    ],
    { stdio: ["ignore", "ignore", "pipe"] },
  );
  return out;
}

await mkdir(TMP, { recursive: true });
await mkdir(OUT, { recursive: true });

for (const cut of CUTS) {
  console.log(`\n  ── ${cut.name} (${cut.outW}×${cut.outH}) ──`);
  const segments = [];

  for (const shot of SHOTS) {
    const art = await hang(shot.slug, cut.canvasW, cut.canvasH);
    const tight = safeZoom(art, cut.canvasW, cut.canvasH);
    const cxMid = cut.canvasW / 2;
    const cyMid = cut.canvasH / 2;

    segments.push(
      shoot(
        art.scene,
        `${cut.name}-${shot.slug}`,
        shot.seconds,
        { zoom: 1.0, cx: cxMid, cy: cyMid },
        {
          zoom: tight,
          /* A little lateral drift where the framing leaves room. */
          cx: cxMid + cut.canvasW * shot.drift,
          cy: cyMid,
        },
        cut,
      ),
    );
    console.log(
      `  ${shot.slug.padEnd(12)} art ${art.artW}×${art.artH}  ` +
        `push 100% → ${Math.round(tight * 100)}% (whole work in frame)`,
    );
  }

  /* The generated shot. Scaled to fill this cut's frame, centre-cropped
     — the painting sits mid-frame so only bare wall is lost. */
  const aiOut = path.join(TMP, `${cut.name}-dance.mp4`);
  execFileSync("ffmpeg", [
    "-v", "error", "-y", "-i", AI_SOURCE, "-t", String(AI_SECONDS),
    "-vf",
    `fps=${FPS},scale=${cut.outW}:${cut.outH}:force_original_aspect_ratio=increase,` +
      `crop=${cut.outW}:${cut.outH},format=yuv420p`,
    "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-an", aiOut,
  ], { stdio: ["ignore", "ignore", "pipe"] });
  segments.push(aiOut);
  console.log(`  the-dance    generated pull-back`);

  /* The cut: crossfade each shot into the next. */
  const durations = [...SHOTS.map((s) => s.seconds), AI_SECONDS];
  const inputs = segments.flatMap((s) => ["-i", s]);
  let filter = "";
  let prev = "0:v";
  let offset = 0;
  for (let i = 1; i < segments.length; i++) {
    offset += durations[i - 1] - FADE;
    const label = i === segments.length - 1 ? "vout" : `x${i}`;
    filter += `[${prev}][${i}:v]xfade=transition=fade:duration=${FADE}:offset=${offset.toFixed(2)}[${label}];`;
    prev = label;
  }
  filter = filter.replace(/;$/, "");

  const dest = path.join(OUT, `${cut.name}.mp4`);
  execFileSync("ffmpeg", [
    "-v", "error", "-y", ...inputs,
    "-filter_complex", filter,
    "-map", "[vout]",
    "-c:v", "libx264", "-profile:v", "high", "-preset", "veryslow",
    "-crf", String(cut.crf),
    /* faststart puts the index first so playback can begin before the
       whole file has arrived. */
    "-movflags", "+faststart",
    "-pix_fmt", "yuv420p", "-an", dest,
  ], { stdio: ["ignore", "ignore", "pipe"] });
}

/* One poster per shape. It shows instantly, and it is what iOS Low
   Power Mode users see, since that refuses autoplay outright. */
for (const cut of CUTS) {
  execFileSync("ffmpeg", [
    "-v", "error", "-y",
    "-i", path.join(OUT, `${cut.name}.mp4`),
    "-frames:v", "1", "-q:v", "4",
    path.join(OUT, `${cut.name}-poster.jpg`),
  ], { stdio: ["ignore", "ignore", "pipe"] });
}

console.log("\n  Done.\n");
