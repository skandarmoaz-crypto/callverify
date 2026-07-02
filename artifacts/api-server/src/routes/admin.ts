import { Router } from "express";
import crypto from "crypto";
import { pool } from "../db";
import { requireAdmin } from "../middleware/auth";

const router = Router();

router.use(requireAdmin);

// GET /api/admin/stats
router.get("/stats", async (_req, res) => {
  const [sessionsRes, keysRes] = await Promise.all([
    pool.query(`
      SELECT
        COUNT(*)                                        AS total,
        COUNT(*) FILTER (WHERE status = 'verified')    AS verified,
        COUNT(*) FILTER (WHERE status = 'pending')     AS pending,
        COUNT(*) FILTER (WHERE status = 'expired')     AS expired
      FROM sessions
    `),
    pool.query("SELECT COUNT(*) AS total FROM api_keys"),
  ]);

  res.json({
    sessions: sessionsRes.rows[0],
    api_keys: keysRes.rows[0],
  });
});

// GET /api/admin/sessions?page=1
router.get("/sessions", async (req, res) => {
  const page = Math.max(1, parseInt(String(req.query["page"] ?? "1"), 10));
  const limit = 20;
  const offset = (page - 1) * limit;

  const [rows, count] = await Promise.all([
    pool.query(
      `SELECT s.id, s.phone, s.status, s.created_at, s.verified_at, s.expires_at,
              ak.name AS api_key_name
       FROM sessions s
       LEFT JOIN api_keys ak ON s.api_key_id = ak.id
       ORDER BY s.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset],
    ),
    pool.query("SELECT COUNT(*) AS total FROM sessions"),
  ]);

  const total = parseInt(String(count.rows[0].total), 10);

  res.json({
    sessions: rows.rows,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
});

// GET /api/admin/api-keys
router.get("/api-keys", async (_req, res) => {
  const result = await pool.query(
    "SELECT id, name, created_at FROM api_keys ORDER BY created_at DESC",
  );
  res.json({ api_keys: result.rows });
});

// POST /api/admin/api-keys
router.post("/api-keys", async (req, res) => {
  const { name } = req.body as { name?: string };
  if (!name?.trim()) {
    res.status(400).json({ error: "name is required" });
    return;
  }

  const key = "cvk_" + crypto.randomBytes(32).toString("hex");

  const result = await pool.query(
    "INSERT INTO api_keys (key, name) VALUES ($1, $2) RETURNING id, key, name, created_at",
    [key, name.trim()],
  );

  res.status(201).json(result.rows[0]);
});

// DELETE /api/admin/api-keys/:id
router.delete("/api-keys/:id", async (req, res) => {
  await pool.query("DELETE FROM api_keys WHERE id = $1", [req.params.id]);
  res.json({ success: true });
});

export default router;
