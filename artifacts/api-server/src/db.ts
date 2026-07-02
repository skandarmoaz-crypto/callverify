import pg from "pg";

const { Pool } = pg;

if (!process.env.NEON_DATABASE_URL) {
  throw new Error("NEON_DATABASE_URL is required");
}

export const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
