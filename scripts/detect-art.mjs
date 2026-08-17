/**
 * ARTWORK EDGE DETECTION
 * ------------------------------------------------------------------
 * Several photographs are the artwork sat inside a frame, a mat, or a
 * white room. The crops in prepare-source.mjs were set by eye from
 * screenshots, and at least one (ankara) was measurably off: it kept a
 * strip of frame on the left and top while cutting the painting on the
 * right and bottom.
 *
 * This measures instead of guessing. It reads each source at low
 * resolution, scores every row and column by how far its pixels sit
 * from the colour of the photograph's border (the wall / frame / mat),
 * and reports the bounding box of the region that is actually artwork.
 *
 * Output is a crop block to paste into prepare-source.mjs — the numbers
 * are then verified visually before anything is committed.
 */

import sharp from "sharp";
import path from "node:path";

const SRC = "/agent/stored_files";

/** source file, output name, and any rotation needed first */
const SOURCES = [
  ["cmsrcy6aj0chx07adxo5mb0co_3659-02.jpeg", "the-suit", 0],
  ["cmsrcy6a80d4q07adhpbh3rsf_IMG_20231116_143551_373_2.jpg", "the-lapel-pin", 0],
  ["cmsrcy6ai0e5i06adyfpmvgo0_Remini20220804172129553_2.jpg", "braids", 0],
  ["cmsrcy6ah0ctt06adxpqdnec9_IMG-20200830-WA0006.jpg", "the-turban", 0],
  ["cmsrcy6an0cws07ad35uvidir_5fd38a90-4ceb-11f0-a716-273fdbe713d8.jpg", "ankara", 0],
  ["cmsrcv5c00cs406ad6dwb1o9g_97c20940-4d4a-11f0-94ee-c1b4b8f2feae.jpg", "saxophone", 0],
  ["cmsrcv5bx0e8h06adwfqcni82_7898b680-4954-11f0-820a-fd2e4be964a2.jpg", "the-dance", 0],
  ["cmsrcy6am0e9s06ad8ts7lrnn_7696f8c0-3e40-11f0-8970-398978c4c316.jpg", "the-cello", 0],
  ["cmsrcy6ai0cmb07ad24evkdy0_20241025_075520_resized.jpg", "two-faces", 90],
  ["cmsrcv5l60dfy06ad48q4l1hc_c15abfc0-2083-11f0-8d04-a9ad610f583e.jpg", "the-hat", 0],
];

const PROBE = 700; // width the analysis runs at

async function detect(file, rotate) {
  const base = sharp(path.join(SRC, file), { failOn: "none" }).rotate(
    rotate || undefined,
  );
  const full = await base.metadata();
  const fullW = rotate === 90 || rotate === 270 ? full.height : full.width;
  const fullH = rotate === 90 || rotate === 270 ? full.width : full.height;

  const { data, info } = await sharp(await base.toBuffer())
    .resize({ width: PROBE })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: w, height: h, channels: ch } = info;
  const at = (x, y) => {
    const i = (y * w + x) * ch;
    return [data[i], data[i + 1], data[i + 2]];
  };

  /* The border colour: median of a ring of pixels just inside the edge.
     That is the wall, the frame, or the mat — whatever surrounds. */
  const ring = [];
  for (let x = 0; x < w; x += 3) {
    ring.push(at(x, 1), at(x, h - 2));
  }
  for (let y = 0; y < h; y += 3) {
    ring.push(at(1, y), at(w - 2, y));
  }
  const med = [0, 1, 2].map((c) => {
    const v = ring.map((p) => p[c]).sort((a, b) => a - b);
    return v[Math.floor(v.length / 2)];
  });

  const far = (x, y) => {
    const p = at(x, y);
    const d =
      Math.abs(p[0] - med[0]) + Math.abs(p[1] - med[1]) + Math.abs(p[2] - med[2]);
    return d > 72; // clearly not the surround
  };

  const colScore = new Array(w).fill(0);
  const rowScore = new Array(h).fill(0);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (far(x, y)) {
        colScore[x]++;
        rowScore[y]++;
      }
    }
  }

  /* Widest run where at least a third of the line is content. */
  const run = (score, len, span) => {
    const on = score.map((s) => s / span > 0.33);
    let best = [0, len - 1];
    let bestLen = -1;
    let start = null;
    for (let i = 0; i < len; i++) {
      if (on[i] && start === null) start = i;
      if ((!on[i] || i === len - 1) && start !== null) {
        const end = on[i] ? i : i - 1;
        if (end - start > bestLen) {
          bestLen = end - start;
          best = [start, end];
        }
        start = null;
      }
    }
    return best;
  };

  const [x0, x1] = run(colScore, w, h);
  const [y0, y1] = run(rowScore, h, w);

  const sx = fullW / w;
  const sy = fullH / h;
  /* 0.4% inset absorbs the frame's inner lip and any soft edge. */
  const inset = Math.round(Math.min(fullW, fullH) * 0.004);

  const left = Math.max(0, Math.round(x0 * sx) + inset);
  const top = Math.max(0, Math.round(y0 * sy) + inset);
  const width = Math.min(fullW - left, Math.round((x1 - x0 + 1) * sx) - inset * 2);
  const height = Math.min(fullH - top, Math.round((y1 - y0 + 1) * sy) - inset * 2);

  return { fullW, fullH, left, top, width, height };
}

for (const [file, name, rotate] of SOURCES) {
  const d = await detect(file, rotate);
  const pctW = Math.round((d.width / d.fullW) * 100);
  const pctH = Math.round((d.height / d.fullH) * 100);
  console.log(
    `${name.padEnd(14)} source ${d.fullW}×${d.fullH}  ` +
      `detected { left: ${d.left}, top: ${d.top}, width: ${d.width}, height: ${d.height} }  ` +
      `(${pctW}%×${pctH}% of frame)`,
  );
}
