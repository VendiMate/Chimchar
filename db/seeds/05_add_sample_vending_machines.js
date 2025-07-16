/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // First delete vending machine inventories that reference vending machines
  await knex('vending_machine_inventories').del();

  // Then delete existing vending machines
  await knex('vending_machines').del();

  // Inserts seed entries
  await knex('vending_machines').insert([
    {
      id: 'ven_00001',
      name: 'Vending Machine 1',
      city_id: 'lci_000001',
      x_coordinate: '33.6405',
      y_coordinate: '-117.8443',
      z_coordinate: null,
      description: 'Sample'
    },
    {
      id: 'ven_00002',
      name: 'Vending Machine 2',
      city_id: 'lci_000002',
      x_coordinate: '33.6509',
      y_coordinate: '-117.7447',
      z_coordinate: null,
      description: 'Another sample vending machine'
    }
  ]);
} 