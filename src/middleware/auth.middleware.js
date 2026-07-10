import jwt from "jsonwebtoken";
import { getSessionByToken } from "../features/auth/session.service.js";

export const authenticate = async (req, res, next) => {
   const authHeader = req.headers.authorization;
   if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
   }

   const token = authHeader.split(" ")[1];

   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const session = await getSessionByToken(token);
      if (!session) {
         return res.status(401).json({ error: "Session has expired or is invalid" });
      }

      req.user = decoded;
      next();
   } catch {
      return res.status(401).json({ error: "Invalid or expired token" });
   }
};

export const authorize = (...roles) => (req, res, next) => {
   if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
   }
   next();
};

export const verifyMutationToken = async (req, res, next) => {
   const mutations = ["POST", "PUT", "DELETE", "PATCH"];

   if (mutations.includes(req.method)) {
      const path = req.path || req.originalUrl;
      // Skip public authentication mutations
      const publicPaths = ["/api/auth/login", "/api/auth/refresh", "/auth/login", "/auth/refresh"];
      const isPublic =
         publicPaths.some((p) => path.endsWith(p)) ||
         ((path.endsWith("/api/memberships") || path.endsWith("/memberships")) && req.method === "POST");

      if (isPublic) {
         return next();
      }

      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
         return res.status(401).json({ error: "Unauthorized: No token provided for mutation" });
      }

      const token = authHeader.split(" ")[1];
      try {
         const decoded = jwt.verify(token, process.env.JWT_SECRET);
         const session = await getSessionByToken(token);
         if (!session) {
            return res.status(401).json({ error: "Unauthorized: Session is invalid or expired" });
         }
         req.user = decoded;
      } catch {
         return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
      }
   }
   next();
};
