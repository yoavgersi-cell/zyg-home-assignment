import { existsSync } from 'fs';
import puppeteer from 'puppeteer-core';

export const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

export async function launchBrowser() {
  // Local / sandbox chromium first; on Vercel use the packaged lambda build.
  const localPath =
    process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  if (existsSync(localPath)) {
    return puppeteer.launch({
      executablePath: localPath,
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    });
  }
  const chromium = (await import('@sparticuz/chromium')).default;
  // If the bundler dropped the packaged binaries, fetch the official pack
  // for the exact installed version instead (cached in /tmp across warm
  // invocations).
  let executablePath: string;
  try {
    executablePath = await chromium.executablePath();
  } catch (e) {
    console.warn('[agent] packaged chromium missing, using remote pack:', e);
    executablePath = await chromium.executablePath(
      'https://github.com/Sparticuz/chromium/releases/download/v149.0.0/chromium-v149.0.0-pack.x64.tar',
    );
  }
  // sparticuz ships the headless *shell* build; puppeteer must be told so,
  // otherwise it passes new-headless flags and the launch fails on Vercel.
  return puppeteer.launch({
    executablePath,
    args: chromium.args,
    defaultViewport: { width: 1280, height: 900 },
    headless: 'shell',
  });
}
