import React from 'react';
import { Search, X, Filter, Home, FileText, Check } from 'lucide-react';
import { PageStatus } from '../../types';

export type StatusFilterOption = 'all' | PageStatus;
export type TypeFilterOption = 'all' | 'home' | 'internal';

interface PageFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: StatusFilterOption;
  onStatusChange: (status: StatusFilterOption) => void;
  typeFilter: TypeFilterOption;
  onTypeChange: (type: TypeFilterOption) => void;
  counts: {
    total: number;
    published: number;
    draft: number;
    archived: number;
    home: number;
    internal: number;
  };
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const PageFilters: React.FC<PageFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  counts,
  onResetFilters,
  hasActiveFilters,
}) => {
  return (
    <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-stone-200 shadow-xs space-y-3">
      {/* Linha 1: Campo de Busca e Filtro de Tipo */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Barra de Pesquisa */}
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="input-search-pages"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Pesquisar páginas por título ou slug (ex: /quem-somos)..."
            className="w-full pl-9.5 pr-8 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 rounded-md"
              title="Limpar pesquisa"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filtro de Tipo (Todas / Página Inicial / Páginas Internas) */}
        <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
          <span className="text-xs text-stone-500 font-medium hidden sm:inline">Tipo:</span>
          <div className="inline-flex p-1 bg-stone-100 rounded-lg border border-stone-200/80 text-xs">
            <button
              type="button"
              onClick={() => onTypeChange('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                typeFilter === 'all'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Todas
            </button>
            <button
              type="button"
              onClick={() => onTypeChange('home')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors ${
                typeFilter === 'home'
                  ? 'bg-white text-amber-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Home className="w-3 h-3 text-amber-600" />
              <span>Inicial</span>
            </button>
            <button
              type="button"
              onClick={() => onTypeChange('internal')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors ${
                typeFilter === 'internal'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <FileText className="w-3 h-3 text-stone-400" />
              <span>Internas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Linha 2: Filtros por Status Canônico (Tabs/Pills) e Limpar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => onStatusChange('all')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              statusFilter === 'all'
                ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                : 'bg-white text-stone-600 hover:text-stone-900 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <span>Todas</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                statusFilter === 'all' ? 'bg-stone-800 text-stone-200' : 'bg-stone-100 text-stone-600'
              }`}
            >
              {counts.total}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onStatusChange('published')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              statusFilter === 'published'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-white text-stone-600 hover:text-emerald-700 border-stone-200 hover:bg-emerald-50/50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Publicadas</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                statusFilter === 'published'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-stone-100 text-stone-600'
              }`}
            >
              {counts.published}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onStatusChange('draft')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              statusFilter === 'draft'
                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                : 'bg-white text-stone-600 hover:text-amber-700 border-stone-200 hover:bg-amber-50/50'
            }`}
          >
            <span>Rascunhos</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                statusFilter === 'draft' ? 'bg-amber-700 text-white' : 'bg-stone-100 text-stone-600'
              }`}
            >
              {counts.draft}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onStatusChange('archived')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              statusFilter === 'archived'
                ? 'bg-stone-600 text-white border-stone-600 shadow-xs'
                : 'bg-white text-stone-600 hover:text-stone-900 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <span>Arquivadas</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                statusFilter === 'archived' ? 'bg-stone-700 text-white' : 'bg-stone-100 text-stone-600'
              }`}
            >
              {counts.archived}
            </span>
          </button>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-xs text-amber-700 hover:text-amber-800 font-medium py-1 px-2 hover:bg-amber-50 rounded-md transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Limpar filtros</span>
          </button>
        )}
      </div>
    </div>
  );
};
