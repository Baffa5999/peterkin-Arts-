/**
 * SOURCE PREPARATION — second catalogue
 * ------------------------------------------------------------------
 * The new photographs arrive in three states: clean full-bleed scans,
 * framed presentation mockups sat in white rooms, and one canvas shot
 * sideways on an easel. This crops each down to the artwork itself.
 *
 * Crops only — nothing is recoloured, sharpened or "enhanced". The
 * originals in /agent/stored_files are never modified.
 */

import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const SRC = "/agent/stored_files";
const OUT = path.join(process.cwd(), "public", "works", "originals");

const jobs = [
  /* --- clean scans: pass straight through --------------------- */
  {
    from: "cmsrcy6aj0chx07adxo5mb0co_3659-02.jpeg",
    to: "the-suit.jpg",
  },

  /* --- sheets taped to a wall: crop to the paper --------------- */
  {
    from: "cmsrcy6a80d4q07adhpbh3rsf_IMG_20231116_143551_373_2.jpg",
    to: "the-lapel-pin.jpg",
    crop: { left: 25, top: 320, width: 2660, height: 3400 },
  },
  {
    from: "cmsrcy6ai0e5i06adyfpmvgo0_Remini20220804172129553_2.jpg",
    to: "braids.jpg",
    crop: { left: 170, top: 360, width: 2480, height: 3400 },
  },

  /* --- framed mockups: crop inside the frame ------------------- */
  {
    from: "cmsrcv5bx0e8h06adwfqcni82_7898b680-4954-11f0-820a-fd2e4be964a2.jpg",
    to: "the-dance.jpg",
    crop: { left: 585, top: 405, width: 1780, height: 2585 },
  },
  {
    from: "cmsrcv5c00cs406ad6dwb1o9g_97c20940-4d4a-11f0-94ee-c1b4b8f2feae.jpg",
    to: "saxophone.jpg",
    crop: { left: 440, top: 215, width: 1770, height: 3530 },
  },
  {
    from: "cmsrcy6an0cws07ad35uvidir_5fd38a90-4ceb-11f0-a716-273fdbe713d8.jpg",
    to: "ankara.jpg",
    crop: { left: 655, top: 915, width: 2540, height: 2120 },
  },
  {
    from: "cmsrcy6am0e9s06ad8ts7lrnn_7696f8c0-3e40-11f0-8970-398978c4c316.jpg",
    to: "the-cello.jpg",
    crop: { left: 780, top: 460, width: 1560, height: 2330 },
  },
  {
    from: "cmsrcv5l60dfy06ad48q4l1hc_c15abfc0-2083-11f0-8d04-a9ad610f583e.jpg",
    to: "the-hat.jpg",
    crop: { left: 505, top: 100, width: 610, height: 1155 },
  },
  {
    from: "cmsrcy6ah0ctt06adxpqdnec9_IMG-20200830-WA0006.jpg",
    to: "the-turban.jpg",
    crop: { left: 130, top: 130, width: 610, height: 820 },
  },

  /* --- shot sideways on an easel: stand it up, then crop ------- */
  {
    from: "cmsrcy6ai0cmb07ad24evkdy0_20241025_075520_resized.jpg",
    to: "two-faces.jpg",
    rotate: 90,
    crop: { left: 110, top: 880, width: 2125, height: 3330 },
  },
];

await mkdir(OUT, { recursive: true });

for (const job of jobs) {
  /* failOn:"none" — one source has non-standard JPEG scan headers that
     libvips rejects by default but decodes fine. */
  const pipeline = sharp(path.join(SRC, job.from), { failOn: "none" });
  /* A single rotate() call: chaining two overrides the first. */
  pipeline.rotate(job.rotate ?? undefined);
  if (job.crop) pipeline.extract(job.crop);
  const info = await pipeline
    .jpeg({ quality: 96, chromaSubsampling: "4:4:4" })
    .toFile(path.join(OUT, job.to));
  console.log(`  ${job.to.padEnd(20)} ${info.width}×${info.height}`);
}
