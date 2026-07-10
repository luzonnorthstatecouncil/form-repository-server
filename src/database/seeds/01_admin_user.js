import bcrypt from "bcryptjs";

export const seed = async (knex) => {
   await knex("users").where({ username: "admin" }).delete();

   const hashedPassword = await bcrypt.hash("!2023luzon_", 12);

   await knex("users").insert({
      full_name: "Luzon North State Council",
      username: "luzonnorth",
      email: "luzonnorthstatecouncil@gmail.com",
      password: hashedPassword,
      role: "admin",
      status: "active",
   });
};
