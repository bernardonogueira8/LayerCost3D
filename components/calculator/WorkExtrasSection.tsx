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
  return (
    <section className="bg-white dark:bg-[#141721] rounded-[24px] p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.36)] border border-slate-200/90 dark:border-white/[0.08] flex flex-col justify-between transition-colors">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between mb-5 border-b border-slate-100 dark:border-white/[0.06] pb-4">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-[#5856D6]/10 dark:bg-[#5856D6]/20 text-[#5856D6] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Trabalho e Extras
              </h2>
            </div>
          </div>
        </div>

        {/* 4 Inputs */}
        <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
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
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
        <span className="font-medium">Mão de Obra + Extras (p/ peça):</span>
        <span className="font-bold text-slate-900 dark:text-white text-base sm:text-lg tabular-nums">
          {formatBRL(results.unitLaborCost + results.unitExtrasCost)}
        </span>
      </div>
    </section>
  );
};
