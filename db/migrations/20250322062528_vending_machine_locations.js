/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export async function up(knex) {
  await knex.schema.createTable('vending_machine_locations', (table) => {
    table
      .string('id')
      .primary()
      .defaultTo(
        knex.raw(
          "concat('loc_', lpad(floor(random() * 1000000)::text, 6, '0'))",
        ),
      );
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export async function down(knex) {
  await knex.schema.dropTable('vending_machine_locations');
}
