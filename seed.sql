-- WashAI super admin seed.
--
-- IMPORTANT — password_hash holds the SHA-256 digest of "WashAI2024!", not the
-- plaintext. /api/auth/login computes sha256(submitted) and compares it to this
-- column, so storing the raw password here would lock the account out entirely.
-- Storing plaintext in a column named password_hash would also mean a database
-- leak hands over a working password.
--
-- Email is lowercase: the API lowercases before lookup and SQLite's `=` on TEXT
-- is case-sensitive, so a mixed-case row would be invisible to login.
--
-- Credentials: renzsom2022@gmail.com / WashAI2024!

DELETE FROM users WHERE email = 'demo@washai.ph';

INSERT OR REPLACE INTO users (id, email, password_hash, role, shop_id, created_at)
VALUES (
  'super_admin_1',
  'renzsom2022@gmail.com',
  '3eaed73c69191643b03e1a363a12a9a39920e995f30e14dc037ae3e22dab5bd3',
  'super_admin',
  NULL,
  datetime('now')
);

-- The earlier seed used id 'admin_1'; drop it so there is exactly one admin row.
DELETE FROM users WHERE id = 'admin_1' AND email = 'renzsom2022@gmail.com';
