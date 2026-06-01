import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
mkdirSync('shots', { recursive: true });
const base = 'https://mashater7.github.io/prizekit-site/';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 880 } });
await page.goto(base, { waitUntil: 'load', timeout: 60000 });
await page.waitForTimeout(2500); // wait fonts
const positions = [0, 700, 1380, 2050, 2720];
for (let i = 0; i < positions.length; i++) {
  await page.evaluate((y) => window.scrollTo(0, y), positions[i]);
  await page.waitForTimeout(500);
  await page.screenshot({ path: `shots/live-${i}.png` });
}
console.log('DONE live');
await browser.close();
