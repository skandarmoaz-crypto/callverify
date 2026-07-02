import type { Request, Response, NextFunction } from "express";
import { pool } from "../db";

export async function requireApiKey(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "API key required (Bearer token)" });
    return;
  }
  const key = authHeader.slice(7);
  const result = await pool.query(
    "SELECT id FROM api_keys WHERE key = $1",
    [key],
  );
  if (result.rows.length === 0) {
    res.status(401).json({ error: "Invalid API key" });
    return;
  }
  (req as Request & { apiKeyId: string }).apiKeyId = result.rows[0].id;
  next();
}

export function requireAppSecret(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const secret = req.headers["x-app-secret"];
  if (!secret || secret !== process.env.APP_SECRET_KEY) {
    res.status(401).json({ error: "Invalid app secret" });
    return;
  }
  next();
}

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const password = req.headers["x-admin-password"];
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ error: "Invalid admin password" });
    return;
  }
  next();
}
