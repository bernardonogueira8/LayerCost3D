import type { CalculatorState, CalculationResults } from '../types/calculator';
import { formatBRL } from './pricingService';

/**
 * Constrói a mensagem comercial formatada para envio via WhatsApp.
 */
export function buildWhatsAppQuoteMessage(
  state: CalculatorState,
  results: CalculationResults
): string {
  const { clientProject } = state;
  const isKitMode = results.isKitMode;

  const lines: string[] = [
    `*Orçamento de Impressão 3D* 🖨️✨`,
    `*Cliente:* ${clientProject.clientName || 'Cliente'}`,
    `*Projeto:* ${clientProject.projectName || 'Peça Personalizada'}`,
  ];

  if (clientProject.dimensions) {
    lines.push(`*Dimensões:* ${clientProject.dimensions}`);
  }

  const kitSuffix = isKitMode ? ' (Produção em Fornada / Kit)' : '';
  lines.push(`*Quantidade Solicitada:* ${results.quantity} unidade(s)${kitSuffix}`);
  lines.push(`*Prazo de Produção:* ${clientProject.leadTimeDays || 3} dias úteis`);
  lines.push('');
  lines.push(`*Valor Unitário:* ${formatBRL(results.unitSellingPrice)}`);

  if (results.quantity > 1) {
    lines.push(
      `*Valor Total (${results.quantity} un):* ${formatBRL(results.totalSellingPrice)}`
    );
  }

  lines.push('');
  lines.push(`*Condições:* PIX ou Cartão. Proposta válida por 15 dias.`);
  lines.push(`_Dúvidas estamos à disposição!_`);

  return lines.join('\n');
}

/**
 * Copia um texto para a área de transferência do usuário com fallback seguro.
 * @returns true se copiado com sucesso, false caso contrário.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    console.warn('Clipboard API falhou, tentando fallback legado:', err);
  }

  // Fallback legado com textarea invisível
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    textArea.remove();
    return successful;
  } catch (fallbackErr) {
    console.error('Falha ao copiar texto:', fallbackErr);
    return false;
  }
}
