export const up = async (knex) => {
   await knex.schema.createTable("memberships", (table) => {
      table.bigIncrements("id").unsigned().primary();
      
      // Key fields
      table.string("first_name", 255).notNullable();
      table.string("last_name", 255).notNullable();
      table.string("email", 255).nullable();
      table.string("cell_phone", 50).notNullable();
      table.string("council_number", 50).nullable();
      table.string("transaction_type", 100).notNullable();
      
      // Complete form data payload as JSON
      table.json("form_data").notNullable();
      
      table.datetime("created_at").notNullable().defaultTo(knex.fn.now());
      table.datetime("updated_at").notNullable().defaultTo(knex.fn.now());
   });
};

export const down = async (knex) => {
   await knex.schema.dropTableIfExists("memberships");
};
