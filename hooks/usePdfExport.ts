import { useState, useRef, useCallback } from 'react';
import type { CalculatorState } from '../types/calculator';
import { generatePdfFromElement } from '../services/pdfService';

export interface QuoteMetadata {
  quoteNumber: string;
  quoteDate: string;
  validUntilDate: string;
}

export interface UsePdfExportReturn {
  isPreviewOpen: boolean;
  quoteMeta: QuoteMetadata;
  isExportingDirect: boolean;
  hiddenPdfRef: React.RefObject<HTMLDivElement | null>;
  openPreview: () => void;
  closePreview: () => void;
  exportDirectPdf: (state: CalculatorState) => Promise<void>;
}

/**
 * Hook customizado para exportação de orçamento em PDF e controle do modal de pré-visualização.
 */
export function usePdfExport(): UsePdfExportReturn {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [quoteMeta, setQuoteMeta] = useState<QuoteMetadata>({
    quoteNumber: 'ORC-2026-1001',
    quoteDate: '14/10/2026',
    validUntilDate: '29/10/2026',
  });
  const [isExportingDirect, setIsExportingDirect] = useState(false);
  const hiddenPdfRef = useRef<HTMLDivElement | null>(null);

  const openPreview = useCallback(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const validUntil = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString(
      'pt-BR',
      { day: '2-digit', month: '2-digit', year: 'numeric' }
    );
    const code = String(today.getFullYear()) + String(today.getMonth() + 1).padStart(2, '0');
    setQuoteMeta({
      quoteNumber: `ORC-${code}-1001`,
      quoteDate: formattedDate,
      validUntilDate: validUntil,
    });
    setIsPreviewOpen(true);
  }, []);

  const closePreview = useCallback(() => {
    setIsPreviewOpen(false);
  }, []);

  const exportDirectPdf = useCallback(async (state: CalculatorState) => {
    const targetElement = hiddenPdfRef.current;
    if (!targetElement) return;

    try {
      setIsExportingDirect(true);
      const filename = `Orcamento_${state.clientProject.clientName || 'Cliente'}_${state.clientProject.projectName || 'Projeto'}.pdf`
        .replace(/[^a-zA-Z0-9_\-\.]/g, '_');

      const elementToCapture = (targetElement.firstElementChild as HTMLElement) || targetElement;
      await generatePdfFromElement(elementToCapture, filename);
    } catch (err) {
      console.error('Erro na exportação direta de PDF:', err);
      alert('Erro ao gerar PDF. Experimente abrir a opção "Visualizar e Baixar PDF" para verificar os detalhes.');
    } finally {
      setIsExportingDirect(false);
    }
  }, []);

  return {
    isPreviewOpen,
    quoteMeta,
    isExportingDirect,
    hiddenPdfRef,
    openPreview,
    closePreview,
    exportDirectPdf,
  };
}
