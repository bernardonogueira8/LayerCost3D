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
      <div className="mb-6 bg-white dark:bg-[#141721] rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-[#1B202D] flex items-center justify-center text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 shrink-0">
            <Boxes className="w-5 h-5 text-[#0071E3] dark:text-[#2997FF]" />
          </div>
          <div>
            <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white block">
              Modo de Produção
            </span>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 font-medium">
              Selecione o método de precificação conforme o fatiamento no software.
            </p>
          </div>
        </div>

        {/* Apple Segmented Control Pill */}
        <div className="flex items-center bg-slate-100 dark:bg-[#1B202D] p-1 rounded-full border border-slate-200 dark:border-white/10 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => onSelectMode('unit')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-5 py-2 text-xs sm:text-sm rounded-full transition-all duration-200 ${
              !isKitMode
                ? 'bg-white dark:bg-[#252B3C] text-slate-900 dark:text-white font-bold shadow-[0_1px_4px_rgba(0,0,0,0.1)]'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white font-medium'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Peça Individual</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectMode('kit')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-5 py-2 text-xs sm:text-sm rounded-full transition-all duration-200 ${
              isKitMode
                ? 'bg-white dark:bg-[#252B3C] text-[#0071E3] dark:text-[#2997FF] font-bold shadow-[0_1px_4px_rgba(0,0,0,0.1)]'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white font-medium'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>Fornada / Lote</span>
          </button>
        </div>
      </div>

      {/* Informative Apple Card when in Fornada/Kit mode */}
      {isKitMode && (
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-blue-50/70 dark:bg-[#0071E3]/10 border border-[#0071E3]/25 dark:border-[#2997FF]/30 shadow-sm flex items-start gap-3.5 animate-in fade-in duration-200">
          <div className="p-2 bg-[#0071E3]/15 text-[#0071E3] dark:text-[#2997FF] rounded-xl shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-xs sm:text-sm text-slate-800 dark:text-zinc-200 leading-relaxed">
            <p className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              Modo Fornada Ativado.
            </p>
            <p className="text-slate-600 dark:text-zinc-300 mt-1">
              Insira o tempo total e peso acumulado de toda a mesa informados pelo fatiador. A calculadora rateará automaticamente os custos fixos e insumos pelo número de peças do lote.
            </p>
          </div>
        </div>
      )}
    </>
  );
};
