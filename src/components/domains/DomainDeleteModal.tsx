import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { SiteDomain } from '../../types';

interface DomainDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  domain: SiteDomain | null;
}

export const DomainDeleteModal: React.FC<DomainDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  domain,
}) => {
  if (!isOpen || !domain) return null;

  return (
    <div
      id="domain-delete-modal-backdrop"
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        id="domain-delete-modal"
        className="bg-white rounded-2xl border border-stone-200 shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto border border-red-200">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-base font-bold text-stone-900">
              Desconectar Endereço de Domínio
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Tem certeza que deseja remover o endereço cadastrado para esta congregação?
            </p>
          </div>

          <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 text-xs font-mono text-stone-800 break-all">
            {domain.hostname}
          </div>

          {domain.isPrimary && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs text-left">
              <strong>Atenção:</strong> Este é o domínio principal atualmente ativo. Ao desconectá-lo, lembre-se de eleger outro endereço como principal para manter o acesso público ao portal.
            </div>
          )}

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Confirmar Remoção</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
