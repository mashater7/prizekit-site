# Сайт Приз_КитБот — план реализации (фаза 1)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Собрать SEO-портал про бота Приз_КитБот на Astro: главная, рандомайзер, FAQ, тарифы, юр-страницы и каркас SEO-блога; опубликовать на GitHub Pages.

**Architecture:** Astro генерирует статичный HTML на каждую страницу. Общий каркас (`BaseLayout`) даёт шапку, футер и SEO-мета. Главная собирается из переиспользуемых секций-компонентов. Рандомайзер — клиентский виджет с чистой логикой выбора, покрытой тестами. Блог — Astro Content Collection из Markdown-файлов. Архитектура заложена под добавление ещё 3 ботов без переделки.

**Tech Stack:** Astro 5, TypeScript, чистый CSS (CSS-переменные для токенов), `@astrojs/sitemap`, `node --test` для юнит-тестов логики, GitHub Actions → GitHub Pages.

**Рабочая папка:** `c:\Users\Пользователь\Desktop\raffle bot\site` (git-репозиторий уже инициализирован, в нём лежит спецификация).

**Условные обозначения путей:** все пути ниже — относительно папки `site/`.

---

## Структура файлов

```
site/
  package.json
  astro.config.mjs            # конфиг Astro + sitemap + site URL
  tsconfig.json
  .gitignore
  .github/workflows/deploy.yml # сборка и публикация на GitHub Pages
  public/
    favicon.png               # из аватарки бота (плейсхолдер до файла от клиента)
    logo.png                  # из аватарки бота
    robots.txt
  src/
    styles/global.css         # токены (цвета/шрифты/отступы) + базовые стили
    data/site.ts              # единый источник: имя бота, ссылка на бота, меню, фичи
    layouts/
      BaseLayout.astro        # html-каркас: <head> SEO + Header + slot + Footer
      BlogLayout.astro        # каркас статьи блога
    components/
      Header.astro
      Footer.astro
      Hero.astro
      FeatureCards.astro
      Steps.astro
      FeatureList.astro
      FaqAccordion.astro
      CtaBanner.astro
    lib/
      randomizer.js           # чистая логика выбора победителей (тестируется)
    pages/
      index.astro             # главная
      how-it-works.astro
      randomizer.astro
      faq.astro
      pricing.astro
      offer.astro
      terms.astro
      privacy.astro
      blog/
        index.astro           # список статей
        [...slug].astro       # рендер статьи из коллекции
    content/
      config.ts               # схема коллекции блога
      blog/
        rozygrysh-v-max.md    # первая SEO-статья (пример наполнения)
  tests/
    randomizer.test.js        # юнит-тесты логики рандомайзера
  docs/superpowers/...        # спецификация и этот план
```

**Источник контента для переиспользования** (в соседнем репозитории бота):
- FAQ: `../raffle_bot/webapp/docs/faq.html`
- Оферта: `../raffle_bot/webapp/docs/offer.html`

---

## Task 0: Каркас проекта Astro

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `src/pages/index.astro` (временный)

- [ ] **Step 1: Создать проект Astro (минимальный шаблон)**

Run (из папки `site/`):
```bash
npm create astro@latest . -- --template minimal --no-install --no-git --yes
```
Ожидаемо: создаются `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro`, `.gitignore`. Команда не трогает уже существующую папку `docs/`.

- [ ] **Step 2: Установить зависимости и плагин sitemap**

Run:
```bash
npm install
npm install @astrojs/sitemap
```
Ожидаемо: появляется `node_modules/`, в `package.json` добавлена зависимость `@astrojs/sitemap`.

- [ ] **Step 3: Прописать sitemap и адрес сайта в конфиге**

Заменить содержимое `astro.config.mjs`:
```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// site обновим на реальный домен при переносе с GitHub Pages.
export default defineConfig({
  site: 'https://example.github.io',
  integrations: [sitemap()],
});
```

- [ ] **Step 4: Убедиться, что dev-сервер запускается**

Run:
```bash
npm run dev
```
Ожидаемо: сервер поднимается на `http://localhost:4321`, открывается стартовая страница без ошибок. Остановить (Ctrl+C).

- [ ] **Step 5: Проверить, что .gitignore игнорирует node_modules и dist**

Открыть `.gitignore`, убедиться что есть строки `node_modules` и `dist`. Если нет — добавить:
```
node_modules/
dist/
.astro/
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: каркас Astro-проекта + sitemap"
```

---

## Task 1: Дизайн-токены и глобальные стили

**Files:**
- Create: `src/styles/global.css`

- [ ] **Step 1: Создать глобальные стили с фирменными токенами**

Создать `src/styles/global.css`. Цвет `--brand` — плейсхолдер (оранжевый, как у randocat); заменим на точный цвет из аватарки бота, когда клиент пришлёт файл.
```css
:root {
  --brand: #e8732a;          /* TODO: заменить на цвет из аватарки Приз_КитБот */
  --brand-dark: #c75e1c;
  --fg: #1a1a1a;
  --muted: #6b7280;
  --bg: #ffffff;
  --bg-soft: #f7f7f8;
  --border: #e5e7eb;
  --radius: 14px;
  --maxw: 1080px;
  --font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; font-family: var(--font); color: var(--fg); background: var(--bg); line-height: 1.55; }
.container { max-width: var(--maxw); margin: 0 auto; padding: 0 20px; }
section { padding: 56px 0; }
h1, h2, h3 { line-height: 1.2; }
a { color: var(--brand); }
.btn {
  display: inline-block; background: var(--brand); color: #fff; text-decoration: none;
  font-weight: 700; padding: 14px 26px; border-radius: var(--radius); border: none;
  cursor: pointer; font-size: 16px; transition: background .15s;
}
.btn:hover { background: var(--brand-dark); }
.btn-secondary { background: var(--bg-soft); color: var(--fg); border: 1px solid var(--border); }
.muted { color: var(--muted); }
.grid { display: grid; gap: 20px; }
@media (min-width: 720px) { .grid-3 { grid-template-columns: repeat(3, 1fr); } .grid-4 { grid-template-columns: repeat(4, 1fr); } }
.card { background: var(--bg-soft); border: 1px solid var(--border); border-radius: var(--radius); padding: 22px; }
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: дизайн-токены и глобальные стили"
```

---

## Task 2: Единый источник данных сайта

Чтобы имя бота, ссылка на бота и меню жили в одном месте (DRY) и легко правились.

**Files:**
- Create: `src/data/site.ts`

- [ ] **Step 1: Создать файл данных**

```ts
export const SITE = {
  botName: 'Приз_КитБот',
  // Реальная ссылка-открытие бота в MAX. Уточнить точный URL у клиента.
  botUrl: 'https://max.ru/id772975617249_bot',
  tagline: 'Розыгрыши и конкурсы в MAX — бесплатно',
};

export const NAV = [
  { href: '/how-it-works', label: 'Как это работает' },
  { href: '/randomizer', label: 'Рандомайзер' },
  { href: '/pricing', label: 'Тарифы' },
  { href: '/faq', label: 'FAQ' },
];

export const FEATURES = [
  { icon: '🎯', title: 'Честный розыгрыш', text: 'Победители выбираются случайно, бот проверяет подписку каждого участника.' },
  { icon: '📈', title: 'Рост канала', text: 'Реферальная система даёт билеты за друзей, мультиканальные розыгрыши приводят новых подписчиков.' },
  { icon: '🛡️', title: 'Полный контроль', text: 'Антибот, переразыгрыш, запрет участия админам, любое число победителей.' },
];
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: единый источник данных сайта (имя бота, меню, фичи)"
```

---

## Task 3: BaseLayout с SEO-мета

**Files:**
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Создать каркас страницы**

```astro
---
import '../styles/global.css';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
const { title, description } = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site).href;
---
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonical} />
  </head>
  <body>
    <Header />
    <main><slot /></main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 2: Проверка сборки (после Header/Footer задач сборка должна проходить)**

Примечание: эта задача зависит от Task 4 и Task 5. Если выполняется до них — временно закомментировать импорты Header/Footer и их использование, раскомментировать после.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: BaseLayout с SEO-мета и canonical"
```

---

## Task 4: Header (шапка)

**Files:**
- Create: `src/components/Header.astro`

- [ ] **Step 1: Создать шапку**

Задел под переключатель продуктов оставлен комментарием — включим, когда появятся ещё боты.
```astro
---
import { SITE, NAV } from '../data/site';
---
<header class="site-header">
  <div class="container hdr">
    <a href="/" class="logo"><img src="/logo.png" alt={SITE.botName} width="32" height="32" /> {SITE.botName}</a>
    {/* TODO: переключатель продуктов (RandoCat/AiCat/...) — включить при добавлении ботов */}
    <nav class="nav">
      {NAV.map((item) => <a href={item.href}>{item.label}</a>)}
    </nav>
    <a href={SITE.botUrl} class="btn">Открыть бота</a>
  </div>
</header>
<style>
  .site-header { border-bottom: 1px solid var(--border); position: sticky; top: 0; background: var(--bg); z-index: 50; }
  .hdr { display: flex; align-items: center; gap: 20px; padding: 12px 20px; }
  .logo { display: flex; align-items: center; gap: 8px; font-weight: 800; color: var(--fg); text-decoration: none; }
  .nav { display: none; gap: 18px; margin-left: auto; }
  .nav a { color: var(--muted); text-decoration: none; font-size: 15px; font-weight: 600; }
  .nav a:hover { color: var(--fg); }
  .site-header .btn { padding: 9px 16px; font-size: 14px; }
  .hdr .btn { margin-left: auto; }
  @media (min-width: 860px) { .nav { display: flex; } .hdr .btn { margin-left: 0; } }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: шапка сайта с навигацией и CTA"
```

---

## Task 5: Footer (футер)

**Files:**
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Создать футер**

Задел «другие боты — скоро» оставлен комментарием.
```astro
---
import { SITE } from '../data/site';
const year = new Date().getFullYear();
---
<footer class="site-footer">
  <div class="container cols">
    <div>
      <div class="ft-brand">{SITE.botName}</div>
      <p class="muted">{SITE.tagline}</p>
    </div>
    <nav>
      <a href="/how-it-works">Как это работает</a>
      <a href="/randomizer">Рандомайзер</a>
      <a href="/pricing">Тарифы</a>
      <a href="/faq">FAQ</a>
      <a href="/blog">Блог</a>
    </nav>
    <nav>
      <a href="/offer">Договор оферты</a>
      <a href="/terms">Пользовательское соглашение</a>
      <a href="/privacy">Конфиденциальность</a>
    </nav>
    {/* TODO: блок «Другие наши боты — скоро» при добавлении продуктов */}
  </div>
  <div class="container copyright muted">© {year} {SITE.botName}</div>
</footer>
<style>
  .site-footer { border-top: 1px solid var(--border); background: var(--bg-soft); padding: 36px 0 24px; margin-top: 40px; }
  .cols { display: grid; gap: 24px; }
  .ft-brand { font-weight: 800; margin-bottom: 6px; }
  .site-footer nav { display: flex; flex-direction: column; gap: 8px; }
  .site-footer nav a { color: var(--muted); text-decoration: none; font-size: 14px; }
  .site-footer nav a:hover { color: var(--fg); }
  .copyright { margin-top: 24px; font-size: 13px; }
  @media (min-width: 720px) { .cols { grid-template-columns: 2fr 1fr 1fr; } }
</style>
```

- [ ] **Step 2: Раскомментировать импорты в BaseLayout (если были закомментированы в Task 3)**

Убедиться, что `BaseLayout.astro` импортирует и использует `Header` и `Footer`.

- [ ] **Step 3: Проверка сборки**

Run:
```bash
npm run build
```
Ожидаемо: сборка без ошибок (стартовая `index.astro` ещё временная — это нормально).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: футер сайта со ссылками"
```

---

## Task 6: Секции-компоненты главной

**Files:**
- Create: `src/components/Hero.astro`, `FeatureCards.astro`, `Steps.astro`, `FeatureList.astro`, `CtaBanner.astro`

- [ ] **Step 1: Hero**

`src/components/Hero.astro`:
```astro
---
import { SITE } from '../data/site';
---
<section class="hero">
  <div class="container">
    <h1>Розыгрыши и конкурсы в&nbsp;MAX — <span class="accent">бесплатно</span></h1>
    <p class="lead muted">Честный выбор победителей, проверка подписки и рост канала. Запустите розыгрыш за пару минут — прямо в {SITE.botName}.</p>
    <a href={SITE.botUrl} class="btn">Запустить розыгрыш</a>
  </div>
</section>
<style>
  .hero { text-align: center; padding: 72px 0 56px; }
  .hero h1 { font-size: 40px; margin: 0 0 14px; }
  .accent { color: var(--brand); }
  .lead { font-size: 18px; max-width: 640px; margin: 0 auto 26px; }
</style>
```

- [ ] **Step 2: FeatureCards (что вы получите)**

`src/components/FeatureCards.astro`:
```astro
---
import { FEATURES } from '../data/site';
---
<section>
  <div class="container">
    <h2 style="text-align:center;margin-bottom:28px;">Что вы получите</h2>
    <div class="grid grid-3">
      {FEATURES.map((f) => (
        <div class="card">
          <div style="font-size:28px;">{f.icon}</div>
          <h3>{f.title}</h3>
          <p class="muted">{f.text}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 3: Steps (универсальный блок шагов)**

`src/components/Steps.astro` — принимает заголовок и массив шагов через props:
```astro
---
const { heading, steps } = Astro.props;
---
<section>
  <div class="container">
    <h2 style="text-align:center;margin-bottom:28px;">{heading}</h2>
    <div class="grid grid-4">
      {steps.map((s, i) => (
        <div class="card">
          <div class="step-num">{i + 1}</div>
          <h3>{s.title}</h3>
          <p class="muted">{s.text}</p>
        </div>
      ))}
    </div>
  </div>
</section>
<style>
  .step-num { width: 34px; height: 34px; border-radius: 50%; background: var(--brand); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; margin-bottom: 10px; }
</style>
```

- [ ] **Step 4: FeatureList (список возможностей)**

`src/components/FeatureList.astro`:
```astro
---
const items = [
  '🛡️ Защита Антибот от накруток',
  '🎟️ Реферальная система — билеты за друзей',
  '🔒 Работает с приватными каналами',
  '🖼️ Фото и видео в посте розыгрыша',
  '👥 Мультиканальные розыгрыши со спонсорами',
  '🔁 Переразыгрыш приза в один клик',
  '📊 Статистика подписок и участников',
  '🏆 Любое число победителей',
];
---
<section style="background:var(--bg-soft);">
  <div class="container">
    <h2 style="text-align:center;margin-bottom:28px;">Возможности</h2>
    <ul class="feats">{items.map((t) => <li>{t}</li>)}</ul>
  </div>
</section>
<style>
  .feats { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; }
  .feats li { background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px 18px; font-weight: 600; }
  @media (min-width: 720px) { .feats { grid-template-columns: 1fr 1fr; } }
</style>
```

- [ ] **Step 5: CtaBanner (финальный призыв)**

`src/components/CtaBanner.astro`:
```astro
---
import { SITE } from '../data/site';
const { title = 'Проведите первый розыгрыш за 2 минуты', button = 'Открыть бота' } = Astro.props;
---
<section class="cta">
  <div class="container">
    <h2>{title}</h2>
    <a href={SITE.botUrl} class="btn">{button}</a>
  </div>
</section>
<style>
  .cta { text-align: center; }
  .cta h2 { margin-bottom: 20px; }
</style>
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: секции-компоненты главной (Hero, FeatureCards, Steps, FeatureList, CtaBanner)"
```

---

## Task 7: FaqAccordion (раскрывающийся FAQ)

**Files:**
- Create: `src/components/FaqAccordion.astro`

- [ ] **Step 1: Создать аккордеон на нативном `<details>`**

Без JS — работает и индексируется поисковиком.
```astro
---
const { items } = Astro.props; // [{ q, a }]
---
<section>
  <div class="container">
    <h2 style="text-align:center;margin-bottom:28px;">Частые вопросы</h2>
    <div class="faq">
      {items.map((it) => (
        <details>
          <summary>{it.q}</summary>
          <div class="ans" set:html={it.a}></div>
        </details>
      ))}
    </div>
  </div>
</section>
<style>
  .faq { max-width: 760px; margin: 0 auto; }
  details { border-bottom: 1px solid var(--border); padding: 4px 0; }
  summary { cursor: pointer; font-weight: 700; padding: 16px 0; list-style: none; }
  summary::-webkit-details-marker { display: none; }
  .ans { padding: 0 0 16px; color: var(--muted); }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: FAQ-аккордеон на нативном details"
```

---

## Task 8: Сборка главной страницы

**Files:**
- Modify: `src/pages/index.astro` (заменить временную заглушку)

- [ ] **Step 1: Собрать главную из компонентов**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import FeatureCards from '../components/FeatureCards.astro';
import Steps from '../components/Steps.astro';
import FeatureList from '../components/FeatureList.astro';
import FaqAccordion from '../components/FaqAccordion.astro';
import CtaBanner from '../components/CtaBanner.astro';

const connectSteps = [
  { title: 'Напишите боту', text: 'Откройте Приз_КитБот в MAX и нажмите Старт.' },
  { title: 'Добавьте в админы', text: 'Добавьте бота в подписчики, затем в администраторы канала.' },
  { title: 'Создайте розыгрыш', text: 'Заполните форму: текст, приз, сроки — и запустите.' },
];
const howSteps = [
  { title: 'Создаёте розыгрыш', text: 'В удобной форме: текст, фото, число победителей, сроки.' },
  { title: 'Пост публикуется', text: 'Бот сам публикует пост с кнопкой «Участвовать» в каналах.' },
  { title: 'Люди участвуют', text: 'Бот проверяет подписку и считает участников.' },
  { title: 'Бот выбирает', text: 'Случайно и честно определяет победителей и оповещает их.' },
];
const faq = [
  { q: 'Можно ли в MAX проводить розыгрыши бесплатно?', a: 'Да, Приз_КитБот бесплатный. Подключите бота к каналу и создайте розыгрыш.' },
  { q: 'Как бот выбирает победителя?', a: 'Случайным образом из участников, выполнивших все условия. Доступен переразыгрыш.' },
  { q: 'Сколько каналов и победителей может быть?', a: 'Неограниченное число каналов-спонсоров и победителей.' },
  { q: 'Что такое реферальная ссылка?', a: 'Персональная ссылка-приглашение: за приведённых друзей участник получает дополнительные билеты.' },
];
---
<BaseLayout title="Розыгрыши и конкурсы в MAX — бесплатный бот | Приз_КитБот" description="Приз_КитБот — бесплатный бот для честных розыгрышей и конкурсов в MAX: проверка подписки, антибот, реферальная система, любое число победителей.">
  <Hero />
  <FeatureCards />
  <Steps heading="Как подключить за 3 шага" steps={connectSteps} />
  <Steps heading="Как это работает" steps={howSteps} />
  <FeatureList />
  <FaqAccordion items={faq} />
  <CtaBanner />
</BaseLayout>
```

- [ ] **Step 2: Проверить главную в браузере**

Run:
```bash
npm run dev
```
Ожидаемо: на `http://localhost:4321/` видна главная со всеми секциями, ссылки «Открыть бота» ведут на `SITE.botUrl`, на мобильной ширине меню скрывается. Остановить (Ctrl+C).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: главная страница собрана из секций"
```

---

## Task 9: Логика рандомайзера (TDD)

**Files:**
- Create: `src/lib/randomizer.js`, `tests/randomizer.test.js`

- [ ] **Step 1: Написать падающий тест**

`tests/randomizer.test.js`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseEntries, pickWinners } from '../src/lib/randomizer.js';

test('parseEntries: строки в массив, пустые и пробелы убираются', () => {
  assert.deepEqual(parseEntries('Аня\n Боря \n\nВера\n'), ['Аня', 'Боря', 'Вера']);
});

test('parseEntries: дубликаты удаляются', () => {
  assert.deepEqual(parseEntries('Аня\nАня\nБоря'), ['Аня', 'Боря']);
});

test('pickWinners: выбирает нужное число уникальных победителей', () => {
  const entries = ['a', 'b', 'c', 'd', 'e'];
  const winners = pickWinners(entries, 3, () => 0.5);
  assert.equal(winners.length, 3);
  assert.equal(new Set(winners).size, 3);
});

test('pickWinners: если победителей больше чем участников — вернуть всех', () => {
  const winners = pickWinners(['a', 'b'], 5, Math.random);
  assert.equal(winners.length, 2);
});

test('pickWinners: 0 участников → пустой массив', () => {
  assert.deepEqual(pickWinners([], 3, Math.random), []);
});
```

- [ ] **Step 2: Запустить тест — убедиться, что падает**

Run:
```bash
node --test tests/randomizer.test.js
```
Ожидаемо: FAIL — модуль `../src/lib/randomizer.js` не найден.

- [ ] **Step 3: Реализовать минимальную логику**

`src/lib/randomizer.js`:
```js
export function parseEntries(text) {
  const seen = new Set();
  const out = [];
  for (const raw of String(text).split('\n')) {
    const v = raw.trim();
    if (v && !seen.has(v)) { seen.add(v); out.push(v); }
  }
  return out;
}

// rng() возвращает число [0,1). По умолчанию Math.random; в тестах подменяется.
export function pickWinners(entries, count, rng = Math.random) {
  const pool = [...entries];
  const n = Math.min(count, pool.length);
  const winners = [];
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(rng() * pool.length);
    winners.push(pool.splice(idx, 1)[0]);
  }
  return winners;
}
```

- [ ] **Step 4: Запустить тест — убедиться, что проходит**

Run:
```bash
node --test tests/randomizer.test.js
```
Ожидаемо: PASS (5 тестов).

Примечание про тест с `() => 0.5`: при первом выборе `idx = floor(0.5 * 5) = 2`, далее пул уменьшается — все индексы валидны, 3 уникальных победителя. Тест устойчив.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: логика рандомайзера с тестами (parseEntries, pickWinners)"
```

---

## Task 10: Страница рандомайзера

**Files:**
- Create: `src/pages/randomizer.astro`

- [ ] **Step 1: Создать страницу с клиентским виджетом**

Логика импортируется тем же модулем (DRY) и исполняется в браузере.
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import CtaBanner from '../components/CtaBanner.astro';
---
<BaseLayout title="Рандомайзер для розыгрыша онлайн — выбрать победителя | Приз_КитБот" description="Бесплатный рандомайзер: вставьте список участников и честно выберите случайных победителей. Для розыгрышей в MAX используйте Приз_КитБот.">
  <section>
    <div class="container" style="max-width:680px;">
      <h1>Рандомайзер — выбрать победителя</h1>
      <p class="muted">Вставьте участников (по одному в строке), укажите число победителей и нажмите кнопку.</p>
      <textarea id="entries" rows="10" placeholder="Аня&#10;Боря&#10;Вера" style="width:100%;padding:12px;border:1px solid var(--border);border-radius:var(--radius);font-size:15px;"></textarea>
      <div style="display:flex;gap:12px;align-items:center;margin:14px 0;">
        <label>Победителей: <input id="count" type="number" min="1" value="1" style="width:80px;padding:8px;border:1px solid var(--border);border-radius:10px;"></label>
        <button id="run" class="btn">Выбрать</button>
      </div>
      <div id="result"></div>
    </div>
  </section>
  <CtaBanner title="Проводите розыгрыши прямо в MAX — автоматически" />
</BaseLayout>

<script>
  import { parseEntries, pickWinners } from '../lib/randomizer.js';
  const $ = (id) => document.getElementById(id);
  $('run').addEventListener('click', () => {
    const entries = parseEntries($('entries').value);
    const count = Math.max(1, parseInt($('count').value) || 1);
    const winners = pickWinners(entries, count);
    const box = $('result');
    if (!winners.length) { box.innerHTML = '<p class="muted">Добавьте хотя бы одного участника.</p>'; return; }
    box.innerHTML = '<div class="card"><b>Победители:</b><ol>' +
      winners.map((w) => '<li>' + w.replace(/</g, '&lt;') + '</li>').join('') + '</ol></div>';
  });
</script>
```

- [ ] **Step 2: Проверить в браузере**

Run: `npm run dev`. Открыть `/randomizer`, вставить несколько строк, выбрать 2 победителей — убедиться, что выводятся 2 разных. Остановить.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: страница рандомайзера с клиентским виджетом"
```

---

## Task 11: Страница «Как это работает»

**Files:**
- Create: `src/pages/how-it-works.astro`

- [ ] **Step 1: Создать страницу с подробной инструкцией**

Текст — расширенная версия шагов с главной + блок прав администратора (из FAQ бота).
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import CtaBanner from '../components/CtaBanner.astro';
---
<BaseLayout title="Как провести розыгрыш в MAX — пошаговая инструкция | Приз_КитБот" description="Пошагово: как подключить Приз_КитБот к каналу MAX, дать права администратора и запустить розыгрыш с проверкой подписки.">
  <section>
    <div class="container" style="max-width:760px;">
      <h1>Как провести розыгрыш в MAX</h1>
      <h2>1. Добавьте бота в канал</h2>
      <p>Добавьте <b>Приз_КитБот</b> (поиском по имени или по id <b>id772975617249_bot</b>) в подписчики канала, затем — в администраторы.</p>
      <h2>2. Дайте права</h2>
      <p>Боту нужны все права администратора, <b>кроме</b> «назначать и удалять администраторов».</p>
      <h2>3. Создайте розыгрыш</h2>
      <p>В боте нажмите «Новый розыгрыш», заполните форму: текст поста, приз, число победителей, условие завершения (по дате или по числу участников), при необходимости включите Антибот и реферальную систему. Добавьте фото или видео, когда бот предложит.</p>
      <h2>4. Бот ведёт розыгрыш</h2>
      <p>Бот публикует пост с кнопкой участия, проверяет подписку участников, а в назначенный момент случайно выбирает победителей и оповещает их. Доступен переразыгрыш и досрочное завершение.</p>
    </div>
  </section>
  <CtaBanner button="Запустить розыгрыш" />
</BaseLayout>
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: страница «Как это работает»"
```

---

## Task 12: Страница FAQ (перенос готового контента)

**Files:**
- Create: `src/pages/faq.astro`
- Read: `../raffle_bot/webapp/docs/faq.html` (источник вопросов/ответов)

- [ ] **Step 1: Перенести вопросы из готового FAQ**

Открыть `../raffle_bot/webapp/docs/faq.html`, перенести вопросы и ответы в массив и отрисовать через `FaqAccordion`. Структура страницы:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import FaqAccordion from '../components/FaqAccordion.astro';
import CtaBanner from '../components/CtaBanner.astro';
// Перенести ВСЕ вопросы из ../raffle_bot/webapp/docs/faq.html.
// Поля: q (вопрос), a (ответ, допускается простой HTML — выводится через set:html).
const items = [
  { q: 'Как добавить канал в Приз_КитБот?', a: 'Добавьте бота в подписчики канала (поиском по имени или id <b>id772975617249_bot</b>), затем в администраторы и нажмите «Обновить».' },
  { q: 'Какие права дать боту?', a: 'Все права, кроме «назначать и удалять администраторов».' },
  { q: 'Сколько победителей можно выбрать?', a: 'Неограниченное количество.' },
  { q: 'Можно ли переразыграть приз?', a: 'Да, после подведения итогов появляется кнопка «ПереРозыгрыш».' },
  { q: 'Как стать участником?', a: 'Нажмите «Участвовать» под постом и подпишитесь на каналы-спонсоры, если это условие.' },
  { q: 'Что такое реферальная ссылка?', a: 'Персональная ссылка-приглашение: за друзей, пришедших по ней, участник получает дополнительные билеты.' },
  // ... перенести остальные вопросы из faq.html
];
---
<BaseLayout title="Частые вопросы о розыгрышах в MAX | Приз_КитБот" description="Ответы на частые вопросы про розыгрыши в MAX: подключение бота, права администратора, выбор победителя, рефералы.">
  <FaqAccordion items={items} />
  <CtaBanner />
</BaseLayout>
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: страница FAQ из готового контента бота"
```

---

## Task 13: Страница «Тарифы»

**Files:**
- Create: `src/pages/pricing.astro`

- [ ] **Step 1: Создать страницу-заглушку «бесплатно»**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import CtaBanner from '../components/CtaBanner.astro';
---
<BaseLayout title="Тарифы — розыгрыши в MAX бесплатно | Приз_КитБот" description="Приз_КитБот бесплатный: проводите розыгрыши и конкурсы в MAX без оплаты.">
  <section>
    <div class="container" style="max-width:520px;text-align:center;">
      <h1>Тарифы</h1>
      <div class="card">
        <h2 style="color:var(--brand);">Бесплатно</h2>
        <p class="muted">Все функции Приз_КитБот доступны без оплаты: розыгрыши, проверка подписки, антибот, рефералы, любое число победителей.</p>
        <a href="/how-it-works" class="btn btn-secondary">Как начать</a>
      </div>
    </div>
  </section>
  <CtaBanner />
</BaseLayout>
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: страница тарифов"
```

---

## Task 14: Юридические страницы

**Files:**
- Create: `src/pages/offer.astro`, `src/pages/terms.astro`, `src/pages/privacy.astro`
- Read: `../raffle_bot/webapp/docs/offer.html`

- [ ] **Step 1: Перенести оферту**

Открыть `../raffle_bot/webapp/docs/offer.html`, перенести текст в `src/pages/offer.astro` внутри `BaseLayout`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Договор оферты | Приз_КитБот" description="Публичный договор оферты сервиса Приз_КитБот.">
  <section><div class="container" style="max-width:760px;">
    {/* Перенести содержимое ../raffle_bot/webapp/docs/offer.html (текст внутри <article>) */}
    <h1>Договор оферты</h1>
    <!-- ... текст оферты ... -->
  </div></section>
</BaseLayout>
```

- [ ] **Step 2: Создать terms.astro и privacy.astro по тому же шаблону**

Если у клиента нет готовых текстов «Пользовательское соглашение» и «Политика конфиденциальности» — оставить заголовок и пометку «текст уточняется» и сообщить клиенту, что нужны эти документы. (В форме бота уже есть отсылка к пользовательскому соглашению — взять текст оттуда, если доступен.)

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: юридические страницы (оферта, соглашение, конфиденциальность)"
```

---

## Task 15: Блог (Content Collection)

**Files:**
- Create: `src/content/config.ts`, `src/content/blog/rozygrysh-v-max.md`, `src/layouts/BlogLayout.astro`, `src/pages/blog/index.astro`, `src/pages/blog/[...slug].astro`

- [ ] **Step 1: Описать схему коллекции**

`src/content/config.ts`:
```ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.string(),
  }),
});

export const collections = { blog };
```

- [ ] **Step 2: Создать первую статью**

`src/content/blog/rozygrysh-v-max.md`:
```md
---
title: Как провести розыгрыш в MAX в 2026 году
description: Пошаговое руководство по проведению честного розыгрыша в канале MAX с ботом Приз_КитБот.
pubDate: 2026-06-01
---

## Зачем проводить розыгрыши в MAX

Розыгрыши — самый быстрый способ привлечь подписчиков в канал...

## Шаг 1. Подключите бота

Добавьте Приз_КитБот в администраторы канала...

## Шаг 2. Создайте розыгрыш

В форме укажите приз, число победителей и сроки...

## Частые ошибки

...
```

- [ ] **Step 3: Создать BlogLayout**

`src/layouts/BlogLayout.astro`:
```astro
---
import BaseLayout from './BaseLayout.astro';
const { title, description } = Astro.props;
---
<BaseLayout title={`${title} | Приз_КитБот`} description={description}>
  <article class="container" style="max-width:740px;">
    <h1>{title}</h1>
    <slot />
  </article>
</BaseLayout>
```

- [ ] **Step 4: Список статей**

`src/pages/blog/index.astro`:
```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';
const posts = await getCollection('blog');
---
<BaseLayout title="Блог о розыгрышах в MAX | Приз_КитБот" description="Статьи о розыгрышах и конкурсах в MAX: инструкции, идеи, правила.">
  <section><div class="container" style="max-width:740px;">
    <h1>Блог</h1>
    <ul class="post-list">
      {posts.map((p) => (
        <li><a href={`/blog/${p.slug}`}>{p.data.title}</a><p class="muted">{p.data.description}</p></li>
      ))}
    </ul>
  </div></section>
</BaseLayout>
<style>
  .post-list { list-style: none; padding: 0; }
  .post-list li { padding: 16px 0; border-bottom: 1px solid var(--border); }
  .post-list a { font-weight: 700; font-size: 18px; text-decoration: none; }
</style>
```

- [ ] **Step 5: Рендер статьи**

`src/pages/blog/[...slug].astro`:
```astro
---
import { getCollection } from 'astro:content';
import BlogLayout from '../../layouts/BlogLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((p) => ({ params: { slug: p.slug }, props: { post: p } }));
}
const { post } = Astro.props;
const { Content } = await post.render();
---
<BlogLayout title={post.data.title} description={post.data.description}>
  <Content />
</BlogLayout>
```

- [ ] **Step 6: Проверить блог**

Run: `npm run dev`. Открыть `/blog` — виден список; кликнуть статью — открывается `/blog/rozygrysh-v-max`. Остановить.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: блог на Content Collections + первая SEO-статья"
```

---

## Task 16: robots.txt и финальная проверка сборки

**Files:**
- Create: `public/robots.txt`

- [ ] **Step 1: Создать robots.txt**

```
User-agent: *
Allow: /
Sitemap: https://example.github.io/sitemap-index.xml
```
(Адрес обновим при переносе на реальный домен.)

- [ ] **Step 2: Полная сборка**

Run:
```bash
npm run build
```
Ожидаемо: сборка без ошибок; в `dist/` появляются все страницы (`index.html`, `randomizer/index.html`, `blog/...`) и `sitemap-index.xml`.

- [ ] **Step 3: Локальный просмотр собранного сайта**

Run:
```bash
npm run preview
```
Ожидаемо: открыть указанный адрес, пройти по всем страницам и ссылкам — ошибок нет. Остановить.

- [ ] **Step 4: Запустить тесты**

Run:
```bash
node --test tests/randomizer.test.js
```
Ожидаемо: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: robots.txt и финальная проверка сборки"
```

---

## Task 17: Публикация на GitHub Pages

**Files:**
- Create: `.github/workflows/deploy.yml`

**Предусловие:** у клиента есть аккаунт GitHub и создан пустой репозиторий (например `prizekit-site`). Уточнить имя пользователя GitHub и имя репозитория — от них зависит итоговый адрес `https://<user>.github.io/<repo>/` и значение `site`/`base` в конфиге.

- [ ] **Step 1: Обновить astro.config.mjs под адрес GitHub Pages**

Если сайт публикуется по адресу `https://<user>.github.io/<repo>/`, добавить `base`:
```js
export default defineConfig({
  site: 'https://<user>.github.io',
  base: '/<repo>',
  integrations: [sitemap()],
});
```
(При переносе на собственный домен `base` убрать, `site` сменить на домен.)

- [ ] **Step 2: Создать workflow публикации**

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v3
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 3: Подключить удалённый репозиторий и запушить**

Run (подставить реальные user/repo):
```bash
git remote add origin https://github.com/<user>/<repo>.git
git branch -M main
git push -u origin main
```

- [ ] **Step 4: Включить Pages в настройках репозитория**

В GitHub: Settings → Pages → Source = «GitHub Actions». Дождаться завершения workflow во вкладке Actions.

- [ ] **Step 5: Проверить опубликованный сайт**

Открыть `https://<user>.github.io/<repo>/` — сайт открывается, страницы и ссылки работают.

---

## Самопроверка плана (выполнено при написании)

- **Покрытие спецификации:** главная (Task 8), рандомайзер (9–10), how-it-works (11), FAQ (12), тарифы (13), юр-страницы (14), блог (15), SEO/sitemap/robots (Task 0 + 16), GitHub Pages (17), задел под 4 бота (комментарии в Header/Footer, Task 4–5). Все разделы спецификации покрыты.
- **Заглушки:** контент юр-страниц и остальных FAQ-вопросов переносится из готовых файлов бота — это явный источник, не «TODO без данных». Точные цвета/ссылка бота/имя GitHub-репозитория помечены как уточняемые у клиента (внешние данные, не код).
- **Согласованность типов:** `parseEntries`/`pickWinners` (Task 9) используются и на странице (Task 10), и в тестах с одинаковыми сигнатурами. Props компонентов (`heading`/`steps`, `items`, `title`/`button`) совпадают между определением и использованием на главной.

## Что нужно от клиента к старту вёрстки

1. Файл аватарки бота (PNG) — для точных фирменных цветов и `logo.png`/`favicon.png`.
2. Точная ссылка открытия бота в MAX (для `SITE.botUrl`).
3. Имя пользователя GitHub и название репозитория для сайта.
4. (Опционально) готовые тексты «Пользовательское соглашение» и «Политика конфиденциальности», если их нет в материалах бота.
