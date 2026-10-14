import { IMAGE_UPLOAD_CONFIG } from '../constants/defaults';

/**
 * Lê um arquivo de imagem selecionado pelo usuário, redimensiona proporcionalmente
 * para uma dimensão máxima e converte para Data URL (JPEG) comprimido.
 *
 * @param file Arquivo selecionado no input
 * @param maxDimension Dimensão máxima de largura/altura em pixels (padrão: 800px)
 * @param quality Qualidade de compressão JPEG de 0 a 1 (padrão: 0.85)
 * @returns Promise com string em formato base64 Data URL
 */
export async function compressAndResizeImage(
  file: File,
  maxDimension: number = IMAGE_UPLOAD_CONFIG.maxDimension,
  quality: number = IMAGE_UPLOAD_CONFIG.quality
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('O arquivo selecionado não é uma imagem válida.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Erro ao ler arquivo de imagem.'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Erro ao carregar bitmap da imagem.'));
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDimension) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            }
          } else {
            if (height > maxDimension) {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Falha ao obter contexto 2D do Canvas.'));
            return;
          }

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        } catch (err) {
          reject(err);
        }
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
