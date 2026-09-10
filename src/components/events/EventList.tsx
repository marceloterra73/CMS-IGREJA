import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Eye,
  Edit,
  Copy,
  Trash2,
  Image as ImageIcon,
  MoreVertical,
  Check,
} from 'lucide-react';
import { ChurchEvent } from '../../types';
import { EventStatusBadge } from './EventStatusBadge';
import {
  formatEventDateRange,
  getEventDateBadgeInfo,
} from './eventsUtils';
import { INITIAL_DEMO_MEDIA } from '../media/demoMediaData';

interface EventListProps {
  events: ChurchEvent[];
  onPreview: (event: ChurchEvent) => void;
  onEdit: (event: ChurchEvent) => void;
  onDuplicate: (event: ChurchEvent) => void;
  onDelete: (event: ChurchEvent) => void;
  onStatusChange?: (event: ChurchEvent, newStatus: ChurchEvent['status']) => void;
}

export const EventList: React.FC<EventListProps> = ({
  events,
  onPreview,
  onEdit,
  onDuplicate,
  onDelete,
  onStatusChange,
}) => {
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
      {/* Tabela para Desktop e Tablet */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4 w-16 text-center">Data</th>
              <th className="py-3 px-4">Evento</th>
              <th className="py-3 px-4">Data & Horário</th>
              <th className="py-3 px-4">Localização</th>
              <th className="py-3 px-4 w-28">Status</th>
              <th className="py-3 px-4 w-36 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {events.map((event) => {
              const dateBadge = getEventDateBadgeInfo(event.startDate);
              const dateFormatted = formatEventDateRange(event.startDate, event.endDate);
              const mediaItem = event.imageMediaId
                ? INITIAL_DEMO_MEDIA.find((m) => m.id === event.imageMediaId)
                : null;
              const isMenuOpen = activeMenuId === event.id;

              return (
                <tr
                  key={event.id}
                  id={`event-row-${event.id}`}
                  className="hover:bg-stone-50/70 transition-colors group"
                >
                  {/* Badge de Data Reduzido */}
                  <td className="py-3 px-4 text-center">
                    <div className="w-11 h-11 mx-auto rounded-xl bg-stone-100 border border-stone-200 flex flex-col items-center justify-center">
                      <span className="text-[9px] font-bold text-stone-500 uppercase leading-none">
                        {dateBadge.month}
                      </span>
                      <span className="text-sm font-extrabold text-stone-900 leading-none mt-0.5">
                        {dateBadge.day}
                      </span>
                    </div>
                  </td>

                  {/* Detalhes do Evento com Imagem */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-10 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                        {mediaItem ? (
                          <img
                            src={mediaItem.url}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-400">
                            <ImageIcon className="w-4 h-4 opacity-40" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => onPreview(event)}
                          className="text-stone-900 font-bold hover:text-stone-700 text-xs sm:text-sm text-left truncate block max-w-xs cursor-pointer"
                        >
                          {event.title}
                        </button>
                        <span className="text-[11px] font-mono text-stone-400 block truncate">
                          /{event.slug}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Data e Horário */}
                  <td className="py-3 px-4">
                    <div className="text-stone-800 font-medium whitespace-nowrap">
                      {dateFormatted}
                    </div>
                    {event.time && (
                      <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5 whitespace-nowrap">
                        <Clock className="w-3 h-3 text-stone-400" />
                        <span>{event.time}</span>
                      </div>
                    )}
                  </td>

                  {/* Localização */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 text-stone-600 max-w-[200px] truncate">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="truncate" title={event.location || 'Não informado'}>
                        {event.location || '—'}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <EventStatusBadge status={event.status} />
                  </td>

                  {/* Ações */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="relative inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onPreview(event)}
                        title="Visualizar"
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit(event)}
                        title="Editar"
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDuplicate(event)}
                        title="Duplicar"
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setActiveMenuId(isMenuOpen ? null : event.id)
                        }
                        title="Mais opções"
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Adicional para a Linha */}
                      {isMenuOpen && (
                        <div
                          className="absolute right-0 top-8 z-30 w-44 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 text-xs text-stone-700 text-left animate-in fade-in zoom-in-95 duration-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {onStatusChange && (
                            <>
                              <div className="px-3 py-1 text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                                Mudar status
                              </div>
                              {event.status !== 'published' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    onStatusChange(event, 'published');
                                  }}
                                  className="w-full px-3 py-1.5 hover:bg-emerald-50 text-emerald-700 flex items-center gap-2 cursor-pointer"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  <span>Publicar</span>
                                </button>
                              )}
                              {event.status !== 'draft' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    onStatusChange(event, 'draft');
                                  }}
                                  className="w-full px-3 py-1.5 hover:bg-amber-50 text-amber-700 flex items-center gap-2 cursor-pointer"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                  <span>Rascunho</span>
                                </button>
                              )}
                              {event.status !== 'archived' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    onStatusChange(event, 'archived');
                                  }}
                                  className="w-full px-3 py-1.5 hover:bg-stone-100 text-stone-700 flex items-center gap-2 cursor-pointer"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-stone-500" />
                                  <span>Arquivar</span>
                                </button>
                              )}
                              <div className="border-t border-stone-100 my-1" />
                            </>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onDelete(event);
                            }}
                            className="w-full px-3 py-1.5 hover:bg-rose-50 text-rose-600 flex items-center gap-2 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                            <span>Excluir evento</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Lista em Cartões para Mobile (< 768px) */}
      <div className="md:hidden divide-y divide-stone-100">
        {events.map((event) => {
          const dateBadge = getEventDateBadgeInfo(event.startDate);
          const dateFormatted = formatEventDateRange(event.startDate, event.endDate);
          const mediaItem = event.imageMediaId
            ? INITIAL_DEMO_MEDIA.find((m) => m.id === event.imageMediaId)
            : null;

          return (
            <div
              key={event.id}
              className="p-4 flex flex-col gap-3 hover:bg-stone-50/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-200 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[9px] font-bold text-stone-500 uppercase leading-none">
                      {dateBadge.month}
                    </span>
                    <span className="text-base font-extrabold text-stone-900 leading-none mt-0.5">
                      {dateBadge.day}
                    </span>
                  </div>

                  <div>
                    <h4
                      className="text-sm font-bold text-stone-900 line-clamp-1 cursor-pointer"
                      onClick={() => onPreview(event)}
                    >
                      {event.title}
                    </h4>
                    <span className="text-[11px] font-mono text-stone-400 block truncate">
                      /{event.slug}
                    </span>
                    <div className="mt-1">
                      <EventStatusBadge status={event.status} size="sm" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Detalhes de Data & Local */}
              <div className="text-xs text-stone-600 space-y-1 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="font-medium text-stone-800">{dateFormatted}</span>
                </div>
                {event.time && (
                  <div className="flex items-center gap-1.5 text-stone-500">
                    <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{event.time}</span>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center gap-1.5 text-stone-500">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                )}
              </div>

              {/* Ações Mobile */}
              <div className="flex items-center justify-end gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => onPreview(event)}
                  className="px-2.5 py-1.5 rounded-lg bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Ver</span>
                </button>

                <button
                  type="button"
                  onClick={() => onEdit(event)}
                  className="px-2.5 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-semibold flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Editar</span>
                </button>

                <button
                  type="button"
                  onClick={() => onDuplicate(event)}
                  title="Duplicar"
                  className="p-1.5 rounded-lg bg-stone-100 text-stone-600"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(event)}
                  title="Excluir"
                  className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
