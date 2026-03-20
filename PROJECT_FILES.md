# Назначение файлов проекта (whiteshop.am-minimal)

Краткое описание: для чего нужен каждый файл или папка в проекте.

---

## Корень проекта

| Файл | Назначение |
|------|------------|
| **package.json** | Зависимости npm, скрипты (dev, build, start, db:seed, postinstall и др.). |
| **tsconfig.json** | Настройки TypeScript: пути, строгость, цели компиляции. |
| **next.config.ts** | Конфиг Next.js: изображения, ESLint, экспериментальные опции, заголовки кэша. |
| **postcss.config.mjs** | PostCSS (в т.ч. для Tailwind). |
| **eslint.config.mjs** | Правила ESLint для кода. |
| **.env** | Переменные окружения для Prisma CLI (DATABASE_URL). Не коммитить. |
| **.env.local** | Локальные переменные (DATABASE_URL, NEXTAUTH_*, NODE_ENV). Не коммитить. |
| **.gitignore** | Список файлов/папок, которые Git не отслеживает. |
| **README.md** | Описание проекта, как запустить и использовать. |

---

## src/ — исходный код приложения

### src/app/ — страницы и API (App Router)

| Путь | Назначение |
|------|------------|
| **layout.tsx** | Общий layout: провайдеры, шапка, подвал, стили. |
| **page.tsx** | Главная страница: список товаров, баннер, избранное. |
| **globals.css** | Глобальные стили и импорт Tailwind. |
| **about/page.tsx** | Страница «О нас». |
| **account-deleted/page.tsx** | Страница после удаления аккаунта. |
| **cart/page.tsx** | Корзина. |
| **checkout/page.tsx** | Оформление заказа. |
| **contact/page.tsx** | Контакты. |
| **login/page.tsx** | Вход в аккаунт. |
| **register/page.tsx** | Регистрация. |
| **order-success/page.tsx** | Успешное оформление заказа. |
| **profile/page.tsx** | Личный кабинет пользователя. |
| **privacy/page.tsx** | Политика конфиденциальности. |
| **terms/page.tsx** | Условия использования. |
| **products/page.tsx** | Каталог товаров. |
| **products/[id]/page.tsx** | Страница одного товара. |
| **admin/page.tsx** | Главная админ-панели. |
| **admin/categories/page.tsx** | Управление категориями. |
| **admin/orders/page.tsx** | Список заказов. |
| **admin/products/page.tsx** | Список товаров. |
| **admin/products/new/page.tsx** | Добавление товара. |
| **admin/products/[id]/edit/page.tsx** | Редактирование товара. |
| **admin/settings/page.tsx** | Настройки сайта. |

### src/app/api/ — API-маршруты

| Путь | Назначение |
|------|------------|
| **auth/[...nextauth]/route.ts** | NextAuth: вход, сессии, JWT. |
| **auth/register/route.ts** | Регистрация пользователя. |
| **categories/route.ts** | GET списка категорий. |
| **products/route.ts** | GET всех товаров, POST создания (админ). |
| **products/[id]/route.ts** | GET/PUT/DELETE одного товара. |
| **products/featured/route.ts** | Товары «хит» / избранные. |
| **products/banner/route.ts** | Товар для баннера на главной. |
| **products/validate/route.ts** | Проверка ID товаров (для корзины/заказа). |
| **orders/route.ts** | GET заказов пользователя, POST создание заказа. |
| **admin/orders/route.ts** | Список заказов с фильтрами (админ). |
| **admin/orders/[id]/status/route.ts** | Смена статуса заказа. |
| **admin/categories/route.ts** | CRUD категорий. |
| **admin/categories/[id]/route.ts** | Редактирование/удаление категории. |
| **admin/products/route.ts** | Создание товара (админ). |
| **admin/products/[id]/route.ts** | Обновление/удаление товара. |
| **admin/settings/route.ts** | GET/PUT настроек сайта. |
| **admin/stats/route.ts** | Статистика для админки. |
| **user/profile/route.ts** | GET/PUT профиля пользователя. |
| **user/delete/route.ts** | Удаление аккаунта. |
| **upload/route.ts**, **upload-image/route.ts**, **upload-logo/route.ts** | Загрузка файлов (изображения, лого). |
| **images/route.ts** | Прокси/обработка изображений при необходимости. |

### src/components/ — React-компоненты

| Файл | Назначение |
|------|------------|
| **Header.tsx** | Общая шапка сайта. |
| **DesktopHeader.tsx** | Шапка для десктопа. |
| **MobileHeader.tsx** | Шапка для мобильных. |
| **MobileBottomNav.tsx** | Нижняя навигация на мобильных. |
| **Footer.tsx** | Подвал сайта. |
| **ProductCard.tsx** | Карточка товара (изображение, название, цена, в корзину). |
| **ProductQuantityControls.tsx** | Кнопки +/- количества в корзине. |
| **OptimizedImage.tsx** | Оптимизированная загрузка/отображение изображений. |
| **ImageUpload.tsx** | Загрузка изображения (админка). |
| **ImageSelector.tsx** | Выбор изображения из списка. |
| **CompanyInfo.tsx** | Блок с информацией о компании (контакты и т.д.). |
| **DeleteAccountModal.tsx** | Модальное окно удаления аккаунта. |
| **EditProfileModal.tsx** | Модальное окно редактирования профиля. |
| **PullToRefresh.tsx** | «Потянуть для обновления» на мобильных. |
| **ServiceWorkerProvider.tsx** | Регистрация и обновление Service Worker (PWA). |
| **ui/badge.tsx**, **button.tsx**, **card.tsx**, **input.tsx**, **select.tsx** | Переиспользуемые UI-компоненты. |

### src/hooks/

| Файл | Назначение |
|------|------------|
| **useCart.tsx** | Состояние корзины (добавить/удалить/количество, localStorage). |
| **useCurrentPath.ts** | Текущий путь для навигации/подсветки меню. |
| **useHydration.ts** | Проверка гидрации (избежание расхождений SSR/клиент). |
| **usePullToRefresh.tsx** | Логика «потянуть для обновления». |
| **useSettings.tsx** | Загрузка настроек сайта (API). |

### src/lib/

| Файл | Назначение |
|------|------------|
| **prisma.ts** | Единый экземпляр PrismaClient (избежание множественных подключений). |
| **auth.ts** | Конфиг NextAuth (Credentials, callbacks, страница входа). |
| **utils.ts** | Вспомогательные функции (clsx, merge классов и т.п.). |

### src/types/

| Файл | Назначение |
|------|------------|
| **index.ts** | Экспорт типов из Prisma (User, Product, Order и т.д.). |
| **next-auth.d.ts** | Расширение типов NextAuth (role, user.id в session). |

### src/constants/

| Файл | Назначение |
|------|------------|
| **colors.ts** | Цветовая палитра приложения. |
| **company.ts** | Название компании, контакты и т.п. |

### src/middleware.ts

Проверка путей (защита /admin, редиректы). Выполняется до отдачи страницы.

---

## public/ — статические файлы

| Путь | Назначение |
|------|------------|
| **images/placeholder.png**, **placeholder.svg** | Плейсхолдер для товаров без фото. |
| **sw.js** | Service Worker для офлайн/PWA. |

---

## prisma/ — база данных

| Путь | Назначение |
|------|------------|
| **schema.prisma** | Модели БД (User, Category, Product, Order, OrderItem, Settings), enum, провайдер PostgreSQL. |
| **migrations/** | SQL-миграции: создание таблиц, индексов, изменений схемы. |
| **migrations/migration_lock.toml** | Фиксация провайдера БД для миграций. |

---

## scripts/ — скрипты (Node/TS)

| Файл | Назначение |
|------|------------|
| **seed.ts** | Наполнение БД: категории, товары из data, пользователи, тестовый заказ. |
| **add-10-products.ts** | Добавить 10 тестовых товаров без очистки БД. |
| **fix-product-images.ts** | Обновить поле image у части товаров на плейсхолдер. |
| **check-products.ts** | Проверка товаров в БД (вывод в консоль). |
| **Archive/** | Старые скрипты (миграции данных, обновление путей картинок, тестовые пользователи и т.д.). |

---

## data/ — данные для импорта

| Файл | Назначение |
|------|------------|
| **buy-am-products.json** | Товары в JSON (для seed/импорта). |
| **buy-am-products.csv** | То же в CSV. |
| **buy-am-products-backup.json**, **.csv** | Резервные копии данных. |

---

## Итог

- **Корень** — конфигурация сборки, окружения и репозитория.
- **src/app** — страницы и API.
- **src/components** — UI и переиспользуемые блоки.
- **src/hooks, lib, types, constants** — логика, типы и константы.
- **public** — статика и PWA.
- **prisma** — схема и миграции БД.
- **scripts** — одноразовые и вспомогательные скрипты.
- **data** — исходные данные для заполнения БД.
