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
  const marginPresets = [30, 50, 80, 100, 150, 200];

  return (
    <section className="bg-white dark:bg-[#1C1C1E] rounded-[22px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] border border-black/[0.06] dark:border-white/[0.08] hover:border-black/[0.1] dark:hover:border-white/[0.14] hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)] focus-within:border-[#0071E3]/40 focus-within:shadow-[0_8px_30px_rgba(0,113,227,0.06)] transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between mb-5 border-b border-black/[0.05] dark:border-white/[0.06] pb-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-[#34C759]/10 text-[#248A3D] dark:text-[#30D158] flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-[17px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
                Mercado e Riscos
              </h2>
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-3.5">
          <div>
            <InputField
              label="Margem de Lucro Desejada"
              value={marketRisks.profitMarginPercent}
              onChange={(v) => onUpdateMarketRisks({ profitMarginPercent: v })}
              suffix="%"
            />

            {/* Quick Profit Margin Presets (Fast UX) */}
            <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-0.5">
              <span className="text-[11px] text-[#86868B] font-medium mr-1 shrink-0">Meta:</span>
              {marginPresets.map((pct) => {
                const isActive = marketRisks.profitMarginPercent === pct;
                return (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => onUpdateMarketRisks({ profitMarginPercent: pct })}
                    className={`px-2.5 py-1 rounded-full text-[11px] transition-all duration-200 active:scale-95 cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-[#34C759] text-white font-medium shadow-sm'
                        : 'bg-[#F5F5F7] dark:bg-[#2C2C2E] hover:bg-[#E5E5EA] dark:hover:bg-[#38383A] text-[#1D1D1F] dark:text-[#F5F5F7] border border-black/[0.04] dark:border-white/[0.06]'
                    }`}
                  >
                    {pct}%
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
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

          <div className="grid grid-cols-2 gap-3.5">
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
      <div className="mt-5 pt-4 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between text-[13px] text-[#86868B]">
        <span>Risco de Falha p/ peça:</span>
        <span className="font-semibold text-[#FF9500] tabular-nums">
          {formatBRL(results.unitFailureRiskCost)}
        </span>
      </div>
    </section>
  );
};
