import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  Eye,
  Edit,
  Sparkles,
} from 'lucide-react';
import { ChurchEvent } from '../../types';
import { EventStatusBadge } from './EventStatusBadge';
import { formatEventDateRange } from './eventsUtils';
import { INITIAL_DEMO_MEDIA } from '../media/demoMediaData';

interface EventCalendarViewProps {
  events: ChurchEvent[];
  onPreview: (event: ChurchEvent) => void;
  onEdit: (event: ChurchEvent) => void;
}

export const EventCalendarView: React.FC<EventCalendarViewProps> = ({
  events,
  onPreview,
  onEdit,
}) => {
  // Mês e ano correntes da visualização (inicia em Setembro de 2026 de acordo com os dados)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(8); // 8 = Setembro (0-indexed)
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Navegação
  const handlePrevMonth = () => {
    setSelectedDay(null);
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    setSelectedDay(null);
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Cálculo da grade do mês
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days: {
      day: number;
      isCurrentMonth: boolean;
      dateStr: string;
      events: ChurchEvent[];
    }[] = [];

    // Dias do mês anterior para preencher a primeira semana
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const prevDay = daysInPrevMonth - i;
      const m = currentMonth === 0 ? 12 : currentMonth;
      const y = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(prevDay).padStart(2, '0')}`;
      days.push({
        day: prevDay,
        isCurrentMonth: false,
        dateStr,
        events: [],
      });
    }

    // Dias do mês corrente
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayEvents = events.filter((e) => {
        const start = e.startDate ? e.startDate.split('T')[0] : '';
        const end = e.endDate ? e.endDate.split('T')[0] : start;
        return dateStr >= start && dateStr <= end;
      });

      days.push({
        day: i,
        isCurrentMonth: true,
        dateStr,
        events: dayEvents,
      });
    }

    // Dias do próximo mês para completar 35 ou 42 células
    const remaining = 35 - days.length >= 0 ? 35 - days.length : 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const m = currentMonth === 11 ? 1 : currentMonth + 2;
      const y = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        day: i,
        isCurrentMonth: false,
        dateStr,
        events: [],
      });
    }

    return days;
  }, [currentYear, currentMonth, events]);

  // Eventos filtrados para o dia selecionado ou para todo o mês
  const activeEvents = useMemo(() => {
    if (selectedDay !== null) {
      const selectedDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
      return events.filter((e) => {
        const start = e.startDate ? e.startDate.split('T')[0] : '';
        const end = e.endDate ? e.endDate.split('T')[0] : start;
        return selectedDateStr >= start && selectedDateStr <= end;
      });
    }

    // Todos os eventos do mês visível
    const monthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    return events.filter((e) => {
      const start = e.startDate ? e.startDate.split('T')[0] : '';
      const end = e.endDate ? e.endDate.split('T')[0] : start;
      return (
        start.startsWith(monthPrefix) ||
        end.startsWith(monthPrefix) ||
        (start < monthPrefix && end > monthPrefix)
      );
    });
  }, [selectedDay, currentYear, currentMonth, events]);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden p-4 sm:p-6 space-y-6">
      {/* Navegador de Mês */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-900 flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900">
              {monthNames[currentMonth]} de {currentYear}
            </h3>
            <p className="text-xs text-stone-500">
              Visão cronológica dos eventos e programações
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {selectedDay !== null && (
            <button
              type="button"
              onClick={() => setSelectedDay(null)}
              className="text-xs font-semibold text-stone-600 hover:text-stone-900 px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 transition-colors mr-1 cursor-pointer"
            >
              Ver mês todo
            </button>
          )}

          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors border border-stone-200 cursor-pointer"
            title="Mês anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors border border-stone-200 cursor-pointer"
            title="Próximo mês"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Grade Mensal do Calendário (7 colunas) */}
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="grid grid-cols-7 gap-1 text-center font-semibold text-xs text-stone-400 mb-2">
            {weekDays.map((wd) => (
              <div key={wd} className="py-1">
                {wd}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {calendarDays.map((cell, idx) => {
              const hasEvents = cell.events.length > 0;
              const isSelected = selectedDay === cell.day && cell.isCurrentMonth;

              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (cell.isCurrentMonth) {
                      setSelectedDay(isSelected ? null : cell.day);
                    }
                  }}
                  className={`min-h-[64px] sm:min-h-[74px] p-1.5 rounded-xl border transition-all flex flex-col justify-between ${
                    !cell.isCurrentMonth
                      ? 'bg-stone-50/50 border-stone-100 text-stone-300 pointer-events-none'
                      : isSelected
                      ? 'bg-stone-900 text-white border-stone-900 shadow-sm ring-2 ring-stone-900 cursor-pointer'
                      : hasEvents
                      ? 'bg-stone-50 hover:bg-stone-100/90 border-stone-200/80 text-stone-900 font-semibold cursor-pointer'
                      : 'bg-white hover:bg-stone-50 border-stone-100 text-stone-600 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs ${
                        isSelected
                          ? 'text-white font-bold'
                          : cell.isCurrentMonth
                          ? 'text-stone-800'
                          : 'text-stone-300'
                      }`}
                    >
                      {cell.day}
                    </span>
                    {hasEvents && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                          isSelected
                            ? 'bg-white text-stone-900'
                            : 'bg-stone-900 text-white'
                        }`}
                      >
                        {cell.events.length}
                      </span>
                    )}
                  </div>

                  {/* Indicador de Títulos de Evento (Truncado) */}
                  {hasEvents && (
                    <div className="space-y-0.5 mt-1 overflow-hidden">
                      {cell.events.slice(0, 2).map((ev) => (
                        <div
                          key={ev.id}
                          className={`text-[9px] truncate px-1 py-0.5 rounded leading-tight text-left ${
                            isSelected
                              ? 'bg-stone-800 text-stone-200'
                              : ev.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                          title={ev.title}
                        >
                          {ev.title}
                        </div>
                      ))}
                      {cell.events.length > 2 && (
                        <span className="text-[8px] text-stone-400 block text-left">
                          +{cell.events.length - 2} mais
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Painel Lateral: Eventos do Dia ou do Mês Selecionado */}
        <div className="lg:col-span-5 xl:col-span-4 bg-stone-50/70 border border-stone-200 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-3">
              <div>
                <h4 className="text-sm font-bold text-stone-900">
                  {selectedDay !== null
                    ? `Eventos em ${selectedDay} de ${monthNames[currentMonth]}`
                    : `Programação de ${monthNames[currentMonth]}`}
                </h4>
                <span className="text-xs text-stone-500">
                  {activeEvents.length}{' '}
                  {activeEvents.length === 1 ? 'evento encontrado' : 'eventos encontrados'}
                </span>
              </div>
            </div>

            {activeEvents.length === 0 ? (
              <div className="text-center py-8 text-stone-400">
                <Calendar className="w-8 h-8 mx-auto opacity-30 mb-2" />
                <p className="text-xs font-medium">Nenhum evento agendado para este período.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {activeEvents.map((ev) => {
                  const mediaItem = ev.imageMediaId
                    ? INITIAL_DEMO_MEDIA.find((m) => m.id === ev.imageMediaId)
                    : null;
                  const dateStr = formatEventDateRange(ev.startDate, ev.endDate);

                  return (
                    <div
                      key={ev.id}
                      className="bg-white p-3 rounded-xl border border-stone-200 shadow-2xs space-y-2 hover:border-stone-300 transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h5
                            className="text-xs font-bold text-stone-900 hover:text-stone-700 cursor-pointer truncate"
                            onClick={() => onPreview(ev)}
                            title={ev.title}
                          >
                            {ev.title}
                          </h5>
                          <span className="text-[10px] font-mono text-stone-400 block truncate">
                            /{ev.slug}
                          </span>
                        </div>
                        <EventStatusBadge status={ev.status} size="sm" />
                      </div>

                      <div className="text-[11px] text-stone-500 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-stone-400 shrink-0" />
                          <span>{dateStr}</span>
                        </div>
                        {ev.time && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-stone-400 shrink-0" />
                            <span>{ev.time}</span>
                          </div>
                        )}
                        {ev.location && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                            <span className="truncate">{ev.location}</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-stone-100 flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onPreview(ev)}
                          className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Ver</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onEdit(ev)}
                          className="px-2 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded-md text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Editar</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
