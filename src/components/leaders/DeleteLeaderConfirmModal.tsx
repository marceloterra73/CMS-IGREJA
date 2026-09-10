import React from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';
import { ChurchLeader } from '../../types';

interface DeleteLeaderConfirmModalProps {
  leader: ChurchLeader | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteLeaderConfirmModal: React.FC<DeleteLeaderConfirmModalProps> = ({
  leader,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !leader) return null;

  return (
    <div
      id="delete-leader-modal-backdrop"
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
    >
      <div
        id="delete-leader-modal-content"
        className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-stone-200 overflow-hidden"
      >
        {/* Cabeçalho */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Confirmar Exclusão</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg transition-colors cursor-pointer"
            title="Cancelar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-5 space-y-3">
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Tem certeza de que deseja remover o cadastro desta liderança?
          </p>

          <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
            <div className="font-bold text-sm text-stone-900">{leader.name}</div>
            <div className="text-xs font-semibold text-stone-700">{leader.role}</div>
            <div className="text-[11px] font-mono text-stone-400">
              Ordem: #{leader.order} • ID: {leader.id}
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
            Atenção: Esta exclusão removerá o registro da liderança do estado administrativo em memória. Arquivos de imagem na biblioteca de mídia não serão afetados.
          </div>
        </div>

        {/* Rodapé com Ações */}
        <div className="px-5 py-4 border-t border-stone-200 bg-stone-50/70 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <button
            id="btn-confirm-delete-leader"
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-xs cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Excluir Registro</span>
          </button>
        </div>
      </div>
    </div>
  );
};
