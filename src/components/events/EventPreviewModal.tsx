import React from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Edit,
  ExternalLink,
  Image as ImageIcon,
  Share2,
} from 'lucide-react';
import { ChurchEvent } from '../../types';
import { EventStatusBadge } from './EventStatusBadge';
import {
  formatEventDateRange,
  getEventDateBadgeInfo,
  formatEventDate,
} from './eventsUtils';
import { INITIAL_DEMO_MEDIA } from '../media/demoMediaData';

interface EventPreviewModalProps {
  event: ChurchEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (event: ChurchEvent) => void;
}

export const EventPreviewModal: React.FC<EventPreviewModalProps> = ({
  event,
  isOpen,
  onClose,
  onEdit,
}) => {
  if (!isOpen || !event) return null;

  const dateBadge = getEventDateBadgeInfo(event.startDate);
  const dateFormatted = formatEventDateRange(event.startDate, event.endDate);

  const mediaItem = event.imageMediaId
    ? INITIAL_DEMO_MEDIA.find((m) => m.id === event.imageMediaId)
    : null;

  return (
    <div
      id="modal-event-preview-backdrop"
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="modal-event-preview-content"
        className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden my-6 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Capa com Imagem */}
        <div className="relative h-56 sm:h-64 bg-stone-900 overflow-hidden shrink-0">
          {mediaItem ? (
            <img
              src={mediaItem.url}
              alt={mediaItem.altText || event.title}
              className="w-full h-full object-cover opacity-90"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-stone-500 bg-stone-100">
              <ImageIcon className="w-12 h-12 opacity-30 mb-2" />
              <span className="text-xs font-medium">Sem imagem de capa vinculada</span>
            </div>
          )}

          {/* Gradiente de proteção de texto */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

          {/* Botão Fechar no Topo Direito */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-xs text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badge de Status no Canto Superior Esquerdo */}
          <div className="absolute top-4 left-4">
            <EventStatusBadge status={event.status} size="md" />
          </div>

          {/* Título e Data no Canto Inferior */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end gap-3 text-white">
            <div className="bg-white text-stone-900 rounded-2xl p-2.5 text-center shrink-0 shadow-lg min-w-[56px]">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                {dateBadge.month}
              </span>
              <span className="text-xl font-black text-stone-950 leading-none block">
                {dateBadge.day}
              </span>
            </div>

            <div className="min-w-0">
              <span className="text-[11px] font-mono text-stone-300 block truncate">
                /eventos/{event.slug}
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-white leading-tight line-clamp-2">
                {event.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Informações Centrais do Evento */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Caixa de Destaque: Data, Horário e Local */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 space-y-2.5 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 text-stone-800">
              <div className="w-7 h-7 rounded-lg bg-stone-200/70 text-stone-700 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">
                  Período
                </span>
                <span className="font-semibold text-stone-900">{dateFormatted}</span>
              </div>
            </div>

            {event.time && (
              <div className="flex items-center gap-2.5 text-stone-800 pt-2 border-t border-stone-200/60">
                <div className="w-7 h-7 rounded-lg bg-stone-200/70 text-stone-700 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">
                    Horário de Início
                  </span>
                  <span className="font-medium text-stone-900">{event.time}</span>
                </div>
              </div>
            )}

            {event.location && (
              <div className="flex items-center gap-2.5 text-stone-800 pt-2 border-t border-stone-200/60">
                <div className="w-7 h-7 rounded-lg bg-stone-200/70 text-stone-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">
                    Localização
                  </span>
                  <span className="font-medium text-stone-900">{event.location}</span>
                </div>
              </div>
            )}
          </div>

          {/* Descrição do Evento */}
          <div>
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
              Sobre o Evento
            </h4>
            <div className="text-xs sm:text-sm text-stone-600 leading-relaxed bg-white p-4 rounded-xl border border-stone-100 whitespace-pre-line">
              {event.description || 'Nenhuma descrição detalhada informada para este evento.'}
            </div>
          </div>

          {/* Metadados Técnicos do Contrato Canônico */}
          <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between text-[11px] text-stone-400 gap-2">
            <span>ID Canônico: {event.id}</span>
            <span>Atualizado em: {formatEventDate(event.updatedAt)}</span>
          </div>
        </div>

        {/* Rodapé do Modal */}
        <div className="bg-stone-50 px-6 py-3.5 border-t border-stone-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-stone-700 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
          >
            Fechar
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(event);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-stone-800 transition-colors shadow-xs cursor-pointer"
          >
            <Edit className="w-4 h-4" />
            <span>Editar este evento</span>
          </button>
        </div>
      </div>
    </div>
  );
};
