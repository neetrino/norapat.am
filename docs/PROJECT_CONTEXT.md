# Контекст проекта norapat (Witleybel / Pideh Armenia)

> Сводка структуры, стекa и конвенций для разработки. Обновляется при изменениях.

---

## Общее

- **Имя в package.json:** `witleybel-online-shop`, версия 1.3.0
- **Суть:** интернет-магазин армянских пиде (Next.js fullstack, доставка по Еревану)
- **Язык интерфейса:** русский (`lang="ru"` в layout)
- **База:** PostgreSQL (Prisma), Auth: NextAuth (Credentials + JWT)

---

## Структура каталогов

```
norapat/
├── prisma/
│   └── schema.prisma          # Модели: User, Category, Product, Order, OrderItem, Settings
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx         # Root layout: Inter, ClientProviders, Header, PullToRefresh, MobileBottomNav
│   │   ├── globals.css       # Tailwind @import, :root, анимации, scrollbar
│   │   ├── page.tsx          # Главная (hero, категории, товары, хиты)
│   │   ├── login, register, profile, cart, checkout, contact, terms, privacy, about, order-success, account-deleted
│   │   ├── products/         # [id] — карточка товара
│   │   ├── admin/            # Админка: page, orders, products, products/new, products/[id]/edit, categories, settings
│   │   └── api/
│   │       ├── auth/         # [...nextauth], register
│   │       ├── products/    # route, [id], featured, banner, validate
│   │       ├── orders/      # route
│   │       ├── categories/  # route
│   │       ├── user/        # profile, delete
│   │       ├── upload, upload-image, upload-logo, images
│   │       └── admin/       # stats, products, products/[id], orders, orders/[id]/status, categories, categories/[id], settings
│   ├── components/          # UI и фичи
│   │   ├── ui/              # button, input, card, badge, select
│   │   ├── home/            # Главная: BrandBannerSection, CategoriesSection
│   │   ├── Header, MobileHeader, DesktopHeader, MobileBottomNav, Footer
│   │   ├── ClientProviders  # SessionProvider + CartProvider
│   │   ├── ProductCard, ProductQuantityControls, ImageUpload, ImageSelector, OptimizedImage
│   │   ├── PullToRefresh, ServiceWorkerProvider
│   │   ├── CompanyInfo, DeleteAccountModal, EditProfileModal
│   ├── hooks/               # useCart, useSettings, useHydration, useCurrentPath, usePullToRefresh
│   ├── lib/                 # prisma.ts, auth.ts, utils.ts (cn)
│   ├── types/               # index.ts (типы + константы из Prisma), next-auth.d.ts
│   └── constants/           # company.ts, colors.ts
├── scripts/                 # seed.ts, parse, import, auto-import, fix-product-images, check-products, add-10-products, Archive/*
├── reference/               # templates, platforms, knowledge-base, Check
├── docs/                    # BRIEF.md, PROJECT_CONTEXT.md (этот файл)
├── next.config.ts
├── tsconfig.json            # paths: "@/*" -> "./src/*"
└── package.json
```

---

## Стек и конфиг

- **Next.js** 15.5.14, React 19, TypeScript (strict), Tailwind 4
- **БД:** Prisma 6, PostgreSQL (`DATABASE_URL`), @vercel/postgres, pg
- **Auth:** next-auth 4 (Credentials, bcryptjs), JWT, session 30 дней
- **Формы:** react-hook-form, @hookform/resolvers, zod
- **UI:** lucide-react, clsx, tailwind-merge (cn в lib/utils)
- **Скрипты:** tsx, puppeteer (в devDependencies)

next.config: `outputFileTracingRoot`, ESLint/TS ignore during builds, images (webp/avif, dangerouslyAllowSVG), optimizePackageImports lucide-react, compress, Cache-Control для /api/products и /images.

---

## База данных (Prisma)

- **User:** id, email, name, phone, address, password, role (USER | ADMIN), orders, deletedAt
- **Category:** id, name, description, isActive, products
- **Product:** id, name, description, price, image, categoryId, ingredients (String[]), isAvailable, status (REGULAR | HIT | NEW | CLASSIC | BANNER), orderItems
- **Order:** id, userId?, status (PENDING..CANCELLED), total, address, phone, notes, paymentMethod, deliveryTime, name, items
- **OrderItem:** id, orderId, productId, quantity, price
- **Settings:** id, key, value

Типы и константы (OrderStatus, ProductStatus, PaymentMethod, ORDER_STATUS_LABELS, PRODUCT_STATUS_LABELS, PAYMENT_METHODS) — в `src/types/index.ts`. Product/Category реэкспортируются из `@prisma/client`; добавлены ProductWithCategory, CategoryWithCount для главной и API.

---

## Авторизация и роутинг

- NextAuth: Credentials (email + password), JWT, callbacks для role в session.
- Страницы входа: `signIn: '/login'`.
- Middleware: `withAuth`, matcher `/admin/:path*`, `/profile/:path*`; для /admin проверка `token.role === 'ADMIN'`, иначе redirect на /login.
- Session: `session.user.id`, `session.user.role` (расширение в next-auth.d.ts).

---

## Конвенции кода

- **Алиас:** `@/` → `src/` (компоненты, хуки, lib, types, constants).
- **Компоненты:** PascalCase (ProductCard, ClientProviders). Файлы компонентов — PascalCase.tsx.
- **Хуки:** useCart, useSettings, useHydration — camelCase с префиксом use.
- **Страницы:** только в `src/app/` по App Router; клиентские страницы — `'use client'` где нужно (например, главная).
- **API:** Route handlers в `src/app/api/.../route.ts`, ответы через `NextResponse.json`, ошибки с корректным status.
- **Стили:** Tailwind-классы, глобальные переменные и утилиты в `globals.css`. Избегать inline styles (по правилам 00-core).
- **Типы:** общие типы и константы статусов/оплаты в `src/types/index.ts`; типы из Prisma не дублировать, импорт из `@/types` или `@prisma/client`.

---

## Важные моменты

1. **Корзина:** контекст в `useCart.tsx` (CartProvider), ключ localStorage `pideh-cart`. Типы CartItem, CartContextType в `@/types`.
2. **Главная:** секции — (1) Brand banner `BrandBannerSection` + `/api/products/banner`, (2) Категории `CategoriesSection` + `/api/categories` (карточки, scroll к товарам), (3) товары по категориям + хиты; данные: `/api/products`, `/api/products/featured`, `/api/products/banner`.
3. **Админка:** защищена по роли ADMIN; маршруты под `/admin/*`.
4. **Константы компании:** `src/constants/company.ts` (Witleybel); для бренда «Pideh Armenia» метаданные заданы в layout (title, description).
5. **Не использовать:** `@/constants/products` — файла нет, импорт из него удалён в api/products/route.ts.

---

## Документация и шаблоны

- `docs/BRIEF.md` — шаблон техзадания (не заполнен до конца).
- `reference/templates/` — TECH_CARD, ARCHITECTURE, PROGRESS, PROJECT_INIT, ADR.
- `reference/platforms/` — Vercel, Neon, Cloudflare, Render и др., `10-AUTH.md`, `11-EMAIL.md`.
- Правила Cursor: `.cursor/rules/00-core.mdc` и др. (армянский + русский в чате).

---

## Последние изменения

- **2026-03-20:** Главная — выделены секции 1.1 и 1.2 (02-FUNCTIONAL): компоненты `src/components/home/BrandBannerSection.tsx` (брендовый баннер + товар BANNER), `src/components/home/CategoriesSection.tsx` (категории с API, карточки, выбор категории и scroll к блоку товаров). В `page.tsx` порядок: Brand banner → Категории → Товары (id=`products-section`). Типы: ProductWithCategory, CategoryWithCount в `@/types`.

---

*Последнее обновление контекста: 2026-03-20.*
