export const up = async (knex) => {
   await knex.schema.createTable("audit_logs", (table) => {
      table.bigIncrements("id").unsigned().primary();
      table.bigInteger("user_id").unsigned().nullable();
      table.string("actor_name", 255).notNullable();
      table.string("action", 100).notNullable();
      table.string("entity", 100).nullable();
      table.bigInteger("entity_id").unsigned().nullable();
      table.json("metadata").nullable();
      table.string("ip_address", 45).nullable();
      table.datetime("created_at").notNullable().defaultTo(knex.fn.now());

      table.foreign("user_id").references("id").inTable("users").onDelete("SET NULL");
      table.index(["user_id", "action", "entity"]);
   });
};

export const down = async (knex) => {
   await knex.schema.dropTableIfExists("audit_logs");
};
