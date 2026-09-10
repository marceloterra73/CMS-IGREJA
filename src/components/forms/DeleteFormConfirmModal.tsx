import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { FormDefinition } from '../../types';

interface DeleteFormConfirmModalProps {
  form: FormDefinition | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteFormConfirmModal: React.FC<DeleteFormConfirmModalProps> = ({
  form,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !form) return null;

  return (
    <div
      id="modal-delete-form-backdrop"
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="modal-delete-form-content"
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-lg font-bold text-stone-900 mb-2">
          Excluir formulário?
        </h3>

        <p className="text-sm text-stone-600 mb-4 leading-relaxed">
          Tem certeza de que deseja excluir o formulário{' '}
          <strong className="text-stone-900">"{form.name}"</strong>? O
          formulário será removido da lista durante esta sessão.
        </p>

        <div className="bg-stone-50 rounded-lg p-3 text-xs text-stone-500 border border-stone-200 mb-6">
          <p>
            • Esta ação opera em memória local.
            <br />• Nenhum dado persistente ou submissão real é afetado.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            id="btn-confirm-delete-form"
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors shadow-xs cursor-pointer"
          >
            Excluir formulário
          </button>
        </div>
      </div>
    </div>
  );
};
