# Khanico Bites — Full-Stack Food Ordering Website

A production-ready fast-food ordering platform built with **Next.js 14 (App Router) + TypeScript + Tailwind CSS + PostgreSQL + Prisma**.

---

## 1. Project Folder Structure

```
khanico-bites/
├── prisma/
│   ├── schema.prisma          # Database schema (7 tables, see below)
│   └── seed.ts                 # Seeds categories, products, and an admin account
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout, fonts, SEO metadata
│   │   ├── page.tsx             # 1. Home
│   │   ├── globals.css          # Design tokens / Tailwind layer
│   │   ├── robots.ts            # SEO: robots.txt
│   │   ├── sitemap.ts           # SEO: sitemap.xml
│   │   ├── not-found.tsx
│   │   ├── menu/
│   │   │   ├── page.tsx         # 2. Menu (category filter, search)
│   │   │   └── [slug]/page.tsx  # 3. Food item details
│   │   ├── cart/page.tsx        # 4. Cart
│   │   ├── checkout/page.tsx    # 5. Checkout (COD)
│   │   ├── login/page.tsx       # 6. Customer login
│   │   ├── register/page.tsx    # 6. Customer register
│   │   ├── account/orders/page.tsx  # 7. Customer order history
│   │   ├── contact/page.tsx     # 8. Contact / About
│   │   ├── admin/
│   │   │   ├── login/page.tsx       # 9. Admin login
│   │   │   ├── dashboard/page.tsx   # 10. Admin dashboard (stats)
│   │   │   ├── orders/page.tsx      # Admin: view + update order status
│   │   │   ├── products/page.tsx    # Admin: add/edit/delete food items
│   │   │   └── categories/page.tsx  # Admin: manage categories
│   │   └── api/                     # Node.js API routes
│   │       ├── auth/{register,login,logout,me}/route.ts
│   │       ├── admin/{login,logout,stats}/route.ts
│   │       ├── categories/route.ts, categories/[id]/route.ts
│   │       ├── products/route.ts, products/[id]/route.ts
│   │       └── orders/route.ts, orders/[id]/route.ts, orders/[id]/status/route.ts
│   ├── components/              # Navbar, Footer, ProductCard, CartContext,
│   │                             # AddToCartControl, AdminSidebar, ProductManager,
│   │                             # CategoryManager, OrderStatusSelect, WhatsAppButton
│   ├── lib/
│   │   ├── db.ts                 # Prisma client singleton
│   │   ├── auth.ts                # JWT + bcrypt + cookie helpers
│   │   └── validation.ts          # Zod schemas for every form/API input
│   ├── types/index.ts             # Shared TypeScript types
│   └── middleware.ts              # Route guards for /admin and /account
├── .env.example
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

---

## 2. Database Schema (PostgreSQL)

Seven tables, defined in `prisma/schema.prisma` and created via Prisma Migrate:

| Table         | Purpose                                                              |
|---------------|-----------------------------------------------------------------------|
| `users`       | Customer accounts (name, email, phone, hashed password)               |
| `admins`      | Admin accounts (separate from customers, own login)                   |
| `categories`  | Food categories (Burgers, Pizza, etc.), with sort order + active flag |
| `products`    | Food items: name, slug, description, price, image, availability       |
| `addresses`   | Saved customer delivery addresses (optional, for logged-in users)     |
| `orders`      | One row per order: unique order number, status, totals, delivery info |
| `order_items` | Line items per order (product name/price snapshotted at order time)   |

Order status is a Postgres enum: `PENDING → CONFIRMED → PREPARING → OUT_FOR_DELIVERY → DELIVERED`, or `CANCELLED`.

Order line items **snapshot** the product name and price at the time of purchase, so editing or deleting a product later never changes historical order records.

---

## 3. Prisma Schema

See `prisma/schema.prisma` in the project — it's the single source of truth for the database and is what Prisma Migrate reads to create/update tables. Run `npx prisma studio` any time to browse your data visually.

---

## 4. API Routes

All routes live under `src/app/api/` (Next.js Route Handlers = your Node.js API layer).

| Method & Path                       | Access          | Purpose                              |
|--------------------------------------|-----------------|----------------------------------------|
| `POST /api/auth/register`            | Public          | Create customer account, sets cookie   |
| `POST /api/auth/login`               | Public          | Customer login                         |
| `POST /api/auth/logout`              | Customer        | Clear customer session                 |
| `GET  /api/auth/me`                  | Public          | Current customer session (if any)      |
| `POST /api/admin/login`              | Public          | Admin login                            |
| `POST /api/admin/logout`             | Admin           | Clear admin session                    |
| `GET  /api/admin/stats`              | Admin           | Dashboard totals                       |
| `GET  /api/categories`               | Public          | Active categories                      |
| `POST /api/categories`               | Admin           | Create category                        |
| `PUT/DELETE /api/categories/:id`     | Admin           | Update / delete category               |
| `GET  /api/products`                 | Public          | Menu listing (filter by category/search)|
| `POST /api/products`                 | Admin           | Create food item                       |
| `GET  /api/products/:id`             | Public          | Single item (by id or slug)            |
| `PUT/DELETE /api/products/:id`       | Admin           | Update / delete food item              |
| `POST /api/orders`                   | Public          | Place an order (checkout, COD)         |
| `GET  /api/orders`                   | Customer/Admin  | Own orders / all orders                |
| `GET  /api/orders/:id`               | Owner/Admin     | Single order (by id or order number)   |
| `PATCH /api/orders/:id/status`       | Admin           | Change order status                    |

**Security notes:**
- Passwords are hashed with `bcryptjs` (10 salt rounds) — never stored in plain text.
- Sessions are signed JWTs (`jsonwebtoken`) stored in `httpOnly`, `sameSite=lax` cookies — not readable by client-side JS, reducing XSS risk.
- Customer and admin sessions use separate cookies/secrets scope, so a customer token can never access admin routes.
- Every write endpoint validates input with **Zod** and returns a clear 400 error on bad input.
- Order totals and unit prices are always recalculated server-side from the database — the client cannot tamper with prices.

---

## 5. Environment Variables

Copy `.env.example` to `.env` and fill in real values:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/khanico_bites?schema=public"
JWT_SECRET="replace-with-a-long-random-string"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_WHATSAPP_NUMBER="923001234567"
SEED_ADMIN_EMAIL="admin@khanicobites.com"
SEED_ADMIN_PASSWORD="ChangeMe123!"
```

Generate a strong `JWT_SECRET` with:
```bash
openssl rand -base64 32
```

**Never commit `.env` to git** — it's already in `.gitignore`.

---

## 6. Database Setup Instructions

### Option A — Local PostgreSQL

1. Install PostgreSQL (e.g. via [postgresapp.com](https://postgresapp.com) on Mac, or `apt install postgresql` on Linux).
2. Create the database:
   ```bash
   createdb khanico_bites
   ```
3. Set `DATABASE_URL` in `.env`:
   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/khanico_bites?schema=public"
   ```

### Option B — Hosted Postgres (recommended for deployment)

Use a free-tier managed Postgres provider — **Neon** (neon.tech), **Supabase**, or **Railway** all work well with Vercel. Create a project, copy the connection string it gives you, and paste it into `DATABASE_URL`.

### Run migrations and seed data

```bash
npm install
npx prisma migrate dev --name init
npm run prisma:seed
```

This creates all 7 tables and seeds 6 categories, 8 sample products, and one admin account (from `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in your `.env`).

---

## 7. Local Testing Instructions

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# then edit .env with your DATABASE_URL, JWT_SECRET, etc.

# 3. Set up the database
npx prisma migrate dev --name init
npm run prisma:seed

# 4. Start the dev server
npm run dev
```

Visit:
- **Storefront:** http://localhost:3000
- **Admin login:** http://localhost:3000/admin/login (use `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`)

Test the full flow: browse `/menu` → open an item → add to cart → `/cart` → `/checkout` → place order (Cash on Delivery) → check it appears under `/account/orders` (if logged in) and in `/admin/orders`, where you can change its status.

---

## 8. GitHub Deployment Instructions

```bash
cd khanico-bites
git init
git add .
git commit -m "Initial commit: Khanico Bites"
```

Create a new empty repository on GitHub (no README/license, since you already have files), then:

```bash
git remote add origin https://github.com/<your-username>/khanico-bites.git
git branch -M main
git push -u origin main
```

Double-check `.env` was **not** committed (`git status` should not show it — it's covered by `.gitignore`).

---

## 9. Vercel Deployment Instructions

1. Go to [vercel.com](https://vercel.com) → **Add New → Project** → import your GitHub repo.
2. Vercel auto-detects Next.js — leave the build settings as default (`next build`).
3. Under **Environment Variables**, add each variable from your `.env`:
   - `DATABASE_URL` (point this at your hosted Postgres — e.g. Neon/Supabase — not `localhost`)
   - `JWT_SECRET`
   - `NEXT_PUBLIC_SITE_URL` → your Vercel URL, e.g. `https://khanico-bites.vercel.app`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`
   - `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` (only needed if you run the seed script)
4. Click **Deploy**.
5. After the first deploy, run the migration against your production database once (from your local machine, with `DATABASE_URL` pointed at production):
   ```bash
   npx prisma migrate deploy
   npm run prisma:seed   # optional — only if you want sample data/admin in production
   ```
6. Every future `git push` to `main` triggers an automatic redeploy.

---

## 10. Custom Domain & DNS Setup

1. In your Vercel project, go to **Settings → Domains** → enter your domain (e.g. `khanicobites.com`) → **Add**.
2. Vercel shows you the DNS records to set. At your domain registrar (GoDaddy, Namecheap, etc.), go to DNS management and add:
   - For the **root domain** (`khanicobites.com`):
     - Type: `A` — Name: `@` — Value: `76.76.21.21`
   - For **www** (`www.khanicobites.com`):
     - Type: `CNAME` — Name: `www` — Value: `cname.vercel-dns.com`
   *(Vercel's dashboard always shows the exact current values — use those if they differ.)*
3. Wait for DNS propagation (a few minutes up to 24–48 hours). Vercel auto-issues a free SSL certificate once it verifies the domain.
4. Update `NEXT_PUBLIC_SITE_URL` in your Vercel environment variables to `https://khanicobites.com`, then redeploy so SEO metadata and the sitemap use the correct domain.

---

## Notes, Assumptions & Next Steps

- **Payments:** Only Cash on Delivery is implemented, as requested. To add online payments later, add a `paymentMethod` branch in `POST /api/orders` and integrate a gateway (Stripe, JazzCash, EasyPaisa).
- **Delivery fee** is a flat Rs 150, set as a constant in `src/app/api/orders/route.ts` — change `DELIVERY_FEE` there if needed.
- **Images:** seeded products use Unsplash URLs for demo purposes. In the admin panel, products are created with an image **URL** (no file upload yet) — swap in a file-upload flow (e.g. Vercel Blob or Cloudinary) if you need direct image uploads later.
- **WhatsApp button** links to `https://wa.me/<NEXT_PUBLIC_WHATSAPP_NUMBER>` with a prefilled message — set that env var to your business WhatsApp number (digits only, with country code).
- This is a solid, working foundation — for a real launch, also add: rate limiting on auth endpoints, email/SMS order confirmations, and automated tests.
