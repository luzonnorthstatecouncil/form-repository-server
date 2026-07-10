import bcrypt from "bcryptjs";

export const seed = async (knex) => {
   await knex("users").where({ username: "admin" }).delete();

   const hashedPassword = await bcrypt.hash("test", 12);

   await knex("users").insert({
      full_name: "Administrator",
      username: "admin",
      email: "admin@formrepository.local",
      password: hashedPassword,
      role: "admin",
      status: "active",
   });
};
