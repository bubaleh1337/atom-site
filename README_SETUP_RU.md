# ATOM — лендинг для atom.com.kz

Готовый статический трёхъязычный сайт (RU/KZ/EN) + серверная функция `/api/lead` для заявок.

## Что внутри
- Адаптивный лендинг без платного конструктора.
- Реальные фото работ ATOM.
- RU / KZ / EN, отдельные SEO-страницы.
- Кнопки «Получить расчёт» открывают форму; кнопки «Заказать услугу» и WhatsApp ведут менеджеру Азамату: +7 776 000 20 31.
- Форма пишет заявку в Supabase и отправляет уведомления Никите в Telegram и на Atom.pr@inbox.ru.
- UTM-метки сохраняются вместе с заявкой.
- Honeypot + простое rate limiting против спама.
- Политика конфиденциальности на трёх языках.

## Быстрый запуск локально
1. Распакуйте проект, например в `P:\\Projects\\atom-site`.
2. Откройте PowerShell в папке проекта.
3. Если Vercel CLI ещё нет: `npm i -g vercel`
4. Выполните: `vercel login`
5. Создайте `.env.local` по образцу `.env.example`.
6. Запуск: `vercel dev`
7. Откройте адрес, который покажет CLI (обычно http://localhost:3000).

## Supabase
Можно создать отдельный проект или, чтобы не платить за третий проект, добавить отдельную таблицу в один из уже существующих Supabase-проектов. Таблица изолирована RLS и не имеет публичных политик.
1. Supabase → SQL Editor → New query.
2. Вставьте содержимое `supabase/setup.sql` → Run.
3. Project Settings → API / Data API: скопируйте Project URL в `SUPABASE_URL`.
4. Скопируйте **service_role / secret key** в `SUPABASE_SERVICE_ROLE_KEY`.
5. Этот ключ НИКОГДА не вставляйте в HTML/JS и не публикуйте в Git. Он используется только серверной функцией.

## Telegram Никиты
Telegram не позволяет боту писать человеку только по @username. Никите нужно один раз начать чат с ботом.
1. В Telegram открыть `@BotFather` → `/newbot` → создать бота, например `ATOM Leads`.
2. Токен вставить в `TELEGRAM_BOT_TOKEN`.
3. Никита со своего аккаунта `@PupykinN` открывает созданного бота и нажимает **Start**.
4. В PowerShell выполнить (подставив токен):
   `Invoke-RestMethod "https://api.telegram.org/botВАШ_ТОКЕН/getUpdates" | ConvertTo-Json -Depth 8`
5. Найдите `message.chat.id` у сообщения Никиты и вставьте число в `TELEGRAM_CHAT_ID`.

## Email-уведомления через Resend
Чтобы не трогать входящую почту компании, лучше подтвердить поддомен `notify.atom.com.kz`.
1. Создайте бесплатный аккаунт Resend → Domains → Add domain → `notify.atom.com.kz`.
2. Resend покажет DNS-записи (DKIM/SPF). Добавьте **ровно их** в DNS-зону PS.kz. Не удаляйте записи сайта и не меняйте MX `inbox.ru` — получатель остаётся `Atom.pr@inbox.ru`.
3. После статуса Verified создайте API key.
4. Заполните `RESEND_API_KEY` и `LEADS_EMAIL_FROM=ATOM Website <leads@notify.atom.com.kz>`.

## Переменные в Vercel
Vercel Dashboard → проект → Settings → Environment Variables. Добавьте все 7 переменных из `.env.example` для Production, Preview и Development (можно сначала только Production).

## Деплой
В PowerShell из папки проекта:
`vercel --prod`

После первого деплоя проверьте форму на временном `*.vercel.app` адресе. Сначала убедитесь, что:
- новая строка появилась в `atom_website_leads`;
- Никита получил Telegram;
- письмо пришло на `Atom.pr@inbox.ru`.
Только после этого переключайте основной домен.

## Подключение atom.com.kz
Сначала в Vercel: Project → Settings → Domains → Add → `atom.com.kz`, затем `www.atom.com.kz`.

В PS.kz сейчас у домена старый A-record на `213.130.74.124`. После успешного теста откройте Vercel → Domains и используйте DNS-значения, которые он покажет для проекта. На текущей конфигурации Vercel обычно поддерживает:
- `A` для `atom.com.kz` / `@`: **76.76.21.21**
- `CNAME` для `www`: **cname.vercel-dns.com**

Если Vercel в интерфейсе покажет другие значения, используйте именно значения из Vercel.

NS `ns1.ps.kz`, `ns2.ps.kz`, `ns3.ps.kz` оставьте как есть. DNS-зону PS.kz отключать не нужно.

После изменения проверьте:
`vercel domains verify atom.com.kz`

Vercel сам выпустит SSL-сертификат. DNS может обновляться не мгновенно.

## Проверка перед рекламой
1. Desktop + mobile.
2. RU/KZ/EN переключатели.
3. Каждая кнопка «Заказать услугу» подставляет услугу в форму.
4. WhatsApp открывает +7 776 000 20 31.
5. Форма даёт запись в Supabase + Telegram + email.
6. Карта показывает ул. Беймбет Майлина 89а/1.
7. `https://atom.com.kz/robots.txt` и `/sitemap.xml` открываются.
8. Только после этого можно добавлять домен обратно в Google Ads.
