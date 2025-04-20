/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('vending_machine_inventories').del();

  await knex('vending_machine_inventories').insert([
    {
      id: 'vmi_123456',
      vending_machine_id: 'ven_000001',
      inventory_id: 'sni_123456',
      row_number: 1,
      column_number: 1,
      inventory_type: 'snack',
      quantity: 10,
      price: 10,
      status: 'available',
    },
    {
      id: 'vmi_123457',
      vending_machine_id: 'ven_000001',
      inventory_id: 'sni_123457',
      row_number: 1,
      column_number: 2,
      inventory_type: 'snack',
      quantity: 10,
      price: 10,
      status: 'available',
    },
  ]);
}
