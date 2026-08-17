/**
 * FRAME / MOUNT TRIMMER
 * ------------------------------------------------------------------
 * A few of the hand-set crops in prepare-source.mjs still keep a band
 * of picture frame, mount board or wall along one or more edges. On a
 * dark page that band reads as the painting being boxed in — or, worse,
 * as the painting having been cut, because the eye takes the frame edge
 * for the edge of the work.
 *
 * This finds those bands by measuring VARIANCE along each edge line
 * rather than by matching a colour. A frame or a mount is near-uniform
 * down its whole length, so its standard deviation is low; a line that
 * crosses actual artwork varies a lot. That test works on a brown
 * frame, a black frame and a grey mount alike, which a
 * background-colour match does not.
 *
 *   node scripts/trim-frames.mjs           report only
 *   node scripts/trim-frames.mjs --apply   rewrite the crops
 *
 * Run `npm run images` afterwards to regenerate what the site serves.
 */

import sharp from "sharp";
import { readdir } from "node:fs/promises";
import path from "node:path";

const DIR = path.join(process.cwd(), "public", "works", "originals");
const APPLY = process.argv.includes("--apply");

/** A line is "flat" — frame, mount or wall — below this deviation. */
const FLAT_STD = 17;
/** Never eat more than this share of a side; a guard against runaway. */
const MAX_TRIM = 0.16;

const std = (vals) => {
  const m = vals.reduce((a, b) => a + b, 0) / vals.length;
  return Math.sqrt(vals.reduce((a, b) => a + (b - m) ** 2, 0) / vals.length);
};

async function analyse(file) {
  const full = await sharp(file).metadata();
  const PROBE = 600;
  const { data, info } = await sharp(file)
    .resize({ width: PROBE })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const lum = (x, y) => {
    const i = (y * w + x) * 3;
    return 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  };

  const colStd = [];
  for (let x = 0; x < w; x++) {
    const v = [];
    for (let y = 0; y < h; y += 2) v.push(lum(x, y));
    colStd.push(std(v));
  }
  const rowStd = [];
  for (let y = 0; y < h; y++) {
    const v = [];
    for (let x = 0; x < w; x += 2) v.push(lum(x, y));
    rowStd.push(std(v));
  }

  /* Walk inward while the line stays flat. */
  const walk = (arr, limit) => {
    let i = 0;
    while (i < limit && arr[i] < FLAT_STD) i++;
    return i;
  };
  const left = walk(colStd, Math.floor(w * MAX_TRIM));
  const right = walk([...colStd].reverse(), Math.floor(w * MAX_TRIM));
  const top = walk(rowStd, Math.floor(h * MAX_TRIM));
  const bottom = walk([...rowStd].reverse(), Math.floor(h * MAX_TRIM));

  const kx = full.width / w;
  const ky = full.height / h;
  return {
    full,
    trim: {
      left: Math.round(left * kx),
      right: Math.round(right * kx),
      top: Math.round(top * ky),
      bottom: Math.round(bottom * ky),
    },
  };
}

const files = (await readdir(DIR)).filter((f) => f.endsWith(".jpg")).sort();

for (const f of files) {
  const src = path.join(DIR, f);
  const { full, trim } = await analyse(src);
  const total = trim.left + trim.right + trim.top + trim.bottom;

  if (total === 0) {
    console.log(`  ${f.replace(".jpg", "").padEnd(14)} clean — artwork already flush to every edge`);
    continue;
  }

  const box = {
    left: trim.left,
    top: trim.top,
    width: full.width - trim.left - trim.right,
    height: full.height - trim.top - trim.bottom,
  };

  console.log(
    `  ${f.replace(".jpg", "").padEnd(14)} trim L${trim.left} R${trim.right} ` +
      `T${trim.top} B${trim.bottom}  →  ${box.width}×${box.height}` +
      (APPLY ? "  [applied]" : ""),
  );

  if (APPLY) {
    const buf = await sharp(src)
      .extract(box)
      .jpeg({ quality: 96, chromaSubsampling: "4:4:4" })
      .toBuffer();
    await sharp(buf).toFile(src);
  }
}

if (!APPLY) console.log("\n  Report only. Re-run with --apply to write.\n");
