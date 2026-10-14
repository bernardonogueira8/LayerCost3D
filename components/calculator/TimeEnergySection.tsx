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
  const totalHours = timeEnergy.printTimeHours + timeEnergy.printTimeMinutes / 60;
  const totalKwh = ((totalHours * timeEnergy.avgPowerWatts) / 1000).toFixed(2);
  const calculatedEnergyCost = (Number(totalKwh) * timeEnergy.energyCostKwh).toFixed(2);

  return (
    <section className="bg-white dark:bg-[#1C1C1E] rounded-[22px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] border border-black/[0.06] dark:border-white/[0.08] hover:border-black/[0.1] dark:hover:border-white/[0.14] hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)] focus-within:border-[#FF9500]/40 focus-within:shadow-[0_8px_30px_rgba(255,149,0,0.06)] transition-all duration-300">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between mb-3.5 border-b border-black/[0.05] dark:border-white/[0.06] pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-[#FF9500]/10 text-[#FF9500] flex items-center justify-center shrink-0">
              <Zap className="w-3.5 h-3.5" />
            </span>
            <div>
              <h2 className="text-[16px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
                Tempo e Energia
              </h2>
            </div>
          </div>
          <span className="text-[11px] font-medium text-[#86868B] bg-[#F5F5F7] dark:bg-[#2C2C2E] px-2.5 py-0.5 rounded-full border border-black/[0.04] dark:border-white/[0.06] transition-colors">
            {totalKwh} kWh (~R$ {calculatedEnergyCost})
          </span>
        </div>

        {/* 4 Inputs */}
        <div className="grid grid-cols-2 gap-2.5">
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
      <div className="mt-3.5 pt-3 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between text-[12px] sm:text-[13px] text-[#86868B]">
        <span>
          {isKitMode
            ? `Energia/Deprec. (~${results.effectiveUnitPrintTimeFormatted}):`
            : 'Energia + Depreciação:'}
        </span>
        <span className="font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums">
          {formatBRL(results.unitEnergyDepreciationCost)}
        </span>
      </div>
    </section>
  );
};
