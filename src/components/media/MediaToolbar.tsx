import React from 'react';
import { Search, LayoutGrid, List, Filter } from 'lucide-react';
import { MediaType, MediaStatus } from '../../types';

interface MediaToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedFolder: string;
  onFolderChange: (folder: string) => void;
  availableFolders: string[];
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  hideTypeFilter?: boolean;
}

export const MediaToolbar: React.FC<MediaToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedStatus,
  onStatusChange,
  selectedFolder,
  onFolderChange,
  availableFolders,
  viewMode,
  onViewModeChange,
  hideTypeFilter,
}) => {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-3 shadow-xs space-y-3">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Barra de Busca */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar mídia..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-800"
          />
        </div>

        {/* Filtros e Alternador de Exibição */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Filtro de Tipo */}
          {!hideTypeFilter && (
            <select
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 text-stone-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">Todos os tipos</option>
              <option value="image">Imagens</option>
              <option value="video">Vídeos</option>
              <option value="audio">Áudios</option>
              <option value="document">Documentos</option>
            </select>
          )}

          {/* Filtro de Status */}
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 text-stone-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">Todos os status</option>
            <option value="active">Ativo</option>
            <option value="archived">Arquivado</option>
          </select>

          {/* Filtro de Pasta */}
          {availableFolders.length > 0 && (
            <select
              value={selectedFolder}
              onChange={(e) => onFolderChange(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 text-stone-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">Todas as pastas</option>
              {availableFolders.map((folder) => (
                <option key={folder} value={folder}>
                  {folder}
                </option>
              ))}
            </select>
          )}

          {/* Alternador Grade / Lista */}
          <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 ml-auto sm:ml-0">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-amber-700 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Visualização em Grade"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-amber-700 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Visualização em Lista"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
