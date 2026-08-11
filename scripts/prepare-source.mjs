/**
 * ONE-OFF SOURCE PREPARATION
 * ------------------------------------------------------------------
 * Two of the supplied photographs are framed presentation mockups sat
 * on a white background, and one is a snapshot taken in the workshop.
 * On a black gallery page a white surround reads as a mistake, so the
 * artwork is cropped out of its mockup here.
 *
 * Nothing is recoloured, sharpened or "enhanced" — these are crops
 * only. The originals in /agent/stored_files are never touched.
 */

import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const SRC = "/agent/stored_files";
const OUT = path.join(process.cwd(), "public", "works", "originals");

const jobs = [
  {
    // Bearded man, flat cap and sunglasses. Crop inside the gold frame.
    from: "cmsp3dmw601io06adh6dde97x_867ec4c0-03ee-11f0-8e5a-97c4de72f31c.jpg",
    to: "the-cap.jpg",
    crop: { left: 468, top: 196, width: 1588, height: 1836 },
  },
  {
    // Cubist abstract. Crop inside the gold liner of the white frame.
    from: "cmsp3dmve085p07adqm2rea3q_50e6c850-3718-11f0-8f8e-5f3c86341a14.jpg",
    to: "green-ground.jpg",
    crop: { left: 292, top: 250, width: 962, height: 1132 },
  },
  {
    // Framed portrait photographed in the workshop. Crop to the sheet.
    from: "cmsp3dmvq087z06adhsi3a0i9_FB_IMG_16196586530263302.jpg",
    to: "white-collar.jpg",
    crop: { left: 216, top: 238, width: 344, height: 478 },
  },
  // These three arrived as clean scans — pass straight through.
  {
    from: "cmsp3dmax081607adi9jwi645_Remini20211116122219118_2.jpg",
    to: "hand-to-temple.jpg",
  },
  {
    from: "cmsp3dmvf088707adb614td9d_IMG-20190723-WA0026.jpg",
    to: "the-child.jpg",
  },
  {
    from: "cmsp3dmvk085b07ad9bbd4xtv_IMG-20220114-WA0011.jpg",
    to: "the-fila.jpg",
  },
];

await mkdir(OUT, { recursive: true });

for (const job of jobs) {
  const pipeline = sharp(path.join(SRC, job.from)).rotate();
  if (job.crop) pipeline.extract(job.crop);
  const info = await pipeline
    .jpeg({ quality: 96, chromaSubsampling: "4:4:4" })
    .toFile(path.join(OUT, job.to));
  console.log(`  ${job.to.padEnd(22)} ${info.width}×${info.height}`);
}
