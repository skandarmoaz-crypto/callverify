import pg from "pg";

const { Pool } = pg;

const connectionString = process.env.NEON_DATABASE_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("NEON_DATABASE_URL or DATABASE_URL environment variable is required");
}

export const pool = new Pool({
  connectionString,
  ssl: process.env.NEON_DATABASE_URL ? { rejectUnauthorized: false } : undefined,
});

export async function initDb(): Promise<void> {
  await pool.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS api_keys (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      key         TEXT UNIQUE NOT NULL,
      name        TEXT NOT NULL,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      api_key_id   UUID REFERENCES api_keys(id) ON DELETE CASCADE,
      phone        TEXT NOT NULL,
      status       TEXT NOT NULL DEFAULT 'pending',
      created_at   TIMESTAMPTZ DEFAULT NOW(),
      verified_at  TIMESTAMPTZ,
      expires_at   TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '5 minutes'
    );

    CREATE TABLE IF NOT EXISTS settings (
      key        TEXT PRIMARY KEY,
      value      TEXT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  /* Seed default settings — only if not already present */
  const phone = process.env.RECEIVING_PHONE_NUMBER ?? "+249000000000";
  await pool.query(
    `INSERT INTO settings (key, value)
     VALUES ('receiving_phone_number', $1)
     ON CONFLICT (key) DO NOTHING`,
    [phone],
  );
}
