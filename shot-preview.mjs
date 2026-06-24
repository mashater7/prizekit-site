import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const SRC = process.argv[2];        // file:// url to preview.html
const OUT = process.argv[3];        // output dir
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1180, height: 900 }, deviceScaleFactor: 2 });
await page.goto(SRC, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(1500); // fonts

const screens = await page.$$('.screen');
const names = ['1-teal', '2-indigo', '3-ocean'];
for (let i = 0; i < screens.length; i++) {
  await screens[i].screenshot({ path: `${OUT}/palette-${names[i]}.png` });
  console.log('OK', names[i]);
}
await browser.close();
console.log('DONE');
