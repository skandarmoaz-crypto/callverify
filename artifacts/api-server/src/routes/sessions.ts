import { Router } from "express";
import { pool } from "../db";
import { requireApiKey } from "../middleware/auth";

const router = Router();

interface AuthedRequest extends Express.Request {
  apiKeyId: string;
}

// POST /api/sessions - open verification session
router.post("/sessions", requireApiKey, async (req, res) => {
  const { phone } = req.body as { phone?: string };
  if (!phone) {
    res.status(400).json({ error: "phone is required" });
    return;
  }

  const normalizedPhone = String(phone).replace(/[\s\-\(\)]/g, "");
  const apiKeyId = (req as unknown as AuthedRequest).apiKeyId;

  const result = await pool.query(
    `INSERT INTO sessions (api_key_id, phone, status, expires_at)
     VALUES ($1, $2, 'pending', NOW() + INTERVAL '5 minutes')
     RETURNING id, phone, status, created_at, expires_at`,
    [apiKeyId, normalizedPhone],
  );

  const session = result.rows[0] as {
    id: string;
    phone: string;
    status: string;
    created_at: string;
    expires_at: string;
  };

  const expiresAt = new Date(session.expires_at);
  const expiresInSeconds = Math.max(0, Math.round((expiresAt.getTime() - Date.now()) / 1000));
  const callNumber = process.env.RECEIVING_PHONE_NUMBER;

  res.status(201).json({
    id: session.id,
    phone: session.phone,
    status: session.status,
    created_at: session.created_at,
    expires_at: session.expires_at,
    expires_in_seconds: expiresInSeconds,
    call_number: callNumber,
    instructions: {
      ar: `يرجى الاتصال بـ ${callNumber} من الرقم ${session.phone} للتحقق`,
      en: `Please call ${callNumber} from ${session.phone} to verify your identity`,
    },
  });
});

// GET /api/sessions/:id - check session status
router.get("/sessions/:id", requireApiKey, async (req, res) => {
  const apiKeyId = (req as unknown as AuthedRequest).apiKeyId;

  const result = await pool.query(
    `SELECT id, phone, status, created_at, verified_at, expires_at
     FROM sessions
     WHERE id = $1 AND api_key_id = $2`,
    [req.params.id, apiKeyId],
  );

  if (result.rows.length === 0) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  const session = result.rows[0] as {
    id: string;
    phone: string;
    status: string;
    created_at: string;
    verified_at: string | null;
    expires_at: string;
  };

  // Auto-expire if past expiry
  if (session.status === "pending" && new Date(session.expires_at) < new Date()) {
    await pool.query("UPDATE sessions SET status = 'expired' WHERE id = $1", [
      req.params.id,
    ]);
    session.status = "expired";
  }

  res.json(session);
});

export default router;
