// location_cities.js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('location_cities', (table) => {
    table
      .string('id')
      .primary()
      .defaultTo(
        knex.raw(
          "concat('lci_', lpad(floor(random() * 1000000)::text, 6, '0'))",
        ),
      );
    table.string('name').notNullable();
    table.string('state_id').notNullable();
    table.string('country_id').notNullable();
    table.string('description');

    // No foreign key to vending_machine_locations here
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTable('location_cities');
}
