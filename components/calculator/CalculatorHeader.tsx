import React, { useState } from 'react';
import { Layers, PlusCircle, FolderOpen, Save, FileText, Sun, Moon } from 'lucide-react';
import type { CalculatorState } from '../../types/calculator';

interface HeaderQuantityInputProps {
  value: number;
  onChange: (val: number) => void;
}

const HeaderQuantityInput: React.FC<HeaderQuantityInputProps> = ({ value, onChange }) => {
  const [prevValue, setPrevValue] = useState(value);
  const [local, setLocal] = useState<string>(String(value || 1));
  const [isFocused, setIsFocused] = useState(false);

  // Sincronização idiomática em render para React 19 (sem useEffect cascading renders)
  if (value !== prevValue) {
    setPrevValue(value);
    if (!isFocused) {
      setLocal(String(value || 1));
    }
  }

  return (
    <input
      type="number"
      min={1}
      value={local}
      onFocus={(e) => {
        setIsFocused(true);
        e.target.select();
      }}
      onChange={(e) => {
        const raw = e.target.value;
        setLocal(raw);
        if (raw !== '') {
          const num = parseInt(raw, 10);
          if (!isNaN(num) && num > 0) onChange(num);
        }
      }}
      onBlur={() => {
        setIsFocused(false);
        if (local === '' || isNaN(parseInt(local, 10)) || parseInt(local, 10) < 1) {
          setLocal('1');
          onChange(1);
        } else {
          const num = Math.max(1, parseInt(local, 10));
          setLocal(String(num));
          onChange(num);
        }
      }}
      className="text-sm sm:text-[15px] font-bold text-slate-900 dark:text-white bg-transparent border-none p-0 focus:outline-none w-14 tabular-nums"
    />
  );
};

export interface CalculatorHeaderProps {
  state: CalculatorState;
  isKitMode: boolean;
  notification: string | null;
  jsonInputRef: React.RefObject<HTMLInputElement | null>;
  isDark?: boolean;
  onToggleTheme?: () => void;
  onNewProject: () => void;
  onSaveJson: () => void;
  onOpenJsonTrigger: () => void;
  onJsonFileSelected: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdateClientQuantity: (qty: number) => void;
  onUpdateProjectName: (name: string) => void;
  onOpenPdfPreview: () => void;
}

export const CalculatorHeader: React.FC<CalculatorHeaderProps> = ({
  state,
  isKitMode,
  notification,
  jsonInputRef,
  isDark = true,
  onToggleTheme,
  onNewProject,
  onSaveJson,
  onOpenJsonTrigger,
  onJsonFileSelected,
  onUpdateClientQuantity,
  onUpdateProjectName,
  onOpenPdfPreview,
}) => {
  const displayQuantity = isKitMode
    ? state.kitBatch.clientQuantity
    : state.clientProject.quantity;

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#000000]/80 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.08] transition-colors duration-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Logo & App Title - Apple Clean Aesthetic */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1D1D1F] dark:bg-white text-white dark:text-[#1D1D1F] flex items-center justify-center shadow-sm shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[17px] font-semibold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
                Calculadora 3D
              </h1>
              <span className="px-2 py-0.5 text-[11px] font-medium bg-black/[0.04] dark:bg-white/10 text-[#1D1D1F]/70 dark:text-[#F5F5F7]/70 border border-black/[0.04] dark:border-white/[0.06] rounded-full">
                FDM & SLA Pro
              </span>
            </div>
            <p className="text-[12px] text-[#86868B] font-normal leading-tight">
              Precificação de manufatura e propostas comerciais
            </p>
          </div>
        </div>

        {/* Action Toolbar & Quick Inputs */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Action Buttons: Apple Segmented Pill */}
          <div className="flex items-center bg-[#F5F5F7] dark:bg-[#1C1C1E] p-1 rounded-full border border-black/[0.04] dark:border-white/[0.06]">
            <button
              onClick={onNewProject}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-white dark:hover:bg-[#2C2C2E] rounded-full transition-all active:scale-[0.98] cursor-pointer"
              title="Iniciar Novo Projeto"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#0071E3] dark:text-[#2997FF]" />
              <span>Novo</span>
            </button>

            <button
              onClick={onOpenJsonTrigger}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-white dark:hover:bg-[#2C2C2E] rounded-full transition-all active:scale-[0.98] cursor-pointer"
              title="Abrir Projeto Salvo (JSON)"
            >
              <FolderOpen className="w-3.5 h-3.5 text-[#FF9500]" />
              <span>Abrir</span>
            </button>
            <input
              type="file"
              ref={jsonInputRef}
              onChange={onJsonFileSelected}
              accept=".json"
              className="hidden"
            />

            <button
              onClick={onSaveJson}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-white dark:hover:bg-[#2C2C2E] rounded-full transition-all active:scale-[0.98] cursor-pointer"
              title="Salvar Projeto em Arquivo"
            >
              <Save className="w-3.5 h-3.5 text-[#0071E3] dark:text-[#2997FF]" />
              <span>Salvar</span>
            </button>
          </div>

          {/* Quick Header Widget: Quantidade */}
          <div className="bg-[#F5F5F7] dark:bg-[#1C1C1E] border border-black/[0.04] dark:border-white/[0.06] rounded-xl px-3 py-1.5 flex flex-col justify-center min-w-[105px]">
            <span className="text-[11px] font-medium text-[#86868B] tracking-tight">
              {isKitMode ? 'Pedido Cliente' : 'Qtd. Peças'}
            </span>
            <HeaderQuantityInput
              value={displayQuantity}
              onChange={onUpdateClientQuantity}
            />
          </div>

          {/* Quick Header Widget: Nome do Projeto */}
          <div className="bg-[#F5F5F7] dark:bg-[#1C1C1E] border border-black/[0.04] dark:border-white/[0.06] rounded-xl px-3 py-1.5 flex flex-col justify-center min-w-[140px]">
            <span className="text-[11px] font-medium text-[#86868B] tracking-tight">
              Projeto
            </span>
            <input
              type="text"
              value={state.clientProject.projectName}
              onFocus={(e) => e.target.select()}
              onChange={(e) => onUpdateProjectName(e.target.value)}
              placeholder="Nome da peça"
              className="text-[13px] font-medium text-[#1D1D1F] dark:text-[#F5F5F7] bg-transparent border-none p-0 focus:outline-none w-32 truncate"
            />
          </div>

          {/* Theme Toggle Button */}
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-2 sm:px-3 sm:py-2 text-[13px] font-medium rounded-full bg-[#F5F5F7] dark:bg-[#1C1C1E] text-[#1D1D1F] dark:text-[#F5F5F7] border border-black/[0.04] dark:border-white/[0.06] hover:bg-black/[0.04] dark:hover:bg-[#2C2C2E] transition-all flex items-center gap-1.5 active:scale-[0.98] cursor-pointer"
              title={isDark ? "Alternar para Tema Claro" : "Alternar para Tema Escuro"}
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-[#FF9500]" />
                  <span className="hidden sm:inline">Claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-[#5856D6]" />
                  <span className="hidden sm:inline">Escuro</span>
                </>
              )}
            </button>
          )}

          {/* Main Action: Apple Brand Blue Pill */}
          <button
            onClick={onOpenPdfPreview}
            className="flex items-center gap-2 px-4 sm:px-5 py-2 text-[13px] font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] active:scale-[0.98] rounded-full shadow-[0_2px_8px_rgba(0,113,227,0.25)] transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Gerar Orçamento em PDF</span>
          </button>
        </div>
      </div>

      {/* Floating Notification */}
      {notification && (
        <div className="bg-[#0071E3] text-white text-[13px] font-medium py-2 px-4 text-center animate-in slide-in-from-top duration-200 shadow-sm">
          {notification}
        </div>
      )}
    </header>
  );
};
