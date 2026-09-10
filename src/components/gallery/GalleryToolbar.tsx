import React from 'react';
import {
  Camera,
  Plus,
  Search,
  LayoutGrid,
  List,
  CheckCircle2,
  Archive,
  X,
  SlidersHorizontal,
  Images,
} from 'lucide-react';
import { GalleryStatus } from '../../types';

export type GalleryStatusFilter = 'all' | GalleryStatus;

export type GallerySortOption =
  | 'recent'
  | 'oldest'
  | 'title_asc'
  | 'title_desc'
  | 'photos_desc';

export type GalleryViewMode = 'cards' | 'table';

interface GalleryToolbarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  statusFilter: GalleryStatusFilter;
  onStatusFilterChange: (status: GalleryStatusFilter) => void;
  sortBy: GallerySortOption;
  onSortChange: (sort: GallerySortOption) => void;
  viewMode: GalleryViewMode;
  onViewModeChange: (mode: GalleryViewMode) => void;
  onNewAlbum: () => void;
  stats: {
    total: number;
    active: number;
    archived: number;
    totalPhotos: number;
  };
  filteredCount: number;
}

export const GalleryToolbar: React.FC<GalleryToolbarProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onNewAlbum,
  stats,
  filteredCount,
}) => {
  const hasActiveFilters = searchTerm.trim() !== '' || statusFilter !== 'all';

  return (
    <div id="gallery-toolbar" className="space-y-4">
      {/* Linha Superior: Título da Seção e Ação Primária */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-stone-900 text-white flex items-center justify-center shadow-xs">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-stone-900 tracking-tight">
                Galeria
              </h1>
              <p className="text-xs sm:text-sm text-stone-500">
                Gerenciamento visual e organização dos álbuns fotográficos da congregação.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-new-album"
            type="button"
            onClick={onNewAlbum}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium rounded-lg shadow-xs transition-colors focus:outline-hidden focus:ring-2 focus:ring-stone-400"
          >
            <Plus className="w-4 h-4" />
            <span>+ Novo álbum</span>
          </button>
        </div>
      </div>

      {/* Métricas Dinâmicas em Cards Rítmicos */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total de Álbuns */}
        <button
          type="button"
          onClick={() => onStatusFilterChange('all')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'all'
              ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
              : 'bg-white hover:bg-stone-50 text-stone-900 border-stone-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-medium uppercase tracking-wider ${
                statusFilter === 'all' ? 'text-stone-300' : 'text-stone-500'
              }`}
            >
              Total de Álbuns
            </span>
            <Camera
              className={`w-4 h-4 ${
                statusFilter === 'all' ? 'text-stone-300' : 'text-stone-400'
              }`}
            />
          </div>
          <div className="mt-2 text-2xl font-bold">{stats.total}</div>
          <div
            className={`text-xs mt-0.5 ${
              statusFilter === 'all' ? 'text-stone-300' : 'text-stone-500'
            }`}
          >
            Todos os registros
          </div>
        </button>

        {/* Álbuns Ativos */}
        <button
          type="button"
          onClick={() => onStatusFilterChange(statusFilter === 'active' ? 'all' : 'active')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'active'
              ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
              : 'bg-white hover:bg-emerald-50/50 text-stone-900 border-stone-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-medium uppercase tracking-wider ${
                statusFilter === 'active' ? 'text-emerald-200' : 'text-emerald-700'
              }`}
            >
              Ativos
            </span>
            <CheckCircle2
              className={`w-4 h-4 ${
                statusFilter === 'active' ? 'text-emerald-200' : 'text-emerald-600'
              }`}
            />
          </div>
          <div className="mt-2 text-2xl font-bold">{stats.active}</div>
          <div
            className={`text-xs mt-0.5 ${
              statusFilter === 'active' ? 'text-emerald-200' : 'text-stone-500'
            }`}
          >
            Publicados no site
          </div>
        </button>

        {/* Álbuns Arquivados */}
        <button
          type="button"
          onClick={() =>
            onStatusFilterChange(statusFilter === 'archived' ? 'all' : 'archived')
          }
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'archived'
              ? 'bg-stone-700 text-white border-stone-700 shadow-xs'
              : 'bg-white hover:bg-stone-50 text-stone-900 border-stone-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-medium uppercase tracking-wider ${
                statusFilter === 'archived' ? 'text-stone-300' : 'text-stone-500'
              }`}
            >
              Arquivados
            </span>
            <Archive
              className={`w-4 h-4 ${
                statusFilter === 'archived' ? 'text-stone-300' : 'text-stone-400'
              }`}
            />
          </div>
          <div className="mt-2 text-2xl font-bold">{stats.archived}</div>
          <div
            className={`text-xs mt-0.5 ${
              statusFilter === 'archived' ? 'text-stone-300' : 'text-stone-500'
            }`}
          >
            Histórico interno
          </div>
        </button>

        {/* Fotos Registradas */}
        <div className="p-3.5 rounded-xl border border-stone-200 bg-white text-stone-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-stone-500">
              Fotos Vinculadas
            </span>
            <Images className="w-4 h-4 text-stone-400" />
          </div>
          <div className="mt-2 text-2xl font-bold">{stats.totalPhotos}</div>
          <div className="text-xs mt-0.5 text-stone-500">
            Total em todos os álbuns
          </div>
        </div>
      </div>

      {/* Controles de Busca, Filtro, Ordenação e Modo de Visualização */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3 bg-white rounded-xl border border-stone-200 shadow-xs">
        {/* Campo de Busca */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            id="gallery-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por título, descrição ou slug..."
            className="w-full pl-9 pr-8 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-stone-400 focus:bg-white transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5 rounded-full"
              title="Limpar busca"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filtros e Controles Rápidos */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Filtro de Status */}
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400 hidden sm:block" />
            <select
              id="gallery-status-select"
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value as GalleryStatusFilter)}
              className="text-xs sm:text-sm bg-stone-50 border border-stone-200 text-stone-700 py-2 px-2.5 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-stone-400 focus:bg-white"
            >
              <option value="all">Todos os status</option>
              <option value="active">Somente Ativos</option>
              <option value="archived">Somente Arquivados</option>
            </select>
          </div>

          {/* Ordenação */}
          <select
            id="gallery-sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as GallerySortOption)}
            className="text-xs sm:text-sm bg-stone-50 border border-stone-200 text-stone-700 py-2 px-2.5 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-stone-400 focus:bg-white"
          >
            <option value="recent">Mais recentes</option>
            <option value="oldest">Mais antigos</option>
            <option value="title_asc">Título (A-Z)</option>
            <option value="title_desc">Título (Z-A)</option>
            <option value="photos_desc">Mais fotos</option>
          </select>

          {/* Alternador de Visualização */}
          <div className="flex items-center border border-stone-200 rounded-lg p-0.5 bg-stone-50 ml-auto sm:ml-0">
            <button
              type="button"
              onClick={() => onViewModeChange('cards')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'cards'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Visualização em Grade de Cards"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Visualização em Tabela / Lista"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Indicador de Filtros Ativos */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between text-xs text-stone-600 bg-stone-50 px-3 py-2 rounded-lg border border-stone-200">
          <span>
            Exibindo <strong>{filteredCount}</strong> de <strong>{stats.total}</strong> álbuns
            {statusFilter !== 'all' && (
              <>
                {' '}
                com status <strong>{statusFilter === 'active' ? 'Ativo' : 'Arquivado'}</strong>
              </>
            )}
            {searchTerm && (
              <>
                {' '}
                contendo "<strong>{searchTerm}</strong>"
              </>
            )}
          </span>
          <button
            type="button"
            onClick={() => {
              onSearchChange('');
              onStatusFilterChange('all');
            }}
            className="text-stone-500 hover:text-stone-900 font-medium inline-flex items-center gap-1 ml-2"
          >
            <X className="w-3.5 h-3.5" />
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
};
