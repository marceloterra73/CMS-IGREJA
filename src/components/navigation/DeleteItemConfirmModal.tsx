import React from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';
import { NavigationItem } from '../../types';

interface DeleteItemConfirmModalProps {
  isOpen: boolean;
  item: NavigationItem | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteItemConfirmModal: React.FC<DeleteItemConfirmModalProps> = ({
  isOpen,
  item,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !item) return null;

  const childrenCount = item.children ? item.children.length : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-md overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-red-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-100 border border-red-200 flex items-center justify-center text-red-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">Excluir item?</h3>
              <p className="text-xs text-stone-500">Confirmação de remoção do menu</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-3 text-xs text-stone-600 leading-relaxed">
          <p>
            Você está prestes a remover o item{' '}
            <span className="font-semibold text-stone-900">"{item.label}"</span>.
          </p>
          <p className="text-stone-500">
            Esta ação removerá este item do menu durante esta sessão de edição em memória.
          </p>

          {childrenCount > 0 && (
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">
                  Atenção: Este item possui {childrenCount} {childrenCount === 1 ? 'item filho' : 'itens filhos'}.
                </p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Ao remover o item principal, todos os sub-itens associados a ele também serão excluídos.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-semibold text-stone-600 hover:text-stone-800 hover:bg-stone-200 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Excluir</span>
          </button>
        </div>
      </div>
    </div>
  );
};
