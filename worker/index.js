/**
 * WashAI Worker — serves the built SPA from ./dist and hosts the /api routes.
 *
 * NOTE ON PASSWORDS: these are plain SHA-256 digests, as specified for this
 * milestone. SHA-256 is a fast hash with no salt — it is NOT safe for real
 * user passwords (offline brute force / rainbow tables). Before taking real
 * signups, move to PBKDF2 (available in Workers' Web Crypto via
 * crypto.subtle.deriveBits) or Argon2/bcrypt behind a queue.
 */

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  })

const bad = (message, status = 400) => json({ ok: false, error: message }, status)

/** Hex SHA-256 of a string. */
async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

/** Constant-time-ish compare so we don't leak hash prefixes via timing. */
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

const nowIso = () => new Date().toISOString()
const normEmail = (e) => String(e || '').trim().toLowerCase()

async function readJson(request) {
  try {
    return await request.json()
  } catch {
    return null
  }
}

/* ------------------------------ /api/auth ------------------------------ */

async function signup(request, env) {
  const body = await readJson(request)
  if (!body) return bad('Invalid JSON body')

  const email = normEmail(body.email)
  const password = String(body.password || '')
  const shopName = String(body.shopName || body.shop_name || '').trim()

  if (!email || !email.includes('@')) return bad('A valid email is required')
  if (password.length < 6) return bad('Password must be at least 6 characters')
  if (!shopName) return bad('Shop name is required')

  const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first()
  if (existing) return bad('That email already has an account', 409)

  const shopId = `shop_${crypto.randomUUID().slice(0, 8)}`
  const userId = `user_${crypto.randomUUID().slice(0, 8)}`
  const passwordHash = await sha256(password)
  const createdAt = nowIso()

  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO shops (id, name, owner_email, plan, orders_used, revenue, status, created_at)
       VALUES (?, ?, ?, 'FREE', 0, 0, 'Active', ?)`
    ).bind(shopId, shopName, email, createdAt),
    env.DB.prepare(
      `INSERT INTO users (id, email, password_hash, role, shop_id, created_at)
       VALUES (?, ?, ?, 'shop_owner', ?, ?)`
    ).bind(userId, email, passwordHash, shopId, createdAt),
  ])

  return json({
    ok: true,
    user: { id: userId, email, role: 'shop_owner', shop_id: shopId },
    shop: { id: shopId, name: shopName, plan: 'FREE' },
  })
}

async function login(request, env) {
  const body = await readJson(request)
  if (!body) return bad('Invalid JSON body')

  const email = normEmail(body.email)
  const password = String(body.password || '')
  if (!email || !password) return bad('Email and password are required')

  const user = await env.DB.prepare(
    'SELECT id, email, password_hash, role, shop_id FROM users WHERE email = ?'
  )
    .bind(email)
    .first()

  const attempted = await sha256(password)
  // Same generic message either way so we don't confirm which emails exist.
  if (!user || !safeEqual(user.password_hash, attempted)) {
    return bad('Invalid email or password', 401)
  }

  let shop = null
  if (user.shop_id) {
    shop = await env.DB.prepare(
      'SELECT id, name, plan, orders_used, revenue, status FROM shops WHERE id = ?'
    )
      .bind(user.shop_id)
      .first()
  }

  return json({
    ok: true,
    user: { id: user.id, email: user.email, role: user.role, shop_id: user.shop_id },
    shop,
  })
}

/* ------------------------------ /api/admin ----------------------------- */

/**
 * Stopgap gate: the caller states who they are via x-user-email and we confirm
 * that row is a super_admin. This is NOT authentication — anyone who knows an
 * admin address can spoof it. Replace with a signed session token before this
 * holds real shop data.
 */
async function requireSuperAdmin(request, env) {
  const email = normEmail(request.headers.get('x-user-email'))
  if (!email) return null
  const row = await env.DB.prepare('SELECT role FROM users WHERE email = ?').bind(email).first()
  return row && row.role === 'super_admin' ? row : null
}

async function adminShops(request, env) {
  const admin = await requireSuperAdmin(request, env)
  if (!admin) return bad('Super admin access required', 403)

  const { results } = await env.DB.prepare('SELECT * FROM shops ORDER BY created_at DESC').all()
  return json({ ok: true, shops: results ?? [] })
}

/* -------------------------------- router ------------------------------- */

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const { pathname } = url

    if (!pathname.startsWith('/api/')) {
      // Everything else is the built SPA.
      return env.ASSETS.fetch(request)
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'access-control-allow-origin': '*',
          'access-control-allow-methods': 'GET,POST,OPTIONS',
          'access-control-allow-headers': 'content-type,x-user-email',
        },
      })
    }

    try {
      if (pathname === '/api/auth/signup' && request.method === 'POST') {
        return await signup(request, env)
      }
      if (pathname === '/api/auth/login' && request.method === 'POST') {
        return await login(request, env)
      }
      if (pathname === '/api/admin/shops' && request.method === 'GET') {
        return await adminShops(request, env)
      }
      if (pathname === '/api/health') {
        return json({ ok: true, service: 'washai-api', time: nowIso() })
      }
      return bad('Not found', 404)
    } catch (err) {
      console.error('API error', pathname, err)
      return bad('Internal error', 500)
    }
  },
}
