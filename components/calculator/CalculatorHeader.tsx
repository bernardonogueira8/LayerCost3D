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
    <header className="sticky top-0 z-30 bg-white/85 dark:bg-[#10131B]/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/[0.08] transition-colors duration-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Logo & App Title - Apple Clean Aesthetic */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-sm">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Calculadora 3D
              </h1>
              <span className="px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-white/10 rounded-full">
                FDM & SLA Pro
              </span>
            </div>
            <p className="text-xs sm:text-[13px] text-slate-500 dark:text-zinc-400 font-medium leading-tight">
              Precificação de manufatura e propostas comerciais
            </p>
          </div>
        </div>

        {/* Action Toolbar & Quick Inputs */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Action Buttons: Apple Segmented Pill */}
          <div className="flex items-center bg-slate-100 dark:bg-[#1B202D] p-1 rounded-full border border-slate-200 dark:border-white/[0.08]">
            <button
              onClick={onNewProject}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-[13px] font-semibold text-slate-700 dark:text-zinc-200 hover:bg-white dark:hover:bg-[#252B3C] rounded-full transition-all"
              title="Iniciar Novo Projeto"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#0071E3] dark:text-[#2997FF]" />
              <span>Novo</span>
            </button>

            <button
              onClick={onOpenJsonTrigger}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-[13px] font-semibold text-slate-700 dark:text-zinc-200 hover:bg-white dark:hover:bg-[#252B3C] rounded-full transition-all"
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
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-[13px] font-semibold text-slate-700 dark:text-zinc-200 hover:bg-white dark:hover:bg-[#252B3C] rounded-full transition-all"
              title="Salvar Projeto em Arquivo"
            >
              <Save className="w-3.5 h-3.5 text-[#0071E3] dark:text-[#2997FF]" />
              <span>Salvar</span>
            </button>
          </div>

          {/* Quick Header Widget: Quantidade */}
          <div className="bg-slate-50 dark:bg-[#1B202D] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 flex flex-col justify-center min-w-[105px]">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 tracking-tight">
              {isKitMode ? 'Pedido Cliente' : 'Qtd. Peças'}
            </span>
            <HeaderQuantityInput
              value={displayQuantity}
              onChange={onUpdateClientQuantity}
            />
          </div>

          {/* Quick Header Widget: Nome do Projeto */}
          <div className="bg-slate-50 dark:bg-[#1B202D] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 flex flex-col justify-center min-w-[140px]">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 tracking-tight">
              Projeto
            </span>
            <input
              type="text"
              value={state.clientProject.projectName}
              onFocus={(e) => e.target.select()}
              onChange={(e) => onUpdateProjectName(e.target.value)}
              placeholder="Nome da peça"
              className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white bg-transparent border-none p-0 focus:outline-none w-32 truncate"
            />
          </div>

          {/* Theme Toggle Button */}
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-2 sm:px-3 sm:py-2 text-xs sm:text-[13px] font-semibold rounded-full bg-slate-100 dark:bg-[#1B202D] text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-[#252B3C] transition-all flex items-center gap-1.5"
              title={isDark ? "Alternar para Tema Claro" : "Alternar para Tema Escuro"}
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-500" />
                  <span className="hidden sm:inline">Escuro</span>
                </>
              )}
            </button>
          )}

          {/* Main Action: Apple Brand Blue Pill */}
          <button
            onClick={onOpenPdfPreview}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#0071E3] hover:bg-[#0077ED] active:scale-[0.98] rounded-full shadow-[0_2px_12px_rgba(0,113,227,0.3)] transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Gerar Orçamento em PDF</span>
          </button>
        </div>
      </div>

      {/* Floating Notification */}
      {notification && (
        <div className="bg-[#0071E3] text-white text-xs sm:text-sm font-semibold py-2 px-4 text-center animate-in slide-in-from-top duration-200 shadow-sm">
          {notification}
        </div>
      )}
    </header>
  );
};
