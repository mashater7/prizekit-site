import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

mkdirSync('shots', { recursive: true });
const targets = [
  ['randocat', 'https://randocat.ru/'],
  ['ours', 'https://mashater7.github.io/prizekit-site/'],
];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 860 } });
for (const [name, url] of targets) {
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(1800);
    await page.screenshot({ path: `shots/${name}-top.png` });
    await page.evaluate(() => window.scrollTo(0, 760));
    await page.waitForTimeout(700);
    await page.screenshot({ path: `shots/${name}-mid.png` });
    console.log('OK', name);
  } catch (e) {
    console.log('ERR', name, e.message);
  }
}
await browser.close();
console.log('DONE');
