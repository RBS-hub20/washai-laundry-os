/**
 * WashAI API client — talks to the Cloudflare Worker (worker/index.js), which
 * queries D1 (binding: DB, database: washai-db).
 *
 *   POST /api/auth/login   → SELECT * FROM users WHERE email = ?
 *   POST /api/auth/signup  → INSERT INTO shops + INSERT INTO users
 *   GET  /api/admin/shops  → SELECT * FROM shops   (super_admin only)
 *
 * Dev: Vite proxies /api → wrangler dev on :8787.
 * Prod: the Worker serves both the SPA and /api from one origin.
 */

const KEY_IDENTITY = 'washai_identity'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/** The signed-in D1 user (id, email, role, shop_id). */
export function getIdentity() {
  try {
    const raw = localStorage.getItem(KEY_IDENTITY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setIdentity(identity) {
  if (identity) localStorage.setItem(KEY_IDENTITY, JSON.stringify(identity))
  else localStorage.removeItem(KEY_IDENTITY)
}

export const clearIdentity = () => setIdentity(null)

async function request(path, { method = 'GET', body } = {}) {
  const headers = {}
  if (body) headers['content-type'] = 'application/json'

  const identity = getIdentity()
  if (identity?.email) headers['x-user-email'] = identity.email

  let res
  try {
    res = await fetch(path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(
      'Cannot reach the WashAI server. Check your connection and try again.',
      0
    )
  }

  let data = null
  try {
    data = await res.json()
  } catch {
    /* non-JSON (e.g. an HTML error page) */
  }

  if (!res.ok || data?.ok === false) {
    throw new ApiError(data?.error || `Request failed (${res.status})`, res.status)
  }
  return data
}

export const api = {
  health: () => request('/api/health'),

  /** Verifies credentials against the D1 users table. Returns {user, shop}. */
  login: ({ email, password }) =>
    request('/api/auth/login', { method: 'POST', body: { email, password } }),

  /** Creates a shops row + a shop_owner users row. */
  signup: ({ email, password, shopName }) =>
    request('/api/auth/signup', { method: 'POST', body: { email, password, shopName } }),

  /** Every tenant. Requires the caller to be a super_admin. */
  adminShops: () => request('/api/admin/shops'),
}

export default api
