# Նախագծի ճարտարապետություն. Foodcourt E‑commerce

> Foodcourt-ի համար e-commerce վեբ կայք՝ լիարժեք public shop, հաճախորդի հաշիվ, հզոր admin panel, արագ checkout և analytics/վերահսկում։

**Նախագծի չափ.** B (միջին)  
**Վերջին թարմացում.** 2026-03-20

---

## 📋 ԱՄԲՈՂՋԱԿ

### Նշանակություն
Համակարգը ապահովում է Foodcourt-ի առցանց վաճառքը՝ ապրանքների ցուցադրում, պատվերների ձևակերպում, հաճախորդի հաշիվ, ադմինի կառավարում և անալիտիկա։

### Հիմնական առանձնահատկություններ
- Լիարժեք public shop (գլխավոր էջ, shop, ապրանքի էջ, զեղչեր, կատեգորիաներ)
- Customer account system (գրանցում/մուտք, պատվերների պատմություն, հասցեներ, անձնական տվյալներ)
- Հզոր admin panel (ապրանքներ, պատվերներ, զեղչեր/promo, կատեգորիաներ, անալիտիկա)
- Պարզ և արագ checkout (դաշտեր, առաքում, վճարում)
- Analytics և վերահսկում (orders, revenue, products, customers)

### Օգտատերեր
- **Հաճախորդ (Guest).** Զննում է shop, ավելացնում զամբյուղ, checkout (կարող է գրանցվել կամ ոչ)
- **Հաճախորդ (Registered).** Մուտք, պատվերների պատմություն, հասցեներ, wishlist, կրկնել պատվեր
- **Ադմին.** Ապրանքներ/կատեգորիաներ/պատվերներ/promo, անալիտիկա, ստատուսների խմբագրում

---

## 🏗️ ՃԱՐՏԱՐԱՊԵՏՈՒԹՅՈՒՆ

### Բարձր մակարդակի դիագրամ

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                        │
│  Public: Home, Shop, Product, Cart, Checkout, About, Contact     │
│  Customer: Profile, Orders, Addresses, Wishlist                  │
│  Admin: Products, Orders, Categories, Promo, Analytics            │
└───────────────────────────────┬─────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────┐
│                    Next.js API Routes (REST)                     │
│  /api/auth, /api/products, /api/orders, /api/categories,         │
│  /api/user, /api/admin/*, /api/upload, /api/promo...              │
└───────────────────────────────┬─────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────┐
│                    PostgreSQL (Prisma ORM)                       │
│  User, Category, Product, Order, OrderItem, Settings,            │
│  Address, PromoCode, Wishlist (ըստ ֆունկցիոնալի)                 │
└─────────────────────────────────────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────┐
│  Ինտեգրացիաներ: Բանկ (վճարում), Email (ըստ need)                │
└─────────────────────────────────────────────────────────────────┘
```

### Ճարտարապետական ոճ
**Modular Monolith** — մեկ Next.js հավելված (App Router + API Routes), մոդուլացված ըստ domain (products, orders, auth, admin).

**Հիմնավորում.** Միջին չափի նախագծի համար մեկ codebase-ը պարզացնում է դեպլոյը և արագ զարգացումը; ապագայում հնարավոր է առանձնացնել API։

---

## 🧩 ՀԱՄԱԿԱՐԳԻ ԿՈՄՈՆԵՆՏՆԵՐ

### Frontend
- **Տեխնոլոգիա.** Next.js 15 (App Router), React 19, TypeScript
- **Նշանակություն.** SSR/CSR էջեր, զամբյուղ (localStorage + context), responsive (mobile/desktop)
- **Գտնվելու վայր.** `src/app/`, `src/components/`, `src/hooks/`
- **Առանձնահատկություններ.** Tailwind CSS, NextAuth (session), PWA/Service Worker (ըստ կարիքի)

### Backend (API)
- **Տեխնոլոգիա.** Next.js Route Handlers (App Router)
- **Նշանակություն.** REST API, auth middleware, վալիդացիա (Zod)
- **Գտնվելու վայր.** `src/app/api/`
- **API ոճ.** REST (GET/POST/PATCH/DELETE)

### Բազային տվյալներ
- **Տեխնոլոգիա.** PostgreSQL (Neon / Vercel Postgres)
- **ORM.** Prisma
- **Սխեմա.** `prisma/schema.prisma`

### Cache
- Կարող է ավելացվել (Redis/Vercel KV) promo codes, rate limit, session — ըստ need.

---

## 📁 ՆԱԽԱԳԾԻ ԿԱՐԳՈՒՑՎԱԿՔԸ

```
src/
├── app/                    # Էջեր և API
│   ├── (public)/           # Գլխավոր, shop, ապրանք, cart, checkout, about, contact
│   ├── profile/            # Հաճախորդի էջ
│   ├── admin/              # Ադմին panel
│   └── api/                # REST endpoints
├── components/             # UI և ֆիչ-կոմպոնենտներ
│   ├── ui/                 # Button, Input, Card, Badge, Select
│   └── ...                 # Header, Footer, ProductCard, forms
├── hooks/                  # useCart, useAuth, useWishlist...
├── lib/                    # prisma, auth, utils
├── types/                  # Ընդհանուր տիպեր
└── constants/              # company, colors, config
prisma/
├── schema.prisma
└── migrations/
docs/                       # Փաստաթղթեր (01–ARCHITECTURE, 02–FUNCTIONAL, 03–WORKFLOW)
```

---

## 🔄 ՏՎՅԱԼՆԵՐԻ ՀՈՐԻԶՈՆԹՆԵՐ

### Հաճախորդի հարցում (օր. ապրանքների ցանկ)

```
1. Browser → Next.js (page or API)
2. API → Վալիդացիա (query params / body)
3. API → Prisma → DB
4. Response → JSON / HTML
```

### Checkout

```
1. Cart (client) → POST /api/orders (body: items, contact, address, payment, delivery)
2. API → Վալիդացիա → Order + OrderItems ստեղծում
3. Վճարում (Բանկ redirect կամ Cash նշում)
4. Redirect → order-success / payment gateway
```

### Ինքնություն հաստատում

```
NextAuth (Credentials / JWT). Session in cookie.
Middleware: /admin, /profile պահանջում են token; admin — role === ADMIN.
```

---

## 📊 ԲԱԶԱՅԻՆ ՏՎՅԱԼՆԵՐ

### Հիմնական էնտիտիներ (ըստ ֆունկցիոնալի)

| Էնտիտի      | Նկարագրություն |
|-------------|------------------|
| User        | Հաճախորդ/Ադմին, email կամ phone, գաղտնաբառ |
| Category    | Ապրանքների կատեգորիաներ |
| Product     | Անվանում, նկարներ, նկարագրություն, գին, զեղչ, stock |
| Order       | Պատվեր, ստատուս, հասցե, վճարում, առաքում |
| OrderItem   | Պատվերի տող (product, quantity, price) |
| Address     | Հաճախորդի հասցեներ (profile) |
| PromoCode   | Զեղչի կոդեր (ադմին) |
| Wishlist    | Հաճախորդի նախընտրած ապրանքներ |
| Settings    | Կայքի կարգավորումներ (key-value) |

### Մանրամասն սխեմա
Տե՛ս `prisma/schema.prisma`; ֆունկցիոնալի համաձայն ավելացվեն Address, PromoCode, Wishlist (եթե դեռ չկան) — `docs/02-FUNCTIONAL.md`, `docs/05-DATABASE.md`։

---

## 🔌 ԻՆՏԵԳՐԱՑԻԱՆԵՐ

| Սերվիս        | Նշանակություն     | Նշում |
|----------------|--------------------|--------|
| Բանկ           | Քարտային վճարում  | Checkout-ում |
| Cash           | Կանխիկ            | Ընտրովի վճարային տարբերակ |
| Email (optional) | Ծանուցումներ/վերականգնում | Ըստ need |

---

## 🔐 ԱՆՎՏԱՆԳՈՒԹՅՈՒՆ

- **Auth.** NextAuth, JWT, session in httpOnly cookie.
- **RBAC.** USER (հաճախորդ), ADMIN (ադմին).
- **Պաշտպանություն.** HTTPS, CORS, rate limiting (API), մուտքային վալիդացիա (Zod), prepared statements (Prisma).

---

## 🚀 ԴԵՊԼՈՅ

- **Development.** `pnpm dev` — localhost:3000
- **Production.** Vercel (Next.js) + Neon/Postgres; env: DATABASE_URL, NEXTAUTH_SECRET, բանկի keys

---

## 🔗 ԿԱՊՎԱԾ ՓԱՍՏԱԹՂԹԵՐ

- [02-FUNCTIONAL.md](./02-FUNCTIONAL.md) — ֆունկցիոնալ պահանջներ
- [03-WORKFLOW_STEPS.md](./03-WORKFLOW_STEPS.md) — աշխատանքային քայլեր
- [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) — կոնտեքստ և կոնվենցիաներ
- [05-DATABASE.md](./05-DATABASE.md) — ԲԴ (եթե կա)

---

**Փաստաթղթի տարբերակ.** 1.0  
**Ամսաթիվ.** 2026-03-20
