export const up = async (knex) => {
   await knex.schema.alterTable("form_links", (table) => {
      table.boolean("is_visible").notNullable().defaultTo(true);
   });
};

export const down = async (knex) => {
   await knex.schema.alterTable("form_links", (table) => {
      table.dropColumn("is_visible");
   });
};
