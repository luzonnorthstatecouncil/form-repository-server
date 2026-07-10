import "dotenv/config";
import env from "./src/config/env.js";

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
   development: {
      client: "mysql2",
      connection: {
         host: env.DB_HOST || "127.0.0.1",
         port: Number(env.DB_PORT) || 3306,
         user: env.DB_USER || "root",
         password: env.DB_PASSWORD || "",
         database: env.DB_NAME || "form_repository",
      },
      migrations: {
         directory: "./src/database/migrations",
         tableName: "knex_migrations",
      },
      seeds: {
         directory: "./src/database/seeds",
      },
   },
   production: {
      client: "mysql2",
      connection: {
         host: env.DB_HOST,
         port: Number(env.DB_PORT) || 3306,
         user: env.DB_USER,
         password: env.DB_PASSWORD,
         database: env.DB_NAME,
      },
      pool: {
         min: 2,
         max: 10,
      },
      migrations: {
         directory: "./src/database/migrations",
         tableName: "knex_migrations",
      },
      seeds: {
         directory: "./src/database/seeds",
      },
   },
};
