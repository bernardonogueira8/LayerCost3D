import { useState, useRef, useCallback } from 'react';
import type { CalculatorState } from '../types/calculator';
import { exportProjectAsJsonFile, importProjectFromJsonFile } from '../services/storageService';

export interface UseProjectStorageReturn {
  notification: string | null;
  jsonInputRef: React.RefObject<HTMLInputElement | null>;
  handleNewProject: (onReset: () => void) => void;
  handleSaveJson: (state: CalculatorState) => void;
  triggerOpenJson: () => void;
  handleJsonFileSelected: (
    e: React.ChangeEvent<HTMLInputElement>,
    onLoadState: (state: CalculatorState) => void
  ) => Promise<void>;
}

/**
 * Hook customizado para gerenciar operações de novo projeto, importação e exportação de JSON.
 */
export function useProjectStorage(): UseProjectStorageReturn {
  const [notification, setNotification] = useState<string | null>(null);
  const jsonInputRef = useRef<HTMLInputElement | null>(null);

  const showNotification = useCallback((message: string, durationMs: number = 3000) => {
    setNotification(message);
    setTimeout(() => {
      setNotification((curr) => (curr === message ? null : curr));
    }, durationMs);
  }, []);

  const handleNewProject = useCallback(
    (onReset: () => void) => {
      const confirmReset = window.confirm(
        'Deseja iniciar um novo projeto? Os dados atuais serão redefinidos para os valores padrão.'
      );
      if (confirmReset) {
        onReset();
        showNotification('Novo projeto iniciado com sucesso!');
      }
    },
    [showNotification]
  );

  const handleSaveJson = useCallback(
    (state: CalculatorState) => {
      try {
        exportProjectAsJsonFile(state);
        showNotification('Projeto salvo com sucesso!');
      } catch (err) {
        console.error('Erro ao exportar projeto:', err);
        showNotification('Erro ao salvar projeto em arquivo.');
      }
    },
    [showNotification]
  );

  const triggerOpenJson = useCallback(() => {
    jsonInputRef.current?.click();
  }, []);

  const handleJsonFileSelected = useCallback(
    async (
      e: React.ChangeEvent<HTMLInputElement>,
      onLoadState: (state: CalculatorState) => void
    ) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const loadedState = await importProjectFromJsonFile(file);
        onLoadState(loadedState);
        showNotification('Projeto importado com sucesso!');
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Erro ao importar arquivo JSON.';
        alert(message);
      } finally {
        e.target.value = '';
      }
    },
    [showNotification]
  );

  return {
    notification,
    jsonInputRef,
    handleNewProject,
    handleSaveJson,
    triggerOpenJson,
    handleJsonFileSelected,
  };
}
