import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

mkdirSync('shots', { recursive: true });
const base = 'http://localhost:5050/prizekit-site/';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 880 } });

// retry until preview is up
let ok = false;
for (let i = 0; i < 30 && !ok; i++) {
  try { await page.goto(base, { waitUntil: 'load', timeout: 8000 }); ok = true; }
  catch { await page.waitForTimeout(1000); }
}
if (!ok) { console.log('PREVIEW NOT UP'); await browser.close(); process.exit(1); }

await page.waitForTimeout(1200);
const positions = [0, 720, 1450, 2200, 3000];
for (let i = 0; i < positions.length; i++) {
  await page.evaluate((y) => window.scrollTo(0, y), positions[i]);
  await page.waitForTimeout(500);
  await page.screenshot({ path: `shots/local-${i}.png` });
}
// full-page too
await page.screenshot({ path: 'shots/local-full.png', fullPage: true });
console.log('DONE');
await browser.close();
