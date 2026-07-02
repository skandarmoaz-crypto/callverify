import { Router } from "express";
import { pool } from "../db";
import { requireAdmin } from "../middleware/auth";

const router = Router();

router.use(requireAdmin);

/* GET /api/admin/settings — return all settings as a key-value map */
router.get("/settings", async (_req, res) => {
  const result = await pool.query<{ key: string; value: string }>(
    "SELECT key, value FROM settings ORDER BY key",
  );
  const map: Record<string, string> = {};
  for (const row of result.rows) map[row.key] = row.value;
  res.json(map);
});

/* PUT /api/admin/settings — update one or more settings */
router.put("/settings", async (req, res) => {
  const updates = req.body as Record<string, string>;
  const allowedKeys = new Set(["receiving_phone_number"]);

  const entries = Object.entries(updates).filter(([k]) => allowedKeys.has(k));
  if (entries.length === 0) {
    res.status(400).json({ error: "No valid settings keys provided" });
    return;
  }

  for (const [key, value] of entries) {
    await pool.query(
      `INSERT INTO settings (key, value, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
      [key, value],
    );
  }

  res.json({ success: true });
});

export default router;
