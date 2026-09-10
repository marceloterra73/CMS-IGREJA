import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { SectionInstance } from '../../types';

interface DeleteSectionConfirmModalProps {
  isOpen: boolean;
  section: SectionInstance | null;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * Modal de confirmação visual para remoção de seção (Fase 30)
 * Garante que o usuário confirme antes de excluir uma seção e seus blocos da sessão local.
 */
export const DeleteSectionConfirmModal: React.FC<DeleteSectionConfirmModalProps> = ({
  isOpen,
  section,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !section) return null;

  const blockCount = section.blocks?.length || 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-md overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header com ícone de alerta */}
        <div className="p-5 border-b border-stone-100 flex items-start justify-between bg-red-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">Remover seção?</h3>
              <p className="text-xs text-stone-500 font-medium">
                {section.title || 'Seção sem título'}
              </p>
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

        {/* Corpo explicativo */}
        <div className="p-5 space-y-3 text-xs text-stone-600 leading-relaxed">
          <p>
            Esta ação removerá a seção e os{' '}
            <strong className="text-stone-900 font-semibold">
              {blockCount} {blockCount === 1 ? 'bloco contido' : 'blocos contidos'}
            </strong>{' '}
            nela desta sessão de edição.
          </p>
          <p className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-lg border border-stone-200/70">
            A remoção afetará exclusivamente o rascunho de trabalho local em memória.
          </p>
        </div>

        {/* Botões de Ação */}
        <div className="p-4 bg-stone-50/80 border-t border-stone-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-semibold text-stone-600 hover:text-stone-800 hover:bg-stone-200/60 rounded-lg transition-colors"
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
            <span>Remover</span>
          </button>
        </div>
      </div>
    </div>
  );
};
