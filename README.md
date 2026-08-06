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

| Page | What works |
|---|---|
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
