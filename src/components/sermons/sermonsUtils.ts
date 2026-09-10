import { ChurchSermon, SermonStatus } from '../../types';

/**
 * Normaliza um texto para slug URL seguro e limpo
 */
export function generateSermonSlug(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // remove caracteres não alfanuméricos
    .trim()
    .replace(/\s+/g, '-') // substitui múltiplos espaços por hífens
    .replace(/-+/g, '-'); // remove hífens consecutivos
}

/**
 * Garante unicidade do slug entre os sermões existentes em memória
 */
export function ensureUniqueSermonSlug(
  baseSlug: string,
  existingSermons: ChurchSermon[],
  currentSermonId?: string
): string {
  const cleanBase = generateSermonSlug(baseSlug) || 'sermao';
  let candidate = cleanBase;
  let counter = 1;

  const otherSermons = existingSermons.filter((s) => s.id !== currentSermonId);

  while (otherSermons.some((s) => s.slug === candidate)) {
    counter++;
    candidate = `${cleanBase}-${counter}`;
  }

  return candidate;
}

/**
 * Retorna rótulo legível em português para o status do sermão
 */
export function getSermonStatusLabel(status: SermonStatus): string {
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
export function formatSermonDate(dateStr?: string): string {
  if (!dateStr) return 'Data não informada';
  try {
    const cleanDate = dateStr.split('T')[0];
    const parts = cleanDate.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];
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
 * Validação rigorosa de segurança para URLs de vídeo.
 * Aceita exclusivamente protocolos seguros http:// e https://.
 * Rejeita expressamente esquemas perigosos como javascript:, data:, vbscript:, scripts ou HTML.
 */
export function isValidVideoUrl(url?: string): boolean {
  if (!url || !url.trim()) return true; // campo opcional
  const trimmed = url.trim().toLowerCase();

  // Rejeita esquemas inseguros
  if (
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('vbscript:') ||
    trimmed.includes('<script') ||
    trimmed.includes('</script') ||
    trimmed.includes('<') ||
    trimmed.includes('>') ||
    trimmed.includes('"') ||
    trimmed.includes("'")
  ) {
    return false;
  }

  // Aceita apenas http:// e https://
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}
