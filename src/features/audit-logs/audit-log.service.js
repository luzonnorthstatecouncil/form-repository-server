import db from "../../database/db.js";

export const createAuditLog = async ({
   userId = null,
   actorName,
   action,
   entity = null,
   entityId = null,
   metadata = null,
   ipAddress = null,
}) => {
   await db("audit_logs").insert({
      user_id: userId,
      actor_name: actorName,
      action,
      entity,
      entity_id: entityId,
      metadata: metadata ? JSON.stringify(metadata) : null,
      ip_address: ipAddress,
   });
};

export const findAllAuditLogs = async ({
   search,
   action,
   date_from,
   date_to,
   page = 1,
   limit = 10,
} = {}) => {
   const offset = (page - 1) * limit;

   const applyFilters = (query) => {
      if (search) {
         const like = `%${search.toLowerCase()}%`;
         query.where((q) =>
            q
               .orWhereRaw("LOWER(actor_name) LIKE ?", [like])
               .orWhereRaw("LOWER(action) LIKE ?", [like])
               .orWhereRaw("LOWER(entity) LIKE ?", [like]),
         );
      }
      if (action) query.where("action", action);
      if (date_from) query.where("created_at", ">=", new Date(date_from));
      if (date_to) {
         const end = new Date(date_to);
         end.setHours(23, 59, 59, 999);
         query.where("created_at", "<=", end);
      }
      return query;
   };

   const [{ total }] = await applyFilters(db("audit_logs").count("id as total"));

   const rows = await applyFilters(
      db("audit_logs").select(
         "id",
         "user_id",
         "actor_name",
         "action",
         "entity",
         "entity_id",
         "metadata",
         "ip_address",
         "created_at",
      ),
   )
      .orderBy("created_at", "desc")
      .limit(limit)
      .offset(offset);

   const logs = rows.map((row) => {
      if (typeof row.metadata === "string") {
         try {
            row.metadata = JSON.parse(row.metadata);
         } catch (e) {}
      }
      return row;
   });

   return { logs, total: Number(total), page: Number(page), limit: Number(limit) };
};
