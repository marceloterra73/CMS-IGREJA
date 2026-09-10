import React from 'react';
import { Search, Plus, LayoutGrid, Table, Filter, ArrowUpDown, X } from 'lucide-react';
import { CANONICAL_WEEKDAYS } from './schedulesUtils';

export type ScheduleStatusFilter = 'all' | 'active' | 'inactive';
export type ScheduleSortOption = 'day_asc' | 'time_asc' | 'title_asc' | 'status_asc';
export type ScheduleViewMode = 'cards' | 'table';

interface SchedulesToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: ScheduleStatusFilter;
  onStatusFilterChange: (status: ScheduleStatusFilter) => void;
  dayFilter: string;
  onDayFilterChange: (day: string) => void;
  sortBy: ScheduleSortOption;
  onSortByChange: (sort: ScheduleSortOption) => void;
  viewMode: ScheduleViewMode;
  onViewModeChange: (mode: ScheduleViewMode) => void;
  onAddNew: () => void;
  availableDays: string[];
}

export const SchedulesToolbar: React.FC<SchedulesToolbarProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  dayFilter,
  onDayFilterChange,
  sortBy,
  onSortByChange,
  viewMode,
  onViewModeChange,
  onAddNew,
  availableDays,
}) => {
  const hasActiveFilters =
    Boolean(searchTerm.trim()) || statusFilter !== 'all' || dayFilter !== 'all';

  const clearFilters = () => {
    onSearchChange('');
    onStatusFilterChange('all');
    onDayFilterChange('all');
  };

  return (
    <div
      id="schedules-toolbar-container"
      className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-3"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Barra de Busca */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por culto, dia, horário, local ou descrição..."
            className="w-full text-xs pl-10 pr-9 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 focus:bg-white text-stone-900 placeholder:text-stone-400 transition-colors"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5 rounded-sm"
              title="Limpar busca"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Ações Direitas: Ordenação, Alternância de Visualização e Botão de Criação */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Ordenação */}
          <div className="flex items-center gap-1.5 text-xs text-stone-600 bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="text-[11px] font-medium text-stone-500 hidden sm:inline">
              Ordem:
            </span>
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as ScheduleSortOption)}
              className="bg-transparent font-medium text-stone-800 text-xs focus:outline-hidden cursor-pointer"
            >
              <option value="day_asc">Dia da Semana (Domingo a Sábado)</option>
              <option value="time_asc">Horário do Culto</option>
              <option value="title_asc">Nome do Culto (A - Z)</option>
              <option value="status_asc">Status (Ativos Primeiro)</option>
            </select>
          </div>

          {/* Alternador de Modo: Cards vs Tabela */}
          <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200">
            <button
              type="button"
              onClick={() => onViewModeChange('cards')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'cards'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Visualizar em Cards"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Visualizar em Tabela"
            >
              <Table className="w-4 h-4" />
            </button>
          </div>

          {/* Botão Primário: Novo Horário */}
          <button
            type="button"
            onClick={onAddNew}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>+ Novo Horário</span>
          </button>
        </div>
      </div>

      {/* Linha Inferior de Filtros Rápidos */}
      <div className="flex items-center justify-between gap-3 pt-1 border-t border-stone-100 flex-wrap text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Filtros:
          </span>

          {/* Filtro de Status */}
          <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg">
            <button
              type="button"
              onClick={() => onStatusFilterChange('all')}
              className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors ${
                statusFilter === 'all'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => onStatusFilterChange('active')}
              className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors ${
                statusFilter === 'active'
                  ? 'bg-white text-emerald-800 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Ativos
            </button>
            <button
              type="button"
              onClick={() => onStatusFilterChange('inactive')}
              className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors ${
                statusFilter === 'inactive'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Inativos
            </button>
          </div>

          {/* Filtro de Dia da Semana */}
          <div className="flex items-center gap-1.5 text-xs text-stone-600 bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1">
            <span className="text-[11px] text-stone-500">Dia:</span>
            <select
              value={dayFilter}
              onChange={(e) => onDayFilterChange(e.target.value)}
              className="bg-transparent font-medium text-stone-800 text-xs focus:outline-hidden cursor-pointer"
            >
              <option value="all">Todos os dias</option>
              {CANONICAL_WEEKDAYS.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
              {availableDays
                .filter(
                  (d) =>
                    !CANONICAL_WEEKDAYS.some(
                      (c) => c.toLowerCase() === d.toLowerCase()
                    )
                )
                .map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline ml-1"
            >
              <X className="w-3 h-3" />
              Limpar filtros
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
