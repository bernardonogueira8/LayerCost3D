import React from 'react';
import { Sparkles, Upload, Trash2, Loader2 } from 'lucide-react';
import type { ClientProjectData, KitBatchData } from '../../types/calculator';
import { InputField } from '../InputField';

export interface ClientProjectSectionProps {
  clientProject: ClientProjectData;
  kitBatch: KitBatchData;
  isKitMode: boolean;
  isImageProcessing?: boolean;
  imageInputRef: React.RefObject<HTMLInputElement | null>;
  onTriggerImageUpload: () => void;
  onImageFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  onUpdateClientProject: (patch: Partial<ClientProjectData>) => void;
  onUpdateKitBatch: (patch: Partial<KitBatchData>) => void;
}

export const ClientProjectSection: React.FC<ClientProjectSectionProps> = ({
  clientProject,
  kitBatch,
  isKitMode,
  isImageProcessing = false,
  imageInputRef,
  onTriggerImageUpload,
  onImageFileChange,
  onRemoveImage,
  onUpdateClientProject,
  onUpdateKitBatch,
}) => {
  return (
    <section className="bg-white dark:bg-[#141721] rounded-[24px] p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.36)] border border-slate-200/90 dark:border-white/[0.08] transition-colors">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5 border-b border-slate-100 dark:border-white/[0.06] pb-4">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-[#0071E3]/10 dark:bg-[#0071E3]/20 text-[#0071E3] dark:text-[#2997FF] flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Dados do Cliente e Projeto
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 font-medium">
              Informações para apresentação no orçamento comercial formal
            </p>
          </div>
        </div>
      </div>

      {/* Basic Text Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] sm:text-[14px] font-semibold text-slate-700 dark:text-zinc-200 tracking-tight">
            Nome do Cliente
          </label>
          <input
            type="text"
            value={clientProject.clientName}
            onFocus={(e) => e.target.select()}
            onChange={(e) => onUpdateClientProject({ clientName: e.target.value })}
            placeholder="Ex: João da Silva"
            className="w-full h-11 sm:h-12 px-4 bg-white dark:bg-[#1B202D] border border-slate-300 dark:border-white/10 rounded-xl text-[15px] font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:border-[#0071E3] dark:focus:border-[#2997FF] focus:ring-4 focus:ring-[#0071E3]/15 dark:focus:ring-[#2997FF]/20 transition-all outline-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] sm:text-[14px] font-semibold text-slate-700 dark:text-zinc-200 tracking-tight">
            Nome do Projeto / Peça
          </label>
          <input
            type="text"
            value={clientProject.projectName}
            onFocus={(e) => e.target.select()}
            onChange={(e) => onUpdateClientProject({ projectName: e.target.value })}
            placeholder="Ex: Suporte Articulado"
            className="w-full h-11 sm:h-12 px-4 bg-white dark:bg-[#1B202D] border border-slate-300 dark:border-white/10 rounded-xl text-[15px] font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:border-[#0071E3] dark:focus:border-[#2997FF] focus:ring-4 focus:ring-[#0071E3]/15 dark:focus:ring-[#2997FF]/20 transition-all outline-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] sm:text-[14px] font-semibold text-slate-700 dark:text-zinc-200 tracking-tight">
            Dimensões do Item
          </label>
          <input
            type="text"
            value={clientProject.dimensions}
            onFocus={(e) => e.target.select()}
            onChange={(e) => onUpdateClientProject({ dimensions: e.target.value })}
            placeholder="Ex: 150 x 42 x 2.5 mm"
            className="w-full h-11 sm:h-12 px-4 bg-white dark:bg-[#1B202D] border border-slate-300 dark:border-white/10 rounded-xl text-[15px] font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:border-[#0071E3] dark:focus:border-[#2997FF] focus:ring-4 focus:ring-[#0071E3]/15 dark:focus:ring-[#2997FF]/20 transition-all outline-none"
          />
        </div>
      </div>

      {/* Special Kit / Fornada Control inputs inside Project Card */}
      {isKitMode && (
        <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#1B202D] border border-slate-200 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      )}

      {/* Image Upload Dropzone & Service Description */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/[0.06] flex flex-col sm:flex-row items-center gap-4">
        <input
          type="file"
          ref={imageInputRef}
          onChange={onImageFileChange}
          accept="image/*"
          className="hidden"
        />

        {clientProject.referenceImage ? (
          <div className="relative group w-20 h-20 rounded-2xl border border-slate-300 dark:border-white/20 overflow-hidden bg-slate-100 dark:bg-[#1B202D] flex items-center justify-center shadow-sm shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={clientProject.referenceImage}
              alt="Referência da peça 3D"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={onRemoveImage}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
              title="Remover foto"
            >
              <Trash2 className="w-5 h-5 text-red-400" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onTriggerImageUpload}
            disabled={isImageProcessing}
            className="w-full sm:w-auto h-11 sm:h-12 px-4 border border-dashed border-slate-300 dark:border-white/20 hover:border-[#0071E3] dark:hover:border-[#2997FF] rounded-xl bg-slate-50 dark:bg-[#1B202D] hover:bg-white dark:hover:bg-[#252B3C] transition-all flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-200 shrink-0 disabled:opacity-50 cursor-pointer"
          >
            {isImageProcessing ? (
              <>
                <Loader2 className="w-4 h-4 text-[#0071E3] dark:text-[#2997FF] animate-spin" />
                <span>Processando imagem...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 text-[#0071E3] dark:text-[#2997FF]" />
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
            className="w-full h-11 sm:h-12 px-4 bg-white dark:bg-[#1B202D] border border-slate-300 dark:border-white/10 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:border-[#0071E3] dark:focus:border-[#2997FF] focus:ring-4 focus:ring-[#0071E3]/15 dark:focus:ring-[#2997FF]/20 transition-all outline-none"
          />
        </div>
      </div>
    </section>
  );
};
