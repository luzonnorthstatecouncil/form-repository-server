import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { findByIdentifier, findById } from "../users/user.service.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";
import * as sessionService from "./session.service.js";
import env from "../../config/env.js";

const signAccessToken = (payload) =>
   jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });

const signRefreshToken = (payload) =>
   jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN });

export const login = async (identifier, password, ipAddress, userAgent) => {
   const user = await findByIdentifier(identifier);
   if (!user) throw { status: 401, message: "Invalid credentials" };
   if (user.status === "inactive") throw { status: 403, message: "Account is inactive" };

   const isMatch = await bcrypt.compare(password, user.password);
   if (!isMatch) throw { status: 401, message: "Invalid credentials" };

   const payload = { id: user.id, role: user.role, full_name: user.full_name };
   const token = signAccessToken(payload);
   const refreshToken = signRefreshToken(payload);

   // Expiry: 7 days from now
   const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

   await sessionService.createSession({
      userId: user.id,
      token,
      refreshToken,
      ipAddress,
      userAgent,
      expiresAt,
   });

   await createAuditLog({
      userId: user.id,
      actorName: user.full_name,
      action: "USER_LOGIN",
      entity: "User",
      entityId: user.id,
      ipAddress,
   });

   const { password: _, ...safeUser } = user;
   return { user: safeUser, token, refreshToken };
};

export const logout = async (user, token, ipAddress) => {
   await sessionService.deleteSessionByToken(token);

   await createAuditLog({
      userId: user.id,
      actorName: user.full_name || user.username || "Unknown",
      action: "USER_LOGOUT",
      entity: "User",
      entityId: user.id,
      ipAddress,
   });
};

export const refresh = async (refreshToken, ipAddress, userAgent) => {
   // Validate the refresh token exists in DB and is active
   const session = await sessionService.getSessionByRefreshToken(refreshToken);
   if (!session) throw { status: 401, message: "Invalid or expired session" };

   // Verify JWT signature
   const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);

   const payload = { id: decoded.id, role: decoded.role, full_name: decoded.full_name };
   const token = signAccessToken(payload);
   const newRefreshToken = signRefreshToken(payload);

   // Delete old session and write the new one
   await sessionService.deleteSessionByRefreshToken(refreshToken);

   const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
   await sessionService.createSession({
      userId: decoded.id,
      token,
      refreshToken: newRefreshToken,
      ipAddress,
      userAgent,
      expiresAt,
   });

   return { token, refreshToken: newRefreshToken };
};

export const getMe = async (id) => {
   const user = await findById(id);
   if (!user) throw { status: 404, message: "User not found" };
   return user;
};
