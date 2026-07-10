import db from "../../database/db.js";

const SAFE_COLUMNS = ["id", "full_name", "username", "email", "role", "status", "created_at", "updated_at"];

export const findByIdentifier = async (identifier) => {
   return db("users")
      .whereNull("deleted_at")
      .where((qb) => {
         qb.where("email", identifier).orWhere("username", identifier);
      })
      .first();
};

export const findById = async (id) => {
   return db("users")
      .select(SAFE_COLUMNS)
      .whereNull("deleted_at")
      .where({ id })
      .first();
};
