import { ChurchGalleryAlbum, GalleryStatus, MediaItem } from '../../types';
import { INITIAL_DEMO_MEDIA } from '../media/demoMediaData';

/**
 * Utilitários do Módulo de Galeria de Fotos da Igreja
 * Operando estritamente sobre o contrato canônico ChurchGalleryAlbum
 */

/**
 * Formata data no formato DD/MM/AAAA
 */
export function formatGalleryDate(dateStr?: string): string {
  if (!dateStr) return 'Data não informada';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
}

/**
 * Formata data e hora no formato DD/MM/AAAA às HH:mm
 */
export function formatGalleryDateTime(dateStr?: string): string {
  if (!dateStr) return 'Data não informada';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return dateStr;
  }
}

/**
 * Rótulo amigável para o status de galeria
 */
export function getGalleryStatusLabel(status: GalleryStatus): string {
  switch (status) {
    case 'active':
      return 'Ativo';
    case 'archived':
      return 'Arquivado';
    default:
      return status;
  }
}

/**
 * Descrição explicativa do status
 */
export function getGalleryStatusDescription(status: GalleryStatus): string {
  switch (status) {
    case 'active':
      return 'Álbum visível e publicado na galeria da congregação.';
    case 'archived':
      return 'Álbum arquivado e mantido no histórico interno.';
    default:
      return '';
  }
}

/**
 * Gera um slug normalizado a partir de uma string de título
 */
export function generateGallerySlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9]+/g, '-') // substitui caracteres especiais por hífen
    .replace(/^-+|-+$/g, '') // remove hífens no início e fim
    .slice(0, 80);
}

/**
 * Busca item de mídia no catálogo de mídias pelo ID
 */
export function getMediaItemById(mediaId?: string): MediaItem | undefined {
  if (!mediaId) return undefined;
  return INITIAL_DEMO_MEDIA.find((m) => m.id === mediaId);
}

/**
 * Retorna a lista de itens de mídia a partir de uma lista de IDs
 */
export function getMediaItemsByIds(mediaIds: string[]): MediaItem[] {
  if (!mediaIds || mediaIds.length === 0) return [];
  const map = new Map<string, MediaItem>();
  INITIAL_DEMO_MEDIA.forEach((m) => map.set(m.id, m));
  return mediaIds.map((id) => map.get(id)).filter((m): m is MediaItem => m !== undefined);
}
