import React from 'react';
import { Printer } from 'lucide-react';
import type { MaterialEquipData, CalculationResults } from '../../types/calculator';
import { PRINTER_PRESETS, FILAMENT_PRESETS } from '../../constants/presets';
import { formatBRL } from '../../services/pricingService';
import { InputField } from '../InputField';

export interface MaterialEquipSectionProps {
  materialEquip: MaterialEquipData;
  results: CalculationResults;
  isKitMode: boolean;
  onUpdateMaterialEquip: (patch: Partial<MaterialEquipData>) => void;
  onSelectPrinterPreset: (presetId: string) => void;
  onSelectFilamentPreset: (presetId: string) => void;
}

export const MaterialEquipSection: React.FC<MaterialEquipSectionProps> = ({
  materialEquip,
  results,
  isKitMode,
  onUpdateMaterialEquip,
  onSelectPrinterPreset,
  onSelectFilamentPreset,
}) => {
  return (
    <section className="bg-white dark:bg-[#141721] rounded-[24px] p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.36)] border border-slate-200/90 dark:border-white/[0.08] flex flex-col justify-between transition-colors">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between mb-5 border-b border-slate-100 dark:border-white/[0.06] pb-4">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-[#0071E3]/10 dark:bg-[#0071E3]/20 text-[#0071E3] dark:text-[#2997FF] flex items-center justify-center shrink-0">
              <Printer className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Material e Equipamento
              </h2>
            </div>
          </div>
        </div>

        {/* Preset Selectors */}
        <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="text-[13px] sm:text-[14px] font-semibold text-slate-700 dark:text-zinc-200 block mb-1.5 tracking-tight">
              Preset Impressora
            </label>
            <select
              onChange={(e) => onSelectPrinterPreset(e.target.value)}
              className="w-full h-11 sm:h-12 px-3.5 text-xs sm:text-sm font-semibold bg-white dark:bg-[#1B202D] border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:border-[#0071E3] dark:focus:border-[#2997FF] focus:ring-4 focus:ring-[#0071E3]/15 dark:focus:ring-[#2997FF]/20 transition-all outline-none cursor-pointer"
              defaultValue="bambu-a1-mini"
            >
              {PRINTER_PRESETS.map((p) => (
                <option key={p.id} value={p.id} className="bg-white dark:bg-[#1B202D] text-slate-900 dark:text-white">
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[13px] sm:text-[14px] font-semibold text-slate-700 dark:text-zinc-200 block mb-1.5 tracking-tight">
              Preset Filamento
            </label>
            <select
              onChange={(e) => onSelectFilamentPreset(e.target.value)}
              className="w-full h-11 sm:h-12 px-3.5 text-xs sm:text-sm font-semibold bg-white dark:bg-[#1B202D] border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:border-[#0071E3] dark:focus:border-[#2997FF] focus:ring-4 focus:ring-[#0071E3]/15 dark:focus:ring-[#2997FF]/20 transition-all outline-none cursor-pointer"
              defaultValue=""
            >
              <option value="" disabled className="bg-white dark:bg-[#1B202D] text-slate-500">
                Selecionar Tipo...
              </option>
              {FILAMENT_PRESETS.map((f) => (
                <option key={f.id} value={f.id} className="bg-white dark:bg-[#1B202D] text-slate-900 dark:text-white">
                  {f.name} (R$ {f.costPerKg}/kg)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4 Inputs */}
        <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
          <InputField
            label="Custo Filamento"
            value={materialEquip.filamentCostPerKg}
            onChange={(v) => onUpdateMaterialEquip({ filamentCostPerKg: v })}
            suffix="R$/kg"
          />

          <InputField
            label={isKitMode ? 'Peso Fornada' : 'Peso Unitário'}
            value={materialEquip.partWeightG}
            onChange={(v) => onUpdateMaterialEquip({ partWeightG: v })}
            suffix="g"
          />

          <InputField
            label="Valor Impressora"
            value={materialEquip.printerValue}
            onChange={(v) => onUpdateMaterialEquip({ printerValue: v })}
            suffix="R$"
          />

          <InputField
            label="Vida Útil Est."
            value={materialEquip.lifespanHours}
            onChange={(v) => onUpdateMaterialEquip({ lifespanHours: v })}
            suffix="horas"
          />
        </div>
      </div>

      {/* Card Footer Summary */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
        <span className="font-medium">
          {isKitMode
            ? `Custo Mat. p/ peça (~${results.effectiveUnitWeightG.toFixed(1)}g):`
            : 'Custo Material:'}
        </span>
        <span className="font-bold text-slate-900 dark:text-white text-base sm:text-lg tabular-nums">
          {formatBRL(results.unitMaterialCost)}
        </span>
      </div>
    </section>
  );
};
