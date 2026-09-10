import React, { useState } from 'react';
import {
  X,
  Camera,
  Edit2,
  Copy,
  Calendar,
  Clock,
  Images,
  Globe,
  Archive,
  CheckCircle2,
  Maximize2,
} from 'lucide-react';
import { ChurchGalleryAlbum, MediaItem } from '../../types';
import { GalleryStatusBadge } from './GalleryStatusBadge';
import {
  formatGalleryDate,
  formatGalleryDateTime,
  getGalleryStatusDescription,
  getMediaItemById,
  getMediaItemsByIds,
} from './galleryUtils';

interface GalleryPreviewModalProps {
  album: ChurchGalleryAlbum | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (album: ChurchGalleryAlbum) => void;
  onDuplicate: (album: ChurchGalleryAlbum) => void;
  onToggleStatus: (album: ChurchGalleryAlbum) => void;
}

export const GalleryPreviewModal: React.FC<GalleryPreviewModalProps> = ({
  album,
  isOpen,
  onClose,
  onEdit,
  onDuplicate,
  onToggleStatus,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<MediaItem | null>(null);

  if (!isOpen || !album) return null;

  const coverMedia = getMediaItemById(album.coverMediaId);
  const photos = getMediaItemsByIds(album.mediaIds);
  const photoCount = album.mediaIds.length;

  return (
    <div
      id="gallery-preview-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/50">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Visualização do Álbum
            </span>
            <span className="text-stone-300">•</span>
            <GalleryStatusBadge status={album.status} size="sm" />
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onToggleStatus(album)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 rounded-lg transition-colors shadow-2xs"
            >
              {album.status === 'active' ? (
                <>
                  <Archive className="w-3.5 h-3.5 text-stone-500" />
                  <span>Arquivar</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tornar Ativo</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onDuplicate(album)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 rounded-lg transition-colors shadow-2xs"
              title="Duplicar este álbum"
            >
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Duplicar</span>
            </button>

            <button
              type="button"
              onClick={() => onEdit(album)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors shadow-2xs"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Editar</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Capa Principal em Destaque */}
          {coverMedia ? (
            <div className="relative aspect-21/9 w-full rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shadow-xs">
              <img
                src={coverMedia.url}
                alt={coverMedia.altText || album.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-white/20 backdrop-blur-xs">
                    Foto de Capa
                  </span>
                  <span className="text-xs text-stone-300">
                    {photoCount} {photoCount === 1 ? 'fotografia' : 'fotografias'} no álbum
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-xs">
                  {album.title}
                </h1>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-stone-50 border border-stone-200 text-stone-900">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
                {album.title}
              </h1>
              <p className="text-xs text-stone-400 mt-1">Álbum sem imagem de capa definida.</p>
            </div>
          )}

          {/* Metadados e Informações Estruturadas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs">
            {/* Slug */}
            <div>
              <span className="text-stone-400 uppercase tracking-wider font-semibold block text-[10px]">
                Slug do Álbum
              </span>
              <span className="font-mono text-stone-800 mt-0.5 block truncate">
                {album.slug ? `/${album.slug}` : 'Não definido'}
              </span>
            </div>

            {/* Data de Criação */}
            <div>
              <span className="text-stone-400 uppercase tracking-wider font-semibold block text-[10px]">
                Data de Criação
              </span>
              <div className="flex items-center gap-1 text-stone-800 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>{formatGalleryDateTime(album.createdAt)}</span>
              </div>
            </div>

            {/* Última Atualização */}
            <div>
              <span className="text-stone-400 uppercase tracking-wider font-semibold block text-[10px]">
                Última Atualização
              </span>
              <div className="flex items-center gap-1 text-stone-800 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>{formatGalleryDateTime(album.updatedAt)}</span>
              </div>
            </div>
          </div>

          {/* Descrição do Álbum */}
          {album.description && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Descrição do Álbum
              </h3>
              <p className="text-sm text-stone-700 leading-relaxed bg-white p-4 rounded-xl border border-stone-200">
                {album.description}
              </p>
            </div>
          )}

          {/* Galeria de Fotos */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Images className="w-4 h-4 text-stone-600" />
                <h3 className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  Fotografias do Álbum ({photos.length})
                </h3>
              </div>
              <span className="text-xs text-stone-400">
                Clique sobre qualquer foto para expandir
              </span>
            </div>

            {photos.length === 0 ? (
              <div className="p-8 rounded-xl border border-dashed border-stone-200 bg-stone-50 text-center">
                <Camera className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="text-xs font-medium text-stone-600">
                  Nenhuma fotografia vinculada ao álbum.
                </p>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Edite o álbum para vincular fotos da biblioteca de mídia.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {photos.map((photo) => {
                  const isCover = photo.id === album.coverMediaId;
                  return (
                    <div
                      key={photo.id}
                      onClick={() => setSelectedPhoto(photo)}
                      className="group relative aspect-square rounded-xl overflow-hidden bg-stone-100 border border-stone-200 cursor-pointer shadow-2xs hover:shadow-md transition-all"
                    >
                      <img
                        src={photo.url}
                        alt={photo.altText || photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />

                      {/* Tag de Capa */}
                      {isCover && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-semibold uppercase tracking-wider shadow-xs">
                          Capa
                        </div>
                      )}

                      {/* Overlay ao passar o mouse */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Maximize2 className="w-5 h-5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Rodapé do Modal */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-50 border-t border-stone-200 text-xs text-stone-500">
          <span>{getGalleryStatusDescription(album.status)}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 font-medium rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>

      {/* Modal de Foto Ampliada */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-stone-900 rounded-xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 bg-stone-950 text-white text-xs border-b border-stone-800">
              <span className="font-medium truncate max-w-md">
                {selectedPhoto.title || selectedPhoto.filename}
              </span>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="p-1 hover:bg-stone-800 rounded-md text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2 flex items-center justify-center bg-black/90 max-h-[75vh] overflow-hidden">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.altText || selectedPhoto.title}
                className="max-w-full max-h-[70vh] object-contain rounded-sm"
              />
            </div>
            {selectedPhoto.altText && (
              <div className="p-2.5 bg-stone-950 text-stone-300 text-xs border-t border-stone-800">
                <span className="text-stone-500 font-medium mr-1.5">Descrição:</span>
                {selectedPhoto.altText}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
