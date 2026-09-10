import React from 'react';
import {
  Users,
  Plus,
  Search,
  LayoutGrid,
  List,
  CheckCircle,
  XCircle,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { MinistryStatus } from '../../types';

export type MinistryStatusFilter = 'all' | MinistryStatus;

export type MinistrySortOption =
  | 'recent'
  | 'oldest'
  | 'name_asc'
  | 'name_desc'
  | 'leader_asc'
  | 'leader_desc';

export type MinistryViewMode = 'table' | 'cards';

interface MinistriesToolbarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  statusFilter: MinistryStatusFilter;
  onStatusFilterChange: (status: MinistryStatusFilter) => void;
  sortBy: MinistrySortOption;
  onSortChange: (sort: MinistrySortOption) => void;
  viewMode: MinistryViewMode;
  onViewModeChange: (mode: MinistryViewMode) => void;
  onNewMinistry: () => void;
  stats: {
    total: number;
    active: number;
    inactive: number;
  };
  filteredCount: number;
}

export const MinistriesToolbar: React.FC<MinistriesToolbarProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onNewMinistry,
  stats,
  filteredCount,
}) => {
  return (
    <div id="ministries-toolbar" className="space-y-4">
      {/* Linha Superior: Cabeçalho da Seção e Botão Primário */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-stone-900 text-white flex items-center justify-center shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                Ministérios
              </h1>
              <p className="text-xs text-stone-500">
                Gerencie os departamentos, equipes e frentes de atuação da congregação.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="btn-new-ministry"
            type="button"
            onClick={onNewMinistry}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Novo ministério</span>
          </button>
        </div>
      </div>

      {/* Cartões de Métricas em Tempo Real (Interativos como Filtros Rápidos) */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {/* Total */}
        <button
          type="button"
          onClick={() => onStatusFilterChange('all')}
          className={`p-3 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
              : 'bg-white text-stone-900 border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-[11px] font-semibold uppercase tracking-wider ${
                statusFilter === 'all' ? 'text-stone-300' : 'text-stone-500'
              }`}
            >
              Total
            </span>
            <Users
              className={`w-4 h-4 ${
                statusFilter === 'all' ? 'text-stone-300' : 'text-stone-400'
              }`}
            />
          </div>
          <div className="text-xl sm:text-2xl font-black mt-1">{stats.total}</div>
          <span
            className={`text-[10px] hidden sm:block mt-0.5 ${
              statusFilter === 'all' ? 'text-stone-400' : 'text-stone-400'
            }`}
          >
            Departamentos registrados
          </span>
        </button>

        {/* Ativos */}
        <button
          type="button"
          onClick={() => onStatusFilterChange('active')}
          className={`p-3 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'active'
              ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
              : 'bg-white text-stone-900 border-stone-200 hover:border-emerald-200 hover:bg-emerald-50/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-[11px] font-semibold uppercase tracking-wider ${
                statusFilter === 'active' ? 'text-emerald-100' : 'text-emerald-700'
              }`}
            >
              Ativos
            </span>
            <CheckCircle
              className={`w-4 h-4 ${
                statusFilter === 'active' ? 'text-emerald-200' : 'text-emerald-500'
              }`}
            />
          </div>
          <div className="text-xl sm:text-2xl font-black mt-1">{stats.active}</div>
          <span
            className={`text-[10px] hidden sm:block mt-0.5 ${
              statusFilter === 'active' ? 'text-emerald-200' : 'text-stone-400'
            }`}
          >
            Em plena atividade
          </span>
        </button>

        {/* Inativos */}
        <button
          type="button"
          onClick={() => onStatusFilterChange('inactive')}
          className={`p-3 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'inactive'
              ? 'bg-stone-700 text-white border-stone-700 shadow-sm'
              : 'bg-white text-stone-900 border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-[11px] font-semibold uppercase tracking-wider ${
                statusFilter === 'inactive' ? 'text-stone-300' : 'text-stone-500'
              }`}
            >
              Inativos
            </span>
            <XCircle
              className={`w-4 h-4 ${
                statusFilter === 'inactive' ? 'text-stone-300' : 'text-stone-400'
              }`}
            />
          </div>
          <div className="text-xl sm:text-2xl font-black mt-1">{stats.inactive}</div>
          <span
            className={`text-[10px] hidden sm:block mt-0.5 ${
              statusFilter === 'inactive' ? 'text-stone-400' : 'text-stone-400'
            }`}
          >
            Pausados ou suspensos
          </span>
        </button>
      </div>

      {/* Barra de Busca, Ordenação e Alternador de Visão */}
      <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Campo de Busca */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="ministries-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nome, slug, liderança ou descrição..."
            className="w-full pl-10 pr-9 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-400 transition-all"
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

        {/* Controles: Ordenação e Visão */}
        <div className="flex items-center gap-2 self-end md:self-auto shrink-0 w-full md:w-auto justify-between md:justify-start">
          {/* Ordenação */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <select
              id="ministries-sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as MinistrySortOption)}
              className="px-2.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-700 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-400 cursor-pointer"
            >
              <option value="recent">Mais recentes</option>
              <option value="oldest">Mais antigos</option>
              <option value="name_asc">Nome (A-Z)</option>
              <option value="name_desc">Nome (Z-A)</option>
              <option value="leader_asc">Liderança (A-Z)</option>
              <option value="leader_desc">Liderança (Z-A)</option>
            </select>
          </div>

          {/* Alternador de Modo de Visualização */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Visualização em Lista / Tabela"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('cards')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Visualização em Cartões"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Indicador de Filtros Ativos */}
      {(searchTerm || statusFilter !== 'all') && (
        <div className="flex items-center justify-between text-xs text-stone-500 px-1">
          <span>
            Exibindo <strong>{filteredCount}</strong> de <strong>{stats.total}</strong> ministérios
            {statusFilter !== 'all' && (
              <>
                {' '}
                filtrados por{' '}
                <span className="font-semibold text-stone-800">
                  {statusFilter === 'active' ? 'Ativos' : 'Inativos'}
                </span>
              </>
            )}
            {searchTerm && (
              <>
                {' '}
                com termo &ldquo;<strong>{searchTerm}</strong>&rdquo;
              </>
            )}
          </span>
          <button
            type="button"
            onClick={() => {
              onSearchChange('');
              onStatusFilterChange('all');
            }}
            className="text-stone-600 hover:text-stone-900 font-medium underline cursor-pointer"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
};
