/**
 * Watches the hero reel across two full changeovers and reports, at
 * each sample, which painting is showing and the exact pixel box of
 * the frame — so any layout shift between paintings shows up as a
 * changing number rather than something you have to spot by eye.
 */
import puppeteer from "puppeteer-core";
import { mkdir } from "node:fs/promises";

const CHROME =
  "/agent/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome";
const OUT = "/tmp/reel";
await mkdir(OUT, { recursive: true });

const width = Number(process.argv[2] ?? 1440);
const height = Number(process.argv[3] ?? 900);
const tag = process.argv[4] ?? "d";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage();
await page.setViewport({ width, height });

const start = Date.now();
await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });

/* Sample across ~3 paintings: cycle is PERFORMANCE(5.42)+HOLD(1.6) ≈ 7s */
const marks = [
  2500, 5000, 6500, 7600, 9500, 12000, 13500, 14600, 16500, 19000, 21500,
];

const seen = [];
for (const ms of marks) {
  const wait = ms - (Date.now() - start);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));

  const info = await page.evaluate(() => {
    const label = document.querySelector('section[aria-label="Introduction"] .label:last-of-type');
    const canvas = document.querySelector('[role="img"]');
    const frame = canvas?.parentElement?.parentElement;
    const r = frame?.getBoundingClientRect();
    return {
      showing: canvas?.getAttribute("aria-label")?.split(",")[0] ?? "—",
      caption: label?.textContent ?? "—",
      frame: r ? `${Math.round(r.width)}×${Math.round(r.height)} @${Math.round(r.left)},${Math.round(r.top)}` : "—",
    };
  });

  seen.push({ ms, ...info });
  await page.screenshot({ path: `${OUT}/${tag}-${String(ms).padStart(5, "0")}.png` });
}

console.table(seen);
await browser.close();
