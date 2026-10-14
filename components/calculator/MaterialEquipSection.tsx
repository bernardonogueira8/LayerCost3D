import React from 'react';
import { Printer } from 'lucide-react';
import type { MaterialEquipData, CalculationResults, PrinterPreset, FilamentPreset } from '../../types/calculator';
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
  const costPerGram = materialEquip.filamentCostPerKg > 0
    ? (materialEquip.filamentCostPerKg / 1000).toFixed(2)
    : '0.00';

  const quickFilaments = [
    { id: 'pla-padrao', label: 'PLA', price: 110 },
    { id: 'petg-padrao', label: 'PETG', price: 120 },
    { id: 'abs-asa', label: 'ABS', price: 130 },
    { id: 'tpu-flex', label: 'TPU', price: 170 },
  ];

  return (
    <section className="bg-white dark:bg-[#1C1C1E] rounded-[22px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] border border-black/[0.06] dark:border-white/[0.08] hover:border-black/[0.1] dark:hover:border-white/[0.14] hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)] focus-within:border-[#0071E3]/40 focus-within:shadow-[0_8px_30px_rgba(0,113,227,0.06)] transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between mb-5 border-b border-black/[0.05] dark:border-white/[0.06] pb-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-[#0071E3]/10 dark:bg-[#0071E3]/20 text-[#0071E3] dark:text-[#2997FF] flex items-center justify-center shrink-0">
              <Printer className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-[17px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
                Material e Equipamento
              </h2>
            </div>
          </div>
          <span className="text-[11px] font-medium text-[#86868B] bg-[#F5F5F7] dark:bg-[#2C2C2E] px-2.5 py-1 rounded-full border border-black/[0.04] dark:border-white/[0.06] transition-colors">
            R$ {costPerGram}/g
          </span>
        </div>

        {/* Preset Selectors */}
        <div className="mb-3.5 grid grid-cols-2 gap-3">
          <div>
            <label className="text-[12px] font-medium text-[#86868B] block mb-1">
              Preset Impressora
            </label>
            <select
              onChange={(e) => onSelectPrinterPreset(e.target.value)}
              className="w-full h-10 px-3 text-[13px] bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-[#38383A] rounded-xl text-[#1D1D1F] dark:text-[#F5F5F7] focus:bg-white dark:focus:bg-[#1C1C1E] focus:border-[#0071E3] dark:focus:border-[#2997FF] focus:ring-4 focus:ring-[#0071E3]/15 transition-all outline-none cursor-pointer"
              defaultValue="bambu-a1-mini"
            >
              {PRINTER_PRESETS.map((p: PrinterPreset) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[12px] font-medium text-[#86868B] block mb-1">
              Preset Filamento
            </label>
            <select
              onChange={(e) => onSelectFilamentPreset(e.target.value)}
              className="w-full h-10 px-3 text-[13px] bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-[#38383A] rounded-xl text-[#1D1D1F] dark:text-[#F5F5F7] focus:bg-white dark:focus:bg-[#1C1C1E] focus:border-[#0071E3] dark:focus:border-[#2997FF] focus:ring-4 focus:ring-[#0071E3]/15 transition-all outline-none cursor-pointer"
              defaultValue=""
            >
              <option value="" disabled>
                Selecionar Tipo...
              </option>
              {FILAMENT_PRESETS.map((f: FilamentPreset) => (
                <option key={f.id} value={f.id}>
                  {f.name} (R$ {f.costPerKg}/kg)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Material Chips (Fast UX) */}
        <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-0.5">
          <span className="text-[11px] text-[#86868B] font-medium mr-1 shrink-0">Rápido:</span>
          {quickFilaments.map((item) => {
            const isMatch = materialEquip.filamentCostPerKg === item.price;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectFilamentPreset(item.id)}
                className={`px-2.5 py-1 rounded-full text-[11px] transition-all duration-200 active:scale-95 cursor-pointer shrink-0 ${
                  isMatch
                    ? 'bg-[#0071E3] text-white font-medium shadow-sm'
                    : 'bg-[#F5F5F7] dark:bg-[#2C2C2E] hover:bg-[#E5E5EA] dark:hover:bg-[#38383A] text-[#1D1D1F] dark:text-[#F5F5F7] border border-black/[0.04] dark:border-white/[0.06]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* 4 Inputs */}
        <div className="grid grid-cols-2 gap-3.5">
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
      <div className="mt-5 pt-4 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between text-[13px] text-[#86868B]">
        <span>
          {isKitMode
            ? `Custo Mat. p/ peça (~${results.effectiveUnitWeightG.toFixed(1)}g):`
            : 'Custo Material:'}
        </span>
        <span className="font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums">
          {formatBRL(results.unitMaterialCost)}
        </span>
      </div>
    </section>
  );
};
