import React from 'react';
import { Zap } from 'lucide-react';
import type { TimeEnergyData, CalculationResults } from '../../types/calculator';
import { formatBRL } from '../../services/pricingService';
import { InputField } from '../InputField';

export interface TimeEnergySectionProps {
  timeEnergy: TimeEnergyData;
  results: CalculationResults;
  isKitMode: boolean;
  onUpdateTimeEnergy: (patch: Partial<TimeEnergyData>) => void;
}

export const TimeEnergySection: React.FC<TimeEnergySectionProps> = ({
  timeEnergy,
  results,
  isKitMode,
  onUpdateTimeEnergy,
}) => {
  return (
    <section className="bg-white dark:bg-[#141721] rounded-[24px] p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.36)] border border-slate-200/90 dark:border-white/[0.08] flex flex-col justify-between transition-colors">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between mb-5 border-b border-slate-100 dark:border-white/[0.06] pb-4">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-[#FF9500]/10 dark:bg-[#FF9500]/20 text-[#FF9500] flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Tempo e Energia
              </h2>
            </div>
          </div>
        </div>

        {/* 4 Inputs */}
        <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
          <InputField
            label={isKitMode ? 'Tempo Fornada (H)' : 'Tempo Impressão (H)'}
            value={timeEnergy.printTimeHours}
            onChange={(v) => onUpdateTimeEnergy({ printTimeHours: v })}
            suffix="h"
            min={0}
          />

          <InputField
            label={isKitMode ? 'Tempo Fornada (Min)' : 'Tempo Impressão (Min)'}
            value={timeEnergy.printTimeMinutes}
            onChange={(v) => onUpdateTimeEnergy({ printTimeMinutes: v })}
            suffix="min"
            min={0}
            max={59}
          />

          <InputField
            label="Consumo Médio"
            value={timeEnergy.avgPowerWatts}
            onChange={(v) => onUpdateTimeEnergy({ avgPowerWatts: v })}
            suffix="W"
          />

          <InputField
            label="Custo Energia"
            value={timeEnergy.energyCostKwh}
            onChange={(v) => onUpdateTimeEnergy({ energyCostKwh: v })}
            suffix="R$/kWh"
            step={0.01}
          />
        </div>
      </div>

      {/* Card Footer Summary */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
        <span className="font-medium">
          {isKitMode
            ? `Energia/Deprec. p/ peça (~${results.effectiveUnitPrintTimeFormatted}):`
            : 'Energia + Depreciação:'}
        </span>
        <span className="font-bold text-slate-900 dark:text-white text-base sm:text-lg tabular-nums">
          {formatBRL(results.unitEnergyDepreciationCost)}
        </span>
      </div>
    </section>
  );
};
