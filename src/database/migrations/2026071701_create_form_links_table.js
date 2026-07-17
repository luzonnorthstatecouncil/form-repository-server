export const up = async (knex) => {
   await knex.schema.createTable("form_links", (table) => {
      table.bigIncrements("id").unsigned().primary();
      table.string("name", 255).notNullable();
      table.string("url", 1000).notNullable();
      table.string("description", 500).nullable();
      table.datetime("created_at").notNullable().defaultTo(knex.fn.now());
      table.datetime("updated_at").notNullable().defaultTo(knex.fn.now());
   });
};

export const down = async (knex) => {
   await knex.schema.dropTableIfExists("form_links");
};
