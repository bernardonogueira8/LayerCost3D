import React, { useRef, useState } from 'react';
import type { CalculatorState, CalculationResults } from '../types/calculator';
import type { QuoteMetadata } from '../hooks/usePdfExport';
import { PdfQuoteTemplate } from './PdfQuoteTemplate';
import { generatePdfFromElement } from '../services/pdfService';
import { Download, Printer, X, Check, Loader2, Sparkles, ZoomIn, ZoomOut } from 'lucide-react';

export interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: CalculatorState;
  results: CalculationResults;
  quoteMeta?: QuoteMetadata;
  onUpdateClientProject: (data: Partial<CalculatorState['clientProject']>) => void;
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  isOpen,
  onClose,
  state,
  results,
  quoteMeta = {
    quoteNumber: 'ORC-2026-1001',
    quoteDate: '14/10/2026',
    validUntilDate: '29/10/2026',
  },
  onUpdateClientProject,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [zoom, setZoom] = useState(0.72);
  const cleanOffscreenRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleDownloadPdf = async () => {
    const targetElement = cleanOffscreenRef.current;
    if (!targetElement) return;

    try {
      setIsGenerating(true);
      const filename = `Orcamento_${state.clientProject.clientName || 'Cliente'}_${state.clientProject.projectName || 'Projeto'}.pdf`
        .replace(/[^a-zA-Z0-9_\-\.]/g, '_');

      const elementToCapture = (targetElement.firstElementChild as HTMLElement) || targetElement;
      await generatePdfFromElement(elementToCapture, filename);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Erro ao gerar PDF no modal:', err);
      alert('Houve um erro ao gerar o arquivo PDF. Por favor, tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#141721] rounded-[24px] shadow-[0_24px_80px_rgba(0,0,0,0.3)] max-w-6xl w-full max-h-[94vh] flex flex-col overflow-hidden border border-slate-200 dark:border-white/10 transition-colors">
        {/* Top Modal Header */}
        <div className="px-6 py-4 bg-white dark:bg-[#141721] text-slate-900 dark:text-white flex justify-between items-center border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-[#0071E3]/15 text-[#0071E3] dark:text-[#2997FF] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-lg leading-tight">Pré-visualização do Orçamento (A4)</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 font-medium">
                Verifique a proposta comercial e proporções antes de exportar o arquivo PDF
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-[#1B202D] hover:bg-slate-200 dark:hover:bg-[#252B3C] text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left customizer controls, Right PDF preview */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-100 dark:bg-[#0B0D13] grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Customizer Sidebar */}
          <div className="lg:col-span-4 bg-white dark:bg-[#1B202D] p-5 rounded-[20px] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col gap-4 self-start">
            <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-2.5 flex items-center justify-between">
              <span>Personalizar Cabeçalho</span>
              <span className="text-xs text-[#0071E3] dark:text-[#2997FF] bg-[#0071E3]/10 dark:bg-[#2997FF]/15 px-2.5 py-0.5 rounded-full font-bold">Tempo Real</span>
            </h4>

            <div>
              <label className="text-[13px] font-semibold text-slate-700 dark:text-zinc-200">Sua Marca / Empresa</label>
              <input
                type="text"
                value={state.clientProject.companyName}
                onFocus={(e) => e.target.select()}
                onChange={(e) => onUpdateClientProject({ companyName: e.target.value })}
                placeholder="Ex: Prime 3D Studio"
                className="w-full mt-1.5 px-3.5 py-2 text-sm bg-slate-50 dark:bg-[#141721] border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:bg-white dark:focus:bg-[#141721] focus:border-[#0071E3] dark:focus:border-[#2997FF] focus:ring-4 focus:ring-[#0071E3]/15 outline-none font-medium"
              />
            </div>

            <div>
              <label className="text-[13px] font-semibold text-slate-700 dark:text-zinc-200">Contato / WhatsApp / Redes</label>
              <input
                type="text"
                value={state.clientProject.companyContact}
                onFocus={(e) => e.target.select()}
                onChange={(e) => onUpdateClientProject({ companyContact: e.target.value })}
                placeholder="Ex: (11) 99999-9999 | @seu_studio"
                className="w-full mt-1.5 px-3.5 py-2 text-sm bg-slate-50 dark:bg-[#141721] border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:border-[#0071E3] dark:focus:border-[#2997FF] focus:ring-4 focus:ring-[#0071E3]/15 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[13px] font-semibold text-slate-700 dark:text-zinc-200">Prazo (Dias)</label>
                <input
                  type="number"
                  min="1"
                  value={state.clientProject.leadTimeDays || ''}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const val = e.target.value;
                    onUpdateClientProject({ leadTimeDays: val === '' ? 0 : parseInt(val, 10) || 0 });
                  }}
                  onBlur={() => {
                    if (!state.clientProject.leadTimeDays || state.clientProject.leadTimeDays < 1) {
                      onUpdateClientProject({ leadTimeDays: 1 });
                    }
                  }}
                  className="w-full mt-1.5 px-3.5 py-2 text-sm bg-slate-50 dark:bg-[#141721] border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:border-[#0071E3] dark:focus:border-[#2997FF] focus:ring-4 focus:ring-[#0071E3]/15 outline-none font-semibold"
                />
              </div>

              <div>
                <label className="text-[13px] font-semibold text-slate-700 dark:text-zinc-200">Cor / Acabamento</label>
                <input
                  type="text"
                  value={state.clientProject.color || ''}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => onUpdateClientProject({ color: e.target.value })}
                  placeholder="Ex: Preto"
                  className="w-full mt-1.5 px-3.5 py-2 text-sm bg-slate-50 dark:bg-[#141721] border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:border-[#0071E3] dark:focus:border-[#2997FF] focus:ring-4 focus:ring-[#0071E3]/15 outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-[13px] font-semibold text-slate-700 dark:text-zinc-200">Dimensões do Item</label>
              <input
                type="text"
                value={state.clientProject.dimensions || ''}
                onFocus={(e) => e.target.select()}
                onChange={(e) => onUpdateClientProject({ dimensions: e.target.value })}
                placeholder="Ex: 150 x 42 x 2.5 mm"
                className="w-full mt-1.5 px-3.5 py-2 text-sm bg-slate-50 dark:bg-[#141721] border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:border-[#0071E3] dark:focus:border-[#2997FF] focus:ring-4 focus:ring-[#0071E3]/15 outline-none font-semibold"
              />
            </div>

            <div>
              <label className="text-[13px] font-semibold text-slate-700 dark:text-zinc-200">Descrição do Serviço</label>
              <textarea
                rows={3}
                value={state.clientProject.serviceDescription}
                onFocus={(e) => e.target.select()}
                onChange={(e) => onUpdateClientProject({ serviceDescription: e.target.value })}
                placeholder="Descrição técnica detalhada..."
                className="w-full mt-1.5 px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-[#141721] border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:border-[#0071E3] dark:focus:border-[#2997FF] focus:ring-4 focus:ring-[#0071E3]/15 outline-none resize-none"
              />
            </div>

            <div>
              <label className="text-[13px] font-semibold text-slate-700 dark:text-zinc-200">Observações adicionais</label>
              <textarea
                rows={2}
                value={state.clientProject.notes}
                onFocus={(e) => e.target.select()}
                onChange={(e) => onUpdateClientProject({ notes: e.target.value })}
                placeholder="Ex: Peça para uso decorativo, não expor ao sol..."
                className="w-full mt-1.5 px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-[#141721] border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:border-[#0071E3] dark:focus:border-[#2997FF] focus:ring-4 focus:ring-[#0071E3]/15 outline-none resize-none"
              />
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-white/10 text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              💡 <em>O orçamento oculta custos internos e exibe exclusivamente a proposta comercial formal ao cliente.</em>
            </div>
          </div>

          {/* PDF Paper Preview: Perfectly Scaled Sheet */}
          <div className="lg:col-span-8 flex flex-col items-center">
            {/* Zoom Controls Toolbar */}
            <div className="flex items-center justify-between w-full max-w-[580px] mb-3 px-4 py-2 bg-white dark:bg-[#1B202D] rounded-full border border-slate-200 dark:border-white/10 shadow-sm text-xs sm:text-sm text-slate-800 dark:text-zinc-200">
              <span className="font-semibold text-slate-600 dark:text-zinc-400">Folha A4 Proporcional</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(0.45, Math.round((z - 0.08) * 100) / 100))}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-[#252B3C] rounded-full text-slate-700 dark:text-zinc-200 transition cursor-pointer"
                  title="Diminuir Zoom"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white w-12 text-center tabular-nums">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(1.0, Math.round((z + 0.08) * 100) / 100))}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-[#252B3C] rounded-full text-slate-700 dark:text-zinc-200 transition cursor-pointer"
                  title="Aumentar Zoom"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoom(0.72)}
                  className="ml-2 text-xs font-bold text-[#0071E3] dark:text-[#2997FF] bg-[#0071E3]/10 dark:bg-[#2997FF]/15 px-3 py-1 rounded-full hover:bg-[#0071E3]/20 transition cursor-pointer"
                >
                  Ajustar
                </button>
              </div>
            </div>

            {/* Document Paper Container (always white sheet since it is an A4 print preview) */}
            <div
              className="shadow-2xl rounded-xl border border-slate-300 dark:border-black/50 bg-white"
              style={{
                width: `${794 * zoom}px`,
                height: `${1123 * zoom}px`,
                overflow: 'hidden',
              }}
            >
              <div
                className="light"
                data-theme="light"
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: 'top left',
                  width: '794px',
                  height: '1123px',
                  backgroundColor: '#ffffff',
                  color: '#1D1D1F',
                  colorScheme: 'light',
                }}
              >
                <PdfQuoteTemplate
                  state={state}
                  results={results}
                  quoteNumber={quoteMeta.quoteNumber}
                  quoteDate={quoteMeta.quoteDate}
                  validUntilDate={quoteMeta.validUntilDate}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="px-6 py-4 bg-white dark:bg-[#141721] border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#34C759]"></span>
            <span>Folha A4 proporcional (210 x 297 mm) • Sem margens cortadas</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
            >
              Voltar e Editar
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-zinc-200 bg-slate-100 hover:bg-slate-200 dark:bg-[#1B202D] dark:hover:bg-[#252B3C] rounded-full transition flex items-center gap-2 border border-slate-200 dark:border-white/10 cursor-pointer"
              title="Abre a janela de impressão nativa do navegador"
            >
              <Printer className="w-4 h-4" />
              Imprimir / PDF Vetorial
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#0071E3] hover:bg-[#0077ED] dark:bg-[#0A84FF] dark:hover:bg-[#2094FF] active:scale-[0.99] rounded-full shadow-[0_2px_12px_rgba(0,113,227,0.3)] transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Gerando PDF...
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  PDF Baixado!
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Baixar Orçamento em PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Clean Render Target: Positioned offscreen for clean PDF capture */}
      <div
        id="single-print-root"
        style={{
          position: 'fixed',
          left: '-9999px',
          top: '-9999px',
          width: '794px',
          minWidth: '794px',
          maxWidth: '794px',
          height: '1123px',
          minHeight: '1123px',
          maxHeight: '1123px',
          zIndex: -9999,
          pointerEvents: 'none',
          backgroundColor: '#ffffff',
          overflow: 'hidden',
          visibility: 'visible',
        }}
        aria-hidden="true"
      >
        <div ref={cleanOffscreenRef} className="light" data-theme="light">
          <PdfQuoteTemplate
            state={state}
            results={results}
            quoteNumber={quoteMeta.quoteNumber}
            quoteDate={quoteMeta.quoteDate}
            validUntilDate={quoteMeta.validUntilDate}
          />
        </div>
      </div>
    </div>
  );
};
