import React from 'react';
import { AlertTriangle, Trash2, X, Lock, User } from 'lucide-react';
import { ChurchPrayerRequest } from '../../types';

interface DeletePrayerRequestConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  request: ChurchPrayerRequest | null;
}

export const DeletePrayerRequestConfirmModal: React.FC<DeletePrayerRequestConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  request,
}) => {
  if (!isOpen || !request) return null;

  const displayName = request.isAnonymous
    ? 'Pedido Anônimo'
    : request.requesterName?.trim() || 'Solicitante não identificado';

  return (
    <div
      id="delete-prayer-confirm-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Cabeçalho */}
        <div className="px-6 pt-6 pb-4 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Excluir Pedido de Oração</h3>
              <p className="text-xs text-stone-500 mt-0.5">Esta ação é local e irreversível.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            title="Cancelar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Informações do Pedido a ser excluído */}
        <div className="px-6 py-3">
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  request.isAnonymous
                    ? 'bg-stone-200 text-stone-600'
                    : 'bg-stone-900 text-white'
                }`}
              >
                {request.isAnonymous ? (
                  <Lock className="w-3 h-3" />
                ) : (
                  <User className="w-3 h-3" />
                )}
              </div>
              <span className="font-bold text-stone-800">{displayName}</span>
            </div>

            {request.title && (
              <p className="font-semibold text-stone-900 line-clamp-1">{request.title}</p>
            )}

            <p className="text-stone-600 line-clamp-2 italic leading-relaxed">
              &ldquo;{request.requestText}&rdquo;
            </p>
          </div>

          <p className="text-xs text-stone-500 mt-3 leading-relaxed">
            Tem certeza de que deseja remover este pedido de oração do painel? Os registros
            demonstrativos em memória serão atualizados imediatamente.
          </p>
        </div>

        {/* Rodapé de Ações */}
        <div className="px-6 py-4 bg-stone-50/70 border-t border-stone-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            id="confirm-delete-prayer-btn"
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Excluir Definitivamente</span>
          </button>
        </div>
      </div>
    </div>
  );
};
