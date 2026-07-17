import db from "../../database/db.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";

export const createMembership = async (data) => {
   const [id] = await db("memberships").insert({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email || null,
      cell_phone: data.cellPhone,
      council_number: data.councilNumber || null,
      transaction_type: data.transactionType,
      form_data: JSON.stringify(data),
   });

   return db("memberships").where({ id }).first();
};

export const findAllMemberships = async ({
   search,
   transaction_type,
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
               .orWhereRaw("LOWER(first_name) LIKE ?", [like])
               .orWhereRaw("LOWER(last_name) LIKE ?", [like])
               .orWhereRaw("LOWER(email) LIKE ?", [like])
               .orWhereRaw("LOWER(cell_phone) LIKE ?", [like])
               .orWhereRaw("LOWER(council_number) LIKE ?", [like])
               .orWhereRaw("LOWER(transaction_type) LIKE ?", [like])
         );
      }
      if (transaction_type) query.where("transaction_type", transaction_type);
      if (date_from) query.where("created_at", ">=", new Date(date_from));
      if (date_to) {
         const end = new Date(date_to);
         end.setHours(23, 59, 59, 999);
         query.where("created_at", "<=", end);
      }
      return query;
   };

   const [{ total }] = await applyFilters(db("memberships").count("id as total"));

   const rows = await applyFilters(
      db("memberships").select(
         "id",
         "first_name",
         "last_name",
         "email",
         "cell_phone",
         "council_number",
         "transaction_type",
         "form_data",
         "created_at"
      )
   )
      .orderBy("created_at", "desc")
      .limit(limit)
      .offset(offset);

   const memberships = rows.map((row) => {
      if (typeof row.form_data === "string") {
         try {
            row.form_data = JSON.parse(row.form_data);
         } catch (e) {
            console.error("Failed to parse form_data JSON", e);
         }
      }
      return row;
   });

   return { memberships, total: Number(total), page: Number(page), limit: Number(limit) };
};

export { createAuditLog };
