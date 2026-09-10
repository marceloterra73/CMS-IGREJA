import React from 'react';
import {
  HeartHandshake,
  Plus,
  Search,
  LayoutGrid,
  List,
  Clock,
  CheckCircle2,
  Archive,
  Sparkles,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { PrayerRequestStatus } from '../../types';

export type PrayerStatusFilter = 'all' | PrayerRequestStatus;

export type PrayerSortOption =
  | 'recent'
  | 'oldest'
  | 'requester_asc'
  | 'requester_desc';

export type PrayerViewMode = 'table' | 'cards';

interface PrayerRequestsToolbarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  statusFilter: PrayerStatusFilter;
  onStatusFilterChange: (status: PrayerStatusFilter) => void;
  sortBy: PrayerSortOption;
  onSortChange: (sort: PrayerSortOption) => void;
  viewMode: PrayerViewMode;
  onViewModeChange: (mode: PrayerViewMode) => void;
  onNewRequest: () => void;
  stats: {
    total: number;
    pending: number;
    praying: number;
    answered: number;
    archived: number;
  };
  filteredCount: number;
}

export const PrayerRequestsToolbar: React.FC<PrayerRequestsToolbarProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onNewRequest,
  stats,
  filteredCount,
}) => {
  return (
    <div id="prayer-requests-toolbar" className="space-y-4">
      {/* Linha Superior: Título da Seção e Botão Primário */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-stone-900 text-white flex items-center justify-center shadow-xs">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              Pedidos de Oração
            </h1>
            <p className="text-xs text-stone-500">
              Acompanhamento pastoral e intercessão confidencial dos pedidos da igreja.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="btn-new-prayer-request"
            type="button"
            onClick={onNewRequest}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Novo pedido</span>
          </button>
        </div>
      </div>

      {/* Cartões de Métricas em Tempo Real (Filtros Rápidos Interativos) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
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
            <HeartHandshake
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
            Todos os pedidos
          </span>
        </button>

        {/* Pendentes */}
        <button
          type="button"
          onClick={() => onStatusFilterChange('pending')}
          className={`p-3 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'pending'
              ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
              : 'bg-white text-stone-900 border-stone-200 hover:border-amber-300 hover:bg-amber-50/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-[11px] font-semibold uppercase tracking-wider ${
                statusFilter === 'pending' ? 'text-amber-100' : 'text-amber-700'
              }`}
            >
              Pendentes
            </span>
            <Clock
              className={`w-4 h-4 ${
                statusFilter === 'pending' ? 'text-amber-200' : 'text-amber-500'
              }`}
            />
          </div>
          <div className="text-xl sm:text-2xl font-black mt-1">{stats.pending}</div>
          <span
            className={`text-[10px] hidden sm:block mt-0.5 ${
              statusFilter === 'pending' ? 'text-amber-200' : 'text-stone-400'
            }`}
          >
            Aguardando triagem
          </span>
        </button>

        {/* Em Oração */}
        <button
          type="button"
          onClick={() => onStatusFilterChange('praying')}
          className={`p-3 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'praying'
              ? 'bg-sky-700 text-white border-sky-700 shadow-sm'
              : 'bg-white text-stone-900 border-stone-200 hover:border-sky-300 hover:bg-sky-50/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-[11px] font-semibold uppercase tracking-wider ${
                statusFilter === 'praying' ? 'text-sky-100' : 'text-sky-700'
              }`}
            >
              Em Oração
            </span>
            <Sparkles
              className={`w-4 h-4 ${
                statusFilter === 'praying' ? 'text-sky-200' : 'text-sky-500'
              }`}
            />
          </div>
          <div className="text-xl sm:text-2xl font-black mt-1">{stats.praying}</div>
          <span
            className={`text-[10px] hidden sm:block mt-0.5 ${
              statusFilter === 'praying' ? 'text-sky-200' : 'text-stone-400'
            }`}
          >
            Intercessão ativa
          </span>
        </button>

        {/* Respondidos */}
        <button
          type="button"
          onClick={() => onStatusFilterChange('answered')}
          className={`p-3 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'answered'
              ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
              : 'bg-white text-stone-900 border-stone-200 hover:border-emerald-300 hover:bg-emerald-50/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-[11px] font-semibold uppercase tracking-wider ${
                statusFilter === 'answered' ? 'text-emerald-100' : 'text-emerald-700'
              }`}
            >
              Respondidos
            </span>
            <CheckCircle2
              className={`w-4 h-4 ${
                statusFilter === 'answered' ? 'text-emerald-200' : 'text-emerald-500'
              }`}
            />
          </div>
          <div className="text-xl sm:text-2xl font-black mt-1">{stats.answered}</div>
          <span
            className={`text-[10px] hidden sm:block mt-0.5 ${
              statusFilter === 'answered' ? 'text-emerald-200' : 'text-stone-400'
            }`}
          >
            Motivos de louvor
          </span>
        </button>

        {/* Arquivados */}
        <button
          type="button"
          onClick={() => onStatusFilterChange('archived')}
          className={`p-3 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer col-span-2 sm:col-span-1 ${
            statusFilter === 'archived'
              ? 'bg-stone-700 text-white border-stone-700 shadow-sm'
              : 'bg-white text-stone-900 border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-[11px] font-semibold uppercase tracking-wider ${
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
          <div className="text-xl sm:text-2xl font-black mt-1">{stats.archived}</div>
          <span
            className={`text-[10px] hidden sm:block mt-0.5 ${
              statusFilter === 'archived' ? 'text-stone-400' : 'text-stone-400'
            }`}
          >
            Concluídos
          </span>
        </button>
      </div>

      {/* Barra de Busca, Ordenação e Alternador de Visão */}
      <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Campo de Busca */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="prayer-requests-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por solicitante, título ou motivo de oração..."
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
              id="prayer-requests-sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as PrayerSortOption)}
              className="px-2.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-700 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-400 cursor-pointer"
            >
              <option value="recent">Mais recentes</option>
              <option value="oldest">Mais antigos</option>
              <option value="requester_asc">Solicitante (A-Z)</option>
              <option value="requester_desc">Solicitante (Z-A)</option>
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
              title="Visualização em Tabela"
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
            Exibindo <strong>{filteredCount}</strong> de <strong>{stats.total}</strong> pedidos
            {statusFilter !== 'all' && (
              <>
                {' '}
                filtrados por{' '}
                <span className="font-semibold text-stone-800">
                  {statusFilter === 'pending'
                    ? 'Pendentes'
                    : statusFilter === 'praying'
                    ? 'Em Oração'
                    : statusFilter === 'answered'
                    ? 'Respondidos'
                    : 'Arquivados'}
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
