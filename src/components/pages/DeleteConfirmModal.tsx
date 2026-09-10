import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { Page } from '../../types';

interface DeleteConfirmModalProps {
  page: Page | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: (pageId: string) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  page,
  isOpen,
  onClose,
  onConfirmDelete,
}) => {
  if (!isOpen || !page) return null;

  return (
    <div
      id="delete-confirm-modal-backdrop"
      className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-all"
    >
      <div
        id="delete-confirm-modal-card"
        className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-stone-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold">
              <Trash2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-stone-900">
              Confirmar Exclusão de Página
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-red-900">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-red-950">Atenção</div>
              <p className="text-[11px] text-red-800 leading-relaxed mt-0.5">
                Você está prestes a remover a página <strong>"{page.title}"</strong> ({page.slug}).
                Nesta fase demonstrativa, a remoção afeta apenas o estado local da interface.
              </p>
            </div>
          </div>

          <p className="text-stone-600 leading-relaxed">
            Tem certeza de que deseja remover esta página da listagem do seu site?
          </p>

          <div className="pt-2 border-t border-stone-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirmDelete(page.id);
                onClose();
              }}
              className="px-4 py-2 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 shadow-xs transition-colors"
            >
              Sim, Excluir Página
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
