import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { ChurchEvent, EventStatus } from '../../types';
import { INITIAL_DEMO_EVENTS } from './demoEventsData';
import {
  EventsToolbar,
  EventStatusFilter,
  EventTimeFilter,
  EventSortOption,
  EventViewMode,
} from './EventsToolbar';
import { EventList } from './EventList';
import { EventCard } from './EventCard';
import { EventCalendarView } from './EventCalendarView';
import { EventEditorModal } from './EventEditorModal';
import { EventPreviewModal } from './EventPreviewModal';
import { DeleteEventConfirmModal } from './DeleteEventConfirmModal';
import { isEventUpcoming, ensureUniqueEventSlug } from './eventsUtils';

export const EventsView: React.FC = () => {
  // Estado principal de eventos em memória local React
  const [events, setEvents] = useState<ChurchEvent[]>(INITIAL_DEMO_EVENTS);

  // Estados de Filtros e Busca
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<EventStatusFilter>('all');
  const [timeFilter, setTimeFilter] = useState<EventTimeFilter>('all');
  const [sortBy, setSortBy] = useState<EventSortOption>('upcoming');
  const [viewMode, setViewMode] = useState<EventViewMode>('table');

  // Estados dos Modais
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ChurchEvent | null>(null);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewingEvent, setPreviewingEvent] = useState<ChurchEvent | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState<ChurchEvent | null>(null);

  // Toast temporário de notificação
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Métricas para a toolbar
  const stats = useMemo(() => {
    const total = events.length;
    let published = 0;
    let draft = 0;
    let archived = 0;
    let upcoming = 0;

    events.forEach((ev) => {
      if (ev.status === 'published') published++;
      else if (ev.status === 'draft') draft++;
      else if (ev.status === 'archived') archived++;

      if (isEventUpcoming(ev.startDate)) {
        upcoming++;
      }
    });

    return { total, published, draft, archived, upcoming };
  }, [events]);

  // Filtragem e Ordenação
  const filteredAndSortedEvents = useMemo(() => {
    return events
      .filter((event) => {
        // 1. Busca por termo (título, slug, localização)
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase().trim();
          const matchesTitle = event.title.toLowerCase().includes(q);
          const matchesSlug = event.slug.toLowerCase().includes(q);
          const matchesLocation = event.location
            ? event.location.toLowerCase().includes(q)
            : false;
          const matchesDesc = event.description
            ? event.description.toLowerCase().includes(q)
            : false;

          if (!matchesTitle && !matchesSlug && !matchesLocation && !matchesDesc) {
            return false;
          }
        }

        // 2. Filtro por status canônico
        if (statusFilter !== 'all' && event.status !== statusFilter) {
          return false;
        }

        // 3. Filtro por período temporal (Próximos vs Passados)
        if (timeFilter !== 'all') {
          const isUp = isEventUpcoming(event.startDate);
          if (timeFilter === 'upcoming' && !isUp) return false;
          if (timeFilter === 'past' && isUp) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Ordenação
        if (sortBy === 'title_asc') {
          return a.title.localeCompare(b.title, 'pt-BR');
        }
        if (sortBy === 'title_desc') {
          return b.title.localeCompare(a.title, 'pt-BR');
        }
        if (sortBy === 'recent') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        // Padrão: 'upcoming' (mais próximos no tempo a partir da data de início)
        return a.startDate.localeCompare(b.startDate);
      });
  }, [events, searchTerm, statusFilter, timeFilter, sortBy]);

  // Manipuladores de Ações
  const handleNewEvent = () => {
    setEditingEvent(null);
    setIsEditorOpen(true);
  };

  const handleEditEvent = (event: ChurchEvent) => {
    setEditingEvent(event);
    setIsEditorOpen(true);
  };

  const handlePreviewEvent = (event: ChurchEvent) => {
    setPreviewingEvent(event);
    setIsPreviewOpen(true);
  };

  const handleDeletePrompt = (event: ChurchEvent) => {
    setDeletingEvent(event);
    setIsDeleteOpen(true);
  };

  const handleSaveEvent = (savedEvent: ChurchEvent) => {
    setEvents((prev) => {
      const exists = prev.some((e) => e.id === savedEvent.id);
      if (exists) {
        return prev.map((e) => (e.id === savedEvent.id ? savedEvent : e));
      } else {
        return [savedEvent, ...prev];
      }
    });

    const isEdit = events.some((e) => e.id === savedEvent.id);
    showToast(
      isEdit
        ? `Evento "${savedEvent.title}" atualizado com sucesso.`
        : `Evento "${savedEvent.title}" criado com sucesso.`
    );
  };

  const handleDuplicateEvent = (event: ChurchEvent) => {
    const newTitle = `${event.title} (Cópia)`;
    const newSlug = ensureUniqueEventSlug(
      `${event.slug}-copia`,
      events
    );

    const duplicated: ChurchEvent = {
      ...event,
      id: `evt_${Date.now()}`,
      title: newTitle,
      slug: newSlug,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setEvents((prev) => [duplicated, ...prev]);
    showToast(`Evento duplicado como rascunho: "${newTitle}".`);
  };

  const handleConfirmDelete = (event: ChurchEvent) => {
    setEvents((prev) => prev.filter((e) => e.id !== event.id));
    showToast(`Evento "${event.title}" excluído com sucesso.`);
  };

  const handleStatusChange = (event: ChurchEvent, newStatus: EventStatus) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === event.id
          ? { ...e, status: newStatus, updatedAt: new Date().toISOString() }
          : e
      )
    );
    showToast(`Status de "${event.title}" alterado para ${newStatus}.`);
  };

  const handleResetDemoData = () => {
    setEvents(INITIAL_DEMO_EVENTS);
    setSearchTerm('');
    setStatusFilter('all');
    setTimeFilter('all');
    showToast('Dados de demonstração de eventos restaurados.');
  };

  return (
    <div id="events-view-container" className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notificação */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs sm:text-sm px-4 py-3 rounded-2xl shadow-xl border border-stone-700 flex items-center gap-2.5 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Toolbar Principal */}
      <EventsToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        timeFilter={timeFilter}
        onTimeFilterChange={setTimeFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNewEvent={handleNewEvent}
        stats={stats}
        filteredCount={filteredAndSortedEvents.length}
      />

      {/* Conteúdo Principal de Acordo com o Modo de Visualização */}
      {filteredAndSortedEvents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-12 text-center shadow-xs">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mb-4">
            <Calendar className="w-7 h-7 opacity-60" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-stone-900">
            Nenhum evento encontrado
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto mt-1 mb-6">
            Não há nenhum evento correspondente aos filtros atuais ou termo de busca
            pesquisado.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setTimeFilter('all');
              }}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Limpar filtros de busca
            </button>

            <button
              type="button"
              onClick={handleNewEvent}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Cadastrar novo evento
            </button>

            {events.length === 0 && (
              <button
                type="button"
                onClick={handleResetDemoData}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Restaurar eventos de demonstração</span>
              </button>
            )}
          </div>
        </div>
      ) : viewMode === 'calendar' ? (
        <EventCalendarView
          events={filteredAndSortedEvents}
          onPreview={handlePreviewEvent}
          onEdit={handleEditEvent}
        />
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredAndSortedEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onPreview={handlePreviewEvent}
              onEdit={handleEditEvent}
              onDuplicate={handleDuplicateEvent}
              onDelete={handleDeletePrompt}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <EventList
          events={filteredAndSortedEvents}
          onPreview={handlePreviewEvent}
          onEdit={handleEditEvent}
          onDuplicate={handleDuplicateEvent}
          onDelete={handleDeletePrompt}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Modais de Gerenciamento */}
      <EventEditorModal
        isOpen={isEditorOpen}
        event={editingEvent}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveEvent}
        existingEvents={events}
      />

      <EventPreviewModal
        isOpen={isPreviewOpen}
        event={previewingEvent}
        onClose={() => setIsPreviewOpen(false)}
        onEdit={(ev) => {
          setIsPreviewOpen(false);
          handleEditEvent(ev);
        }}
      />

      <DeleteEventConfirmModal
        isOpen={isDeleteOpen}
        event={deletingEvent}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
