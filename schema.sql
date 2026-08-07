CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, role TEXT DEFAULT 'shop_owner', shop_id TEXT, created_at TEXT);
CREATE TABLE IF NOT EXISTS shops (id TEXT PRIMARY KEY, name TEXT NOT NULL, owner_email TEXT NOT NULL, plan TEXT DEFAULT 'FREE', orders_used INTEGER DEFAULT 0, revenue REAL DEFAULT 0, status TEXT DEFAULT 'Active', created_at TEXT);
CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, shop_id TEXT, customer_name TEXT, amount REAL, status TEXT, created_at TEXT);
