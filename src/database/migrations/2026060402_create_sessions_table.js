export const up = async (knex) => {
   await knex.schema.createTable("sessions", (table) => {
      table.bigIncrements("id").unsigned().primary();
      table.bigInteger("user_id").unsigned().notNullable();
      table.text("token").notNullable();
      table.text("refresh_token").notNullable();
      table.string("ip_address", 45).nullable();
      table.string("user_agent", 255).nullable();
      table.datetime("expires_at").notNullable();
      table.datetime("created_at").notNullable().defaultTo(knex.fn.now());
      table.datetime("updated_at").notNullable().defaultTo(knex.fn.now());

      table.foreign("user_id").references("id").inTable("users").onDelete("CASCADE");
      table.index(["user_id"]);
   });
};

export const down = async (knex) => {
   await knex.schema.dropTableIfExists("sessions");
};
