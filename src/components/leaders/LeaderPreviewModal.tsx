import React from 'react';
import {
  X,
  Edit2,
  Calendar,
  Clock,
  UserCheck,
  Building2,
  Hash,
} from 'lucide-react';
import { ChurchLeader } from '../../types';
import { LeaderStatusBadge } from './LeaderStatusBadge';
import {
  formatLeaderDateTime,
  getMediaItemById,
  getLeaderInitials,
  getLeaderStatusDescription,
} from './leadersUtils';

interface LeaderPreviewModalProps {
  leader: ChurchLeader | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (leader: ChurchLeader) => void;
}

export const LeaderPreviewModal: React.FC<LeaderPreviewModalProps> = ({
  leader,
  isOpen,
  onClose,
  onEdit,
}) => {
  if (!isOpen || !leader) return null;

  const photo = getMediaItemById(leader.photoMediaId);
  const initials = getLeaderInitials(leader.name);
  const statusDesc = getLeaderStatusDescription(leader.status);

  return (
    <div
      id="leader-preview-modal-backdrop"
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div
        id="leader-preview-modal-content"
        className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-stone-200 overflow-hidden flex flex-col my-8"
      >
        {/* Cabeçalho do Modal */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Detalhes da Liderança
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs font-mono text-stone-400">ID: {leader.id}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
            title="Fechar visualização"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo com Informações do Registro */}
        <div className="p-6 space-y-6">
          {/* Seção Superior: Foto e Identificação */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            {/* Foto ou Avatar com Iniciais */}
            <div className="relative shrink-0">
              {photo ? (
                <img
                  src={photo.url}
                  alt={photo.altText || leader.name}
                  referrerPolicy="no-referrer"
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-stone-100 shadow-xs"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-stone-800 to-stone-900 text-white flex items-center justify-center font-bold text-2xl border-2 border-stone-100 shadow-xs">
                  <span className="tracking-wider text-amber-300/90">{initials}</span>
                </div>
              )}
              <span
                className="absolute -bottom-1 -right-1 px-2 py-0.5 bg-stone-900 text-white font-mono text-xs font-bold rounded-md shadow-2xs border border-white"
                title="Ordem hierárquica de exibição"
              >
                #{leader.order}
              </span>
            </div>

            {/* Nome, Cargo e Badges */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                <LeaderStatusBadge status={leader.status} size="md" />
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono font-semibold bg-stone-100 text-stone-600 border border-stone-200">
                  <Hash className="w-3 h-3 text-stone-400" />
                  <span>Ordem: {leader.order}</span>
                </span>
              </div>

              <h2 className="text-xl font-bold text-stone-900 tracking-tight">
                {leader.name}
              </h2>

              <div className="text-sm font-semibold text-stone-700 mt-0.5">
                {leader.role}
              </div>

              <div className="text-xs text-stone-500 mt-1 flex items-center justify-center sm:justify-start gap-1">
                <Building2 className="w-3.5 h-3.5 text-stone-400" />
                <span>Tenant: {leader.tenantId}</span>
              </div>
            </div>
          </div>

          {/* Status Explicativo */}
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-600">
            <span className="font-semibold text-stone-800">Situação: </span>
            <span>{statusDesc}</span>
          </div>

          {/* Biografia / Apresentação */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Apresentação Ministerial / Biografia
            </h4>
            {leader.description ? (
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                {leader.description}
              </div>
            ) : (
              <div className="p-4 bg-stone-50 border border-dashed border-stone-200 rounded-xl text-xs text-stone-400 italic">
                Nenhuma apresentação ministerial informada para esta liderança.
              </div>
            )}
          </div>

          {/* Dados do Arquivo de Foto (se houver) */}
          {photo && (
            <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl text-xs space-y-1">
              <div className="font-bold text-stone-700">Foto na Biblioteca de Mídia:</div>
              <div className="text-stone-600 truncate">{photo.title} ({photo.filename})</div>
              <div className="text-stone-400 font-mono text-[11px]">Media ID: {photo.id}</div>
            </div>
          )}

          {/* Metadados de Auditoria */}
          <div className="border-t border-stone-100 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-stone-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>Criado: {formatLeaderDateTime(leader.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>Atualizado: {formatLeaderDateTime(leader.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Rodapé com Botões */}
        <div className="px-5 py-4 border-t border-stone-200 bg-stone-50/70 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            Fechar
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(leader);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
            <span>Editar Liderança</span>
          </button>
        </div>
      </div>
    </div>
  );
};
