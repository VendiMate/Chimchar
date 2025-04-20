/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('vending_machines').del();

  // Inserts seed entries
  await knex('vending_machines').insert([
    {
      id: 'ven_000001',
      name: 'Vending Machine 1',
      city_id: 'lci_000001',
      x_coordinate: '33.6493',
      y_coordinate: '-117.8427',
      z_coordinate: null,
      description:
        'Vending machine located at the UCI Student Center with snacks and drinks.',
    },
    {
      id: 'ven_000002',
      name: 'Vending Machine 2',
      city_id: 'lci_000002',
      x_coordinate: '33.6501',
      y_coordinate: '-117.7445',
      z_coordinate: null,
      description:
        'Vending machine near the Irvine Spectrum Center, offering cold beverages and chips.',
    },
    {
      id: 'ven_000003',
      name: 'Vending Machine 3',
      city_id: 'lci_000003',
      x_coordinate: '33.6095',
      y_coordinate: '-117.9280',
      z_coordinate: null,
      description:
        'Beachside vending machine with sunscreen, snacks, and energy drinks.',
    },
  ]);
}
