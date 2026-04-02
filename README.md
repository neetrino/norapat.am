# Զարգացման կանոնների կաղապար (Cursor AI)

Cursor-ում AI-զարգացման կանոններով repo-ի կաղապար։ Next.js / NestJS, ճարտարապետություն, կոդ, անվտանգություն, թեստեր, դեպլոյ։

---

## Ինչպես սկսել

1. **Repo** — GitHub → Use this template → clone, բացի՛ր պրոյեկտի թղթապանակը Cursor-ում։
2. **BRIEF** — լրացրու՛ `docs/BRIEF.md` (նկարագրություն, ֆունկցիաներ, ինտեգրացիաներ)։
3. **AI** — chat-ում. «Կարդա՛ docs/BRIEF.md, սկսի՛ր ըստ 21-project-onboarding.mdc. Փուլ 1 — չափը, Փուլ 2 — TECH_CARD. Սպասում եմ հաստատում կոդից առաջ»։
4. **Հաստատում** — TECH_CARD և ճարտարապետությունը հաստատի՛ր, ապա env։

---

## Մշակողի դերը

- **Կոդից առաջ:** BRIEF, TECH_CARD, ճարտարապետություն — AI-ն առաջարկում է, դու հաստատում ես։
- **Տվյալներ (AI-ն կխնդրի ըստ need-ի):** Neon (DATABASE_URL), R2 (bucket + բանալիներ), Vercel (env), Auth (OAuth), Resend/Stripe/Դոմեն — անհրաժեշտության դեպքում։
- **Env:** Ստեղծել `.env` + `.env.example` (առանց գաղտնիքների), `.gitignore`-ում — `.env`, `.env.local`. 
Հերթականություն. 
Neon → `.env`
R2 →  `.env`
Resend / Upstash (եթե պետք է) → `.env`. Գաղտնիքները միայն env-ում, `.env` — չի commit-վում։
- **Ընթացքում:** Պատասխանի՛ր AI-ի հարցերին, ստուգի՛ր PROGRESS.md, թեստավորի՛ր փուլերը։
- **Ավարտին:** TECH_CARD ✅, PROGRESS 100%, դեպլոյ + .env.example փաստաթղթավորված։

---

## Նախագծերի չափեր

| Չափ | Նկարագրություն | Կառուցվածք |
|-----|-----------------|------------|
| **A** | 1–3 ամիս, 5–15 ֆիչ | `src/app`, `components`, `lib` |
| **B** | 3–6 ամիս, 15–50 ֆիչ | `src/features/*`, `shared/*` |
| **C** | 6+ ամիս, 50+ ֆիչ | Monorepo `apps/*`, `packages/*` |

**Տեղեկատուներ.** `reference/platforms/`, `knowledge-base/`, `templates/` — Vercel, Neon, R2, Render, փաստաթղթերի կաղապարներ։

---

## Կանոնների թարմացում

Template-ի կանոնները թարմացվում են։ Գոյություն ունեցող նախագծում. ավելացրու՛ կաղապարը remote, fetch արա՛, ապա merge/checkout արա՛ անհրաժեշտ `.cursor/rules/*.mdc` ֆայլերը (մանրամասներ — Git-ի remote/fetch/checkout ուղեցույցներ)։

---

## Local run + Cloudflare Quick Tunnel

Временный публичный URL через **trycloudflare.com** (без своего домена и без named tunnel). Локальное приложение должно быть запущено отдельно.

### Как запустить приложение

1. Установите зависимости: `pnpm install`
2. Скопируйте `.env.example` в `.env` и задайте как минимум **`DATABASE_URL`** (и при необходимости `DIRECT_URL` для Prisma). Без `DATABASE_URL` приложение не стартует (Prisma).
3. Запуск dev-сервера: **`pnpm dev`**
4. Откройте в браузере: **http://localhost:8989**

Порт зафиксирован в скрипте `dev` (`next dev -p 8989`), не 3000.

### Cloudflare Quick Tunnel

Установите [`cloudflared`](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/) (один раз). В **отдельном** терминале, пока `pnpm dev` работает:

```bash
cloudflared tunnel --url http://localhost:8989
```

В выводе появится URL вида `https://<случайный-поддомен>.trycloudflare.com`.

**Доступ по туннелю (логин /admin, /profile):** для HTTPS-оригина задайте в `.env` на время теста:

`NEXTAUTH_URL=https://<ваш-поддомен>.trycloudflare.com`

(иначе имя cookie сессии может не совпасть с middleware — см. `src/lib/nextAuthCookie.ts`).

### Конфликт с `~/.cloudflared/config.yml`

Если у вас уже настроен **именованный** tunnel (`config.yml`, `tunnel run`), это **другой** режим. Команда выше (`tunnel --url ...`) — **quick tunnel**, она не требует `config.yml`. Не путайте с `cloudflared tunnel run` (named tunnel). При странном поведении проверьте, что запускаете именно `cloudflared tunnel --url http://localhost:8989`.

### Если туннель не поднимается

- Убедитесь, что `pnpm dev` уже слушает **8989** (`http://localhost:8989` открывается локально).
- Проверьте, что `cloudflared` в PATH и обновлён.
- Антивирус / брандмауэр Windows могут блокировать исходящие соединения `cloudflared` — временно разрешите или добавьте исключение.
- Повторный запуск: остановите старый `cloudflared` (Ctrl+C) и запустите команду снова — URL будет новым.

---

## Quality Automation

Պրոյեկտ ստեղծելուց հետո. AI-ն (onboarding 3.1.1) — prettier, vitest, husky, commitlint, CI workflow. Մշակողը. Branch Protection (`main`), Secret Protection, Dependabot npm։ Մանրամասներ — `docs/QUALITY_AUTOMATION_PLAN.md`։

---

[MIT](LICENSE) — ազատ օգտագործում և հարմարեցում։
