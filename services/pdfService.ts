import { toPng } from 'html-to-image';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { PDF_PAGE_CONFIG } from '../constants/defaults';

/**
 * Renderiza um elemento HTML A4 e faz o download direto do documento PDF gerado.
 *
 * @param element Elemento HTML contendo o template do orçamento
 * @param filename Nome do arquivo PDF para download
 */
export async function generatePdfFromElement(
  element: HTMLElement,
  filename: string = PDF_PAGE_CONFIG.defaultFilename
): Promise<void> {
  try {
    // 1. Aguarda fontes web carregarem completamente
    if (typeof document !== 'undefined' && 'fonts' in document) {
      await document.fonts.ready;
    }

    // 2. Aguarda pintura de layout e imagens
    await new Promise((resolve) => setTimeout(resolve, 100));

    let imgData: string;

    try {
      // Método principal: html-to-image (SVG foreignObject - alta fidelidade)
      imgData = await toPng(element, {
        width: PDF_PAGE_CONFIG.pixelWidth,
        height: PDF_PAGE_CONFIG.pixelHeight,
        pixelRatio: PDF_PAGE_CONFIG.pixelRatio,
        backgroundColor: '#ffffff',
        cacheBust: true,
        style: {
          backgroundColor: '#ffffff',
          colorScheme: 'light',
          color: '#1D1D1F',
          margin: '0',
          transform: 'none',
        },
      });
    } catch (toImageErr) {
      console.warn('html-to-image falhou, aplicando fallback html2canvas:', toImageErr);
      const canvas = await html2canvas(element, {
        scale: PDF_PAGE_CONFIG.pixelRatio,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        x: 0,
        y: 0,
        width: PDF_PAGE_CONFIG.pixelWidth,
        height: PDF_PAGE_CONFIG.pixelHeight,
        windowWidth: PDF_PAGE_CONFIG.pixelWidth,
        windowHeight: PDF_PAGE_CONFIG.pixelHeight,
        onclone: (clonedDoc, clonedElement) => {
          // Garante isolamento estrito de tema claro no clone do DOM
          clonedDoc.documentElement.classList.remove('dark');
          clonedDoc.documentElement.classList.add('light');
          clonedDoc.documentElement.style.colorScheme = 'light';
          clonedDoc.body.classList.remove('dark');
          clonedDoc.body.classList.add('light');
          clonedDoc.body.style.backgroundColor = '#ffffff';
          clonedDoc.body.style.color = '#1D1D1F';
          clonedDoc.body.style.colorScheme = 'light';

          // Garante posicionamento correto sem deslocamento offscreen
          clonedElement.style.position = 'static';
          clonedElement.style.left = '0px';
          clonedElement.style.top = '0px';
          clonedElement.style.margin = '0px';
          clonedElement.style.transform = 'none';
          clonedElement.style.backgroundColor = '#ffffff';
          clonedElement.style.color = '#1D1D1F';
        },
      });
      imgData = canvas.toDataURL('image/png');
    }

    // 3. Cria documento PDF A4 portrait (210 x 297 mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // 4. Insere a imagem cobrindo toda a página A4
    pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');

    // 5. Salva diretamente no navegador
    pdf.save(filename);
  } catch (error) {
    console.error('Erro na geração do PDF:', error);
    throw error;
  }
}
