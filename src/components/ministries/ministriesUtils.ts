import { ChurchMinistry, MinistryStatus } from '../../types';

/**
 * Normaliza e gera um slug amigável para URLs a partir do nome do ministério.
 * Ex: "Ministério de Louvor & Adoração" -> "ministerio-de-louvor-e-adoracao"
 */
export function generateMinistrySlug(name: string): string {
  if (!name) return '';

  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/&/g, '-e-') // Substitui & por -e-
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .trim()
    .replace(/\s+/g, '-') // Espaços para hífens
    .replace(/-+/g, '-'); // Remove hífens duplicados
}

/**
 * Garante que o slug gerado é único dentro da lista de ministérios da igreja.
 * Adiciona sufixo numérico caso já exista slug idêntico.
 */
export function ensureUniqueMinistrySlug(
  baseSlug: string,
  existingMinistries: ChurchMinistry[],
  excludeId?: string
): string {
  const normalized = generateMinistrySlug(baseSlug) || 'ministerio';
  let candidate = normalized;
  let counter = 1;

  while (
    existingMinistries.some(
      (item) => item.slug === candidate && item.id !== excludeId
    )
  ) {
    counter++;
    candidate = `${normalized}-${counter}`;
  }

  return candidate;
}

/**
 * Formata data ISO para padrão brasileiro legível.
 */
export function formatMinistryDate(dateString?: string): string {
  if (!dateString) return 'Data não informada';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Retorna rótulo humanizado do status do ministério.
 */
export function getMinistryStatusLabel(status: MinistryStatus): string {
  switch (status) {
    case 'active':
      return 'Ativo';
    case 'inactive':
      return 'Inativo';
    default:
      return status;
  }
}
