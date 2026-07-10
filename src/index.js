import "./config/env.js";

import express from "express";
import cors from "cors";
import "dotenv/config";
import db from "./database/db.js";
import authRoutes from "./features/auth/auth.routes.js";
import membershipsRoutes from "./features/memberships/memberships.routes.js";
import { verifyMutationToken } from "./middleware/auth.middleware.js";

const app = express();
const PORT = env.PORT;

const corsOptions = {
   origin: ["https://forms.knightstech.org", "https://forms.knightstech.org/"],
   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
   allowedHeaders: ["Content-Type", "Authorization"],
   optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(verifyMutationToken);

app.use("/api/auth", authRoutes);
app.use("/api/memberships", membershipsRoutes);

app.get("/", (req, res) => res.send("Server is running!"));

app.get("/api/health", async (req, res) => {
   try {
      await db.raw("SELECT 1");
      res.json({
         status: "healthy",
         message: "Server is running and connected to the database successfully.",
         timestamp: new Date().toISOString(),
         database: "connected",
      });
   } catch (error) {
      res.status(500).json({
         status: "unhealthy",
         message: "Server is running but database connection failed.",
         timestamp: new Date().toISOString(),
         database: "disconnected",
         error: error instanceof Error ? error.message : String(error),
      });
   }
});

app.listen(PORT, () => {
   console.log(`\n==================================================`);
   console.log(`🚀 Form Repository Server listening on port ${PORT}`);
   console.log(`🩺 Health check URL: http://localhost:${PORT}/api/health`);
   console.log(`==================================================\n`);
});
