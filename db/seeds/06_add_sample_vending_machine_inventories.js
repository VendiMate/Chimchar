/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('vending_machine_inventories').del();

  // Inserts seed entries
  await knex('vending_machine_inventories').insert([
    {
      id: 'vmi813968',
      inventory_id: 'sni_123456',
      inventory_type: 'snack',
      quantity: 10,
      price: 5,
      row_number: 1,
      column_number: 2,
      status: 'active',
      created_at: '2025-07-15 05:45:27.198383+00',
      updated_at: '2025-07-15 05:45:27.198383+00',
      vending_machine_id: 'ven_00001'
    }
  ]);
} 