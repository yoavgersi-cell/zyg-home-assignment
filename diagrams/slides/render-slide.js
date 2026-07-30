const { chromium } = require('playwright-core');
const path = require('path');

(async () => {
  const file = process.argv[2] || 'cover.html';
  const url = 'file://' + path.join(__dirname, file);
  const out = path.join(__dirname, file.replace(/\.html$/, '.png'));
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--no-sandbox', '--force-color-profile=srgb'],
  });
  const ctx = await browser.newContext({ deviceScaleFactor: 2, viewport: { width: 1600, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(250);
  await page.screenshot({ path: out });
  await browser.close();
  console.log('WROTE', out);
})();
