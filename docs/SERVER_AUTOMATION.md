# Автообновление сайта 24kitbot.ru — серверная установка

Сайт статический (Astro → GitHub Pages). Данные для двух фич живут на сервере бота:
- **Кит_Биржа** (`/birzha`) — список каналов из розыгрышей (БД бота).
- **Статьи** (`/articles`) — посты MAX-группы «Охватория» (через MAX API бота).

Автообновление = крон на сервере бота: генерирует данные → собирает Astro →
деплоит в `gh-pages`. Скрипты:
- `raffle_bot/scripts/generate-site-data.mjs` — экспортёр данных (БД read-only + MAX).
- `raffle_bot/scripts/sync-site.sh` — обвязка крона (pull → generate → build → deploy).

> ⚠️ **Почему не активировано в ночь 2026-06-27:** авто-классификатор харнеса
> заблокировал чтение боевого `.env`/БД по SSH даже после «заливай». Поэтому код
> готов и сайт уже задеплоен с каналами из локального бэкапа (без ссылок, цифры от
> ~мая), а финальная серверная активация (свежие цифры + ссылки + статьи) делается
> шагами ниже — с живой авторизацией.

---

## Разовая установка (≈10 минут на сервере)

### 1. Залить скрипты на сервер
```bash
# с локальной машины (scp/sftp) или paramiko-деплоем:
#   raffle_bot/scripts/generate-site-data.mjs  → /root/raffle_bot/scripts/
#   raffle_bot/scripts/sync-site.sh            → /root/raffle_bot/scripts/
chmod +x /root/raffle_bot/scripts/sync-site.sh
```

### 2. Найти chat_id группы «Охватория»
Бот уже в группе. Пробуем по очереди:
```bash
cd /root/raffle_bot
# (a) поиск в БД (если бот уже логировал группу)
node -e 'const D=require("better-sqlite3");const db=new D("./raffle.db",{readonly:true});
for(const t of ["user_channels","channel_link_state","pending_bot_channels"]){try{
  const rows=db.prepare(`SELECT * FROM ${t} WHERE (title||channel_title||"") LIKE "%хватори%" OR (link||channel_username||"") LIKE "%se13299904%" LIMIT 5`).all();
  if(rows.length)console.log(t,JSON.stringify(rows));}catch(e){}}'

# (b) через MAX API — список чатов бота (если GET /chats ещё жив)
node -e 'import("./api.js").then(a=>{a.setToken(process.env.BOT_TOKEN);
  return a.getMyChats(100);}).then(r=>{for(const c of (r?.chats||[]))
  if(/хватори|se13299904/i.test((c.title||"")+(c.link||"")))console.log(c.chat_id,c.title,c.link);})' \
  BOT_TOKEN="$(grep -E '^BOT_TOKEN=' .env|cut -d= -f2-)"
```
Записать найденный `chat_id` (отрицательное число) — он пойдёт в `OHVATORIA_CHAT_ID`.

### 3. Клонировать репозиторий сайта и поставить зависимости
```bash
cd /root
git clone https://github.com/mashater7/prizekit-site.git
cd prizekit-site
npm ci
```

### 4. Deploy-key для пуша в gh-pages (без логина/пароля)
```bash
ssh-keygen -t ed25519 -N "" -f /root/.ssh/prizekit_deploy
cat /root/.ssh/prizekit_deploy.pub   # ← добавить как Deploy key (с правом записи) в репозитории
```
С локальной машины (где авторизован gh, repo-scope достаточно):
```bash
gh repo deploy-key add /root/.ssh/prizekit_deploy.pub \
  --repo mashater7/prizekit-site --title "server-deploy" --allow-write
```

### 5. Первый прогон вручную (проверка)
```bash
cd /root/raffle_bot/scripts
OHVATORIA_CHAT_ID="<chat_id_из_шага_2>" SITE_DIR=/root/prizekit-site ./sync-site.sh
```
Открыть http://24kitbot.ru/birzha/ (ссылки на каналы появятся) и /articles/ (посты группы).

### 6. Поставить в cron (например, каждый час)
```bash
crontab -e
# добавить строку (chat_id подставить свой):
0 * * * * OHVATORIA_CHAT_ID="<chat_id>" SITE_DIR=/root/prizekit-site /root/raffle_bot/scripts/sync-site.sh >> /root/sync-site.log 2>&1
```

---

## Настройки генератора (env)
| Переменная | Назначение | По умолчанию |
|---|---|---|
| `OHVATORIA_CHAT_ID` | chat_id группы для статей | — (без него статьи пропускаются) |
| `ARTICLES_COUNT` | сколько последних постов читать | 100 |
| `MIN_SUBSCRIBERS` | порог отсечения тестовых каналов | 100 |
| `DB_PATH` | путь к raffle.db | `<bot>/raffle.db` |
| `SITE_DIR` | корень репозитория сайта | `<bot>/../site` |

Флаги: `--channels-only` / `--articles-only` (для отладки одной части).

---

## Альтернатива: сборка в GitHub Actions (Вариант A)
Если не хочется собирать Astro на сервере бота — сервер только генерирует данные и
пушит в `main`, а сборкой/деплоем занимается GitHub Actions. Требует разово выдать
токену права `workflow` (`gh auth refresh -h github.com -s workflow`) и добавить
`.github/workflows/deploy.yml`. Текущая установка (Вариант B, выше) этого не требует
и полностью автономна — рекомендуется как основная.
