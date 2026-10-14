import type { CalculatorState, CalculationResults } from '../types/calculator';

/**
 * Formata um valor numérico em moeda Real Brasileiro (BRL).
 * @param value Valor numérico em Reais
 * @returns String formatada (ex: "R$ 45,90")
 */
export function formatBRL(value: number): string {
  if (isNaN(value) || !isFinite(value)) return 'R$ 0,00';
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Formata um número no padrão brasileiro com casas decimais configuráveis.
 * @param value Número a formatar
 * @param decimals Quantidade de casas decimais (padrão: 2)
 * @returns String formatada (ex: "1.250,50")
 */
export function formatNumberBR(value: number, decimals: number = 2): string {
  if (isNaN(value) || !isFinite(value)) return '0,00';
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Formata horas decimais em texto legível de horas e minutos.
 * @param totalHours Quantidade de horas decimais (ex: 2.5)
 * @returns Formato "Xh YYm" ou "YY min"
 */
export function formatPrintTime(totalHours: number): string {
  const safeHours = Math.max(0, Number(totalHours) || 0);
  const hours = Math.floor(safeHours);
  const minutes = Math.round((safeHours - hours) * 60);

  if (hours > 0) {
    return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
  }
  return `${minutes} min`;
}

/**
 * Executa o cálculo determinístico de precificação para impressão 3D (FDM / SLA).
 * 
 * Suporta dois modos de produção:
 * - 'unit': Os dados informados correspondem aos insumos de 1 peça única.
 * - 'kit': Os dados informados de peso e tempo correspondem à fornada inteira na mesa,
 *   sendo rateados entre a quantidade de peças da fornada (itemsPerBatch).
 *
 * @param state Estado atual da calculadora com dados de material, máquina, energia, mão de obra e taxas
 * @returns Resultados financeiros unitários e totais do pedido do cliente
 */
export function calculatePricing(state: CalculatorState): CalculationResults {
  const {
    productionMode = 'unit',
    kitBatch = { itemsPerBatch: 20, clientQuantity: 1 },
    materialEquip,
    timeEnergy,
    workExtras,
    marketRisks,
    clientProject,
  } = state;

  const isKitMode = productionMode === 'kit';
  const itemsPerBatch = Math.max(1, Math.round(kitBatch?.itemsPerBatch || 1));
  const clientQuantity = Math.max(
    1,
    Math.round(isKitMode ? kitBatch?.clientQuantity || 1 : clientProject?.quantity || 1)
  );

  // 1. Cálculo de tempo de impressão
  const rawPrintHours = Math.max(0, Number(timeEnergy.printTimeHours) || 0);
  const rawPrintMinutes = Math.max(0, Number(timeEnergy.printTimeMinutes) || 0);
  const totalEnteredHours = rawPrintHours + rawPrintMinutes / 60;

  // No modo kit, o tempo informado é da fornada inteira -> rateio por peça
  const unitPrintHoursTotal = isKitMode
    ? totalEnteredHours / itemsPerBatch
    : totalEnteredHours;

  // 2. Cálculo de peso do filamento
  const rawWeight = Math.max(0, Number(materialEquip.partWeightG) || 0);
  const effectiveUnitWeightG = isKitMode ? rawWeight / itemsPerBatch : rawWeight;

  // 3. Custo de Material (Unitário)
  // Fórmula: (peso_g / 1000) * custo_por_kg
  const filamentCost = Math.max(0, Number(materialEquip.filamentCostPerKg) || 0);
  const unitMaterialCost = (effectiveUnitWeightG / 1000) * filamentCost;

  // 4. Energia Elétrica e Depreciação do Equipamento (Unitário)
  // Consumo Energia: (potência_W / 1000) * horas_impressao * preco_kWh
  const powerWatts = Math.max(0, Number(timeEnergy.avgPowerWatts) || 0);
  const energyKwhPrice = Math.max(0, Number(timeEnergy.energyCostKwh) || 0);
  const unitEnergyCost = (powerWatts / 1000) * unitPrintHoursTotal * energyKwhPrice;

  // Depreciação: (valor_impressora / vida_util_horas) * horas_impressao
  const printerVal = Math.max(0, Number(materialEquip.printerValue) || 0);
  const lifespanH = Math.max(1, Number(materialEquip.lifespanHours) || 1);
  const hourlyDepreciation = printerVal / lifespanH;
  const unitDepreciationCost = hourlyDepreciation * unitPrintHoursTotal;
  const unitEnergyDepreciationCost = unitEnergyCost + unitDepreciationCost;

  // 5. Custo de Mão de Obra (Unitário)
  // Fórmula: (minutos_prep / 60) * valor_hora
  const rawPrepMinutes = Math.max(0, Number(workExtras.prepTimeMinutes) || 0);
  const unitPrepMinutes = isKitMode ? rawPrepMinutes / itemsPerBatch : rawPrepMinutes;
  const laborHourlyRate = Math.max(0, Number(workExtras.workHourlyRate) || 0);
  const unitLaborCost = (unitPrepMinutes / 60) * laborHourlyRate;

  // 6. Insumos Extras e Embalagem (Unitário)
  // Embalagem é rateada pelo tamanho do pedido do cliente; hardware é unitário
  const packagingTotal = Math.max(0, Number(workExtras.packagingCost) || 0);
  const unitPackaging = clientQuantity > 0 ? packagingTotal / clientQuantity : packagingTotal;
  const unitHardware = Math.max(0, Number(workExtras.extraHardwareCost) || 0);
  const unitExtrasCost = unitPackaging + unitHardware;

  // 7. Custo de Produção Base (Unitário, sem risco)
  const unitBaseCost =
    unitMaterialCost + unitEnergyCost + unitDepreciationCost + unitLaborCost + unitExtrasCost;

  // 8. Margem de Risco de Falha
  // Fórmula: custo_base * (falha_% / 100)
  const failurePercent = Math.max(0, Number(marketRisks.failureMarginPercent) || 0);
  const unitFailureRiskCost = unitBaseCost * (failurePercent / 100);

  // 9. Custo Total de Produção (Unitário)
  const unitProductionCost = unitBaseCost + unitFailureRiskCost;

  // 10. Lucro Líquido Desejado (Unitário)
  const profitMarginPercent = Math.max(0, Number(marketRisks.profitMarginPercent) || 0);
  const unitNetProfit = unitProductionCost * (profitMarginPercent / 100);

  // 11. Deduções de Marketplace e Impostos
  const marketplacePercent = Math.max(0, Number(marketRisks.marketplaceFeePercent) || 0);
  const fixedFee = Math.max(0, Number(marketRisks.marketplaceFixedFee) || 0);
  const unitFixedFee = clientQuantity > 0 ? fixedFee / clientQuantity : fixedFee;
  const taxPercent = Math.max(0, Number(marketRisks.taxPercent) || 0);

  // Preço de venda com mark-up sobre preço final (dedução por fora)
  // PreçoVenda = (CustoUnitário + LucroUnitário + TaxaFixa) / (1 - (TaxaMarketplace% + Imposto%) / 100)
  const deductionsRate = (marketplacePercent + taxPercent) / 100;
  const targetBaseWithProfit = unitProductionCost + unitNetProfit + unitFixedFee;

  let unitSellingPrice = 0;
  if (deductionsRate >= 0.99) {
    unitSellingPrice = targetBaseWithProfit * 2;
  } else {
    unitSellingPrice = targetBaseWithProfit / (1 - deductionsRate);
  }

  const unitMarketplaceFee = unitSellingPrice * (marketplacePercent / 100) + unitFixedFee;
  const unitTaxAmount = unitSellingPrice * (taxPercent / 100);

  // 12. Totais para o Pedido do Cliente
  const totalProductionCost = unitProductionCost * clientQuantity;
  const totalNetProfit = unitNetProfit * clientQuantity;
  const totalSellingPrice = unitSellingPrice * clientQuantity;
  const totalPrintTimeHours = unitPrintHoursTotal * clientQuantity;
  const totalPrintTimeFormatted = formatPrintTime(totalPrintTimeHours);
  const effectiveUnitPrintTimeFormatted = formatPrintTime(unitPrintHoursTotal);

  // 13. Totais da Fornada Completa (Mesa inteira)
  const batchTotalSellingPrice = unitSellingPrice * itemsPerBatch;
  const batchTotalProductionCost = unitProductionCost * itemsPerBatch;
  const batchTotalNetProfit = unitNetProfit * itemsPerBatch;

  return {
    isKitMode,
    itemsPerBatch,
    clientQuantity,
    effectiveUnitWeightG,
    effectiveUnitPrintTimeFormatted,

    unitMaterialCost,
    unitEnergyCost,
    unitDepreciationCost,
    unitEnergyDepreciationCost,
    unitLaborCost,
    unitExtrasCost,
    unitFailureRiskCost,
    unitProductionCost,
    unitNetProfit,
    unitSellingPrice,
    unitMarketplaceFee,
    unitTaxAmount,

    quantity: clientQuantity,
    totalProductionCost,
    totalNetProfit,
    totalSellingPrice,
    totalPrintTimeHours,
    totalPrintTimeFormatted,

    batchTotalSellingPrice,
    batchTotalProductionCost,
    batchTotalNetProfit,
  };
}
