import { PrayerRequestStatus } from '../../types';

/**
 * Formata data ISO para padrão brasileiro legível.
 */
export function formatPrayerDate(dateString?: string): string {
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
 * Formata data e hora para visualização detalhada no preview.
 */
export function formatPrayerDateTime(dateString?: string): string {
  if (!dateString) return 'Data não informada';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

/**
 * Rótulo humanizado para o status do pedido de oração.
 */
export function getPrayerStatusLabel(status: PrayerRequestStatus): string {
  switch (status) {
    case 'pending':
      return 'Pendente';
    case 'praying':
      return 'Em Oração';
    case 'answered':
      return 'Respondido';
    case 'archived':
      return 'Arquivado';
    default:
      return status;
  }
}

/**
 * Descrição contextual do status para auxílio pastoral na interface.
 */
export function getPrayerStatusDescription(status: PrayerRequestStatus): string {
  switch (status) {
    case 'pending':
      return 'Recebido recentemente, aguardando triagem pela equipe pastoral.';
    case 'praying':
      return 'Em intercessão ativa pelos grupos de oração e liderança.';
    case 'answered':
      return 'Motivo de louvor e oração respondida relatada pela pessoa.';
    case 'archived':
      return 'Pedido arquivado após o período de intercessão congregacional.';
    default:
      return '';
  }
}
