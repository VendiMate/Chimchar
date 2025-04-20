/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // First delete vending machines that reference these cities
  await knex('vending_machines').del();

  // Then delete the cities
  await knex('location_cities').del();

  // Inserts seed entries
  await knex('location_cities').insert([
    {
      id: 'lci_000001',
      name: 'Irvine',
      state_id: 'CA',
      country_id: 'USA',
      description:
        'Home to the University of California, Irvine (UCI). A well-planned city with parks and tech hubs.',
    },
    {
      id: 'lci_000002',
      name: 'Irvine',
      state_id: 'CA',
      country_id: 'USA',
      description:
        'Near the Irvine Spectrum Center, a popular shopping and entertainment destination.',
    },
    {
      id: 'lci_000003',
      name: 'Newport Beach',
      state_id: 'CA',
      country_id: 'USA',
      description:
        'A coastal city near Irvine, known for its beaches and luxury living.',
    },
  ]);
}
