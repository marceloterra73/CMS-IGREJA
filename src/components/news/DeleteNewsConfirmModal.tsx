import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { ChurchNews } from '../../types';

interface DeleteNewsConfirmModalProps {
  news: ChurchNews | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (news: ChurchNews) => void;
}

export const DeleteNewsConfirmModal: React.FC<DeleteNewsConfirmModalProps> = ({
  news,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !news) return null;

  return (
    <div
      id="modal-delete-news-backdrop"
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="modal-delete-news-content"
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div className="flex-1">
            <h3 className="text-base font-bold text-stone-900">
              Excluir Notícia
            </h3>
            <p className="text-xs text-stone-600 mt-1">
              Tem certeza que deseja remover esta notícia da listagem?
            </p>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 my-3 text-xs">
              <span className="font-bold text-stone-900 block line-clamp-2">
                {news.title}
              </span>
              <span className="text-[11px] font-mono text-stone-400 mt-0.5 block">
                /{news.slug}
              </span>
            </div>

            <p className="text-[11px] text-stone-400">
              Esta ação removerá o registro em memória durante esta sessão de navegação.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2.5 mt-6 pt-3 border-t border-stone-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <button
            id="btn-confirm-delete-news"
            type="button"
            onClick={() => {
              onConfirm(news);
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors shadow-xs cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Excluir Notícia</span>
          </button>
        </div>
      </div>
    </div>
  );
};
