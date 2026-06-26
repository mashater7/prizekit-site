import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

mkdirSync('shots', { recursive: true });
const base = 'http://localhost:5051/';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

async function go(url) {
  let ok = false;
  for (let i = 0; i < 30 && !ok; i++) {
    try { await page.goto(url, { waitUntil: 'load', timeout: 8000 }); ok = true; }
    catch { await page.waitForTimeout(1000); }
  }
  return ok;
}

if (!(await go(base + 'birzha/'))) { console.log('SERVER NOT UP'); await browser.close(); process.exit(1); }
await page.waitForTimeout(800);
await page.screenshot({ path: 'shots/new-birzha-top.png' });
await page.screenshot({ path: 'shots/new-birzha-full.png', fullPage: true });

await go(base + 'articles/');
await page.waitForTimeout(600);
await page.screenshot({ path: 'shots/new-articles.png', fullPage: true });

await go(base + 'articles/sample-test/');
await page.waitForTimeout(600);
await page.screenshot({ path: 'shots/new-article.png', fullPage: true });

// мобильный вид шапки (6 пунктов меню) — проверка переполнения
const mob = await browser.newPage({ viewport: { width: 390, height: 800 } });
await mob.goto(base, { waitUntil: 'load' });
await mob.waitForTimeout(400);
await mob.screenshot({ path: 'shots/new-mobile-home.png' });

console.log('DONE');
await browser.close();
