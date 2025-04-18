/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('drink_inventories', (table) => {
    table
      .string('id')
      .primary()
      .defaultTo(
        knex.raw(
          "concat('dri', lpad(floor(random() * 1000000)::text, 6, '0'))",
        ),
      );
    table.string('name').notNullable();
    table.string('image_url').notNullable();
    table.integer('default_price').notNullable();
    table.timestamps(true, true);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTable('drink_inventories');
}
