import * as membershipsService from "./memberships.service.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";
import db from "../../database/db.js";

const getIp = (req) => req.headers["x-forwarded-for"]?.split(",")[0].trim() ?? req.socket.remoteAddress;

export const create = async (req, res) => {
   try {
      const membership = await membershipsService.createMembership(req.body);

      await createAuditLog({
         userId: null,
         actorName: `${req.body.firstName} ${req.body.lastName}` || "Guest",
         action: "MEMBERSHIP_SUBMITTED",
         entity: "Membership",
         entityId: membership.id,
         metadata: {
            transaction_type: req.body.transactionType,
            council_number: req.body.councilNumber,
         },
         ipAddress: getIp(req),
      });

      return res.status(201).json({ membership });
   } catch (err) {
      console.error("Error creating membership:", err);
      return res.status(500).json({ error: "Failed to save membership application" });
   }
};

export const list = async (req, res) => {
   try {
      const { search, transaction_type, date_from, date_to, page, limit } = req.query;
      const result = await membershipsService.findAllMemberships({
         search,
         transaction_type,
         date_from,
         date_to,
         page: page ? Number(page) : 1,
         limit: limit ? Number(limit) : 10,
      });
      return res.json(result);
   } catch (err) {
      console.error("Error listing memberships:", err);
      return res.status(500).json({ error: "Failed to fetch membership applications" });
   }
};

export const downloadPdf = async (req, res) => {
   try {
      const { membershipId, applicantName } = req.body;

      const dbUser = req.user?.id ? await db("users").where({ id: req.user.id }).first() : null;
      const actorName = dbUser?.full_name || req.user?.full_name || "Unknown Admin";

      await createAuditLog({
         userId: req.user?.id ?? null,
         actorName,
         action: "MEMBERSHIP_PDF_DOWNLOADED",
         entity: "Membership",
         entityId: membershipId ?? null,
         metadata: { applicantName },
         ipAddress: getIp(req),
      });

      return res.json({ success: true });
   } catch (err) {
      console.error("Error logging PDF download:", err);
      return res.status(500).json({ error: "Failed to log PDF download" });
   }
};
