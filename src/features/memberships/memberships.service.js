import db from "../../database/db.js";

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

export const findAllMemberships = async () => {
   const rows = await db("memberships")
      .select("id", "first_name", "last_name", "email", "cell_phone", "council_number", "transaction_type", "form_data", "created_at")
      .orderBy("created_at", "desc");

   return rows.map((row) => {
      // Parse JSON form_data if returned as string
      if (typeof row.form_data === "string") {
         try {
            row.form_data = JSON.parse(row.form_data);
         } catch (e) {
            console.error("Failed to parse form_data JSON", e);
         }
      }
      return row;
   });
};
