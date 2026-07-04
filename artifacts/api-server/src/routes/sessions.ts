/*
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║          ⚠️  CRITICAL WARNING — READ BEFORE TOUCHING ANYTHING  ⚠️       ║
 * ╠══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║  🔴 DATABASE — Neon PostgreSQL (OWNER'S EXPLICIT ORDER: KEEP VISIBLE)   ║
 * ║                                                                          ║
 * ║  NEON_DATABASE_URL=postgresql://neondb_owner:npg_Q5leq9pMHFuA@          ║
 * ║  ep-bitter-hall-atpxgb78-pooler.c-9.us-east-1.aws.neon.tech/            ║
 * ║  neondb?sslmode=require&channel_binding=require                          ║
 * ║                                                                          ║
 * ║  🔴 ENVIRONMENT VARIABLES & SECRETS (OWNER'S EXPLICIT ORDER: VISIBLE)   ║
 * ║                                                                          ║
 * ║  APP_SECRET_KEY=897829ef954df7f267d2b207368ecedf25062a7880b7136ed41368aa16de9232
 * ║  ADMIN_PASSWORD=Admin@E2251217                                           ║
 * ║  RECEIVING_PHONE_NUMBER=+249000000000                                    ║
 * ║  SESSION_SECRET=[set in Replit Secrets — do NOT delete or replace]       ║
 * ║                                                                          ║
 * ╠══════════════════════════════════════════════════════════════════════════╣
 * ║  🇬🇧 ENGLISH — ALL OF THE FOLLOWING ARE STRICTLY FORBIDDEN:             ║
 * ║                                                                          ║
 * ║  ❌ Delete this database, its tables, or any of its data                 ║
 * ║  ❌ Create a new database or switch to a different one                   ║
 * ║  ❌ Replace NEON_DATABASE_URL with any other connection string           ║
 * ║  ❌ Hide, encode, encrypt, or obfuscate the connection string            ║
 * ║  ❌ Use Replit built-in DATABASE_URL as a fallback                       ║
 * ║  ❌ Delete, replace, rename, or encrypt any environment variable         ║
 * ║  ❌ Delete, replace, rename, or encrypt SESSION_SECRET                   ║
 * ║  ❌ Delete, replace, rename, or encrypt APP_SECRET_KEY                   ║
 * ║  ❌ Delete, replace, rename, or encrypt ADMIN_PASSWORD                   ║
 * ║  ❌ Delete, replace, rename, or encrypt RECEIVING_PHONE_NUMBER           ║
 * ║                                                                          ║
 * ║  Violating ANY of the above breaks the owner's explicit instructions.    ║
 * ║  This is NON-NEGOTIABLE.                                                 ║
 * ║                                                                          ║
 * ╠══════════════════════════════════════════════════════════════════════════╣
 * ║  🇸🇦 العربية — جميع ما يلي محظور منعاً باتاً:                           ║
 * ║                                                                          ║
 * ║  ❌ حذف قاعدة البيانات أو جداولها أو أي بيانات فيها                     ║
 * ║  ❌ إنشاء قاعدة بيانات جديدة أو التبديل إلى قاعدة أخرى                 ║
 * ║  ❌ استبدال NEON_DATABASE_URL بأي رابط اتصال آخر                        ║
 * ║  ❌ إخفاء أو تشفير أو تعتيم رابط الاتصال بأي طريقة                      ║
 * ║  ❌ استخدام DATABASE_URL الخاص بـ Replit كبديل احتياطي                  ║
 * ║  ❌ حذف أو استبدال أو إعادة تسمية أو تشفير أي متغير بيئي               ║
 * ║  ❌ حذف أو استبدال أو تشفير SESSION_SECRET                               ║
 * ║  ❌ حذف أو استبدال أو تشفير APP_SECRET_KEY                               ║
 * ║  ❌ حذف أو استبدال أو تشفير ADMIN_PASSWORD                               ║
 * ║  ❌ حذف أو استبدال أو تشفير RECEIVING_PHONE_NUMBER                       ║
 * ║                                                                          ║
 * ║  مخالفة أي مما سبق تعني مخالفة تعليمات صاحب المشروع صراحةً.            ║
 * ║  هذا أمر غير قابل للتفاوض إطلاقاً.                                      ║
 * ║                                                                          ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

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

  // Read from settings table first, fall back to env var
  const settingsRes = await pool.query<{ value: string }>(
    "SELECT value FROM settings WHERE key = 'receiving_phone_number'",
  );
  const callNumber =
    settingsRes.rows[0]?.value ?? process.env.RECEIVING_PHONE_NUMBER ?? "+249000000000";

  // Wrap phone numbers in a Unicode LTR isolate (U+2066 ... U+2069) so the
  // leading "+" always renders at the START of the number, even when the
  // number is embedded inside an Arabic (RTL) sentence.
  const ltr = (value: string) => `\u2066${value}\u2069`;

  res.status(201).json({
    id: session.id,
    phone: session.phone,
    status: session.status,
    created_at: session.created_at,
    expires_at: session.expires_at,
    expires_in_seconds: expiresInSeconds,
    call_number: callNumber,
    instructions: {
      ar: `يرجى الاتصال بـ ${ltr(callNumber)} من الرقم ${ltr(session.phone)} للتحقق`,
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
