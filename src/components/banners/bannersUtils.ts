import { ChurchBanner, BannerStatus, MediaItem } from '../../types';
import { INITIAL_DEMO_MEDIA } from '../media/demoMediaData';

/**
 * Utilitários do Módulo de Banners da Igreja
 * Operando estritamente sobre o contrato canônico ChurchBanner
 */

/**
 * Formata data no formato DD/MM/AAAA
 */
export function formatBannerDate(dateStr?: string): string {
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
export function formatBannerDateTime(dateStr?: string): string {
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
 * Rótulo amigável para o status do banner
 */
export function getBannerStatusLabel(status: BannerStatus): string {
  switch (status) {
    case 'active':
      return 'Ativo';
    case 'inactive':
      return 'Inativo';
    default:
      return status;
  }
}

/**
 * Descrição explicativa do status do banner
 */
export function getBannerStatusDescription(status: BannerStatus): string {
  switch (status) {
    case 'active':
      return 'Exibido publicamente no site e nos blocos de destaque ativos.';
    case 'inactive':
      return 'Oculto da exibição pública e mantido como rascunho ou histórico.';
    default:
      return '';
  }
}

/**
 * Resolve o item de mídia na biblioteca de demonstração a partir do ID
 */
export function getMediaItemById(mediaId?: string): MediaItem | undefined {
  if (!mediaId) return undefined;
  return INITIAL_DEMO_MEDIA.find((m) => m.id === mediaId);
}

/**
 * Valida se uma URL utiliza apenas protocolos seguros permitidos (http ou https)
 */
export function isValidBannerUrl(url?: string): boolean {
  if (!url || !url.trim()) return true; // campo opcional
  const trimmed = url.trim().toLowerCase();
  return trimmed.startsWith('https://') || trimmed.startsWith('http://') || trimmed.startsWith('/');
}
