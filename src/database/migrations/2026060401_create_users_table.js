export const up = async (knex) => {
   await knex.schema.createTable("users", (table) => {
      table.bigIncrements("id").unsigned().primary();
      table.string("full_name", 255).notNullable();
      table.string("username", 255).notNullable().unique();
      table.string("email", 255).notNullable().unique();
      table.string("password", 255).notNullable();
      table.enum("role", ["admin", "staff", "user"]).notNullable().defaultTo("user");
      table.enum("status", ["active", "inactive"]).notNullable().defaultTo("active");
      table.datetime("deleted_at").nullable();
      table.datetime("created_at").notNullable().defaultTo(knex.fn.now());
      table.datetime("updated_at").notNullable().defaultTo(knex.fn.now());
   });
};

export const down = async (knex) => {
   await knex.schema.dropTableIfExists("users");
};
