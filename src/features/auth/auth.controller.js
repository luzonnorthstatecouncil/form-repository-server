import * as authService from "./auth.service.js";
import { findById } from "../users/user.service.js";

const getIp = (req) => req.headers["x-forwarded-for"]?.split(",")[0].trim() ?? req.socket.remoteAddress;

export const login = async (req, res) => {
   const { email, username, password } = req.body;
   const identifier = email || username;

   if (!identifier || !password) {
      return res.status(400).json({ error: "Credentials are required" });
   }

   try {
      const result = await authService.login(
         identifier,
         password,
         getIp(req),
         req.headers["user-agent"],
      );
      return res.json(result);
   } catch (err) {
      return res.status(err.status || 500).json({ error: err.message });
   }
};

export const logout = async (req, res) => {
   try {
      const user = await findById(req.user.id);
      const token = req.headers.authorization?.split(" ")[1];
      if (user && token) await authService.logout(user, token, getIp(req));
      return res.json({ message: "Logged out successfully" });
   } catch (err) {
      return res.status(err.status || 500).json({ error: err.message });
   }
};

export const refresh = async (req, res) => {
   const { refreshToken } = req.body;
   if (!refreshToken) return res.status(400).json({ error: "Refresh token is required" });

   try {
      const result = await authService.refresh(
         refreshToken,
         getIp(req),
         req.headers["user-agent"],
      );
      return res.json(result);
   } catch {
      return res.status(401).json({ error: "Invalid or expired refresh token" });
   }
};

export const getMe = async (req, res) => {
   try {
      const user = await authService.getMe(req.user.id);
      return res.json({ user });
   } catch (err) {
      return res.status(err.status || 500).json({ error: err.message });
   }
};

export const changePassword = async (req, res) => {
   const { currentPassword, newPassword } = req.body;
   if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new passwords are required" });
   }

   try {
      await authService.changePassword(
         req.user.id,
         currentPassword,
         newPassword,
         getIp(req),
      );
      return res.json({ message: "Password updated successfully" });
   } catch (err) {
      return res.status(err.status || 500).json({ error: err.message });
   }
};
