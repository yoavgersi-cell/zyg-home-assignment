const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');

(async () => {
  const files = process.argv.slice(2);
  const list = files.length ? files : fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--no-sandbox', '--force-color-profile=srgb'],
  });
  const ctx = await browser.newContext({ deviceScaleFactor: 2, viewport: { width: 1600, height: 900 } });
  for (const file of list) {
    const page = await ctx.newPage();
    await page.goto('file://' + path.join(__dirname, file), { waitUntil: 'networkidle' });
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(__dirname, file.replace(/\.html$/, '.png')) });
    await page.close();
    console.log('rendered', file);
  }
  await browser.close();
})();
