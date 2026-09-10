import React from 'react';
import {
  Calendar,
  Plus,
  Search,
  X,
  LayoutGrid,
  List as ListIcon,
  CalendarDays,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { EventStatus } from '../../types';

export type EventStatusFilter = 'all' | EventStatus;
export type EventTimeFilter = 'all' | 'upcoming' | 'past';
export type EventSortOption = 'upcoming' | 'recent' | 'title_asc' | 'title_desc';
export type EventViewMode = 'table' | 'cards' | 'calendar';

interface EventsToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: EventStatusFilter;
  onStatusFilterChange: (status: EventStatusFilter) => void;
  timeFilter: EventTimeFilter;
  onTimeFilterChange: (time: EventTimeFilter) => void;
  sortBy: EventSortOption;
  onSortChange: (sort: EventSortOption) => void;
  viewMode: EventViewMode;
  onViewModeChange: (mode: EventViewMode) => void;
  onNewEvent: () => void;
  stats: {
    total: number;
    published: number;
    draft: number;
    archived: number;
    upcoming: number;
  };
  filteredCount: number;
}

export const EventsToolbar: React.FC<EventsToolbarProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  timeFilter,
  onTimeFilterChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onNewEvent,
  stats,
  filteredCount,
}) => {
  return (
    <div className="space-y-5">
      {/* Cabeçalho Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-stone-900 text-white flex items-center justify-center shadow-xs">
              <Calendar className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              Eventos
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Organize os eventos e atividades da sua igreja.
          </p>
        </div>

        <button
          id="btn-new-event"
          type="button"
          onClick={onNewEvent}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-900 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-stone-800 transition-all shadow-xs hover:shadow-md cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Novo evento</span>
        </button>
      </div>

      {/* Cards de Métricas e Filtros Rápidos */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => {
            onStatusFilterChange('all');
            onTimeFilterChange('all');
          }}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === 'all' && timeFilter === 'all'
              ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
              : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="text-[11px] font-medium opacity-80 uppercase tracking-wider">
            Total Geral
          </div>
          <div className="text-xl font-bold mt-0.5">{stats.total}</div>
        </button>

        <button
          type="button"
          onClick={() => onStatusFilterChange('published')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === 'published'
              ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
              : 'bg-white text-stone-700 border-stone-200 hover:border-emerald-300'
          }`}
        >
          <div className="text-[11px] font-medium opacity-80 uppercase tracking-wider flex items-center justify-between">
            <span>Publicados</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
          </div>
          <div className="text-xl font-bold mt-0.5">{stats.published}</div>
        </button>

        <button
          type="button"
          onClick={() => onStatusFilterChange('draft')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === 'draft'
              ? 'bg-amber-700 text-white border-amber-700 shadow-xs'
              : 'bg-white text-stone-700 border-stone-200 hover:border-amber-300'
          }`}
        >
          <div className="text-[11px] font-medium opacity-80 uppercase tracking-wider flex items-center justify-between">
            <span>Rascunhos</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
          </div>
          <div className="text-xl font-bold mt-0.5">{stats.draft}</div>
        </button>

        <button
          type="button"
          onClick={() => onStatusFilterChange('archived')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === 'archived'
              ? 'bg-stone-700 text-white border-stone-700 shadow-xs'
              : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="text-[11px] font-medium opacity-80 uppercase tracking-wider flex items-center justify-between">
            <span>Arquivados</span>
            <span className="w-2 h-2 rounded-full bg-stone-400 inline-block" />
          </div>
          <div className="text-xl font-bold mt-0.5">{stats.archived}</div>
        </button>
      </div>

      {/* Barra de Ações: Busca, Filtros, Ordenação e Visualização */}
      <div className="bg-white rounded-2xl border border-stone-200 p-3 sm:p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Campo de Busca */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              id="events-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por título, slug ou local..."
              className="w-full pl-9 pr-9 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Controles: Ordenação e Alternador de Modo de Visualização */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Seletor de Ordenação */}
            <div className="flex items-center gap-1 bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs text-stone-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <select
                id="events-sort-select"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as EventSortOption)}
                className="bg-transparent border-none text-xs font-medium text-stone-800 focus:outline-hidden cursor-pointer"
              >
                <option value="upcoming">Mais próximos</option>
                <option value="recent">Mais recentes</option>
                <option value="title_asc">Título (A-Z)</option>
                <option value="title_desc">Título (Z-A)</option>
              </select>
            </div>

            {/* Alternador de Modo de Visualização */}
            <div className="flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200">
              <button
                type="button"
                onClick={() => onViewModeChange('table')}
                title="Visualização em Tabela"
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <ListIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('cards')}
                title="Visualização em Cards"
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('calendar')}
                title="Visualização em Calendário"
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  viewMode === 'calendar'
                    ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <CalendarDays className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Linha de Filtros: Status e Período */}
        <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-stone-400 text-[11px] font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Status:
            </span>
            {(
              [
                { key: 'all', label: 'Todos' },
                { key: 'published', label: 'Publicados' },
                { key: 'draft', label: 'Rascunhos' },
                { key: 'archived', label: 'Arquivados' },
              ] as const
            ).map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => onStatusFilterChange(item.key)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  statusFilter === item.key
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="h-4 w-px bg-stone-200 mx-1 hidden sm:block" />

            <span className="text-stone-400 text-[11px] font-medium mr-1 hidden sm:inline">
              Período:
            </span>
            {(
              [
                { key: 'all', label: 'Todos' },
                { key: 'upcoming', label: 'Próximos' },
                { key: 'past', label: 'Passados' },
              ] as const
            ).map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => onTimeFilterChange(item.key)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  timeFilter === item.key
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-stone-500">
            Mostrando <strong>{filteredCount}</strong> de <strong>{stats.total}</strong> eventos
          </div>
        </div>
      </div>
    </div>
  );
};
