import type { CalculatorState, ProjectExportData } from '../types/calculator';
import { STORAGE_KEY, INITIAL_STATE } from '../constants/defaults';

/**
 * Carrega o estado da calculadora a partir do LocalStorage com tratamento resiliente de erros.
 */
export function loadProjectFromStorage(
  key: string = STORAGE_KEY,
  fallback: CalculatorState = INITIAL_STATE
): CalculatorState {
  if (typeof window === 'undefined') return fallback;

  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;

    const parsed = JSON.parse(saved);
    return mergeWithInitialState(parsed, fallback);
  } catch (err) {
    console.warn('Erro ao recuperar estado do LocalStorage:', err);
    return fallback;
  }
}

/**
 * Salva o estado da calculadora no LocalStorage.
 * @returns true se gravou com sucesso, false caso contrário (ex: cota excedida).
 */
export function saveProjectToStorage(state: CalculatorState, key: string = STORAGE_KEY): boolean {
  if (typeof window === 'undefined') return false;

  try {
    localStorage.setItem(key, JSON.stringify(state));
    return true;
  } catch (err) {
    console.warn('Cota do LocalStorage excedida ou erro de gravação:', err);
    return false;
  }
}

/**
 * Valida se um objeto desestruturado possui a estrutura mínima esperada de um projeto.
 */
export function isValidProjectPayload(obj: unknown): obj is Partial<CalculatorState> {
  if (!obj || typeof obj !== 'object') return false;
  const candidate = obj as Record<string, unknown>;

  // Checa se o objeto tem 'state' embalado (formato ProjectExportData)
  if (candidate.state && typeof candidate.state === 'object') {
    return isValidProjectPayload(candidate.state);
  }

  // Checa campos obrigatórios essenciais
  return Boolean(
    candidate.materialEquip &&
    typeof candidate.materialEquip === 'object' &&
    candidate.timeEnergy &&
    typeof candidate.timeEnergy === 'object'
  );
}

/**
 * Mescla dados parciais ou importados garantindo que nenhum campo padrão fique indefinido.
 */
export function mergeWithInitialState(
  data: unknown,
  base: CalculatorState = INITIAL_STATE
): CalculatorState {
  if (!data || typeof data !== 'object') return base;
  const raw = data as Record<string, unknown>;

  // Desempacota se vier de um ProjectExportData
  const source = (raw.state && typeof raw.state === 'object' ? raw.state : raw) as Partial<CalculatorState>;

  return {
    ...base,
    ...source,
    kitBatch: {
      ...base.kitBatch,
      ...(source.kitBatch || {}),
    },
    clientProject: {
      ...base.clientProject,
      ...(source.clientProject || {}),
    },
    materialEquip: {
      ...base.materialEquip,
      ...(source.materialEquip || {}),
    },
    timeEnergy: {
      ...base.timeEnergy,
      ...(source.timeEnergy || {}),
    },
    workExtras: {
      ...base.workExtras,
      ...(source.workExtras || {}),
    },
    marketRisks: {
      ...base.marketRisks,
      ...(source.marketRisks || {}),
    },
  };
}

/**
 * Exporta o estado atual para um arquivo .json baixado automaticamente pelo navegador.
 */
export function exportProjectAsJsonFile(state: CalculatorState, filenamePrefix?: string): void {
  if (typeof document === 'undefined') return;

  const exportPayload: ProjectExportData = {
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    state,
  };

  const nameSanitized = (filenamePrefix || state.clientProject.projectName || 'Projeto_3D')
    .replace(/[^a-zA-Z0-9_\-\u00C0-\u017F]/g, '_');
  const filename = `${nameSanitized}.json`;

  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
    type: 'application/json;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

/**
 * Lê e valida um arquivo .json selecionado pelo usuário.
 */
export async function importProjectFromJsonFile(file: File): Promise<CalculatorState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        if (!isValidProjectPayload(parsed)) {
          reject(new Error('O arquivo selecionado não contém uma estrutura válida de projeto 3D.'));
          return;
        }

        const merged = mergeWithInitialState(parsed);
        resolve(merged);
      } catch {
        reject(new Error('Erro ao processar o formato do arquivo JSON.'));
      }
    };
    reader.onerror = () => reject(new Error('Falha ao ler o arquivo selecionado.'));
    reader.readAsText(file);
  });
}
