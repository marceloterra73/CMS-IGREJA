import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { ChurchGalleryAlbum } from '../../types';

interface DeleteGalleryConfirmModalProps {
  album: ChurchGalleryAlbum | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteGalleryConfirmModal: React.FC<DeleteGalleryConfirmModalProps> = ({
  album,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !album) return null;

  const photoCount = album.mediaIds?.length || 0;

  return (
    <div
      id="delete-gallery-confirm-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Ícone e Título de Alerta */}
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-stone-900">
              Excluir Álbum de Fotos?
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Esta ação removerá o álbum do painel de administração local.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Card Resumo do Item a ser Removido */}
        <div className="mt-4 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1">
          <div className="font-semibold text-stone-800 line-clamp-1">
            {album.title}
          </div>
          <div className="text-stone-500">
            {photoCount} {photoCount === 1 ? 'fotografia vinculada' : 'fotografias vinculadas'}
          </div>
          {album.slug && (
            <div className="font-mono text-[11px] text-stone-400">
              /{album.slug}
            </div>
          )}
        </div>

        <p className="text-xs text-stone-500 mt-3">
          As fotos associadas continuarão preservadas na Biblioteca de Mídia e não serão apagadas do sistema.
        </p>

        {/* Botões de Ação */}
        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Confirmar Exclusão</span>
          </button>
        </div>
      </div>
    </div>
  );
};
