/**
 * Films the cold open: captures the hero at a series of timestamps so
 * the assembly can be judged as a sequence rather than a still.
 */
import puppeteer from "puppeteer-core";
import { mkdir } from "node:fs/promises";

const CHROME =
  "/agent/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome";
const OUT = "/tmp/seq";
await mkdir(OUT, { recursive: true });

const width = Number(process.argv[2] ?? 1440);
const height = Number(process.argv[3] ?? 900);
const tag = process.argv[4] ?? "d";
const marks = [400, 900, 1500, 2100, 2800, 3600, 4600];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage();
await page.setViewport({ width, height });

const start = Date.now();
await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });

for (const ms of marks) {
  const wait = ms - (Date.now() - start);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  await page.screenshot({ path: `${OUT}/${tag}-${String(ms).padStart(4, "0")}.png` });
  console.log(`  ${tag} ${ms}ms`);
}

await browser.close();
