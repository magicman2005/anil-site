/* Renders tools/og.html to assets/og.png at 1200x630.
   Usage:  node tools/build-og.js
   Requires Playwright, which Scout already provides. */

const path = require("path");

(async () => {
  let chromium;
  try {
    ({ chromium } = require("playwright"));
  } catch (e) {
    console.error("Playwright not found. Install with: npm i -D playwright");
    process.exit(1);
  }

  const src = "file:///" + path.resolve(__dirname, "og.html").replace(/\\/g, "/");
  const out = path.resolve(__dirname, "..", "assets", "og.jpg");

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await page.goto(src, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  // JPEG: no alpha needed, and ~4x smaller than PNG for this gradient artwork
  await page.screenshot({ path: out, type: "jpeg", quality: 88 });
  await browser.close();

  console.log("wrote " + out);
})();
