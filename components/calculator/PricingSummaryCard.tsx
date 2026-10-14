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

  return (
    <div className="lg:col-span-4 flex flex-col gap-5 sticky top-24">
      {/* Main Selling Price Card */}
      <div className="bg-white dark:bg-[#141721] rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)] border border-slate-200/90 dark:border-white/[0.08] overflow-hidden transition-colors">
        <div className="p-6 sm:p-7">
          <span className="text-xs sm:text-[13px] font-bold text-slate-500 dark:text-zinc-400 block mb-1.5 tracking-wider uppercase">
            {isKitMode && results.quantity > 1
              ? `Valor a cobrar do cliente (${results.quantity} un)`
              : 'Preço de venda sugerido'}
          </span>

          {/* Big Price Display */}
          <div className="flex items-baseline gap-1.5 my-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">R$</span>
            <span className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white tabular-nums">
              {displayPrice.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            {!isKitMode && results.quantity > 1 && (
              <span className="text-sm font-semibold text-slate-500 dark:text-zinc-400 ml-1">/ un</span>
            )}
          </div>

          {/* Feature Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-6 mt-3.5">
            <span className="px-3.5 py-1 text-xs sm:text-[13px] font-bold bg-[#34C759]/15 dark:bg-[#34C759]/20 text-[#1E7B34] dark:text-[#30D158] rounded-full border border-[#34C759]/30">
              {state.marketRisks.profitMarginPercent}% Margem
            </span>
            <span className="px-3.5 py-1 text-xs sm:text-[13px] font-bold bg-[#0071E3]/15 dark:bg-[#0071E3]/25 text-[#0071E3] dark:text-[#2997FF] rounded-full border border-[#0071E3]/30">
              Taxas Inclusas
            </span>
            {isKitMode && (
              <span className="px-3.5 py-1 text-xs sm:text-[13px] font-bold bg-[#5856D6]/15 dark:bg-[#5856D6]/25 text-[#5856D6] dark:text-[#7D7AFF] rounded-full border border-[#5856D6]/30">
                Fornada ({results.itemsPerBatch} un)
              </span>
            )}
          </div>

          {/* Net Profit & Order Production Cost */}
          <div className="grid grid-cols-2 gap-4 pt-5 border-t border-slate-100 dark:border-white/[0.06]">
            <div>
              <span className="text-xs sm:text-[13px] font-bold text-slate-500 dark:text-zinc-400 block mb-0.5">
                {results.quantity > 1 ? 'Lucro do Pedido' : 'Lucro Líquido'}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-[#248A3D] dark:text-[#30D158] tabular-nums">
                {formatBRL(results.totalNetProfit)}
              </span>
            </div>

            <div>
              <span className="text-xs sm:text-[13px] font-bold text-slate-500 dark:text-zinc-400 block mb-0.5">
                {results.quantity > 1 ? 'Custo do Pedido' : 'Custo Produção'}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tabular-nums">
                {formatBRL(results.totalProductionCost)}
              </span>
            </div>
          </div>

          {/* Breakdown details for Kit/Batch mode */}
          {isKitMode && (
            <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#1B202D] -mx-6 sm:-mx-7 -mb-6 sm:-mb-7 p-4 px-6 sm:px-7 space-y-2 text-xs sm:text-[13px]">
              <div className="flex justify-between items-center text-slate-700 dark:text-zinc-200">
                <span className="text-slate-500 dark:text-zinc-400">Valor unitário da peça:</span>
                <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                  {formatBRL(results.unitSellingPrice)}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-700 dark:text-zinc-200">
                <span className="text-slate-500 dark:text-zinc-400">Valor fornada ({results.itemsPerBatch} un):</span>
                <span className="font-semibold tabular-nums text-slate-900 dark:text-white">
                  {formatBRL(results.batchTotalSellingPrice)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500 dark:text-zinc-400">
                <span>Tempo total de impressão da fornada:</span>
                <span className="font-semibold text-slate-800 dark:text-zinc-200">
                  {state.timeEnergy.printTimeHours}h {state.timeEnergy.printTimeMinutes}m
                </span>
              </div>
            </div>
          )}

          {/* Breakdown for Unit mode with quantity > 1 */}
          {!isKitMode && results.quantity > 1 && (
            <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#1B202D] -mx-6 sm:-mx-7 -mb-6 sm:-mb-7 p-4 px-6 sm:px-7">
              <div className="flex justify-between items-center text-xs sm:text-sm text-slate-700 dark:text-zinc-200 mb-1">
                <span className="text-slate-500 dark:text-zinc-400 font-medium">Total do pedido ({results.quantity} peças):</span>
                <span className="text-base sm:text-lg font-bold text-[#248A3D] dark:text-[#30D158] tabular-nums">
                  {formatBRL(results.totalSellingPrice)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500 dark:text-zinc-400">
                <span>Lucro líquido total:</span>
                <span className="font-bold text-[#1E7B34] dark:text-[#30D158] tabular-nums">
                  {formatBRL(results.totalNetProfit)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Unit Breakdown Card */}
      <div className="bg-white dark:bg-[#141721] rounded-[24px] p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.36)] border border-slate-200/90 dark:border-white/[0.08] transition-colors">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Detalhamento Unitário (por peça)
          </h3>
        </div>

        <div className="space-y-3 text-xs sm:text-sm">
          <div className="flex justify-between items-center text-slate-700 dark:text-zinc-200">
            <span className="text-slate-500 dark:text-zinc-400">Material</span>
            <span className="font-bold text-slate-900 dark:text-white tabular-nums">
              {formatBRL(results.unitMaterialCost)}
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-700 dark:text-zinc-200">
            <span className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400">
              Energia + Depreciação
              <span
                title={`Energia: ${formatBRL(results.unitEnergyCost)} | Depreciação: ${formatBRL(results.unitDepreciationCost)}`}
                className="cursor-help text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <Info className="w-4 h-4" />
              </span>
            </span>
            <span className="font-bold text-slate-900 dark:text-white tabular-nums">
              {formatBRL(results.unitEnergyDepreciationCost)}
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-700 dark:text-zinc-200">
            <span className="text-slate-500 dark:text-zinc-400">Mão de Obra</span>
            <span className="font-bold text-slate-900 dark:text-white tabular-nums">
              {formatBRL(results.unitLaborCost)}
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-700 dark:text-zinc-200">
            <span className="text-slate-500 dark:text-zinc-400">Embalagem + HW</span>
            <span className="font-bold text-slate-900 dark:text-white tabular-nums">
              {formatBRL(results.unitExtrasCost)}
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-700 dark:text-zinc-200">
            <span className="text-slate-500 dark:text-zinc-400">Risco de Falha ({state.marketRisks.failureMarginPercent}%)</span>
            <span className="font-bold text-[#FF9500] dark:text-[#FF9F0A] tabular-nums">
              {formatBRL(results.unitFailureRiskCost)}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06]"></div>

          <div className="flex justify-between items-center text-slate-700 dark:text-zinc-200">
            <div>
              <span className="text-slate-500 dark:text-zinc-400">Taxas Marketplace</span>
              <p className="text-xs text-slate-400 dark:text-zinc-500">
                {state.marketRisks.marketplaceFeePercent}% + {formatBRL(state.marketRisks.marketplaceFixedFee)}
              </p>
            </div>
            <span className="font-bold text-red-500 dark:text-red-400 tabular-nums">
              -{formatBRL(results.unitMarketplaceFee)}
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-700 dark:text-zinc-200">
            <span className="text-slate-500 dark:text-zinc-400">Impostos</span>
            <span className="font-bold text-red-500 dark:text-red-400 tabular-nums">
              -{formatBRL(results.unitTaxAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-col gap-3">
        <button
          onClick={onOpenPdfPreview}
          className="w-full h-12 sm:h-13 bg-[#0071E3] hover:bg-[#0077ED] dark:bg-[#0A84FF] dark:hover:bg-[#2094FF] active:scale-[0.99] text-white rounded-full font-bold text-sm sm:text-base shadow-[0_4px_16px_rgba(0,113,227,0.35)] transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
        >
          <Eye className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-105" />
          <span>Visualizar e Baixar PDF</span>
        </button>

        <button
          onClick={onDirectPdfExport}
          disabled={isExportingPdf}
          className="w-full h-11 sm:h-12 bg-slate-100 hover:bg-slate-200 dark:bg-[#1B202D] dark:hover:bg-[#252B3C] active:scale-[0.99] text-slate-800 dark:text-zinc-100 rounded-full font-semibold text-xs sm:text-sm border border-slate-200 dark:border-white/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          <FileText className="w-4 h-4 text-[#0071E3] dark:text-[#2997FF]" />
          <span>{isExportingPdf ? 'Gerando arquivo PDF...' : 'Baixar PDF Direto'}</span>
        </button>

        <button
          onClick={onCopyWhatsApp}
          className="w-full h-11 sm:h-12 bg-[#34C759]/15 hover:bg-[#34C759]/25 active:scale-[0.99] text-[#1E7B34] dark:text-[#30D158] rounded-full font-semibold text-xs sm:text-sm border border-[#34C759]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {copiedWhatsApp ? (
            <>
              <Check className="w-4 h-4 text-[#1E7B34] dark:text-[#30D158]" />
              <span>Copiado para o WhatsApp!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-[#1E7B34] dark:text-[#30D158]" />
              <span>Copiar Orçamento para WhatsApp</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
