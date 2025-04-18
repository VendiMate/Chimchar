/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('vending_machine_locations').del();

  // Inserts seed entries
  await knex('vending_machine_locations').insert([
    {
      id: 'loc_000001',
      name: 'UCI Student Center Vending',
      city_id: 'irvine_uci_001',
      x_coordinate: '33.6493',
      y_coordinate: '-117.8427',
      z_coordinate: null,
      description:
        'Vending machine located at the UCI Student Center with snacks and drinks.',
    },
    {
      id: 'loc_000002',
      name: 'Irvine Spectrum Snack Hub',
      city_id: 'irvine_spectrum_002',
      x_coordinate: '33.6501',
      y_coordinate: '-117.7445',
      z_coordinate: null,
      description:
        'Vending machine near the Irvine Spectrum Center, offering cold beverages and chips.',
    },
    {
      id: 'loc_000003',
      name: 'Newport Beach Boardwalk Vending',
      city_id: 'newport_beach_003',
      x_coordinate: '33.6095',
      y_coordinate: '-117.9280',
      z_coordinate: null,
      description:
        'Beachside vending machine with sunscreen, snacks, and energy drinks.',
    },
  ]);
}
