import app from "./app";
import { logger } from "./lib/logger";
import { initDb } from "./db";

// Validate all required env vars at startup
const required = ["PORT", "APP_SECRET_KEY", "ADMIN_PASSWORD"] as const;
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Required environment variable "${key}" is not set`);
  }
}
if (!process.env.NEON_DATABASE_URL && !process.env.DATABASE_URL) {
  throw new Error("NEON_DATABASE_URL or DATABASE_URL must be set");
}

if (!process.env.RECEIVING_PHONE_NUMBER) {
  logger.warn("RECEIVING_PHONE_NUMBER not set, using default +249000000000");
}

const port = Number(process.env["PORT"]);
if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${process.env["PORT"]}"`);
}

initDb()
  .then(() => {
    app.listen(port, (err) => {
      if (err) {
        logger.error({ err }, "Error listening on port");
        process.exit(1);
      }
      logger.info({ port }, "Server listening");
    });
  })
  .catch((err) => {
    logger.error({ err }, "Failed to initialize database");
    process.exit(1);
  });
