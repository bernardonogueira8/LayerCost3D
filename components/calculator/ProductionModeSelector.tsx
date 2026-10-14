import React from 'react';
import { Boxes, Package, Sparkles } from 'lucide-react';
import type { ProductionMode } from '../../types/calculator';

export interface ProductionModeSelectorProps {
  productionMode: ProductionMode;
  onSelectMode: (mode: ProductionMode) => void;
}

export const ProductionModeSelector: React.FC<ProductionModeSelectorProps> = ({
  productionMode,
  onSelectMode,
}) => {
  const isKitMode = productionMode === 'kit';

  return (
    <>
      {/* Apple-style Segmented Production Mode Bar */}
      <div className="mb-6 bg-white dark:bg-[#1C1C1E] rounded-[22px] p-4 sm:p-5 border border-black/[0.06] dark:border-white/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] hover:border-black/[0.1] dark:hover:border-white/[0.14] transition-all duration-300 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#0071E3]/10 dark:bg-[#0071E3]/20 flex items-center justify-center text-[#0071E3] dark:text-[#2997FF] shrink-0">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[16px] sm:text-[17px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] block tracking-tight">
              Modo de Produção
            </span>
            <p className="text-[13px] text-[#86868B] font-normal">
              Selecione o método de precificação conforme o fatiamento no software.
            </p>
          </div>
        </div>

        {/* Apple Segmented Control Pill */}
        <div className="flex items-center bg-[#F5F5F7] dark:bg-[#2C2C2E] p-1 rounded-full border border-black/[0.04] dark:border-white/[0.06] w-full sm:w-auto">
          <button
            type="button"
            onClick={() => onSelectMode('unit')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-5 py-2 text-[13px] rounded-full transition-all duration-200 cursor-pointer active:scale-[0.98] ${
              !isKitMode
                ? 'bg-white dark:bg-[#1C1C1E] text-[#1D1D1F] dark:text-[#F5F5F7] font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                : 'text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] font-medium'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Peça Individual</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectMode('kit')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-5 py-2 text-[13px] rounded-full transition-all duration-200 cursor-pointer active:scale-[0.98] ${
              isKitMode
                ? 'bg-white dark:bg-[#1C1C1E] text-[#0071E3] dark:text-[#2997FF] font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                : 'text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] font-medium'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>Fornada / Lote</span>
          </button>
        </div>
      </div>

      {/* Informative Apple Card when in Fornada/Kit mode */}
      {isKitMode && (
        <div className="mb-6 p-4 sm:p-5 rounded-[20px] bg-[#0071E3]/[0.06] dark:bg-[#0071E3]/15 border border-[#0071E3]/20 dark:border-[#2997FF]/30 shadow-sm flex items-start gap-3.5 transition-all duration-300 animate-in fade-in slide-in-from-top-2">
          <div className="p-2 bg-[#0071E3]/15 text-[#0071E3] dark:text-[#2997FF] rounded-xl shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-[13px] text-[#1D1D1F] dark:text-[#F5F5F7] leading-relaxed">
            <p className="font-semibold text-[15px] text-[#1D1D1F] dark:text-white">
              Modo Fornada Ativado
            </p>
            <p className="text-[#86868B] dark:text-[#A1A1A6] mt-1">
              Insira o tempo total e peso acumulado de toda a mesa informados pelo fatiador. A calculadora rateará automaticamente os custos fixos e insumos pelo número de peças do lote.
            </p>
          </div>
        </div>
      )}
    </>
  );
};
