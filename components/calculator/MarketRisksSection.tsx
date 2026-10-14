import React from 'react';
import { TrendingUp } from 'lucide-react';
import type { MarketRisksData, CalculationResults } from '../../types/calculator';
import { formatBRL } from '../../services/pricingService';
import { InputField } from '../InputField';

export interface MarketRisksSectionProps {
  marketRisks: MarketRisksData;
  results: CalculationResults;
  onUpdateMarketRisks: (patch: Partial<MarketRisksData>) => void;
}

export const MarketRisksSection: React.FC<MarketRisksSectionProps> = ({
  marketRisks,
  results,
  onUpdateMarketRisks,
}) => {
  return (
    <section className="bg-white dark:bg-[#141721] rounded-[24px] p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.36)] border border-slate-200/90 dark:border-white/[0.08] flex flex-col justify-between transition-colors">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between mb-5 border-b border-slate-100 dark:border-white/[0.06] pb-4">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-[#34C759]/10 dark:bg-[#34C759]/20 text-[#248A3D] dark:text-[#30D158] flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Mercado e Riscos
              </h2>
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <InputField
            label="Margem de Lucro Desejada"
            value={marketRisks.profitMarginPercent}
            onChange={(v) => onUpdateMarketRisks({ profitMarginPercent: v })}
            suffix="%"
          />

          <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
            <InputField
              label="Taxa Marketplace %"
              value={marketRisks.marketplaceFeePercent}
              onChange={(v) => onUpdateMarketRisks({ marketplaceFeePercent: v })}
              suffix="%"
            />

            <InputField
              label="Taxa Fixa Marketplace"
              value={marketRisks.marketplaceFixedFee}
              onChange={(v) => onUpdateMarketRisks({ marketplaceFixedFee: v })}
              suffix="R$"
            />
          </div>

          <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
            <InputField
              label="Impostos (MEI)"
              value={marketRisks.taxPercent}
              onChange={(v) => onUpdateMarketRisks({ taxPercent: v })}
              suffix="%"
            />

            <InputField
              label="Margem de Falha"
              value={marketRisks.failureMarginPercent}
              onChange={(v) => onUpdateMarketRisks({ failureMarginPercent: v })}
              suffix="%"
            />
          </div>
        </div>
      </div>

      {/* Card Footer Summary */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
        <span className="font-medium">Risco de Falha p/ peça:</span>
        <span className="font-bold text-[#FF9500] dark:text-[#FF9F0A] text-base sm:text-lg tabular-nums">
          {formatBRL(results.unitFailureRiskCost)}
        </span>
      </div>
    </section>
  );
};
