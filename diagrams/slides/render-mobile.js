const { chromium } = require('playwright-core');
const path = require('path');

(async () => {
  const files = process.argv.slice(2);
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--no-sandbox', '--force-color-profile=srgb'],
  });
  const ctx = await browser.newContext({ deviceScaleFactor: 2, viewport: { width: 390, height: 844 } });
  for (const file of files) {
    const page = await ctx.newPage();
    await page.goto('file://' + path.join(__dirname, file), { waitUntil: 'networkidle' });
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(__dirname, file.replace(/\.html$/, '.png')), fullPage: true });
    await page.close();
    console.log('rendered', file);
  }
  await browser.close();
})();
