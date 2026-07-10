import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Hostinger Production (Looks 2 folders up from src/)
const livePath = path.join(dirname, "../../../.env");

// Localhost Development (Looks 1 folder up from src/, inside Elib-Backend)
const localPath = path.join(__dirname, "../../.env");

if (fs.existsSync(livePath)) {
   dotenv.config({ path: livePath });
   console.log("Loaded live .env");
} else if (fs.existsSync(localPath)) {
   dotenv.config({ path: localPath });
   console.log("Loaded local .env");
} else {
   console.warn("No .env file found anywhere.");
}
