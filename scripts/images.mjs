/**
 * IMAGE PIPELINE
 * ------------------------------------------------------------------
 * Drop the artist's photographs into  public/works/originals/
 * then run:   npm run images
 *
 * For each file this will:
 *   • resize the long edge down to 2400px (plenty for full-bleed 4K,
 *     small enough to actually load) — smaller files are left alone
 *   • strip camera metadata but PRESERVE the colour profile, so the
 *     paintings keep their true colour
 *   • write an optimised .jpg into public/works/
 *   • measure the pixel dimensions and average colour
 *
 * It then prints a ready-to-paste block for src/content/works.ts.
 * It never edits your catalogue for you and never touches the originals.
 */

import sharp from "sharp";
import { readdir, mkdir, stat } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const IN = path.join(ROOT, "public", "works", "originals");
const OUT = path.join(ROOT, "public", "works");

const MAX_EDGE = 2400;
const QUALITY = 86;
const VALID = new Set([".jpg", ".jpeg", ".png", ".tif", ".tiff", ".webp"]);

const warnings = [];

async function main() {
  await mkdir(IN, { recursive: true });
  await mkdir(OUT, { recursive: true });

  const files = (await readdir(IN)).filter((f) =>
    VALID.has(path.extname(f).toLowerCase()),
  );

  if (files.length === 0) {
    console.log(
      `\n  No images found in public/works/originals/\n` +
        `  Put the paintings there and run this again.\n`,
    );
    return;
  }

  const entries = [];

  for (const file of files.sort()) {
    const slug = path
      .basename(file, path.extname(file))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const src = path.join(IN, file);
    const dest = path.join(OUT, `${slug}.jpg`);

    const image = sharp(src, { failOn: "none" });
    const meta = await image.metadata();
    const longEdge = Math.max(meta.width ?? 0, meta.height ?? 0);

    if (longEdge < 1400) {
      warnings.push(
        `${file} is only ${meta.width}×${meta.height}px — too small to show full-bleed. ` +
          `Ask the artist for a larger scan if this work is featured.`,
      );
    }

    const pipeline = image
      .rotate() // honour EXIF orientation
      .resize({
        width: longEdge > MAX_EDGE ? (meta.width >= meta.height ? MAX_EDGE : null) : null,
        height: longEdge > MAX_EDGE ? (meta.height > meta.width ? MAX_EDGE : null) : null,
        withoutEnlargement: true,
        fit: "inside",
      })
      .jpeg({ quality: QUALITY, chromaSubsampling: "4:4:4", mozjpeg: true })
      .withMetadata({ icc: meta.icc ? undefined : "srgb" });

    const info = await pipeline.toFile(dest);
    const { dominant } = await sharp(dest).stats();
    const tint =
      "#" +
      [dominant.r, dominant.g, dominant.b]
        .map((v) => v.toString(16).padStart(2, "0"))
        .join("");

    const before = (await stat(src)).size;
    const after = info.size;

    console.log(
      `  ${slug.padEnd(24)} ${String(info.width).padStart(5)}×${String(
        info.height,
      ).padEnd(5)}  ${(before / 1e6).toFixed(1)}MB → ${(after / 1e6).toFixed(2)}MB`,
    );

    entries.push({ slug, width: info.width, height: info.height, tint });
  }

  console.log(`\n  ── paste into src/content/works.ts ──\n`);
  for (const e of entries) {
    console.log(
      `  {\n    slug: "${e.slug}",\n    title: "",\n    year: ${new Date().getFullYear()},\n` +
        `    medium: "",\n    dimensions: "",\n    width: ${e.width},\n    height: ${e.height},\n` +
        `    tint: "${e.tint}",\n  },`,
    );
  }

  if (warnings.length) {
    console.log(`\n  ⚠  ${warnings.length} warning(s):`);
    warnings.forEach((w) => console.log(`     • ${w}`));
  }
  console.log("");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
