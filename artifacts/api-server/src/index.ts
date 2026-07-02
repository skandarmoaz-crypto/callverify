import app from "./app";
import { logger } from "./lib/logger";

const required = ["PORT", "NEON_DATABASE_URL", "APP_SECRET_KEY", "ADMIN_PASSWORD"] as const;
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Required environment variable "${key}" is not set`);
  }
}

const port = Number(process.env["PORT"]);
if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${process.env["PORT"]}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }
  logger.info({ port }, "Server listening");
});
