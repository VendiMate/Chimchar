/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.alterTable('vending_machine_locations', (table) => {
    table.string('vending_machine_id').notNullable();
    table.foreign('vending_machine_id').references('vending_machines.id');
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.alterTable('vending_machine_locations', (table) => {
    table.dropForeign('vending_machine_id');
    table.dropColumn('vending_machine_id');
  });
}
