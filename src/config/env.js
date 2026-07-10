import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load environment variables from .env file located outside public_html
 *
 * Hostinger directory structure:
 * /home/username/
 *   ├── public_html/        (your app root)
 *   │   └── config/
 *   │       └── env.js      (this file)
 *   └── .env               (environment file - outside web root)
 *
 * For local development: uses .env in project root
 * For production (Hostinger): uses ../.env (one level up from public_html)
 */

// Determine environment file path
const isProduction = process.env.NODE_ENV === "production";
const envPath = isProduction
   ? path.resolve(__dirname, "../../../.env") // Goes up to parent of public_html
   : path.resolve(__dirname, "../../.env"); // Uses project root for local dev

// Load environment variables
const result = dotenv.config({ path: envPath });

if (result.error) {
   console.warn(`⚠️  Environment file not found at: ${envPath}`);
   console.warn("Using system environment variables or defaults");
} else {
   console.log(`✓ Environment variables loaded from: ${envPath}`);
}

// Export environment variables for easy access
export const env = {
   // Server
   NODE_ENV: process.env.NODE_ENV || "development",

   // Database
   DB_HOST: process.env.DB_HOST || "127.0.0.1",
   DB_USER: process.env.DB_USER,
   DB_PASSWORD: process.env.DB_PASSWORD,
   DB_NAME: process.env.DB_NAME,
   DB_PORT: Number(process.env.DB_PORT) || 3306,

   // JWT
   JWT_SECRET: process.env.JWT_SECRET,
   SESSION_HOURS: parseInt(process.env.SESSION_HOURS || "8", 10),
   JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
   JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
   JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,

   // Email
   MAIL_HOST: process.env.MAIL_HOST || "smtp.gmail.com",
   MAIL_PORT: Number(process.env.MAIL_PORT) || 587,
   MAIL_SECURE: process.env.MAIL_SECURE === "true",
   MAIL_USER: process.env.MAIL_USER,
   MAIL_PASSWORD: process.env.MAIL_PASSWORD,
   MAIL_FROM: process.env.MAIL_FROM || process.env.MAIL_USER,
   APP_NAME: process.env.APP_NAME || "Knights of Columbus",
};

export default env;
