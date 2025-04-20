/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('snack_inventories').del();

  await knex('snack_inventories').insert([
    {
      id: 'sni_123456',
      name: 'Snack 1',
      default_price: 10,
      image_url: 'https://example.com/snack1.jpg',
    },
    {
      id: 'sni_123457',
      name: 'Snack 2',
      default_price: 20,
      image_url: 'https://example.com/snack2.jpg',
    },
  ]);
}
