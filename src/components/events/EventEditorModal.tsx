import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Calendar,
  Clock,
  MapPin,
  Image as ImageIcon,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { ChurchEvent, EventStatus, MediaItem } from '../../types';
import { generateEventSlug, ensureUniqueEventSlug } from './eventsUtils';
import { MediaPickerModal } from '../media/MediaPickerModal';
import { INITIAL_DEMO_MEDIA } from '../media/demoMediaData';

interface EventEditorModalProps {
  event: ChurchEvent | null; // null = novo evento
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: ChurchEvent) => void;
  existingEvents: ChurchEvent[];
}

export const EventEditorModal: React.FC<EventEditorModalProps> = ({
  event,
  isOpen,
  onClose,
  onSave,
  existingEvents,
}) => {
  const isEditing = Boolean(event);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<EventStatus>('draft');
  const [imageMediaId, setImageMediaId] = useState<string | undefined>(undefined);

  // Controle do modal seletor de mídia
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Inicializar formulário
  useEffect(() => {
    if (isOpen) {
      if (event) {
        setTitle(event.title);
        setSlug(event.slug);
        setIsSlugManual(true);
        setDescription(event.description || '');
        setStartDate(event.startDate ? event.startDate.split('T')[0] : '');
        setEndDate(event.endDate ? event.endDate.split('T')[0] : '');
        setTime(event.time || '');
        setLocation(event.location || '');
        setStatus(event.status);
        setImageMediaId(event.imageMediaId);
      } else {
        // Novo Evento
        setTitle('');
        setSlug('');
        setIsSlugManual(false);
        setDescription('');
        // Padrão: dia atual formatado
        const todayStr = new Date().toISOString().split('T')[0];
        setStartDate(todayStr);
        setEndDate(todayStr);
        setTime('19:30');
        setLocation('Santuário Principal - IBC');
        setStatus('draft');
        setImageMediaId('med_02'); // imagem padrão da igreja
      }
      setErrorMsg(null);
    }
  }, [isOpen, event]);

  if (!isOpen) return null;

  // Imagem selecionada para preview
  const selectedMedia = imageMediaId
    ? INITIAL_DEMO_MEDIA.find((m) => m.id === imageMediaId)
    : null;

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugManual) {
      const generated = generateEventSlug(val);
      setSlug(generated);
    }
  };

  const handleSlugChange = (val: string) => {
    setIsSlugManual(true);
    setSlug(generateEventSlug(val));
  };

  const handleSave = () => {
    if (!title.trim()) {
      setErrorMsg('Por favor, informe o título do evento.');
      return;
    }

    if (!startDate) {
      setErrorMsg('Por favor, informe a data inicial do evento.');
      return;
    }

    const finalSlug = ensureUniqueEventSlug(
      slug.trim() || generateEventSlug(title),
      existingEvents,
      event?.id
    );

    const savedEvent: ChurchEvent = {
      id: event?.id || `evt_${Date.now()}`,
      tenantId: event?.tenantId || 'ib_central',
      title: title.trim(),
      slug: finalSlug,
      description: description.trim() || undefined,
      startDate: startDate.trim(),
      endDate: endDate.trim() ? endDate.trim() : startDate.trim(),
      time: time.trim() || undefined,
      location: location.trim() || undefined,
      imageMediaId: imageMediaId || undefined,
      status,
      createdAt: event?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(savedEvent);
    onClose();
  };

  return (
    <>
      <div
        id="modal-event-editor-backdrop"
        className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <div
          id="modal-event-editor-content"
          className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-stone-200 my-6 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Cabeçalho */}
          <div className="bg-stone-50 px-6 py-4 border-b border-stone-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-stone-900">
                  {isEditing ? `Editar: ${event?.title}` : 'Novo Evento'}
                </h3>
                <p className="text-xs text-stone-500">
                  {isEditing
                    ? 'Atualize os dados e a programação do evento.'
                    : 'Cadastre uma nova atividade ou celebração da igreja.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-stone-400 hover:text-stone-600 p-1.5 rounded-lg hover:bg-stone-200/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Erro de Validação */}
          {errorMsg && (
            <div className="bg-rose-50 border-b border-rose-200 px-6 py-2.5 flex items-center gap-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Formulário */}
          <div className="p-6 overflow-y-auto space-y-4 flex-1">
            {/* Título do Evento */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Título do Evento *
              </label>
              <input
                id="event-title-input"
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Ex: Conferência da Família 2026"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Slug (URL identificadora) *
              </label>
              <div className="flex items-center">
                <span className="px-3 py-2.5 bg-stone-100 border border-r-0 border-stone-200 rounded-l-xl text-xs font-mono text-stone-500">
                  /eventos/
                </span>
                <input
                  id="event-slug-input"
                  type="text"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="conferencia-da-familia-2026"
                  className="flex-1 px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-r-xl text-sm font-mono text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden"
                />
              </div>
              <span className="text-[11px] text-stone-400 mt-1 block">
                Gerado automaticamente a partir do título para manter links amigáveis.
              </span>
            </div>

            {/* Datas e Horário */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Data Inicial *
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Data Final (opcional)
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Horário
                </label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="Ex: 19:30 ou 09:00 - 12:00"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Localização e Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Localização / Espaço
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex: Santuário Principal - IBC"
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Status de Publicação *
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as EventStatus)}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden"
                >
                  <option value="draft">Rascunho (interno / em planejamento)</option>
                  <option value="published">Publicado (visível no site)</option>
                  <option value="archived">Arquivado (histórico / finalizado)</option>
                </select>
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Descrição do Evento
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Apresente os detalhes do evento, tema, preletores ou orientações para os participantes..."
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden resize-y"
              />
            </div>

            {/* Imagem do Evento (integração com imageMediaId / Biblioteca de Mídia) */}
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-stone-900 block">
                    Imagem de Capa (imageMediaId)
                  </span>
                  <span className="text-[11px] text-stone-500">
                    Selecione um arquivo da biblioteca de mídia existente.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMediaPickerOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-100 transition-colors shadow-2xs cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>{imageMediaId ? 'Trocar imagem' : 'Selecionar imagem'}</span>
                </button>
              </div>

              {selectedMedia ? (
                <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-stone-200">
                  <img
                    src={selectedMedia.url}
                    alt={selectedMedia.title || 'Imagem do evento'}
                    className="w-16 h-12 object-cover rounded-lg border border-stone-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-stone-900 block truncate">
                      {selectedMedia.title || selectedMedia.filename}
                    </span>
                    <span className="text-[11px] font-mono text-stone-400 block truncate">
                      ID: {selectedMedia.id}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setImageMediaId(undefined)}
                    className="text-xs text-rose-600 hover:text-rose-800 font-medium px-2 py-1 rounded hover:bg-rose-50 cursor-pointer"
                  >
                    Remover
                  </button>
                </div>
              ) : (
                <div className="p-3 text-center border border-dashed border-stone-200 rounded-lg text-stone-400 text-xs">
                  Nenhuma imagem selecionada. O card utilizará a exibição padrão.
                </div>
              )}
            </div>
          </div>

          {/* Rodapé de Ações */}
          <div className="bg-stone-50 px-6 py-4 border-t border-stone-200 flex items-center justify-between shrink-0">
            <span className="text-xs text-stone-500 hidden sm:inline">
              Armazenado em memória local nesta sessão
            </span>

            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-stone-700 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                id="btn-save-event"
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-5 py-2 bg-stone-900 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-stone-800 transition-colors shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isEditing ? 'Salvar Alterações' : 'Criar Evento'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Seleção de Mídia (Fase 32) */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        selectedMediaId={imageMediaId}
        onSelectImage={(media: MediaItem) => {
          setImageMediaId(media.id);
          setIsMediaPickerOpen(false);
        }}
      />
    </>
  );
};
