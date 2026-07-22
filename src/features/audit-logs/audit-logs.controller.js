import { findAllAuditLogs } from "./audit-log.service.js";

export const list = async (req, res) => {
   try {
      const { search, action, date_from, date_to, page, limit } = req.query;
      const result = await findAllAuditLogs({
         search,
         action,
         date_from,
         date_to,
         page: page ? Number(page) : 1,
         limit: limit ? Number(limit) : 10,
      });
      return res.json(result);
   } catch (err) {
      console.error("Error listing audit logs:", err);
      return res.status(500).json({ error: "Failed to fetch audit logs" });
   }
};
