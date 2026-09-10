import { ChurchLeader, LeaderStatus, MediaItem } from '../../types';
import { INITIAL_DEMO_MEDIA } from '../media/demoMediaData';

/**
 * Utilitários do Módulo de Lideranças da Igreja
 * Operando estritamente sobre o contrato canônico ChurchLeader
 */

/**
 * Formata data no formato DD/MM/AAAA
 */
export function formatLeaderDate(dateStr?: string): string {
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
export function formatLeaderDateTime(dateStr?: string): string {
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
 * Rótulo amigável para o status de liderança
 */
export function getLeaderStatusLabel(status: LeaderStatus): string {
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
 * Descrição explicativa do status da liderança
 */
export function getLeaderStatusDescription(status: LeaderStatus): string {
  switch (status) {
    case 'active':
      return 'Em pleno exercício ministerial na igreja local.';
    case 'inactive':
      return 'Função temporariamente suspensa, licenciada ou emérita.';
    default:
      return '';
  }
}

/**
 * Obtém o item de mídia correspondente ao photoMediaId a partir da biblioteca de mídia
 */
export function getMediaItemById(mediaId?: string): MediaItem | undefined {
  if (!mediaId) return undefined;
  return INITIAL_DEMO_MEDIA.find((item) => item.id === mediaId);
}

/**
 * Gera iniciais do nome para avatar alternativo quando não houver foto cadastrada
 */
export function getLeaderInitials(name: string): string {
  if (!name) return 'L';
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
