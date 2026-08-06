import { FREE_ORDER_LIMIT, peso } from '../../lib/constants'

/**
 * Bubbles' rule-based brain. Scores each intent by keyword hits, picks the best.
 * No API — pure keyword matching, but weighted so phrasing variations still land.
 */
const INTENTS = [
  {
    id: 'create_order',
    keys: ['create order', 'new order', 'add order', 'make order', 'place order', 'how to order', 'encode', 'kanban'],
    soft: ['order', 'create', 'add', 'new'],
    reply: () => ({
      text:
        "Creating an order is quick! 🫧\n\n1. Go to **Orders** in the sidebar\n2. Tap the blue **New Order** button (top right)\n3. Type the customer name — I'll autocomplete regulars for you\n4. Pick a service, enter the weight in KG, tick any add-ons\n5. The total computes itself from your price-per-KG\n6. Assign a rider and hit **Create Order**\n\nThe new card lands in the **New** column — just drag it across the board as the laundry moves along!",
      actions: [{ label: 'Take me to Orders', to: '/orders' }],
    }),
  },
  {
    id: 'free_limit',
    keys: ['free limit', 'limit', 'how many orders', '50 orders', 'free plan', 'quota', 'cap'],
    soft: ['free', 'limit', 'many'],
    reply: (ctx) => ({
      text: `The **FREE plan** gives you **${FREE_ORDER_LIMIT} orders per month**, 1 branch, and a small "Powered by WashAI" watermark.\n\nYou're at **${ctx.used}/${FREE_ORDER_LIMIT}** this month — ${
        ctx.used >= FREE_ORDER_LIMIT
          ? "you've hit the cap, so new orders are blocked until you upgrade. 😬"
          : `${FREE_ORDER_LIMIT - ctx.used} left to go. 👍`
      }\n\nThe counter resets on the 1st of each month. Upgrading to **BIZ (₱499/mo)** removes the cap entirely.`,
      actions: [
        { label: 'See plans', to: '/pricing' },
        { label: 'Upgrade now', action: 'upgrade' },
      ],
    }),
  },
  {
    id: 'usage',
    keys: ['my usage', 'check usage', 'how much have i used', 'usage', 'my stats', 'how am i doing', 'revenue'],
    soft: ['usage', 'used', 'stats', 'revenue', 'sales'],
    reply: (ctx) => ({
      text: `Here's your snapshot for **${ctx.shopName}** 📊\n\n• Plan: **${ctx.plan}**\n• Orders this month: **${ctx.used}${ctx.plan === 'FREE' ? `/${FREE_ORDER_LIMIT}` : ''}**\n• Revenue this month: **${peso(ctx.monthRevenue)}**\n• Orders today: **${ctx.todayCount}**\n• Pending pickups: **${ctx.pendingPickups}**\n• Customers: **${ctx.totalCustomers}**\n• Low-stock items: **${ctx.lowStock}**${ctx.lowStock ? ' ⚠️' : ' ✅'}`,
      actions: [{ label: 'Open Dashboard', to: '/dashboard' }],
    }),
  },
  {
    id: 'upgrade',
    keys: ['upgrade', 'biz plan', 'growth plan', 'subscribe', 'pay', 'gcash', 'billing', 'price of plan', 'how much is biz'],
    soft: ['upgrade', 'plan', 'pay', 'gcash'],
    reply: () => ({
      text:
        "Upgrading takes about a minute 💙\n\n1. Open **Pricing** from the sidebar\n2. Toggle **Monthly / Yearly** (yearly saves you ~2 months)\n3. Hit **Upgrade** on BIZ (₱499/mo) or Growth (₱1,199/mo)\n4. A **GCash modal** pops up — send to the number shown\n5. Enter your reference number, upload the screenshot, submit\n\nOur Super Admin reviews it and your plan flips over as soon as it's approved. No card needed!",
      actions: [
        { label: 'View pricing', to: '/pricing' },
        { label: 'Upgrade to BIZ', action: 'upgrade' },
      ],
    }),
  },
  {
    id: 'add_rider',
    keys: ['add rider', 'new rider', 'rider', 'driver', 'delivery guy', 'assign rider'],
    soft: ['rider', 'driver'],
    reply: () => ({
      text:
        "Riders are easy to set up 🛵\n\n1. Go to **Riders** in the sidebar\n2. Click **Add Rider**\n3. Fill in name, mobile number, and plate number\n4. Set their status — Available, On Delivery, or Off Duty\n\nOnce saved, they show up in the **Assign Rider** dropdown when you create or edit an order. You can flip their status any time straight from the rider card.",
      actions: [{ label: 'Go to Riders', to: '/riders' }],
    }),
  },
  {
    id: 'inventory',
    keys: ['inventory', 'stock', 'detergent', 'fabcon', 'supplies', 'low stock', 'plastic'],
    soft: ['stock', 'inventory', 'supplies'],
    reply: (ctx) => ({
      text: `The **Inventory** page tracks your supplies — detergent, fabric conditioner, plastic, whatever you add.\n\nEach item has a **low-stock threshold**. Drop to or below it and the row turns **red** so you know to restock. Use the **+ / −** buttons for quick adjustments after a busy day.\n\nRight now you have **${ctx.lowStock} item${ctx.lowStock === 1 ? '' : 's'}** running low.`,
      actions: [{ label: 'Check Inventory', to: '/inventory' }],
    }),
  },
  {
    id: 'track',
    keys: ['track', 'tracking', 'where is my order', 'customer track', 'status link', 'public page'],
    soft: ['track', 'status'],
    reply: () => ({
      text:
        "Your customers can track their own laundry — no login needed! 📦\n\nSend them to the **/track** page, they type in their mobile number, and they'll see a live stepper: Placed → Pickup → Washing → Ready → Delivery → Completed.\n\nIt updates the moment you drag a card on the Kanban board. Fewer \"tapos na ba?\" texts for you.",
      actions: [{ label: 'Open Track page', to: '/track' }],
    }),
  },
  {
    id: 'pricing_setup',
    keys: ['price per kg', 'change price', 'set price', 'rate', 'per kilo', 'shop price'],
    soft: ['price', 'rate', 'kilo'],
    reply: (ctx) => ({
      text: `Your rate is currently **${peso(ctx.pricePerKg)} per KG**.\n\nChange it in **Settings → Shop Profile**. Every new order's total recalculates from it automatically:\n\n\`Total = KG × rate × service multiplier + add-ons\`\n\nPress is ×1.2 and Dry Clean is ×2 of your base rate. Add-ons: Fabric Conditioner ₱10, Rush ₱50, Special Fold ₱15.`,
      actions: [{ label: 'Open Settings', to: '/settings' }],
    }),
  },
  {
    id: 'customers',
    keys: ['customer', 'client', 'suki', 'customer list', 'contacts'],
    soft: ['customer', 'client'],
    reply: () => ({
      text:
        "The **Customers** page lists everyone who's ordered from you, with their total order count and lifetime spend. Search by name or number at the top.\n\nHere's the nice part: you don't have to add customers manually. Create an order with a new name and I'll file them automatically. Returning customers autocomplete as you type. 🫧",
      actions: [{ label: 'View Customers', to: '/customers' }],
    }),
  },
  {
    id: 'kanban',
    keys: ['drag', 'drop', 'move order', 'board', 'column', 'stage', 'status change'],
    soft: ['drag', 'move', 'board'],
    reply: () => ({
      text:
        "The Orders board is a drag-and-drop Kanban 🧺\n\n**New → For Pickup → Washing → Ready → Out for Delivery → Completed**\n\nJust grab a card and drop it in the next column — the status saves instantly and the customer's tracking page updates too. On mobile, tap a card and use the stage buttons in the editor instead.",
      actions: [{ label: 'Open the board', to: '/orders' }],
    }),
  },
  {
    id: 'greeting',
    keys: ['hi', 'hello', 'hey', 'kumusta', 'good morning', 'good afternoon', 'yo', 'sup'],
    soft: [],
    reply: (ctx) => ({
      text: `Hey there! 🫧 Bubbles here, your WashAI assistant.\n\nI can walk you through orders, riders, inventory, plans, and tracking — or just tell you how **${ctx.shopName}** is doing today. What do you need?`,
      actions: [],
    }),
  },
  {
    id: 'thanks',
    keys: ['thanks', 'thank you', 'salamat', 'ty', 'appreciate'],
    soft: [],
    reply: () => ({
      text: "Anytime! 🫧 That's what I'm here for. Ping me whenever — I never run out of suds.",
      actions: [],
    }),
  },
  {
    id: 'who',
    keys: ['who are you', 'what are you', 'what is washai', 'about', 'what can you do', 'help'],
    soft: ['who', 'what', 'help'],
    reply: () => ({
      text:
        "I'm **Bubbles**, the AI assistant baked into WashAI — your laundry business OS. 🫧\n\nWashAI handles orders, customers, riders, inventory, pricing, and customer tracking in one place. I'm the bit that answers your questions so you don't have to dig through menus.\n\nTry asking me about **creating orders**, the **FREE limit**, **upgrading**, or **adding a rider**.",
      actions: [],
    }),
  },
]

const FALLBACK = {
  text:
    "Hmm, I didn't quite catch that one. 🫧 I'm still a young bubble!\n\nHere's what I'm great at:\n• Creating and moving orders\n• FREE plan limits and upgrading\n• Adding riders and managing inventory\n• Your shop's numbers right now\n• Customer order tracking\n\nTry one of the buttons below 👇",
  actions: [
    { label: 'How to create an order?', prompt: 'How to create order?' },
    { label: 'Check my usage', prompt: 'Check my usage' },
    { label: 'Upgrade to BIZ', prompt: 'How do I upgrade?' },
  ],
}

export function ask(raw, ctx) {
  const q = ' ' + raw.toLowerCase().trim() + ' '
  let best = null
  let bestScore = 0

  for (const intent of INTENTS) {
    let score = 0
    for (const k of intent.keys) if (q.includes(k)) score += 10 + k.length / 4
    for (const s of intent.soft) if (q.includes(' ' + s)) score += 2
    if (score > bestScore) {
      bestScore = score
      best = intent
    }
  }

  if (!best || bestScore < 4) return { ...FALLBACK }
  return best.reply(ctx)
}

export const QUICK_ACTIONS = [
  'How to create order?',
  'Check my usage',
  'Upgrade to BIZ',
  'How to add a rider?',
]
