import React from 'react';
import {
  Video,
  Plus,
  Search,
  X,
  LayoutGrid,
  List as ListIcon,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { SermonStatus } from '../../types';

export type SermonStatusFilter = 'all' | SermonStatus;
export type SermonSortOption =
  | 'recent'
  | 'oldest'
  | 'title_asc'
  | 'title_desc'
  | 'preacher_asc'
  | 'preacher_desc';
export type SermonViewMode = 'table' | 'cards';

interface SermonsToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: SermonStatusFilter;
  onStatusFilterChange: (status: SermonStatusFilter) => void;
  sortBy: SermonSortOption;
  onSortChange: (sort: SermonSortOption) => void;
  viewMode: SermonViewMode;
  onViewModeChange: (mode: SermonViewMode) => void;
  onNewSermon: () => void;
  stats: {
    total: number;
    published: number;
    draft: number;
    archived: number;
  };
  filteredCount: number;
}

export const SermonsToolbar: React.FC<SermonsToolbarProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onNewSermon,
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
              <Video className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              Sermões
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Gerencie o acervo de sermões, pregações e estudos bíblicos da sua igreja.
          </p>
        </div>

        <button
          id="btn-new-sermon"
          type="button"
          onClick={onNewSermon}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-900 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-stone-800 transition-all shadow-xs hover:shadow-md cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Novo sermão</span>
        </button>
      </div>

      {/* Cards de Métricas e Filtros Rápidos */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          id="metric-sermons-all"
          type="button"
          onClick={() => onStatusFilterChange('all')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
              : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="text-[11px] font-medium opacity-80 uppercase tracking-wider">
            Total
          </div>
          <div className="text-xl font-bold mt-0.5">{stats.total}</div>
        </button>

        <button
          id="metric-sermons-published"
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
          id="metric-sermons-draft"
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
          id="metric-sermons-archived"
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

      {/* Barra de Ações: Busca, Ordenação e Visualização */}
      <div className="bg-white rounded-2xl border border-stone-200 p-3 sm:p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Campo de Busca */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              id="sermons-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por título, slug, pregador, passagem ou descrição..."
              className="w-full pl-9 pr-9 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:ring-2 focus:ring-stone-400 focus:outline-hidden transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5 cursor-pointer"
                title="Limpar busca"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Controles: Ordenação e Modo de Visualização */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Seletor de Ordenação */}
            <div className="flex items-center gap-1 bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs text-stone-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <select
                id="sermons-sort-select"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SermonSortOption)}
                className="bg-transparent border-none text-xs font-medium text-stone-800 focus:outline-hidden cursor-pointer"
              >
                <option value="recent">Mais recentes</option>
                <option value="oldest">Mais antigos</option>
                <option value="title_asc">Título (A-Z)</option>
                <option value="title_desc">Título (Z-A)</option>
                <option value="preacher_asc">Pregador (A-Z)</option>
                <option value="preacher_desc">Pregador (Z-A)</option>
              </select>
            </div>

            {/* Alternador de Modo de Visualização */}
            <div className="flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200">
              <button
                id="btn-view-table"
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
                id="btn-view-cards"
                type="button"
                onClick={() => onViewModeChange('cards')}
                title="Visualização em Cartões"
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Linha de Filtros Ativos e Contagem */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-stone-400" />
            <span>Filtro de status:</span>
            <div className="flex items-center gap-1">
              {(['all', 'published', 'draft', 'archived'] as SermonStatusFilter[]).map((status) => {
                const label =
                  status === 'all'
                    ? 'Todos'
                    : status === 'published'
                    ? 'Publicados'
                    : status === 'draft'
                    ? 'Rascunhos'
                    : 'Arquivados';
                const isActive = statusFilter === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => onStatusFilterChange(status)}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-[11px] text-stone-400">
            Exibindo <strong className="text-stone-700 font-semibold">{filteredCount}</strong> de{' '}
            {stats.total} sermões
          </div>
        </div>
      </div>
    </div>
  );
};
