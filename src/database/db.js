import knex from "knex";
import knexConfig from "../../knexfile.js";
import env from "../config/env.js";

const environment = env.NODE_ENV || "development";
const config = knexConfig[environment];

if (!config) {
   throw new Error(`Database configuration for environment "${environment}" not found in knexfile.js`);
}

const db = knex(config);

(async () => {
   try {
      await db.raw("SELECT 1");
      console.log("Database connected successfully!. [SUCCESS]");
   } catch (error) {
      console.log(`Database connection failed. [ERROR]: ${error instanceof Error ? error.message : String(error)}`);
      console.log(config);
   }
})();

export default db;
