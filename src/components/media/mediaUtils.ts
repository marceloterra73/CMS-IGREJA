import { MediaType, MediaStatus, MediaDimensions } from '../../types';

/**
 * Utilitários para formatação e apresentação amigável de mídias.
 */

/**
 * Formata tamanho em bytes para representação amigável (B, KB, MB, GB).
 * Preserva estritamente o valor numérico original sizeBytes.
 */
export const formatFileSize = (bytes: number): string => {
  if (!bytes || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const formatted = (bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1);
  return `${formatted} ${units[i]}`;
};

/**
 * Formata dimensões em pixels (ex: 1920 × 1080).
 */
export const formatDimensions = (dimensions?: MediaDimensions): string => {
  if (!dimensions || !dimensions.width || !dimensions.height) {
    return '—';
  }
  return `${dimensions.width} × ${dimensions.height}`;
};

/**
 * Rótulo amigável para MediaType.
 */
export const getMediaTypeLabel = (type: MediaType): string => {
  switch (type) {
    case 'image':
      return 'Imagem';
    case 'video':
      return 'Vídeo';
    case 'audio':
      return 'Áudio';
    case 'document':
      return 'Documento';
    default:
      return type;
  }
};

/**
 * Rótulo amigável para MediaStatus.
 */
export const getMediaStatusLabel = (status?: MediaStatus): string => {
  switch (status) {
    case 'active':
      return 'Ativo';
    case 'archived':
      return 'Arquivado';
    default:
      return 'Ativo';
  }
};
