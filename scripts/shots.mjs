/**
 * Visual check. Drives a real browser over the running site and
 * captures each act of the film, at desktop and phone widths.
 */
import puppeteer from "puppeteer-core";
import { mkdir } from "node:fs/promises";

const CHROME =
  "/agent/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome";
const URL = "http://localhost:3000";
const OUT = "/tmp/shots";

await mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--force-color-profile=srgb"],
});

async function capture(name, width, height, scrollTo, settle = 2600) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 60000 });
  // Let the cold-open animation finish before judging anything.
  await new Promise((r) => setTimeout(r, settle));

  if (scrollTo) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), scrollTo);
    await new Promise((r) => setTimeout(r, 1800));
  }

  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log(`  ${name}`);
  await page.close();
}

const vh = 900;
await capture("01-hero", 1440, vh, 0, 4200);
await capture("02-statement", 1440, vh, vh * 1.15);
await capture("03-featured", 1440, vh, vh * 2.6);
await capture("04-featured-b", 1440, vh, vh * 4.6);
await capture("05-wall", 1440, vh, vh * 8.4);
await capture("06-catalogue", 1440, vh, vh * 12.6);
await capture("07-studio", 1440, vh, vh * 14.2);
await capture("08-contact", 1440, vh, vh * 15.4);
await capture("m1-hero", 390, 844, 0, 4200);
await capture("m2-featured", 390, 844, 1700);

await browser.close();
console.log("done");
