import { FormFieldType, FormStatus } from '../../types';

/**
 * Utilitários para gestão de formulários e tipos canônicos da Fase 33.
 */

/**
 * Gera um slug limpo a partir de uma string de texto.
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // remove caracteres especiais
    .trim()
    .replace(/\s+/g, '-') // espaços por hífens
    .replace(/-+/g, '-'); // múltiplos hífens por um único
};

/**
 * Garante que o slug gerado seja único na lista atual de formulários.
 */
export const ensureUniqueSlug = (
  baseSlug: string,
  existingSlugs: string[],
  currentFormId?: string,
  allForms?: { id: string; slug: string }[]
): string => {
  const normalizedBase = baseSlug || 'formulario';
  let candidate = normalizedBase;
  let counter = 2;

  const isSlugTaken = (slug: string) => {
    if (allForms && currentFormId) {
      return allForms.some((f) => f.slug === slug && f.id !== currentFormId);
    }
    return existingSlugs.includes(slug);
  };

  while (isSlugTaken(candidate)) {
    candidate = `${normalizedBase}-${counter}`;
    counter++;
  }

  return candidate;
};

/**
 * Rótulo amigável para o FormFieldType canônico.
 */
export const getFieldTypeLabel = (type: FormFieldType): string => {
  switch (type) {
    case 'text':
      return 'Texto';
    case 'textarea':
      return 'Área de texto';
    case 'email':
      return 'E-mail';
    case 'tel':
      return 'Telefone';
    case 'number':
      return 'Número';
    case 'url':
      return 'URL';
    case 'date':
      return 'Data';
    case 'select':
      return 'Select';
    case 'radio':
      return 'Radio';
    case 'checkbox':
      return 'Checkbox';
    case 'boolean':
      return 'Booleano';
    default:
      return type;
  }
};

/**
 * Rótulo amigável para FormStatus.
 */
export const getFormStatusLabel = (status: FormStatus): string => {
  switch (status) {
    case 'draft':
      return 'Rascunho';
    case 'active':
      return 'Ativo';
    case 'archived':
      return 'Arquivado';
    default:
      return status;
  }
};
