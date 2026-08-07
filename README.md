# WashAI — The Laundry Business OS

**Laundry Shops, Powered by AI**

A fully functional multi-tenant SaaS for laundry shops. React + Vite + Tailwind, with `localStorage` persistence (no backend).

## Run it

```bash
npm run dev
```

Then open http://localhost:5173. Any password works — pick a demo shop on the login screen.

## The logo

The app looks for a real logo file first and falls back to a built-in SVG recreation. To use your own artwork, drop it in `public/` as any of:

```
public/logo.png    public/logo.jpg    public/logo.svg    public/washailogo.png
```

It's picked up automatically — rounded, with the soft blue glow already applied. No code change needed.

## What's built

## Backend — Cloudflare Worker + D1

The Worker (`worker/index.js`) serves the built SPA **and** the API. D1 binding is `DB` (`washai-db`).

### Setup

```bash
npx wrangler d1 execute washai-db --local --file=./schema.sql
npx wrangler d1 execute washai-db --local --file=./seed.sql
```

Swap `--local` for `--remote` to apply the same to production D1 (requires `npx wrangler login`).

### Local dev

The Worker and the API run together on one origin:

```bash
npm run build && npx wrangler dev
```

Or run Vite's HMR server with the API proxied to `wrangler dev` (`vite.config.js` proxies `/api` → `127.0.0.1:8787`):

```bash
npx wrangler dev
```

```bash
npm run dev
```

### Endpoints

| Method | Route | Body / Auth | Returns |
|---|---|---|---|
| `POST` | `/api/auth/signup` | `{email, password, shopName}` | Creates a `shops` + `users` row, returns both |
| `POST` | `/api/auth/login` | `{email, password}` | `{user: {id,email,role,shop_id}, shop}` |
| `GET` | `/api/admin/shops` | header `x-user-email` of a `super_admin` | `{shops: [...]}` |
| `GET` | `/api/health` | — | Liveness check |

Passwords are hashed with **SHA-256** and compared in constant time. All queries use bound prepared statements.

> **Before real users:** SHA-256 is unsalted and fast — fine for this milestone, not for production credentials. Move to PBKDF2 (`crypto.subtle.deriveBits`, available in Workers) and replace the `x-user-email` admin check with a signed session token.

### Accounts

There is **no demo login**. Every account lives in the D1 `users` table.

| Account | Credentials | Lands on |
|---|---|---|
| Super admin (seeded) | `renzsom2022@gmail.com` / `WashAI2024!` | `/admin` |
| Shop owner | created via **Create one** on `/login` | `/dashboard` |

Routing is driven by the `role` column returned by `/api/auth/login` — `super_admin` → `/admin`, everything else → `/dashboard`. The role switcher in the header only appears for a real `super_admin`.

`seed.sql` stores the **SHA-256 digest** of the password, not the plaintext — the login endpoint hashes what you type and compares digests, so a plaintext row can never match. **Change this password before the site is public.**

### Where data lives

- **D1** — `users`, `shops` (auth, tenants, plans)
- **localStorage, per browser** — orders, customers, riders, inventory, GCash proofs

The second group has no API endpoints yet, so a new shop starts empty and its operational data does not follow the user across devices. Moving it to D1 needs `orders`-table endpoints plus `customers` / `riders` / `inventory` tables.

## Routes

| Route | Page |
|---|---|
| `/` | Public landing page (marketing) |
| `/login` | Shop login / demo tenant picker |
| `/dashboard` | Owner dashboard (auth required) |
| `/orders` `/customers` `/riders` `/inventory` `/pricing` `/settings` | App shell (auth required) |
| `/admin` | Super Admin (role: admin) |
| `/track` | Public order tracking, no login |

Funnel: `/` → **Try for FREE** → `/login` → pick a shop → `/dashboard`.

## What's built

| Page | What works |
|---|---|
| **Landing** | Sticky white navbar, Tagalog hero with a live-styled orders mock, KPI strip, 3 feature cards, testimonials, pricing (BIZ highlighted yellow), CTA band, footer, Bubbles widget |
| **Dashboard** | 4 KPI cards, 6-month revenue area chart, order-status donut, FREE-usage banner with upgrade CTA, recent orders, low-stock panel |
| **Orders** | HTML5 drag-and-drop Kanban across 6 stages. Create/edit/delete modal with customer autocomplete, service multipliers, add-ons, live total, rider assignment. Mobile uses ◀ ▶ stage buttons instead of dragging |
| **Customers** | Searchable + sortable table with computed order count and lifetime spend; auto-created from orders |
| **Riders** | Add riders, live status toggle (Available / On Delivery / Off Duty), active vs completed counts |
| **Inventory** | Stock cards with +/− adjust, inline edit, one-tap restock, red low-stock alerts |
| **Pricing** | Three tiers, Monthly/Yearly toggle, GCash payment modal with reference + proof upload |
| **Settings** | Shop profile, price-per-KG (drives all order math), live price preview, data reset |
| **Super Admin** | All shops with usage bars, plan override, GCash proof approve/reject — approving flips that shop's plan |
| **/track** | Public, no login. Phone lookup → live stepper (Placed → Pickup → Washing → Ready → Delivery → Completed) |

## Bubbles 🫧

The AI assistant in the bottom-right corner. Rule-based keyword matching — no API key, no network calls. It answers on creating orders, the FREE limit, upgrading, adding riders, inventory, tracking, and pricing setup, and reads **live shop data** for usage questions. Quick-action chips and in-message buttons navigate the app directly.

## Plan limits

FREE caps at **50 orders/month**. At the cap, Create Order is blocked and the upgrade modal takes over. Upgrading submits a GCash proof that a Super Admin approves to activate the plan.

## Pricing math

```
Total = KG × shop.pricePerKg × serviceMultiplier + addons
```

Wash Dry Fold ×1 · Press ×1.2 · Dry Clean ×2
Fabric Conditioner +₱10 · Rush +₱50 · Special Fold +₱15

## Storage keys

`washai_shops` · `washai_orders` · `washai_customers` · `washai_riders` · `washai_inventory` · `washai_payments` · `washai_session`

Seeded on first load with 4 shops, 12 orders, 5 customers, 2 riders, 5 inventory items. Reset anytime from **Settings → Reset all demo data**.
