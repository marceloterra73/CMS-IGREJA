import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { ChurchEvent } from '../../types';

interface DeleteEventConfirmModalProps {
  event: ChurchEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (event: ChurchEvent) => void;
}

export const DeleteEventConfirmModal: React.FC<DeleteEventConfirmModalProps> = ({
  event,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !event) return null;

  return (
    <div
      id="modal-delete-event-backdrop"
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="modal-delete-event-content"
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="space-y-1 flex-1">
            <h3 className="text-base font-bold text-stone-900">
              Excluir evento?
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Tem certeza que deseja excluir permanentemente o evento{' '}
              <strong className="text-stone-800 font-semibold">"{event.title}"</strong>?
              Esta alteração removerá o registro da memória local.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <button
            id="btn-confirm-delete-event"
            type="button"
            onClick={() => {
              onConfirm(event);
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-rose-700 transition-colors shadow-xs cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Excluir Evento</span>
          </button>
        </div>
      </div>
    </div>
  );
};
