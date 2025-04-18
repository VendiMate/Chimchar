/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('location_cities').del();

  // Inserts seed entries
  await knex('location_cities').insert([
    {
      city_id: 'irvine_uci_001',
      name: 'Irvine',
      state_id: 'CA',
      country_id: 'USA',
      description:
        'Home to the University of California, Irvine (UCI). A well-planned city with parks and tech hubs.',
    },
    {
      city_id: 'irvine_spectrum_002',
      name: 'Irvine',
      state_id: 'CA',
      country_id: 'USA',
      description:
        'Near the Irvine Spectrum Center, a popular shopping and entertainment destination.',
    },
    {
      city_id: 'newport_beach_003',
      name: 'Newport Beach',
      state_id: 'CA',
      country_id: 'USA',
      description:
        'A coastal city near Irvine, known for its beaches and luxury living.',
    },
  ]);
}
