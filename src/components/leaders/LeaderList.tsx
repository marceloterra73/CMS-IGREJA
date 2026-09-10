import React from 'react';
import {
  UserCheck,
  Eye,
  Edit2,
  Copy,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Plus,
  ArrowUpDown,
} from 'lucide-react';
import { ChurchLeader } from '../../types';
import { LeaderCard } from './LeaderCard';
import { LeaderStatusBadge } from './LeaderStatusBadge';
import {
  formatLeaderDate,
  getMediaItemById,
  getLeaderInitials,
} from './leadersUtils';
import { LeaderViewMode } from './LeadersToolbar';

interface LeaderListProps {
  leaders: ChurchLeader[];
  viewMode: LeaderViewMode;
  onPreview: (leader: ChurchLeader) => void;
  onEdit: (leader: ChurchLeader) => void;
  onDuplicate: (leader: ChurchLeader) => void;
  onToggleStatus: (leader: ChurchLeader) => void;
  onDelete: (leader: ChurchLeader) => void;
  onNewLeader: () => void;
  hasFiltersActive: boolean;
  onClearFilters: () => void;
}

export const LeaderList: React.FC<LeaderListProps> = ({
  leaders,
  viewMode,
  onPreview,
  onEdit,
  onDuplicate,
  onToggleStatus,
  onDelete,
  onNewLeader,
  hasFiltersActive,
  onClearFilters,
}) => {
  // Estado Vazio
  if (leaders.length === 0) {
    return (
      <div
        id="leaders-empty-state"
        className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-12 text-center shadow-2xs"
      >
        <div className="w-14 h-14 mx-auto rounded-2xl bg-stone-100 text-stone-500 flex items-center justify-center mb-4">
          <UserCheck className="w-7 h-7 text-stone-400" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-stone-900">
          {hasFiltersActive
            ? 'Nenhuma liderança encontrada'
            : 'Nenhuma liderança cadastrada'}
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto mt-1.5">
          {hasFiltersActive
            ? 'Não encontramos nenhum registro correspondente aos filtros e termos de busca aplicados.'
            : 'Cadastre os pastores, ministros e líderes da igreja para apresentá-los à comunidade.'}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          {hasFiltersActive ? (
            <button
              type="button"
              onClick={onClearFilters}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Limpar filtros de busca
            </button>
          ) : (
            <button
              type="button"
              onClick={onNewLeader}
              className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar primeira liderança</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Visualização em Grade de Cards
  if (viewMode === 'cards') {
    return (
      <div
        id="leaders-cards-grid"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
      >
        {leaders.map((leader) => (
          <LeaderCard
            key={leader.id}
            leader={leader}
            onPreview={onPreview}
            onEdit={onEdit}
            onDuplicate={onDuplicate}
            onToggleStatus={onToggleStatus}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }

  // Visualização em Tabela Administrativa
  return (
    <div
      id="leaders-table-container"
      className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50/70 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              <th className="py-3 px-4 w-12 text-center">Ordem</th>
              <th className="py-3 px-4 w-14">Foto</th>
              <th className="py-3 px-4">Nome & Função</th>
              <th className="py-3 px-4 hidden md:table-cell">Apresentação</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 hidden sm:table-cell">Atualização</th>
              <th className="py-3 px-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {leaders.map((leader) => {
              const photo = getMediaItemById(leader.photoMediaId);
              const initials = getLeaderInitials(leader.name);

              return (
                <tr
                  key={leader.id}
                  className="hover:bg-stone-50/80 transition-colors group"
                >
                  {/* Ordem de Exibição */}
                  <td className="py-3 px-4 text-center font-mono font-bold text-stone-600">
                    <span className="inline-block px-1.5 py-0.5 bg-stone-100 rounded text-xs">
                      #{leader.order}
                    </span>
                  </td>

                  {/* Foto ou Avatar */}
                  <td className="py-3 px-4">
                    {photo ? (
                      <img
                        src={photo.url}
                        alt={photo.altText || leader.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-xl object-cover border border-stone-200 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-stone-800 text-white flex items-center justify-center font-bold text-xs border border-stone-300 shrink-0">
                        <span className="text-amber-300">{initials}</span>
                      </div>
                    )}
                  </td>

                  {/* Nome e Cargo */}
                  <td className="py-3 px-4">
                    <div
                      onClick={() => onPreview(leader)}
                      className="font-bold text-stone-900 group-hover:text-amber-700 transition-colors cursor-pointer"
                    >
                      {leader.name}
                    </div>
                    <div className="text-xs text-stone-600 font-medium mt-0.5">
                      {leader.role}
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                      ID: {leader.id}
                    </div>
                  </td>

                  {/* Descrição / Biografia (Desktop) */}
                  <td className="py-3 px-4 hidden md:table-cell text-xs text-stone-600 max-w-xs">
                    {leader.description ? (
                      <span className="line-clamp-2">{leader.description}</span>
                    ) : (
                      <span className="text-stone-400 italic">Sem apresentação</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <LeaderStatusBadge status={leader.status} size="sm" />
                  </td>

                  {/* Data de Atualização */}
                  <td className="py-3 px-4 hidden sm:table-cell text-xs text-stone-500 whitespace-nowrap">
                    {formatLeaderDate(leader.updatedAt || leader.createdAt)}
                  </td>

                  {/* Botões de Ação */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onPreview(leader)}
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit(leader)}
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggleStatus(leader)}
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
                        title={
                          leader.status === 'active'
                            ? 'Desativar liderança'
                            : 'Ativar liderança'
                        }
                      >
                        {leader.status === 'active' ? (
                          <ToggleRight className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <ToggleLeft className="w-4 h-4 text-stone-400" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => onDuplicate(leader)}
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
                        title="Duplicar"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(leader)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
