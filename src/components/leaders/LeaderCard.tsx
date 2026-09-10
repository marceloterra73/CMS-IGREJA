import React from 'react';
import {
  Eye,
  Edit2,
  Copy,
  Trash2,
  Calendar,
  ToggleLeft,
  ToggleRight,
  MoreVertical,
  User,
  Hash,
} from 'lucide-react';
import { ChurchLeader } from '../../types';
import { LeaderStatusBadge } from './LeaderStatusBadge';
import {
  formatLeaderDate,
  getMediaItemById,
  getLeaderInitials,
} from './leadersUtils';

interface LeaderCardProps {
  leader: ChurchLeader;
  onPreview: (leader: ChurchLeader) => void;
  onEdit: (leader: ChurchLeader) => void;
  onDuplicate: (leader: ChurchLeader) => void;
  onToggleStatus: (leader: ChurchLeader) => void;
  onDelete: (leader: ChurchLeader) => void;
}

export const LeaderCard: React.FC<LeaderCardProps> = ({
  leader,
  onPreview,
  onEdit,
  onDuplicate,
  onToggleStatus,
  onDelete,
}) => {
  const photo = getMediaItemById(leader.photoMediaId);
  const initials = getLeaderInitials(leader.name);

  return (
    <div
      id={`leader-card-${leader.id}`}
      className="group bg-white rounded-2xl border border-stone-200 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden"
    >
      {/* Topo do Card com Foto ou Avatar e Badges */}
      <div className="relative p-5 pb-3 bg-gradient-to-b from-stone-50/80 to-white flex items-start justify-between gap-3 border-b border-stone-100">
        {/* Foto ou Iniciais */}
        <div className="relative">
          {photo ? (
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden border-2 border-white shadow-xs shrink-0 bg-stone-100">
              <img
                src={photo.url}
                alt={photo.altText || leader.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ) : (
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-stone-800 to-stone-900 text-white flex items-center justify-center font-bold text-lg sm:text-xl border-2 border-white shadow-xs shrink-0">
              <span className="tracking-wider text-amber-300/90">{initials}</span>
            </div>
          )}

          {/* Indicador de Ordem de Exibição */}
          <span
            className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-stone-900 text-white font-mono text-[10px] font-bold rounded-md shadow-2xs border border-white"
            title={`Ordem de exibição na hierarquia: ${leader.order}`}
          >
            #{leader.order}
          </span>
        </div>

        {/* Badges e Ação Rápida */}
        <div className="flex flex-col items-end gap-1.5">
          <LeaderStatusBadge status={leader.status} size="sm" />
          <button
            type="button"
            onClick={() => onToggleStatus(leader)}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-500 hover:text-stone-800 px-2 py-0.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
            title={leader.status === 'active' ? 'Inativar liderança' : 'Ativar liderança'}
          >
            {leader.status === 'active' ? (
              <>
                <ToggleRight className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">Desativar</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-4 h-4 text-stone-400" />
                <span className="hidden sm:inline">Ativar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Conteúdo Principal do Card */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Nome da Liderança */}
          <h3
            onClick={() => onPreview(leader)}
            className="font-bold text-stone-900 text-base sm:text-lg leading-snug group-hover:text-amber-700 transition-colors cursor-pointer"
          >
            {leader.name}
          </h3>

          {/* Cargo / Função Pastoral */}
          <div className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-lg">
            <span>{leader.role}</span>
          </div>

          {/* Biografia / Apresentação */}
          {leader.description ? (
            <p className="mt-3 text-xs sm:text-sm text-stone-600 line-clamp-3 leading-relaxed">
              {leader.description}
            </p>
          ) : (
            <p className="mt-3 text-xs text-stone-400 italic">
              Nenhuma biografia ou apresentação cadastrada.
            </p>
          )}
        </div>

        {/* Metadados de Data */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            <span>Atualizado: {formatLeaderDate(leader.updatedAt || leader.createdAt)}</span>
          </div>
          <span className="font-mono text-stone-400">ID: {leader.id}</span>
        </div>
      </div>

      {/* Barra de Ações Inferior */}
      <div className="px-4 py-2.5 bg-stone-50/80 border-t border-stone-200/70 flex items-center justify-between gap-1">
        <button
          type="button"
          onClick={() => onPreview(leader)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
          title="Visualizar detalhes da liderança"
        >
          <Eye className="w-3.5 h-3.5 text-stone-500" />
          <span>Ver</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(leader)}
            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
            title="Editar cadastro da liderança"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onDuplicate(leader)}
            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
            title="Duplicar liderança"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(leader)}
            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Excluir liderança"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
