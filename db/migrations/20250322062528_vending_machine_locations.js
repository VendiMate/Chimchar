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
    table.string('name').notNullable();
    table.string('city_id').notNullable();
    table.string('x_coordinate').notNullable();
    table.string('y_coordinate').notNullable();
    table.string('z_coordinate');
    table.string('description');

    table.foreign('city_id').references('location_cities.city_id');
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export async function down(knex) {
  await knex.schema.dropTable('vending_machine_locations');
}
