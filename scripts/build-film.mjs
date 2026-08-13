/**
 * THE HERO FILM
 * ------------------------------------------------------------------
 * Builds the single looping clip that opens the site: five shots cut
 * from five paintings, crossfading, ~22 seconds.
 *
 * Four shots are REAL CAMERA MOVES — a virtual camera pushing in,
 * drifting and tilting across the actual scans. Every pixel is the
 * artist's paint. The fifth is a generated gallery pull-back, used
 * only on the abstract, where re-rendering reads as motion rather
 * than as damage.
 *
 * Each painting is first composited onto a dark gallery wall at 4K,
 * then a crop window is animated across that scene and scaled to
 * 1080p — so the move is a genuine camera move over a still artwork,
 * never a distortion of it.
 *
 * Run: node scripts/build-film.mjs
 */

import sharp from "sharp";
import { execFileSync } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const WORKS = path.join(process.cwd(), "public", "works");
const TMP = "/tmp/film";
const OUT = path.join(process.cwd(), "public", "film");

const W = 3840;
const H = 2160;
const WALL = { r: 11, g: 10, b: 9 };
const FPS = 30;

/**
 * Hangs a painting on a 4K dark wall, with a soft pool of light behind
 * it and a drop shadow so it sits on the wall rather than on the screen.
 */
async function hang(slug, targetHeight) {
  const src = path.join(WORKS, `${slug}.jpg`);
  const art = await sharp(src)
    .resize({ height: targetHeight, withoutEnlargement: false })
    .toBuffer();
  const meta = await sharp(art).metadata();
  const left = Math.round((W - meta.width) / 2);
  const top = Math.round((H - meta.height) / 2);

  /* The spotlight: a blurred white ellipse, very low opacity. */
  const glow = await sharp({
    create: { width: W, height: H, channels: 4, background: { ...WALL, alpha: 0 } },
  })
    .composite([
      {
        input: await sharp({
          create: {
            /* Clamped to the canvas — an unclamped glow taller than
               2160 makes sharp refuse the composite. */
            width: Math.min(W, Math.round(meta.width * 1.9)),
            height: Math.min(H, Math.round(meta.height * 1.35)),
            channels: 4,
            background: { r: 255, g: 244, b: 226, alpha: 0.07 },
          },
        })
          .png()
          .toBuffer(),
        left: Math.max(0, Math.round(W / 2 - meta.width * 0.95)),
        top: Math.max(0, Math.round(H / 2 - meta.height * 0.675)),
        blend: "over",
      },
    ])
    .blur(180)
    .png()
    .toBuffer();

  /* The shadow under the canvas. */
  const shadow = await sharp({
    create: {
      width: meta.width + 40,
      height: meta.height + 40,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0.85 },
    },
  })
    .blur(40)
    .png()
    .toBuffer();

  const scene = path.join(TMP, `scene-${slug}.png`);
  await sharp({ create: { width: W, height: H, channels: 3, background: WALL } })
    .composite([
      { input: glow, left: 0, top: 0 },
      { input: shadow, left: left - 20, top: top - 4 },
      { input: art, left, top },
    ])
    .png()
    .toFile(scene);

  return { scene, artLeft: left, artTop: top, artW: meta.width, artH: meta.height };
}

/**
 * Renders one shot: a crop window travelling across a still scene.
 * `from` and `to` are {zoom, cx, cy} — zoom is the FRACTION of the 4K
 * frame visible (1 = whole frame, 0.4 = a tight crop), cx/cy are the
 * centre of that window in scene pixels.
 *
 * Implemented with zoompan rather than crop: ffmpeg evaluates crop's
 * width and height once at init, so only x/y animate there — a crop
 * "zoom" silently renders as a static frame. zoompan re-evaluates z,
 * x and y every frame, which is what a push-in actually needs.
 */
function shoot(scene, name, seconds, from, to) {
  const N = Math.round(seconds * FPS);
  const p = `(on/${N - 1})`;
  const E = `(pow(${p},2)*(3-2*${p}))`;

  /* zoompan's z is a magnification, so it is the inverse of the
     fraction of frame we want visible. */
  const z0 = (1 / from.zoom).toFixed(4);
  const z1 = (1 / to.zoom).toFixed(4);
  const z = `${z0}+(${z1}-${z0})*${E}`;
  const cx = `(${from.cx.toFixed(1)}+(${to.cx.toFixed(1)}-${from.cx.toFixed(1)})*${E})`;
  const cy = `(${from.cy.toFixed(1)}+(${to.cy.toFixed(1)}-${from.cy.toFixed(1)})*${E})`;

  const out = path.join(TMP, `${name}.mp4`);
  execFileSync(
    "ffmpeg",
    [
      "-v", "error", "-y",
      "-loop", "1", "-i", scene,
      "-t", String(seconds),
      "-filter_complex",
      `fps=${FPS},zoompan=z='${z}':x='${cx}-(iw/zoom/2)':y='${cy}-(ih/zoom/2)'` +
        `:d=1:s=1920x1080:fps=${FPS},format=yuv420p`,
      "-c:v", "libx264", "-preset", "slow", "-crf", "20",
      "-an", out,
    ],
    { stdio: ["ignore", "ignore", "pipe"] },
  );
  console.log(`  ${name.padEnd(14)} ${seconds}s`);
  return out;
}

await mkdir(TMP, { recursive: true });
await mkdir(OUT, { recursive: true });

console.log("\n  Hanging the work…");
const suit = await hang("the-suit", 1900);
const ankara = await hang("ankara", 1680);
const sax = await hang("saxophone", 1900);

console.log("\n  Shooting…");
const shots = [];

/* 1 — THE SUIT. Whole drawing, then a slow push in to the eyes.
      The face sits in the upper third, so the crop centre rises. */
shots.push(
  shoot(suit.scene, "01-suit", 5.5,
    { zoom: 1.0, cx: W / 2, cy: H / 2 },
    { zoom: 0.44, cx: W / 2, cy: suit.artTop + suit.artH * 0.27 }),
);

/* 2 — ANKARA. A lateral drift across the patchwork, right to left,
      ending on the face in profile. */
shots.push(
  shoot(ankara.scene, "02-ankara", 5.0,
    { zoom: 0.62, cx: W / 2 + ankara.artW * 0.22, cy: H / 2 },
    { zoom: 0.55, cx: W / 2 - ankara.artW * 0.12, cy: H / 2 - 40 }),
);

/* 3 — BRAIDS. No wall: straight into the surface, so the mark-making
      itself is the subject.
      Deliberately NOT composited onto the 4K canvas — that upscaled a
      1751px scan by 2.2x and the shot came back looking like a
      soft-focus photograph rather than graphite. Here the scene is a
      16:9 window cut from the scan at NATIVE resolution, and the
      camera pans within it, so every frame is real pixels.
      shoot() works on any scene size: cx/cy are just scene pixels. */
const braidsSrc = path.join(WORKS, "braids.jpg");
const bMeta = await sharp(braidsSrc).metadata();
const bW = bMeta.width;
const bH = Math.round((bW * 9) / 16);
const bScene = path.join(TMP, "scene-braids.png");
await sharp(braidsSrc)
  /* Taken from the upper half, where the braids and eyes are. */
  .extract({ left: 0, top: Math.round(bMeta.height * 0.16), width: bW, height: bH })
  .png()
  .toFile(bScene);
shots.push(
  shoot(bScene, "03-braids", 4.5,
    { zoom: 0.62, cx: bW * 0.40, cy: bH * 0.44 },
    { zoom: 0.54, cx: bW * 0.58, cy: bH * 0.56 }),
);

/* 4 — SAXOPHONE. A slow tilt up the figure, settling on the head. */
shots.push(
  shoot(sax.scene, "04-saxophone", 5.0,
    /* Tighter than instinct suggests: at 0.5 the canvas filled under
       half the frame and the shot was mostly bare wall. */
    { zoom: 0.40, cx: W / 2, cy: sax.artTop + sax.artH * 0.74 },
    { zoom: 0.36, cx: W / 2, cy: sax.artTop + sax.artH * 0.20 }),
);

/* 5 — THE DANCE. The generated gallery pull-back. Trimmed to the
      first 5s: past that the painting recedes too far to read. */
const aiIn = "/tmp/film/ai-dance.mp4";
const aiOut = path.join(TMP, "05-dance.mp4");
execFileSync("ffmpeg", [
  "-v", "error", "-y", "-i", aiIn, "-t", "5.0",
  "-vf", `scale=1920:1080,fps=${FPS},format=yuv420p`,
  "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-an", aiOut,
], { stdio: ["ignore", "ignore", "pipe"] });
console.log(`  05-dance       5.0s`);
shots.push(aiOut);

/* ---- The cut: crossfade every shot into the next --------------- */
console.log("\n  Cutting…");
const FADE = 0.9;
const durations = [5.5, 5.0, 4.5, 5.0, 5.0];

const inputs = shots.flatMap((s) => ["-i", s]);
let filter = "";
let prev = "0:v";
let offset = 0;
for (let i = 1; i < shots.length; i++) {
  offset += durations[i - 1] - FADE;
  const label = i === shots.length - 1 ? "vout" : `x${i}`;
  filter += `[${prev}][${i}:v]xfade=transition=fade:duration=${FADE}:offset=${offset.toFixed(2)}[${label}];`;
  prev = label;
}
filter = filter.replace(/;$/, "");

const master = path.join(TMP, "master.mp4");
execFileSync("ffmpeg", [
  "-v", "error", "-y", ...inputs,
  "-filter_complex", filter,
  "-map", "[vout]",
  "-c:v", "libx264", "-preset", "slow", "-crf", "21",
  "-pix_fmt", "yuv420p", "-an", master,
], { stdio: ["ignore", "ignore", "pipe"] });

/* ---- Delivery encodes ------------------------------------------ */
console.log("\n  Encoding…");
/* 24fps, and fairly aggressive CRF. The moves are slow and the frames
   are mostly dark, so this holds up; at CRF 25/30fps the same cut was
   6.7MB, which is not a reasonable thing to send down mobile data. */
for (const [name, width, crf] of [
  ["hero-1080", 1920, 30],
  ["hero-720", 1280, 31],
]) {
  const dest = path.join(OUT, `${name}.mp4`);
  execFileSync("ffmpeg", [
    "-v", "error", "-y", "-i", master,
    "-vf", `fps=24,scale=${width}:-2`,
    "-c:v", "libx264", "-profile:v", "high", "-preset", "veryslow",
    "-crf", String(crf),
    /* faststart puts the index at the front so playback can begin
       before the whole file has arrived. */
    "-movflags", "+faststart",
    "-pix_fmt", "yuv420p", "-an", dest,
  ], { stdio: ["ignore", "ignore", "pipe"] });
}

/* The poster: first frame, shown instantly and whenever autoplay is
   refused. It has to look like a deliberate still, not a loading state. */
execFileSync("ffmpeg", [
  "-v", "error", "-y", "-i", master, "-frames:v", "1",
  "-vf", "scale=1600:-2",
  "-q:v", "4", path.join(OUT, "poster.jpg"),
], { stdio: ["ignore", "ignore", "pipe"] });

console.log("\n  Done.\n");
