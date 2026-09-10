import { ChurchNews, NewsStatus } from '../../types';

/**
 * Normaliza um texto para slug URL seguro e limpo
 */
export function generateNewsSlug(text: string): string {
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
 * Garante unicidade do slug entre as notícias existentes em memória
 */
export function ensureUniqueNewsSlug(
  baseSlug: string,
  existingNews: ChurchNews[],
  currentNewsId?: string
): string {
  const cleanBase = generateNewsSlug(baseSlug) || 'noticia';
  let candidate = cleanBase;
  let counter = 1;

  const otherNews = existingNews.filter((n) => n.id !== currentNewsId);

  while (otherNews.some((n) => n.slug === candidate)) {
    counter++;
    candidate = `${cleanBase}-${counter}`;
  }

  return candidate;
}

/**
 * Retorna rótulo legível em português para o status da notícia
 */
export function getNewsStatusLabel(status: NewsStatus): string {
  switch (status) {
    case 'published':
      return 'Publicada';
    case 'draft':
      return 'Rascunho';
    case 'archived':
      return 'Arquivada';
    default:
      return status;
  }
}

/**
 * Formata data em padrão brasileiro (dd/mm/aaaa)
 */
export function formatNewsDate(dateStr?: string): string {
  if (!dateStr) return 'Não definida';
  try {
    const parts = dateStr.split('T')[0].split('-');
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
 * Retorna tempo estimado de leitura baseado na quantidade de palavras
 */
export function estimateReadingTime(content: string): string {
  if (!content) return '1 min de leitura';
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} min de leitura`;
}
