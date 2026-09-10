import React from 'react';
import { Search, Plus, LayoutGrid, List, Filter, X } from 'lucide-react';
import { FormStatus } from '../../types';

export type FormStatusFilter = 'all' | FormStatus;
export type FormViewMode = 'grid' | 'list';

interface FormsToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: FormStatusFilter;
  onStatusFilterChange: (status: FormStatusFilter) => void;
  viewMode: FormViewMode;
  onViewModeChange: (mode: FormViewMode) => void;
  onNewForm: () => void;
  totalCount: number;
  filteredCount: number;
  stats: {
    total: number;
    active: number;
    draft: number;
    archived: number;
  };
}

export const FormsToolbar: React.FC<FormsToolbarProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
  onNewForm,
  totalCount,
  filteredCount,
  stats,
}) => {
  return (
    <div className="space-y-4">
      {/* Cabeçalho Superior: Título, Estatísticas e Botão Novo Formulário */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              Formulários
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
              {totalCount} {totalCount === 1 ? 'formulário' : 'formulários'}
            </span>
          </div>
          <p className="text-sm text-stone-600 mt-1">
            Crie e organize os formulários utilizados pelo site da sua igreja.
          </p>
        </div>

        <button
          id="btn-new-form"
          type="button"
          onClick={onNewForm}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo formulário</span>
        </button>
      </div>

      {/* Cards de Métricas / Estatísticas de Resumo */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => onStatusFilterChange('all')}
          className={`p-3 rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
              : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="text-xs font-medium opacity-80">Total</div>
          <div className="text-xl font-bold mt-0.5">{stats.total}</div>
        </div>

        <div
          onClick={() => onStatusFilterChange('active')}
          className={`p-3 rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'active'
              ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
              : 'bg-white text-stone-700 border-stone-200 hover:border-emerald-300'
          }`}
        >
          <div className="text-xs font-medium opacity-80">Ativos</div>
          <div className="text-xl font-bold mt-0.5 text-emerald-600 group-hover:text-emerald-700">
            {stats.active}
          </div>
        </div>

        <div
          onClick={() => onStatusFilterChange('draft')}
          className={`p-3 rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'draft'
              ? 'bg-stone-700 text-white border-stone-700 shadow-xs'
              : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
          }`}
        >
          <div className="text-xs font-medium opacity-80">Rascunhos</div>
          <div className="text-xl font-bold mt-0.5">{stats.draft}</div>
        </div>

        <div
          onClick={() => onStatusFilterChange('archived')}
          className={`p-3 rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'archived'
              ? 'bg-amber-700 text-white border-amber-700 shadow-xs'
              : 'bg-white text-stone-700 border-stone-200 hover:border-amber-300'
          }`}
        >
          <div className="text-xs font-medium opacity-80">Arquivados</div>
          <div className="text-xl font-bold mt-0.5 text-amber-600">
            {stats.archived}
          </div>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-stone-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Campo de Busca */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="input-search-forms"
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar formulário por nome, slug ou descrição..."
              className="w-full pl-9 pr-9 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-stone-400 focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
                aria-label="Limpar busca"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Alternador de Visualização (Grade / Lista) */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg self-end md:self-auto shrink-0 border border-stone-200">
            <button
              id="btn-view-grid"
              type="button"
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Visualização em Grade"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Grade</span>
            </button>
            <button
              id="btn-view-list"
              type="button"
              onClick={() => onViewModeChange('list')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                viewMode === 'list'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Visualização em Lista"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Lista</span>
            </button>
          </div>
        </div>

        {/* Abas de Filtro por Status */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 pt-1 border-t border-stone-100">
          <span className="text-xs font-medium text-stone-400 mr-2 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            Status:
          </span>
          <button
            type="button"
            onClick={() => onStatusFilterChange('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
              statusFilter === 'all'
                ? 'bg-stone-900 text-white font-semibold shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Todos ({stats.total})
          </button>
          <button
            type="button"
            onClick={() => onStatusFilterChange('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
              statusFilter === 'active'
                ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            Ativos ({stats.active})
          </button>
          <button
            type="button"
            onClick={() => onStatusFilterChange('draft')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
              statusFilter === 'draft'
                ? 'bg-stone-700 text-white font-semibold shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Rascunhos ({stats.draft})
          </button>
          <button
            type="button"
            onClick={() => onStatusFilterChange('archived')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
              statusFilter === 'archived'
                ? 'bg-amber-600 text-white font-semibold shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            Arquivados ({stats.archived})
          </button>

          {filteredCount !== totalCount && (
            <span className="text-xs text-stone-500 ml-auto hidden sm:inline">
              Exibindo {filteredCount} de {totalCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
