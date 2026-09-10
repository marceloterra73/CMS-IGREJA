import { ChurchEvent, EventStatus } from '../../types';

/**
 * Normaliza um texto para slug URL amigável e limpo
 */
export function generateEventSlug(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // remove caracteres especiais
    .trim()
    .replace(/\s+/g, '-') // substitui espaços por hífens
    .replace(/-+/g, '-'); // remove hífens duplicados
}

/**
 * Garante unicidade do slug entre os eventos existentes em memória
 */
export function ensureUniqueEventSlug(
  baseSlug: string,
  existingEvents: ChurchEvent[],
  currentEventId?: string
): string {
  const cleanBase = generateEventSlug(baseSlug) || 'evento';
  let candidate = cleanBase;
  let counter = 1;

  const otherEvents = existingEvents.filter((e) => e.id !== currentEventId);

  while (otherEvents.some((e) => e.slug === candidate)) {
    counter++;
    candidate = `${cleanBase}-${counter}`;
  }

  return candidate;
}

/**
 * Retorna rótulo legível em português para o status do evento
 */
export function getEventStatusLabel(status: EventStatus): string {
  switch (status) {
    case 'published':
      return 'Publicado';
    case 'draft':
      return 'Rascunho';
    case 'archived':
      return 'Arquivado';
    default:
      return status;
  }
}

/**
 * Formata data em padrão brasileiro (dd/mm/aaaa)
 */
export function formatEventDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const month = parts[1];
      const day = parts[2].slice(0, 2);
      return `${day}/${month}/${year}`;
    }
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('pt-BR');
  } catch {
    return dateStr;
  }
}

/**
 * Formata intervalo de datas do evento
 */
export function formatEventDateRange(startDate: string, endDate?: string): string {
  const startFormatted = formatEventDate(startDate);
  if (!endDate || endDate === startDate) {
    return startFormatted;
  }
  const endFormatted = formatEventDate(endDate);
  return `${startFormatted} a ${endFormatted}`;
}

/**
 * Verifica se o evento é futuro/próximo ou passado
 * Utiliza o dia atual local como referência
 */
export function isEventUpcoming(startDateStr: string): boolean {
  if (!startDateStr) return true;
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString().split('T')[0];
    const eventDate = startDateStr.split('T')[0];
    return eventDate >= today;
  } catch {
    return true;
  }
}

/**
 * Extrai dia e mês abreviado para badges visuais de calendário
 */
export function getEventDateBadgeInfo(dateStr: string): { day: string; month: string } {
  if (!dateStr) return { day: '--', month: '---' };
  try {
    const parts = dateStr.split('-');
    if (parts.length >= 3) {
      const day = parts[2].slice(0, 2);
      const monthNum = parseInt(parts[1], 10);
      const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
      const month = months[monthNum - 1] || '---';
      return { day, month };
    }
  } catch {
    // fallback
  }
  return { day: '01', month: 'SET' };
}
