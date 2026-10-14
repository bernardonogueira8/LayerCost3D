import React from 'react';
import { Sparkles, Upload, Trash2, Loader2, Package, Boxes } from 'lucide-react';
import type { ClientProjectData, KitBatchData, ProductionMode } from '../../types/calculator';
import { InputField } from '../InputField';

export interface ClientProjectSectionProps {
  clientProject: ClientProjectData;
  kitBatch: KitBatchData;
  productionMode: ProductionMode;
  isImageProcessing?: boolean;
  imageInputRef: React.RefObject<HTMLInputElement | null>;
  onTriggerImageUpload: () => void;
  onImageFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  onUpdateClientProject: (patch: Partial<ClientProjectData>) => void;
  onUpdateKitBatch: (patch: Partial<KitBatchData>) => void;
  onSelectProductionMode: (mode: ProductionMode) => void;
}

export const ClientProjectSection: React.FC<ClientProjectSectionProps> = ({
  clientProject,
  kitBatch,
  productionMode,
  isImageProcessing = false,
  imageInputRef,
  onTriggerImageUpload,
  onImageFileChange,
  onRemoveImage,
  onUpdateClientProject,
  onUpdateKitBatch,
  onSelectProductionMode,
}) => {
  const isKitMode = productionMode === 'kit';

  return (
    <section className="bg-white dark:bg-[#1C1C1E] rounded-[22px] p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] border border-black/[0.06] dark:border-white/[0.08] hover:border-black/[0.1] dark:hover:border-white/[0.14] hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)] focus-within:border-[#0071E3]/40 focus-within:shadow-[0_8px_30px_rgba(0,113,227,0.06)] transition-all duration-300">
      {/* Section Header with integrated Production Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-black/[0.06] dark:border-white/[0.06] pb-4">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-[#0071E3]/10 dark:bg-[#0071E3]/20 text-[#0071E3] dark:text-[#2997FF] flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-[17px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
              Dados do Cliente e Projeto
            </h2>
            <p className="text-[13px] text-[#86868B] font-normal">
              Informações para apresentação no orçamento comercial formal
            </p>
          </div>
        </div>

        {/* Apple Segmented Control for Production Mode */}
        <div className="flex items-center bg-[#F5F5F7] dark:bg-[#2C2C2E] p-1 rounded-full border border-black/[0.04] dark:border-white/[0.06] shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onSelectProductionMode('unit')}
            className={`flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 text-[12px] sm:text-[13px] rounded-full transition-all duration-200 cursor-pointer active:scale-[0.98] ${
              !isKitMode
                ? 'bg-white dark:bg-[#1C1C1E] text-[#1D1D1F] dark:text-[#F5F5F7] font-semibold shadow-[0_1px_4px_rgba(0,0,0,0.08)]'
                : 'text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] font-medium'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Peça Individual</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectProductionMode('kit')}
            className={`flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 text-[12px] sm:text-[13px] rounded-full transition-all duration-200 cursor-pointer active:scale-[0.98] ${
              isKitMode
                ? 'bg-white dark:bg-[#1C1C1E] text-[#0071E3] dark:text-[#2997FF] font-semibold shadow-[0_1px_4px_rgba(0,0,0,0.08)]'
                : 'text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] font-medium'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Fornada / Lote</span>
          </button>
        </div>
      </div>

      {/* Basic Text Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium text-[#1D1D1F]/80 dark:text-[#F5F5F7]/80">
            Nome do Cliente
          </label>
          <input
            type="text"
            value={clientProject.clientName}
            onFocus={(e) => e.target.select()}
            onChange={(e) => onUpdateClientProject({ clientName: e.target.value })}
            placeholder="Ex: João da Silva"
            className="w-full h-11 px-3.5 bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-[#38383A] rounded-xl text-[14px] font-medium text-[#1D1D1F] dark:text-[#F5F5F7] placeholder:text-[#86868B] focus:bg-white dark:focus:bg-[#1C1C1E] focus:border-[#0071E3] dark:focus:border-[#2997FF] focus:ring-4 focus:ring-[#0071E3]/15 transition-all outline-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium text-[#1D1D1F]/80 dark:text-[#F5F5F7]/80">
            Nome do Projeto / Peça
          </label>
          <input
            type="text"
            value={clientProject.projectName}
            onFocus={(e) => e.target.select()}
            onChange={(e) => onUpdateClientProject({ projectName: e.target.value })}
            placeholder="Ex: Suporte Articulado"
            className="w-full h-11 px-3.5 bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-[#38383A] rounded-xl text-[14px] font-medium text-[#1D1D1F] dark:text-[#F5F5F7] placeholder:text-[#86868B] focus:bg-white dark:focus:bg-[#1C1C1E] focus:border-[#0071E3] dark:focus:border-[#2997FF] focus:ring-4 focus:ring-[#0071E3]/15 transition-all outline-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium text-[#1D1D1F]/80 dark:text-[#F5F5F7]/80">
            Dimensões do Item
          </label>
          <input
            type="text"
            value={clientProject.dimensions}
            onFocus={(e) => e.target.select()}
            onChange={(e) => onUpdateClientProject({ dimensions: e.target.value })}
            placeholder="Ex: 150 x 42 x 2.5 mm"
            className="w-full h-11 px-3.5 bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-[#38383A] rounded-xl text-[14px] font-medium text-[#1D1D1F] dark:text-[#F5F5F7] placeholder:text-[#86868B] focus:bg-white dark:focus:bg-[#1C1C1E] focus:border-[#0071E3] dark:focus:border-[#2997FF] focus:ring-4 focus:ring-[#0071E3]/15 transition-all outline-none"
          />
        </div>
      </div>

      {/* Special Kit / Fornada Control inputs inside Project Card */}
      {isKitMode && (
        <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-[#0071E3]/[0.05] dark:bg-[#0071E3]/15 border border-[#0071E3]/20 dark:border-[#2997FF]/30 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-start gap-2.5 text-[13px] text-[#1D1D1F] dark:text-[#F5F5F7] leading-relaxed">
            <Boxes className="w-4 h-4 text-[#0071E3] dark:text-[#2997FF] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#0071E3] dark:text-[#2997FF]">Modo Fornada Ativado: </span>
              <span className="text-[#86868B] dark:text-[#A1A1A6]">
                Insira o tempo total e peso acumulado de toda a mesa informados pelo fatiador. A calculadora rateará automaticamente os custos fixos pelo número de peças do lote.
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <InputField
              label="Peças na Fornada / Mesa (Lote)"
              value={kitBatch.itemsPerBatch}
              onChange={(v) => onUpdateKitBatch({ itemsPerBatch: Math.max(1, Math.round(Number(v) || 1)) })}
              suffix="peças"
              min={1}
            />

            <InputField
              label="Qtd. Solicitada pelo Cliente"
              value={kitBatch.clientQuantity}
              onChange={(v) => onUpdateKitBatch({ clientQuantity: Math.max(1, Math.round(Number(v) || 1)) })}
              suffix="unidades"
              min={1}
            />
          </div>
        </div>
      )}

      {/* Image Upload Dropzone & Service Description */}
      <div className="mt-5 pt-4 border-t border-black/[0.06] dark:border-white/[0.06] flex flex-col sm:flex-row items-center gap-4">
        <input
          type="file"
          ref={imageInputRef}
          onChange={onImageFileChange}
          accept="image/*"
          className="hidden"
        />

        {clientProject.referenceImage ? (
          <div className="relative group w-20 h-20 rounded-2xl border border-black/[0.08] dark:border-white/[0.12] overflow-hidden bg-[#F5F5F7] dark:bg-[#2C2C2E] flex items-center justify-center shadow-sm shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={clientProject.referenceImage}
              alt="Referência da peça 3D"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <button
              type="button"
              onClick={onRemoveImage}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
              title="Remover foto"
            >
              <Trash2 className="w-5 h-5 text-red-400 hover:scale-110 transition-transform" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onTriggerImageUpload}
            disabled={isImageProcessing}
            className="group w-full sm:w-auto h-11 px-4 border border-dashed border-[#D2D2D7] dark:border-[#38383A] hover:border-[#0071E3] dark:hover:border-[#2997FF] rounded-xl bg-[#F5F5F7] dark:bg-[#2C2C2E] hover:bg-white dark:hover:bg-[#1C1C1E] transition-all flex items-center justify-center gap-2.5 text-[13px] font-medium text-[#1D1D1F] dark:text-[#F5F5F7] shrink-0 disabled:opacity-50 cursor-pointer active:scale-[0.98]"
          >
            {isImageProcessing ? (
              <>
                <Loader2 className="w-4 h-4 text-[#0071E3] dark:text-[#2997FF] animate-spin" />
                <span>Processando imagem...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 text-[#0071E3] dark:text-[#2997FF] group-hover:-translate-y-0.5 transition-transform duration-200" />
                <span>Foto de Referência (Opcional)</span>
              </>
            )}
          </button>
        )}

        <div className="flex-1 w-full">
          <input
            type="text"
            value={clientProject.serviceDescription}
            onFocus={(e) => e.target.select()}
            onChange={(e) => onUpdateClientProject({ serviceDescription: e.target.value })}
            placeholder="Descrição técnica para o cliente (ex: Impressão 3D de alta precisão com acabamento refinado)..."
            className="w-full h-11 px-3.5 bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-[#38383A] rounded-xl text-[13px] font-medium text-[#1D1D1F] dark:text-[#F5F5F7] placeholder:text-[#86868B] focus:bg-white dark:focus:bg-[#1C1C1E] focus:border-[#0071E3] dark:focus:border-[#2997FF] focus:ring-4 focus:ring-[#0071E3]/15 transition-all outline-none"
          />
        </div>
      </div>
    </section>
  );
};
