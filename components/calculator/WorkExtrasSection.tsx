import React from 'react';
import { Clock } from 'lucide-react';
import type { WorkExtrasData, CalculationResults } from '../../types/calculator';
import { formatBRL } from '../../services/pricingService';
import { InputField } from '../InputField';

export interface WorkExtrasSectionProps {
  workExtras: WorkExtrasData;
  results: CalculationResults;
  isKitMode: boolean;
  onUpdateWorkExtras: (patch: Partial<WorkExtrasData>) => void;
}

export const WorkExtrasSection: React.FC<WorkExtrasSectionProps> = ({
  workExtras,
  results,
  isKitMode,
  onUpdateWorkExtras,
}) => {
  const prepLaborCost = ((workExtras.prepTimeMinutes / 60) * workExtras.workHourlyRate).toFixed(2);

  return (
    <section className="bg-white dark:bg-[#1C1C1E] rounded-[22px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] border border-black/[0.06] dark:border-white/[0.08] hover:border-black/[0.1] dark:hover:border-white/[0.14] hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)] focus-within:border-[#5856D6]/40 focus-within:shadow-[0_8px_30px_rgba(88,86,214,0.06)] transition-all duration-300">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between mb-3.5 border-b border-black/[0.05] dark:border-white/[0.06] pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-[#5856D6]/10 text-[#5856D6] flex items-center justify-center shrink-0">
              <Clock className="w-3.5 h-3.5" />
            </span>
            <div>
              <h2 className="text-[16px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
                Trabalho e Extras
              </h2>
            </div>
          </div>
          <span className="text-[11px] font-medium text-[#86868B] bg-[#F5F5F7] dark:bg-[#2C2C2E] px-2.5 py-0.5 rounded-full border border-black/[0.04] dark:border-white/[0.06] transition-colors">
            Prep: R$ {prepLaborCost}
          </span>
        </div>

        {/* 4 Inputs */}
        <div className="grid grid-cols-2 gap-2.5">
          <InputField
            label="Valor Hora Trabalho"
            value={workExtras.workHourlyRate}
            onChange={(v) => onUpdateWorkExtras({ workHourlyRate: v })}
            suffix="R$/h"
          />

          <InputField
            label={isKitMode ? 'Prep. Mesa / Fornada' : 'Tempo Prep. Unitário'}
            value={workExtras.prepTimeMinutes}
            onChange={(v) => onUpdateWorkExtras({ prepTimeMinutes: v })}
            suffix="min"
          />

          <InputField
            label="Embalagem Total"
            value={workExtras.packagingCost}
            onChange={(v) => onUpdateWorkExtras({ packagingCost: v })}
            suffix="R$"
          />

          <InputField
            label="Hardware por Peça"
            value={workExtras.extraHardwareCost}
            onChange={(v) => onUpdateWorkExtras({ extraHardwareCost: v })}
            suffix="R$"
          />
        </div>
      </div>

      {/* Card Footer Summary */}
      <div className="mt-3.5 pt-3 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between text-[12px] sm:text-[13px] text-[#86868B]">
        <span>Mão de Obra + Extras (p/ peça):</span>
        <span className="font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums">
          {formatBRL(results.unitLaborCost + results.unitExtrasCost)}
        </span>
      </div>
    </section>
  );
};
