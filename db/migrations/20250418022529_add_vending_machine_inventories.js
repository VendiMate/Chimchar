/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('vending_machine_inventories', (table) => {
    table
      .string('id')
      .primary()
      .defaultTo(
        knex.raw(
          "concat('vmi', lpad(floor(random() * 1000000)::text, 6, '0'))",
        ),
      );

    table.string('inventory_id').notNullable();
    table.enum('inventory_type', ['snack', 'drink']).notNullable();
    table.integer('quantity').notNullable();
    table.integer('price').notNullable();
    table.integer('row_number').notNullable();
    table.integer('column_number').notNullable();
    table.string('status').notNullable();
    table.timestamps(true, true);
  });

  // Add check constraint to ensure inventory_id references the correct table based on type
  await knex.raw(`
    CREATE OR REPLACE FUNCTION check_inventory_reference()
    RETURNS TRIGGER AS $$
    BEGIN
      -- Check if the same inventory is already in the same position
      IF EXISTS (
        SELECT 1 FROM vending_machine_inventories 
        WHERE vending_machine_id = NEW.vending_machine_id 
        AND row_number = NEW.row_number 
        AND column_number = NEW.column_number
      ) THEN
        RAISE EXCEPTION 'Position (row_number, column_number) is already occupied in this vending machine';
      END IF;

      -- Check if the inventory exists in the correct table
      IF NEW.inventory_type = 'snack' AND NOT EXISTS (
        SELECT 1 FROM snack_inventories WHERE id = NEW.inventory_id
      ) THEN
        RAISE EXCEPTION 'Invalid snack inventory reference';
      END IF;
      
      IF NEW.inventory_type = 'drink' AND NOT EXISTS (
        SELECT 1 FROM drink_inventories WHERE id = NEW.inventory_id
      ) THEN
        RAISE EXCEPTION 'Invalid drink inventory reference';
      END IF;
      
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER check_inventory_reference_trigger
    BEFORE INSERT OR UPDATE ON vending_machine_inventories
    FOR EACH ROW
    EXECUTE FUNCTION check_inventory_reference();
  `);
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.raw(
    'DROP TRIGGER IF EXISTS check_inventory_reference_trigger ON vending_machine_inventories',
  );
  await knex.raw('DROP FUNCTION IF EXISTS check_inventory_reference');
  await knex.schema.dropTable('vending_machine_inventories');
}
