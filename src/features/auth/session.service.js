import db from "../../database/db.js";

export const createSession = async ({
   userId,
   token,
   refreshToken,
   ipAddress = null,
   userAgent = null,
   expiresAt,
}) => {
   const [id] = await db("sessions").insert({
      user_id: userId,
      token,
      refresh_token: refreshToken,
      ip_address: ipAddress,
      user_agent: userAgent,
      expires_at: expiresAt,
   });
   return id;
};

export const getSessionByToken = async (token) => {
   return db("sessions")
      .where("token", token)
      .andWhere("expires_at", ">", new Date())
      .first();
};

export const getSessionByRefreshToken = async (refreshToken) => {
   return db("sessions")
      .where("refresh_token", refreshToken)
      .andWhere("expires_at", ">", new Date())
      .first();
};

export const deleteSessionByToken = async (token) => {
   await db("sessions").where("token", token).delete();
};

export const deleteSessionByRefreshToken = async (refreshToken) => {
   await db("sessions").where("refresh_token", refreshToken).delete();
};

export const deleteExpiredSessions = async () => {
   await db("sessions").where("expires_at", "<", new Date()).delete();
};
