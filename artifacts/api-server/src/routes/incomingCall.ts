import { Router } from "express";
import { pool } from "../db";
import { requireAppSecret } from "../middleware/auth";

const router = Router();

router.post("/incoming-call", requireAppSecret, async (req, res) => {
  const { phone } = req.body as { phone?: string };
  if (!phone) {
    res.status(400).json({ error: "phone is required" });
    return;
  }

  const normalizedPhone = String(phone).replace(/[\s\-\(\)]/g, "");

  // Verify only the most-recent pending session for this phone number
  const result = await pool.query<{ id: string }>(
    `UPDATE sessions
     SET    status = 'verified', verified_at = NOW()
     WHERE  id = (
       SELECT id
       FROM   sessions
       WHERE  phone      = $1
         AND  status     = 'pending'
         AND  expires_at > NOW()
       ORDER  BY created_at DESC
       LIMIT  1
     )
     RETURNING id`,
    [normalizedPhone],
  );

  if (result.rows.length === 0) {
    res.status(404).json({ error: "No pending session found for this phone" });
    return;
  }

  res.json({ success: true, session_id: result.rows[0].id });
});

export default router;
