/**
 * SOURCE PREPARATION — framed presentation
 * ------------------------------------------------------------------
 * The artist wants the work shown AS PHOTOGRAPHED: inside its frame,
 * with the white mount and a margin of wall. Earlier versions cut each
 * painting out of its frame, which stripped exactly the presentation he
 * wanted — and on several pieces made the work look boxed or cropped.
 *
 * So each job keeps the frame and a little of the surround, and removes
 * only what genuinely is not part of the presentation: studio clutter,
 * an easel, a workshop wall, other pictures taped up nearby.
 *
 * TWO OUTPUTS, deliberately different:
 *
 *   public/works/*.jpg         framed — what the Works grid and the
 *                              lightbox show
 *   public/works/plates/*.jpg  the painting alone — what the hero film
 *                              uses, because a white mockup hung on the
 *                              film's dark gallery wall would read as a
 *                              mistake
 *
 * Crops only. Nothing is recoloured or sharpened, and the originals in
 * /agent/stored_files are never modified.
 *
 *   node scripts/prepare-source.mjs           rebuild the framed masters
 *   node scripts/prepare-source.mjs --plates  rebuild the film plates too
 */

import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const SRC = "/agent/stored_files";
const FRAMED = path.join(process.cwd(), "public", "works", "originals");
const PLATES = path.join(process.cwd(), "public", "works", "plates");

/**
 * `framed` keeps the frame, mount and a margin of wall — omit it to use
 * the whole photograph. `plate` is the painting alone, for the film.
 */
const jobs = [
  {
    to: "the-suit.jpg",
    from: "cmsrcy6aj0chx07adxo5mb0co_3659-02.jpeg",
    /* A bare drawing photographed edge to edge — no frame to keep. */
  },
  {
    to: "the-lapel-pin.jpg",
    from: "cmsrcy6a80d4q07adhpbh3rsf_IMG_20231116_143551_373_2.jpg",
    /* Keeps the white paper margin, drops the pictures taped above. */
    framed: { left: 25, top: 300, width: 2690, height: 3430 },
  },
  {
    to: "braids.jpg",
    from: "cmsrcy6ai0e5i06adyfpmvgo0_Remini20220804172129553_2.jpg",
    framed: { left: 150, top: 340, width: 2520, height: 3440 },
  },
  {
    to: "the-turban.jpg",
    from: "cmsrcy6ah0ctt06adxpqdnec9_IMG-20200830-WA0006.jpg",
    /* Already a straight photograph of the framed, mounted drawing. */
    plate: { left: 130, top: 130, width: 610, height: 820 },
  },
  {
    to: "ankara.jpg",
    from: "cmsrcy6an0cws07ad35uvidir_5fd38a90-4ceb-11f0-a716-273fdbe713d8.jpg",
    framed: { left: 520, top: 740, width: 2920, height: 2480 },
    plate: { left: 688, top: 956, width: 2624, height: 2088 },
  },
  {
    to: "saxophone.jpg",
    from: "cmsrcv5c00cs406ad6dwb1o9g_97c20940-4d4a-11f0-94ee-c1b4b8f2feae.jpg",
    framed: { left: 370, top: 150, width: 1910, height: 3670 },
    plate: { left: 470, top: 274, width: 1710, height: 3411 },
  },
  {
    to: "the-dance.jpg",
    from: "cmsrcv5bx0e8h06adwfqcni82_7898b680-4954-11f0-820a-fd2e4be964a2.jpg",
    framed: { left: 320, top: 130, width: 2300, height: 3260 },
    plate: { left: 716, top: 444, width: 1646, height: 2371 },
  },
  {
    to: "the-cello.jpg",
    from: "cmsrcy6am0e9s06ad8ts7lrnn_7696f8c0-3e40-11f0-8970-398978c4c316.jpg",
    /* Room mockup: keep the frame and the wall, lose the floor. */
    framed: { left: 664, top: 355, width: 1790, height: 2530 },
    plate: { left: 793, top: 522, width: 1529, height: 2232 },
  },
  {
    to: "the-hat.jpg",
    from: "cmsrcv5l60dfy06ad48q4l1hc_c15abfc0-2083-11f0-8d04-a9ad610f583e.jpg",
    /* Room mockup: the framed picture and its wall, not the furniture. */
    framed: { left: 456, top: 56, width: 708, height: 1244 },
    plate: { left: 505, top: 100, width: 591, height: 1120 },
  },
  {
    to: "two-faces.jpg",
    from: "cmsrcy6ai0cmb07ad24evkdy0_20241025_075520_resized.jpg",
    /* Shot sideways on an easel in a cluttered studio: stand it up and
       crop to the canvas. There is no frame to keep here. */
    rotate: 90,
    framed: { left: 110, top: 880, width: 2125, height: 3330 },
  },
];

const WRITE_PLATES = process.argv.includes("--plates");

await mkdir(FRAMED, { recursive: true });
if (WRITE_PLATES) await mkdir(PLATES, { recursive: true });

for (const job of jobs) {
  /* failOn:"none" — one source has non-standard JPEG scan headers that
     libvips rejects by default but decodes correctly. */
  const open = () =>
    sharp(path.join(SRC, job.from), { failOn: "none" }).rotate(
      job.rotate ?? undefined,
    );

  const framed = open();
  if (job.framed) framed.extract(job.framed);
  const a = await framed
    .jpeg({ quality: 96, chromaSubsampling: "4:4:4" })
    .toFile(path.join(FRAMED, job.to));
  console.log(`  ${job.to.padEnd(20)} framed ${a.width}×${a.height}`);

  if (WRITE_PLATES && job.plate) {
    const plate = open().extract(job.plate);
    const b = await plate
      .jpeg({ quality: 96, chromaSubsampling: "4:4:4" })
      .toFile(path.join(PLATES, job.to));
    console.log(`  ${"".padEnd(20)} plate  ${b.width}×${b.height}`);
  }
}
