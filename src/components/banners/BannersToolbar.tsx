import React from 'react';
import {
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  Sparkles,
  CheckCircle2,
  XCircle,
  Layers,
} from 'lucide-react';
import { BannerStatus } from '../../types';

export type BannerStatusFilter = 'all' | BannerStatus;
export type BannerSortOption =
  | 'order_asc'
  | 'title_asc'
  | 'title_desc'
  | 'recent'
  | 'oldest';
export type BannerViewMode = 'cards' | 'table';

interface BannersToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: BannerStatusFilter;
  onStatusFilterChange: (status: BannerStatusFilter) => void;
  sortBy: BannerSortOption;
  onSortChange: (sort: BannerSortOption) => void;
  viewMode: BannerViewMode;
  onViewModeChange: (mode: BannerViewMode) => void;
  onNewBanner: () => void;
  stats: {
    total: number;
    active: number;
    inactive: number;
  };
  filteredCount: number;
}

export const BannersToolbar: React.FC<BannersToolbarProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onNewBanner,
  stats,
  filteredCount,
}) => {
  return (
    <div className="space-y-4">
      {/* Cabeçalho Principal: Título, Subtítulo e Ação Primária */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              Banners
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
              {stats.total} {stats.total === 1 ? 'banner' : 'banners'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Destaques visuais, avisos principais e campanhas pastorais do site da igreja.
          </p>
        </div>

        <button
          id="btn-new-banner"
          type="button"
          onClick={onNewBanner}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs hover:shadow-md cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Novo banner</span>
        </button>
      </div>

      {/* Cartões de Métricas Dinâmicas Reais */}
      <div className="grid grid-cols-3 gap-3">
        {/* Total */}
        <button
          type="button"
          onClick={() => onStatusFilterChange('all')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
              : 'bg-white text-stone-800 border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${
              statusFilter === 'all' ? 'text-stone-300' : 'text-stone-500'
            }`}>
              Total
            </span>
            <Layers className={`w-4 h-4 ${
              statusFilter === 'all' ? 'text-amber-400' : 'text-stone-400'
            }`} />
          </div>
          <div className="text-xl sm:text-2xl font-black mt-1">
            {stats.total}
          </div>
        </button>

        {/* Ativos */}
        <button
          type="button"
          onClick={() => onStatusFilterChange('active')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === 'active'
              ? 'bg-emerald-900 text-white border-emerald-900 shadow-xs'
              : 'bg-white text-stone-800 border-stone-200 hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${
              statusFilter === 'active' ? 'text-emerald-200' : 'text-emerald-700'
            }`}>
              Ativos
            </span>
            <CheckCircle2 className={`w-4 h-4 ${
              statusFilter === 'active' ? 'text-emerald-300' : 'text-emerald-600'
            }`} />
          </div>
          <div className="text-xl sm:text-2xl font-black mt-1 text-emerald-600 dark:text-emerald-400">
            {stats.active}
          </div>
        </button>

        {/* Inativos */}
        <button
          type="button"
          onClick={() => onStatusFilterChange('inactive')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === 'inactive'
              ? 'bg-stone-800 text-white border-stone-800 shadow-xs'
              : 'bg-white text-stone-800 border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${
              statusFilter === 'inactive' ? 'text-stone-300' : 'text-stone-500'
            }`}>
              Inativos
            </span>
            <XCircle className={`w-4 h-4 ${
              statusFilter === 'inactive' ? 'text-stone-300' : 'text-stone-400'
            }`} />
          </div>
          <div className="text-xl sm:text-2xl font-black mt-1">
            {stats.inactive}
          </div>
        </button>
      </div>

      {/* Barra de Filtros, Busca, Ordenação e Modos de Exibição */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-stone-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Busca Textual em Campos Canônicos */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="input-search-banners"
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por título, subtítulo ou chamada..."
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-stone-900 focus:bg-white transition-all"
            />
          </div>

          {/* Controles de Filtros e Ordenação */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Seletor de Status */}
            <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5">
              <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <select
                id="select-banner-status"
                value={statusFilter}
                onChange={(e) =>
                  onStatusFilterChange(e.target.value as BannerStatusFilter)
                }
                className="bg-transparent text-xs font-semibold text-stone-700 focus:outline-hidden cursor-pointer"
              >
                <option value="all">Todos os Status ({stats.total})</option>
                <option value="active">Ativos ({stats.active})</option>
                <option value="inactive">Inativos ({stats.inactive})</option>
              </select>
            </div>

            {/* Seletor de Ordenação */}
            <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <select
                id="select-banner-sort"
                value={sortBy}
                onChange={(e) =>
                  onSortChange(e.target.value as BannerSortOption)
                }
                className="bg-transparent text-xs font-semibold text-stone-700 focus:outline-hidden cursor-pointer"
              >
                <option value="order_asc">Ordem (# Crescente)</option>
                <option value="title_asc">Título (A-Z)</option>
                <option value="title_desc">Título (Z-A)</option>
                <option value="recent">Mais Recentes</option>
                <option value="oldest">Mais Antigos</option>
              </select>
            </div>

            {/* Alternador de Modo de Exibição */}
            <div className="flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200">
              <button
                type="button"
                onClick={() => onViewModeChange('cards')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-white text-stone-900 shadow-2xs font-bold'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                title="Exibir em Cartões Visuais"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('table')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-stone-900 shadow-2xs font-bold'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                title="Exibir em Tabela"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Resumo do filtro ativo */}
        {(searchTerm || statusFilter !== 'all') && (
          <div className="flex items-center justify-between text-xs text-stone-500 pt-1 border-t border-stone-100">
            <span>
              Exibindo <strong>{filteredCount}</strong> de <strong>{stats.total}</strong> banners
            </span>
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                onStatusFilterChange('all');
              }}
              className="text-stone-600 hover:text-stone-900 underline font-medium cursor-pointer"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
