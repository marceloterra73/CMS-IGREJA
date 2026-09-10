import { ChurchSchedule } from '../../types';

export const CANONICAL_WEEKDAYS = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
] as const;

export type WeekdayOption = (typeof CANONICAL_WEEKDAYS)[number];

/**
 * Obtém o índice do dia da semana para ordenação cronológica da semana (Domingo = 0, Sábado = 6)
 */
export function getWeekdayOrderIndex(dayOfWeek?: string): number {
  if (!dayOfWeek) return 7;
  const index = CANONICAL_WEEKDAYS.findIndex(
    (w) => w.toLowerCase() === dayOfWeek.trim().toLowerCase()
  );
  return index >= 0 ? index : 7;
}

/**
 * Compara dois horários no formato HH:mm
 */
export function compareTimes(timeA?: string, timeB?: string): number {
  const a = timeA || '00:00';
  const b = timeB || '00:00';
  return a.localeCompare(b);
}

/**
 * Ordenação pura baseada em campos existentes de ChurchSchedule
 */
export function sortSchedules(
  schedules: ChurchSchedule[],
  sortBy: 'day_asc' | 'time_asc' | 'title_asc' | 'status_asc'
): ChurchSchedule[] {
  const copy = [...schedules];

  switch (sortBy) {
    case 'day_asc':
      return copy.sort((a, b) => {
        const dayDiff =
          getWeekdayOrderIndex(a.dayOfWeek) - getWeekdayOrderIndex(b.dayOfWeek);
        if (dayDiff !== 0) return dayDiff;
        return compareTimes(a.time, b.time);
      });

    case 'time_asc':
      return copy.sort((a, b) => {
        const timeDiff = compareTimes(a.time, b.time);
        if (timeDiff !== 0) return timeDiff;
        return (a.title || '').localeCompare(b.title || '', 'pt-BR');
      });

    case 'title_asc':
      return copy.sort((a, b) =>
        (a.title || '').localeCompare(b.title || '', 'pt-BR')
      );

    case 'status_asc':
      return copy.sort((a, b) => {
        if (a.status === b.status) {
          return (a.title || '').localeCompare(b.title || '', 'pt-BR');
        }
        return a.status === 'active' ? -1 : 1;
      });

    default:
      return copy;
  }
}
