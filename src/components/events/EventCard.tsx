import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Trash2,
  Image as ImageIcon,
  Check,
} from 'lucide-react';
import { ChurchEvent } from '../../types';
import { EventStatusBadge } from './EventStatusBadge';
import {
  formatEventDateRange,
  getEventDateBadgeInfo,
} from './eventsUtils';
import { INITIAL_DEMO_MEDIA } from '../media/demoMediaData';

interface EventCardProps {
  event: ChurchEvent;
  onPreview: (event: ChurchEvent) => void;
  onEdit: (event: ChurchEvent) => void;
  onDuplicate: (event: ChurchEvent) => void;
  onDelete: (event: ChurchEvent) => void;
  onStatusChange?: (event: ChurchEvent, newStatus: ChurchEvent['status']) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onPreview,
  onEdit,
  onDuplicate,
  onDelete,
  onStatusChange,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const [copiedSlug, setCopiedSlug] = React.useState(false);

  // Obter imagem a partir de imageMediaId se existir
  const mediaItem = React.useMemo(() => {
    if (!event.imageMediaId) return null;
    return INITIAL_DEMO_MEDIA.find((m) => m.id === event.imageMediaId) || null;
  }, [event.imageMediaId]);

  const dateBadge = getEventDateBadgeInfo(event.startDate);
  const dateFormatted = formatEventDateRange(event.startDate, event.endDate);

  const handleCopySlug = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(event.slug);
    setCopiedSlug(true);
    setTimeout(() => setCopiedSlug(false), 2000);
  };

  return (
    <div
      id={`event-card-${event.id}`}
      className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden group"
    >
      {/* Topo / Capa do Evento */}
      <div className="relative h-40 bg-stone-100 overflow-hidden">
        {mediaItem ? (
          <img
            src={mediaItem.url}
            alt={mediaItem.altText || event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 bg-stone-100 p-4 text-center">
            <ImageIcon className="w-8 h-8 opacity-40 mb-1" />
            <span className="text-[11px] text-stone-400 font-medium">Sem imagem vinculada</span>
          </div>
        )}

        {/* Gradiente sutil para contraste */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-black/20" />

        {/* Badge de Data no Canto Superior Esquerdo */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs rounded-xl px-2.5 py-1 text-center shadow-xs border border-white/40">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
            {dateBadge.month}
          </span>
          <span className="text-base font-extrabold text-stone-900 leading-none block">
            {dateBadge.day}
          </span>
        </div>

        {/* Status no Canto Superior Direito */}
        <div className="absolute top-3 right-3">
          <EventStatusBadge status={event.status} />
        </div>

        {/* Botão de Menu Flutuante */}
        <div className="absolute bottom-2 right-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu((prev) => !prev);
            }}
            className="w-8 h-8 rounded-lg bg-black/40 hover:bg-black/70 backdrop-blur-xs text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Ações"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Menu Dropdown de Ações */}
          {showMenu && (
            <div
              className="absolute right-0 bottom-9 z-20 w-44 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 text-xs text-stone-700 animate-in fade-in zoom-in-95 duration-100"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onPreview(event);
                }}
                className="w-full px-3 py-2 text-left hover:bg-stone-50 flex items-center gap-2 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-stone-500" />
                <span>Visualizar evento</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onEdit(event);
                }}
                className="w-full px-3 py-2 text-left hover:bg-stone-50 flex items-center gap-2 cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5 text-stone-500" />
                <span>Editar detalhes</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onDuplicate(event);
                }}
                className="w-full px-3 py-2 text-left hover:bg-stone-50 flex items-center gap-2 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-stone-500" />
                <span>Duplicar evento</span>
              </button>

              {onStatusChange && (
                <div className="border-t border-stone-100 my-1 pt-1">
                  <div className="px-3 py-1 text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                    Alterar status
                  </div>
                  {event.status !== 'published' && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        onStatusChange(event, 'published');
                      }}
                      className="w-full px-3 py-1.5 text-left hover:bg-emerald-50 text-emerald-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Publicar</span>
                    </button>
                  )}
                  {event.status !== 'draft' && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        onStatusChange(event, 'draft');
                      }}
                      className="w-full px-3 py-1.5 text-left hover:bg-amber-50 text-amber-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>Mover para Rascunho</span>
                    </button>
                  )}
                  {event.status !== 'archived' && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        onStatusChange(event, 'archived');
                      }}
                      className="w-full px-3 py-1.5 text-left hover:bg-stone-100 text-stone-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-500" />
                      <span>Arquivar</span>
                    </button>
                  )}
                </div>
              )}

              <div className="border-t border-stone-100 my-1 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onDelete(event);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-rose-50 text-rose-600 flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Excluir evento</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Corpo do Card */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3
            className="text-sm font-bold text-stone-900 group-hover:text-stone-700 transition-colors line-clamp-1 cursor-pointer"
            onClick={() => onPreview(event)}
            title={event.title}
          >
            {event.title}
          </h3>

          <div className="flex items-center gap-1 mt-1">
            <span
              onClick={handleCopySlug}
              title="Clique para copiar o slug"
              className="text-[11px] font-mono text-stone-400 hover:text-stone-700 cursor-pointer flex items-center gap-1 truncate"
            >
              /{event.slug}
              {copiedSlug ? (
                <Check className="w-3 h-3 text-emerald-600 shrink-0" />
              ) : null}
            </span>
          </div>

          {event.description && (
            <p className="text-xs text-stone-500 mt-2 line-clamp-2 leading-relaxed">
              {event.description}
            </p>
          )}
        </div>

        {/* Metadados: Data, Horário e Local */}
        <div className="space-y-1.5 pt-2 border-t border-stone-100 text-xs text-stone-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="font-medium text-stone-800 truncate">{dateFormatted}</span>
          </div>

          {event.time && (
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span className="truncate">{event.time}</span>
            </div>
          )}

          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>

        {/* Ações Rápidas no Rodapé do Card */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onPreview(event)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Visualizar</span>
          </button>

          <button
            type="button"
            onClick={() => onEdit(event)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Editar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
