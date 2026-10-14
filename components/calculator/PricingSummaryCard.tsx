import React from 'react';
import { Eye, FileText, Share2, Check, Info } from 'lucide-react';
import type { CalculatorState, CalculationResults } from '../../types/calculator';
import { formatBRL } from '../../services/pricingService';

export interface PricingSummaryCardProps {
  state: CalculatorState;
  results: CalculationResults;
  isKitMode: boolean;
  isExportingPdf: boolean;
  copiedWhatsApp: boolean;
  onOpenPdfPreview: () => void;
  onDirectPdfExport: () => void;
  onCopyWhatsApp: () => void;
}

export const PricingSummaryCard: React.FC<PricingSummaryCardProps> = ({
  state,
  results,
  isKitMode,
  isExportingPdf,
  copiedWhatsApp,
  onOpenPdfPreview,
  onDirectPdfExport,
  onCopyWhatsApp,
}) => {
  const displayPrice = isKitMode && results.quantity > 1
    ? results.totalSellingPrice
    : results.unitSellingPrice;

  // Cálculo proporcional de custos para a barra visual dinâmica (Frontend Design)
  const totalBase = Math.max(0.01, results.unitSellingPrice);
  const matPct = Math.min(100, Math.round((results.unitMaterialCost / totalBase) * 100));
  const energyPct = Math.min(100 - matPct, Math.round((results.unitEnergyDepreciationCost / totalBase) * 100));
  const laborPct = Math.min(100 - matPct - energyPct, Math.round(((results.unitLaborCost + results.unitExtrasCost) / totalBase) * 100));
  const feesPct = Math.min(100 - matPct - energyPct - laborPct, Math.round(((results.unitMarketplaceFee + results.unitTaxAmount + results.unitFailureRiskCost) / totalBase) * 100));
  const profitPct = Math.max(0, 100 - matPct - energyPct - laborPct - feesPct);

  return (
    <div className="lg:col-span-4 flex flex-col gap-5 sticky top-24">
      {/* Main Selling Price Card */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)] dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] border border-black/[0.06] dark:border-white/[0.08] hover:border-black/[0.1] dark:hover:border-white/[0.14] overflow-hidden transition-all duration-300">
        <div className="p-6 sm:p-7">
          <span className="text-[12px] font-medium text-[#86868B] block mb-1">
            {isKitMode && results.quantity > 1
              ? `Valor a cobrar do cliente (${results.quantity} un)`
              : 'Preço de venda sugerido'}
          </span>

          {/* Big Price Display with smooth counter feel */}
          <div className="flex items-baseline gap-1.5 my-2">
            <span className="text-2xl font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">R$</span>
            <span className="text-4xl sm:text-5xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums transition-all">
              {displayPrice.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            {!isKitMode && results.quantity > 1 && (
              <span className="text-[13px] text-[#86868B] font-medium ml-1">/ un</span>
            )}
          </div>

          {/* Feature Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-5 mt-3">
            <span className="px-3 py-1 text-[12px] font-medium bg-[#34C759]/10 text-[#248A3D] dark:text-[#30D158] rounded-full border border-[#34C759]/20 transition-all">
              {state.marketRisks.profitMarginPercent}% Margem
            </span>
            <span className="px-3 py-1 text-[12px] font-medium bg-[#0071E3]/10 text-[#0071E3] dark:text-[#2997FF] rounded-full border border-[#0071E3]/20 transition-all">
              Taxas Inclusas
            </span>
            {isKitMode && (
              <span className="px-3 py-1 text-[12px] font-medium bg-[#5856D6]/10 text-[#5856D6] dark:text-[#5E5CE6] rounded-full border border-[#5856D6]/20 transition-all">
                Fornada ({results.itemsPerBatch} un)
              </span>
            )}
          </div>

          {/* Net Profit & Order Production Cost */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-black/[0.05] dark:border-white/[0.06]">
            <div>
              <span className="text-[11px] font-medium text-[#86868B] block mb-0.5">
                {results.quantity > 1 ? 'Lucro do Pedido' : 'Lucro Líquido'}
              </span>
              <span className="text-2xl font-bold text-[#34C759] dark:text-[#30D158] tabular-nums transition-colors">
                {formatBRL(results.totalNetProfit)}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-medium text-[#86868B] block mb-0.5">
                {results.quantity > 1 ? 'Custo do Pedido' : 'Custo Produção'}
              </span>
              <span className="text-2xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums transition-colors">
                {formatBRL(results.totalProductionCost)}
              </span>
            </div>
          </div>

          {/* Animated Cost Composition Bar (Frontend Design & Visual Delight) */}
          <div className="mt-5 pt-4 border-t border-black/[0.05] dark:border-white/[0.06]">
            <div className="flex justify-between items-center text-[11px] font-medium text-[#86868B] mb-2">
              <span>Composição Visual do Preço</span>
              <span className="text-[#34C759] dark:text-[#30D158] font-semibold">{profitPct}% margem líquida</span>
            </div>

            {/* Micro Multi-Segment Progress Bar */}
            <div className="h-2 w-full bg-[#E5E5EA] dark:bg-[#2C2C2E] rounded-full overflow-hidden flex gap-[2px] p-[1.5px]">
              {matPct > 0 && (
                <div
                  style={{ width: `${matPct}%` }}
                  className="h-full bg-[#0071E3] dark:bg-[#2997FF] rounded-full transition-all duration-500 ease-out"
                  title={`Material: ${matPct}% (${formatBRL(results.unitMaterialCost)})`}
                />
              )}
              {energyPct > 0 && (
                <div
                  style={{ width: `${energyPct}%` }}
                  className="h-full bg-[#FF9500] rounded-full transition-all duration-500 ease-out"
                  title={`Energia + Deprec.: ${energyPct}% (${formatBRL(results.unitEnergyDepreciationCost)})`}
                />
              )}
              {laborPct > 0 && (
                <div
                  style={{ width: `${laborPct}%` }}
                  className="h-full bg-[#5856D6] dark:bg-[#5E5CE6] rounded-full transition-all duration-500 ease-out"
                  title={`Mão de Obra + HW: ${laborPct}% (${formatBRL(results.unitLaborCost + results.unitExtrasCost)})`}
                />
              )}
              {feesPct > 0 && (
                <div
                  style={{ width: `${feesPct}%` }}
                  className="h-full bg-[#FF3B30] rounded-full transition-all duration-500 ease-out"
                  title={`Taxas + Risco: ${feesPct}%`}
                />
              )}
              {profitPct > 0 && (
                <div
                  style={{ width: `${profitPct}%` }}
                  className="h-full bg-[#34C759] dark:bg-[#30D158] rounded-full transition-all duration-500 ease-out"
                  title={`Lucro Líquido: ${profitPct}% (${formatBRL(results.unitNetProfit)})`}
                />
              )}
            </div>

            {/* Interactive Micro Legend */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-[10px] text-[#86868B] mt-2 select-none">
              <span className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full bg-[#0071E3] dark:bg-[#2997FF] shrink-0"></span> Mat {matPct}%
              </span>
              <span className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full bg-[#FF9500] shrink-0"></span> Luz/Meq {energyPct}%
              </span>
              <span className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full bg-[#5856D6] dark:bg-[#5E5CE6] shrink-0"></span> M.O. {laborPct}%
              </span>
              <span className="flex items-center gap-1.5 truncate font-semibold text-[#248A3D] dark:text-[#30D158]">
                <span className="w-2 h-2 rounded-full bg-[#34C759] dark:bg-[#30D158] shrink-0"></span> Lucro {profitPct}%
              </span>
            </div>
          </div>

          {/* Breakdown details for Kit/Batch mode */}
          {isKitMode && (
            <div className="mt-5 pt-3.5 border-t border-black/[0.05] dark:border-white/[0.06] bg-[#F5F5F7] dark:bg-[#2C2C2E]/60 -mx-6 sm:-mx-7 -mb-6 sm:-mb-7 p-4 px-6 sm:px-7 space-y-2 text-[13px] animate-in fade-in duration-200">
              <div className="flex justify-between items-center text-[#1D1D1F] dark:text-[#F5F5F7]">
                <span className="text-[#86868B]">Valor unitário da peça:</span>
                <span className="font-semibold tabular-nums">
                  {formatBRL(results.unitSellingPrice)}
                </span>
              </div>
              <div className="flex justify-between items-center text-[#1D1D1F] dark:text-[#F5F5F7]">
                <span className="text-[#86868B]">Valor fornada inteira ({results.itemsPerBatch} un):</span>
                <span className="font-medium tabular-nums">
                  {formatBRL(results.batchTotalSellingPrice)}
                </span>
              </div>
              <div className="flex justify-between items-center text-[12px] text-[#86868B]">
                <span>Tempo de impressão da fornada:</span>
                <span className="font-medium text-[#1D1D1F] dark:text-[#F5F5F7]">
                  {state.timeEnergy.printTimeHours}h {state.timeEnergy.printTimeMinutes}m
                </span>
              </div>
            </div>
          )}

          {/* Breakdown for Unit mode with quantity > 1 */}
          {!isKitMode && results.quantity > 1 && (
            <div className="mt-5 pt-3.5 border-t border-black/[0.05] dark:border-white/[0.06] bg-[#F5F5F7] dark:bg-[#2C2C2E]/60 -mx-6 sm:-mx-7 -mb-6 sm:-mb-7 p-4 px-6 sm:px-7 animate-in fade-in duration-200">
              <div className="flex justify-between items-center text-[13px] text-[#1D1D1F] dark:text-[#F5F5F7] mb-1">
                <span className="text-[#86868B]">Total do pedido ({results.quantity} peças):</span>
                <span className="text-base font-bold text-[#34C759] dark:text-[#30D158] tabular-nums">
                  {formatBRL(results.totalSellingPrice)}
                </span>
              </div>
              <div className="flex justify-between items-center text-[12px] text-[#86868B]">
                <span>Lucro líquido total:</span>
                <span className="font-semibold text-[#248A3D] dark:text-[#30D158] tabular-nums">
                  {formatBRL(results.totalNetProfit)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Unit Breakdown Card with subtle elevation */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-[24px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_6px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_8px_28px_rgba(0,0,0,0.5)] border border-black/[0.06] dark:border-white/[0.08] hover:border-black/[0.1] dark:hover:border-white/[0.14] transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[14px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
            Detalhamento Unitário
          </h3>
          <span className="text-[11px] text-[#86868B] font-medium">por peça</span>
        </div>

        <div className="space-y-2.5 text-[13px]">
          <div className="flex justify-between items-center text-[#1D1D1F] dark:text-[#F5F5F7]">
            <span className="text-[#86868B]">Material</span>
            <span className="font-medium tabular-nums">
              {formatBRL(results.unitMaterialCost)}
            </span>
          </div>

          <div className="flex justify-between items-center text-[#1D1D1F] dark:text-[#F5F5F7]">
            <span className="flex items-center gap-1 text-[#86868B]">
              Energia + Depreciação
              <span
                title={`Energia: ${formatBRL(results.unitEnergyCost)} | Depreciação: ${formatBRL(results.unitDepreciationCost)}`}
                className="cursor-help text-[#86868B]/80 hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors"
              >
                <Info className="w-3.5 h-3.5" />
              </span>
            </span>
            <span className="font-medium tabular-nums">
              {formatBRL(results.unitEnergyDepreciationCost)}
            </span>
          </div>

          <div className="flex justify-between items-center text-[#1D1D1F] dark:text-[#F5F5F7]">
            <span className="text-[#86868B]">Mão de Obra</span>
            <span className="font-medium tabular-nums">
              {formatBRL(results.unitLaborCost)}
            </span>
          </div>

          <div className="flex justify-between items-center text-[#1D1D1F] dark:text-[#F5F5F7]">
            <span className="text-[#86868B]">Embalagem + HW</span>
            <span className="font-medium tabular-nums">
              {formatBRL(results.unitExtrasCost)}
            </span>
          </div>

          <div className="flex justify-between items-center text-[#1D1D1F] dark:text-[#F5F5F7]">
            <span className="text-[#86868B]">Risco de Falha ({state.marketRisks.failureMarginPercent}%)</span>
            <span className="font-medium text-[#FF9500] tabular-nums">
              {formatBRL(results.unitFailureRiskCost)}
            </span>
          </div>

          <div className="pt-2 border-t border-black/[0.05] dark:border-white/[0.06]"></div>

          <div className="flex justify-between items-center text-[#1D1D1F] dark:text-[#F5F5F7]">
            <div>
              <span className="text-[#86868B]">Taxas Marketplace</span>
              <p className="text-[11px] text-[#86868B]/70">
                {state.marketRisks.marketplaceFeePercent}% + {formatBRL(state.marketRisks.marketplaceFixedFee)}
              </p>
            </div>
            <span className="font-medium text-[#FF3B30] tabular-nums">
              -{formatBRL(results.unitMarketplaceFee)}
            </span>
          </div>

          <div className="flex justify-between items-center text-[#1D1D1F] dark:text-[#F5F5F7]">
            <span className="text-[#86868B]">Impostos</span>
            <span className="font-medium text-[#FF3B30] tabular-nums">
              -{formatBRL(results.unitTaxAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons with Apple tactile micro-animations */}
      <div className="flex flex-col gap-2.5">
        <button
          onClick={onOpenPdfPreview}
          className="w-full h-12 bg-[#0071E3] hover:bg-[#0077ED] active:scale-[0.98] text-white rounded-full font-medium text-[14px] shadow-[0_2px_8px_rgba(0,113,227,0.25)] hover:shadow-[0_4px_16px_rgba(0,113,227,0.35)] transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
        >
          <Eye className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
          <span>Visualizar e Baixar PDF</span>
        </button>

        <button
          onClick={onDirectPdfExport}
          disabled={isExportingPdf}
          className="w-full h-11 bg-[#F5F5F7] dark:bg-[#2C2C2E] hover:bg-[#E8E8ED] dark:hover:bg-[#38383A] active:scale-[0.98] text-[#1D1D1F] dark:text-[#F5F5F7] rounded-full font-medium text-[13px] border border-black/[0.06] dark:border-white/[0.08] hover:border-black/[0.1] dark:hover:border-white/[0.14] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          <FileText className="w-4 h-4 text-[#0071E3] dark:text-[#2997FF] transition-transform duration-200 group-hover:scale-105" />
          <span>{isExportingPdf ? 'Gerando arquivo PDF...' : 'Baixar PDF Direto'}</span>
        </button>

        <button
          onClick={onCopyWhatsApp}
          className="w-full h-11 bg-[#34C759]/10 hover:bg-[#34C759]/20 active:scale-[0.98] text-[#248A3D] dark:text-[#30D158] rounded-full font-medium text-[13px] border border-[#34C759]/25 hover:border-[#34C759]/40 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer group"
        >
          {copiedWhatsApp ? (
            <>
              <Check className="w-4 h-4 text-[#248A3D] dark:text-[#30D158] animate-in zoom-in-75 duration-150" />
              <span>Copiado para o WhatsApp!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-[#248A3D] dark:text-[#30D158] transition-transform duration-200 group-hover:scale-110" />
              <span>Copiar Orçamento para WhatsApp</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
