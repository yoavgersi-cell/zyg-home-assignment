const { chromium } = require('playwright-core');
const path = require('path');

(async () => {
  const url = 'file://' + path.join(__dirname, 'funnel.html');
  const out = path.join(__dirname, 'funnel.png');
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--no-sandbox'],
  });
  const ctx = await browser.newContext({ deviceScaleFactor: 2, viewport: { width: 2400, height: 700 } });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  const el = await page.$('.wrap');
  await el.screenshot({ path: out });
  await browser.close();
  console.log('WROTE', out);
})();
