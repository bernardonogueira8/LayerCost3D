import { useState, useRef, useCallback } from 'react';
import { compressAndResizeImage } from '../services/imageService';

export interface UseImageUploadReturn {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isProcessing: boolean;
  triggerUpload: () => void;
  handleFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (dataUrl: string) => void
  ) => Promise<void>;
  clearFileInput: () => void;
}

/**
 * Hook customizado para upload e compressão de imagens via Canvas.
 */
export function useImageUpload(): UseImageUploadReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const triggerUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const clearFileInput = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleFileChange = useCallback(
    async (
      e: React.ChangeEvent<HTMLInputElement>,
      onSuccess: (dataUrl: string) => void
    ) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        setIsProcessing(true);
        const dataUrl = await compressAndResizeImage(file);
        onSuccess(dataUrl);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Erro ao processar imagem.';
        alert(message);
      } finally {
        setIsProcessing(false);
        e.target.value = '';
      }
    },
    []
  );

  return {
    fileInputRef,
    isProcessing,
    triggerUpload,
    handleFileChange,
    clearFileInput,
  };
}
