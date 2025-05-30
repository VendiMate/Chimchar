import logger from '../../../../src/utils/logger.js';
import db from '../../../../db/index.js';
/**
 * Validates if a vending machine slot exists with the given parameters.
 * Returns the full inventory row if found, otherwise throws an error.
 */
export async function validateDispenseParams(params) {
  const { vendingMachineId, rowNumber, columnNumber } = params;
  if (!vendingMachineId || rowNumber == null || columnNumber == null) {
    throw new Error('Missing or invalid parameters');
  }

  const slot = await db('vending_machine_inventories')
    .where({
      vending_machine_id: vendingMachineId,
      row_number: rowNumber,
      column_number: columnNumber,
    })
    .first();
  if (!slot) {
    logger.error('Vending machine slot not found', {
      vendingMachineId,
      rowNumber,
      columnNumber,
    });
    throw new Error('Vending machine slot not found');
  }

  return slot;
}

/**
 * Retrieves the inventory ID for a given vending machine slot.
 */
export async function getInventoryId(
  vendingMachineId,
  rowNumber,
  columnNumber,
) {
  const slot = await validateDispenseParams({
    vendingMachineId,
    rowNumber,
    columnNumber,
  });
  return slot.inventory_id;
}
