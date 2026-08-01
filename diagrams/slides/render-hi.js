const { chromium } = require('playwright-core');
const path = require('path');

(async () => {
  const scale = parseFloat(process.argv[2]) || 4;
  const files = process.argv.slice(3);
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--no-sandbox', '--force-color-profile=srgb'],
  });
  const ctx = await browser.newContext({ deviceScaleFactor: scale, viewport: { width: 1600, height: 900 } });
  for (const file of files) {
    const page = await ctx.newPage();
    await page.goto('file://' + path.join(__dirname, file), { waitUntil: 'networkidle' });
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(__dirname, file.replace(/\.html$/, '.png')) });
    await page.close();
    console.log('rendered @' + scale + 'x', file);
  }
  await browser.close();
})();
