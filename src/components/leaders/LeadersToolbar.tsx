import React from 'react';
import {
  UserCheck,
  Plus,
  Search,
  LayoutGrid,
  List,
  CheckCircle,
  XCircle,
  X,
  SlidersHorizontal,
  ArrowUpDown,
} from 'lucide-react';
import { LeaderStatus } from '../../types';

export type LeaderStatusFilter = 'all' | LeaderStatus;

export type LeaderSortOption =
  | 'order_asc'
  | 'name_asc'
  | 'name_desc'
  | 'role_asc'
  | 'recent'
  | 'oldest';

export type LeaderViewMode = 'cards' | 'table';

interface LeadersToolbarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  statusFilter: LeaderStatusFilter;
  onStatusFilterChange: (status: LeaderStatusFilter) => void;
  sortBy: LeaderSortOption;
  onSortChange: (sort: LeaderSortOption) => void;
  viewMode: LeaderViewMode;
  onViewModeChange: (mode: LeaderViewMode) => void;
  onNewLeader: () => void;
  stats: {
    total: number;
    active: number;
    inactive: number;
  };
  filteredCount: number;
}

export const LeadersToolbar: React.FC<LeadersToolbarProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onNewLeader,
  stats,
  filteredCount,
}) => {
  return (
    <div id="leaders-toolbar" className="space-y-4">
      {/* Linha Superior: Cabeçalho da Seção e Botão Primário */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-stone-900 text-white rounded-xl shadow-xs">
              <UserCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                Lideranças
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                Cadastro e administração dos pastores, ministros e corpo de líderes da igreja.
              </p>
            </div>
          </div>
        </div>

        <button
          id="btn-new-leader"
          onClick={onNewLeader}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs hover:shadow-md cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nova liderança</span>
        </button>
      </div>

      {/* Cartões de Métricas */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        {/* Total */}
        <button
          type="button"
          onClick={() => onStatusFilterChange('all')}
          className={`p-3 sm:p-4 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
              : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-[11px] sm:text-xs font-medium uppercase tracking-wider ${
                statusFilter === 'all' ? 'text-stone-300' : 'text-stone-500'
              }`}
            >
              Total
            </span>
            <UserCheck
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                statusFilter === 'all' ? 'text-stone-300' : 'text-stone-400'
              }`}
            />
          </div>
          <div className="text-lg sm:text-2xl font-bold mt-1 tracking-tight">
            {stats.total}
          </div>
          <div
            className={`text-[10px] sm:text-xs mt-0.5 truncate ${
              statusFilter === 'all' ? 'text-stone-300' : 'text-stone-500'
            }`}
          >
            Cadastradas
          </div>
        </button>

        {/* Ativos */}
        <button
          type="button"
          onClick={() => onStatusFilterChange('active')}
          className={`p-3 sm:p-4 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === 'active'
              ? 'bg-emerald-900 text-white border-emerald-900 shadow-xs'
              : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-[11px] sm:text-xs font-medium uppercase tracking-wider ${
                statusFilter === 'active' ? 'text-emerald-200' : 'text-stone-500'
              }`}
            >
              Ativos
            </span>
            <CheckCircle
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                statusFilter === 'active' ? 'text-emerald-300' : 'text-emerald-600'
              }`}
            />
          </div>
          <div className="text-lg sm:text-2xl font-bold mt-1 tracking-tight">
            {stats.active}
          </div>
          <div
            className={`text-[10px] sm:text-xs mt-0.5 truncate ${
              statusFilter === 'active' ? 'text-emerald-200' : 'text-stone-500'
            }`}
          >
            Em exercício
          </div>
        </button>

        {/* Inativos */}
        <button
          type="button"
          onClick={() => onStatusFilterChange('inactive')}
          className={`p-3 sm:p-4 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === 'inactive'
              ? 'bg-stone-800 text-white border-stone-800 shadow-xs'
              : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-[11px] sm:text-xs font-medium uppercase tracking-wider ${
                statusFilter === 'inactive' ? 'text-stone-300' : 'text-stone-500'
              }`}
            >
              Inativos
            </span>
            <XCircle
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                statusFilter === 'inactive' ? 'text-stone-300' : 'text-stone-400'
              }`}
            />
          </div>
          <div className="text-lg sm:text-2xl font-bold mt-1 tracking-tight">
            {stats.inactive}
          </div>
          <div
            className={`text-[10px] sm:text-xs mt-0.5 truncate ${
              statusFilter === 'inactive' ? 'text-stone-300' : 'text-stone-500'
            }`}
          >
            Licença/Emérito
          </div>
        </button>
      </div>

      {/* Linha Inferior: Controles de Busca, Filtros, Ordenação e Modo de Visualização */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-stone-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 justify-between">
          {/* Campo de Busca Textual */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="input-search-leaders"
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por nome, cargo ou biografia..."
              className="w-full pl-9 pr-9 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-stone-900 focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5 rounded-full hover:bg-stone-200 transition-colors"
                title="Limpar busca"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filtros, Ordenação e Alternador de Visão */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Filtro por Status */}
            <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
              <button
                type="button"
                onClick={() => onStatusFilterChange('all')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => onStatusFilterChange('active')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  statusFilter === 'active'
                    ? 'bg-white text-emerald-700 shadow-2xs font-semibold'
                    : 'text-stone-600 hover:text-emerald-700'
                }`}
              >
                Ativos
              </button>
              <button
                type="button"
                onClick={() => onStatusFilterChange('inactive')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  statusFilter === 'inactive'
                    ? 'bg-white text-stone-800 shadow-2xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Inativos
              </button>
            </div>

            {/* Seletor de Ordenação */}
            <div className="relative flex items-center">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 pointer-events-none" />
              <select
                id="select-sort-leaders"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as LeaderSortOption)}
                aria-label="Ordenar lideranças por"
                className="pl-8 pr-7 py-1.5 bg-stone-100 hover:bg-stone-200/70 border border-stone-200 rounded-xl text-xs font-medium text-stone-700 focus:outline-hidden focus:ring-2 focus:ring-stone-900 cursor-pointer transition-colors appearance-none"
              >
                <option value="order_asc">Ordem de exibição (1, 2, 3...)</option>
                <option value="name_asc">Nome A–Z</option>
                <option value="name_desc">Nome Z–A</option>
                <option value="role_asc">Cargo / Função A–Z</option>
                <option value="recent">Mais recentes</option>
                <option value="oldest">Mais antigos</option>
              </select>
            </div>

            {/* Alternador de Visualização (Cards vs Tabela) */}
            <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
              <button
                type="button"
                onClick={() => onViewModeChange('cards')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
                title="Visualização em grade de cartões"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('table')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
                title="Visualização em tabela"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Indicador de Filtros Ativos e Quantidade */}
        <div className="flex items-center justify-between text-xs text-stone-500 pt-1 border-t border-stone-100">
          <div>
            Mostrando <span className="font-semibold text-stone-800">{filteredCount}</span> de{' '}
            <span className="font-semibold text-stone-800">{stats.total}</span> lideranças
          </div>

          {(searchTerm || statusFilter !== 'all') && (
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
          )}
        </div>
      </div>
    </div>
  );
};
