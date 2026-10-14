import { calculatePricing, formatBRL } from './services/pricingService';
import { INITIAL_STATE } from './constants/defaults';
import { mergeWithInitialState, isValidProjectPayload } from './services/storageService';
import type { CalculatorState } from './types/calculator';

console.log('--- TEST 1: Unit mode initial state ---');
const unitResults = calculatePricing(INITIAL_STATE);
console.log('Unit Material Cost:', formatBRL(unitResults.unitMaterialCost));
console.log('Unit Selling Price:', formatBRL(unitResults.unitSellingPrice));
console.log('Unit Net Profit:', formatBRL(unitResults.unitNetProfit));
console.log('Total Selling Price:', formatBRL(unitResults.totalSellingPrice));
if (unitResults.unitSellingPrice <= 0 || isNaN(unitResults.unitSellingPrice)) {
  throw new Error('Unit selling price is invalid');
}

console.log('--- TEST 2: Kit / Batch Mode ---');
const kitState: CalculatorState = {
  ...INITIAL_STATE,
  productionMode: 'kit',
  kitBatch: {
    itemsPerBatch: 20,
    clientQuantity: 5,
  },
  materialEquip: {
    ...INITIAL_STATE.materialEquip,
    partWeightG: 500, // 500g for batch of 20 => 25g/unit
  },
  timeEnergy: {
    ...INITIAL_STATE.timeEnergy,
    printTimeHours: 10,
    printTimeMinutes: 0, // 10h for batch of 20 => 0.5h/unit
  },
};
const kitResults = calculatePricing(kitState);
console.log('Effective Unit Weight (expected 25g):', kitResults.effectiveUnitWeightG);
console.log('Unit Selling Price:', formatBRL(kitResults.unitSellingPrice));
console.log('Total for Client (5 un):', formatBRL(kitResults.totalSellingPrice));
console.log('Total for Entire Batch (20 un):', formatBRL(kitResults.batchTotalSellingPrice));

if (kitResults.effectiveUnitWeightG !== 25) {
  throw new Error(`Expected 25g but got ${kitResults.effectiveUnitWeightG}`);
}
if (kitResults.quantity !== 5) {
  throw new Error(`Expected client quantity 5 but got ${kitResults.quantity}`);
}
if (Math.abs(kitResults.totalSellingPrice - kitResults.unitSellingPrice * 5) > 0.001) {
  throw new Error('Total selling price does not equal unit selling price * 5');
}

console.log('--- TEST 3: Validation & Merging ---');
const samplePayload = {
  materialEquip: { filamentCostPerKg: 130 },
  timeEnergy: { printTimeHours: 4 },
};
const isValid = isValidProjectPayload(samplePayload);
console.log('Is valid payload:', isValid);
if (!isValid) throw new Error('Validation failed for sample payload');

const merged = mergeWithInitialState(samplePayload, INITIAL_STATE);
console.log('Merged filament cost:', merged.materialEquip.filamentCostPerKg);
console.log('Merged untouched client name:', merged.clientProject.clientName);
if (merged.materialEquip.filamentCostPerKg !== 130) throw new Error('Merged property mismatch');
if (merged.clientProject.clientName !== INITIAL_STATE.clientProject.clientName) {
  throw new Error('Default property lost in merge');
}

console.log('--- ALL AUTOMATED LOGIC TESTS PASSED SUCCESSFULLY! ---');
