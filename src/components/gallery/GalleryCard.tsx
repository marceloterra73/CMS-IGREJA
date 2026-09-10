import React, { useState, useRef, useEffect } from 'react';
import {
  MoreVertical,
  Edit2,
  Eye,
  Copy,
  Trash2,
  Camera,
  Images,
  Calendar,
  Archive,
  CheckCircle2,
} from 'lucide-react';
import { ChurchGalleryAlbum } from '../../types';
import { GalleryStatusBadge } from './GalleryStatusBadge';
import { formatGalleryDate, getMediaItemById } from './galleryUtils';

interface GalleryCardProps {
  album: ChurchGalleryAlbum;
  onPreview: (album: ChurchGalleryAlbum) => void;
  onEdit: (album: ChurchGalleryAlbum) => void;
  onDuplicate: (album: ChurchGalleryAlbum) => void;
  onToggleStatus: (album: ChurchGalleryAlbum) => void;
  onDelete: (album: ChurchGalleryAlbum) => void;
}

export const GalleryCard: React.FC<GalleryCardProps> = ({
  album,
  onPreview,
  onEdit,
  onDuplicate,
  onToggleStatus,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha o menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  // Recupera imagem de capa
  const coverMedia = getMediaItemById(album.coverMediaId) || (album.mediaIds.length > 0 ? getMediaItemById(album.mediaIds[0]) : undefined);
  const photoCount = album.mediaIds?.length || 0;

  return (
    <div
      id={`gallery-card-${album.id}`}
      className="group flex flex-col bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md hover:border-stone-300 transition-all"
    >
      {/* Imagem de Capa e Badges Sobrepostos */}
      <div className="relative aspect-16/10 w-full bg-stone-100 overflow-hidden border-b border-stone-100">
        {coverMedia ? (
          <img
            src={coverMedia.url}
            alt={coverMedia.altText || album.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 bg-stone-50">
            <Camera className="w-10 h-10 stroke-[1.5] text-stone-300" />
            <span className="text-xs mt-1 text-stone-400 font-medium">Sem foto de capa</span>
          </div>
        )}

        {/* Badge de Status no Canto Superior Esquerdo */}
        <div className="absolute top-2.5 left-2.5">
          <GalleryStatusBadge status={album.status} size="sm" />
        </div>

        {/* Badge de Quantidade de Fotos no Canto Superior Direito */}
        <div className="absolute top-2.5 right-2.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-black/60 text-white backdrop-blur-xs shadow-xs">
            <Images className="w-3 h-3" />
            <span>{photoCount} {photoCount === 1 ? 'foto' : 'fotos'}</span>
          </span>
        </div>

        {/* Overlay com Ação Rápida de Visualizar ao passar o mouse */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => onPreview(album)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/95 text-stone-900 text-xs font-semibold hover:bg-white transition-colors shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Ver Álbum</span>
          </button>
        </div>
      </div>

      {/* Corpo do Card */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div className="space-y-1.5">
          {/* Título */}
          <h3
            onClick={() => onPreview(album)}
            className="text-base font-semibold text-stone-900 line-clamp-1 group-hover:text-stone-700 cursor-pointer transition-colors"
            title={album.title}
          >
            {album.title}
          </h3>

          {/* Slug */}
          {album.slug && (
            <p className="text-xs font-mono text-stone-400 truncate">
              /{album.slug}
            </p>
          )}

          {/* Descrição */}
          {album.description ? (
            <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
              {album.description}
            </p>
          ) : (
            <p className="text-xs text-stone-400 italic">
              Sem descrição informada.
            </p>
          )}
        </div>

        {/* Rodapé do Card: Data e Ações */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-stone-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatGalleryDate(album.createdAt)}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onPreview(album)}
              className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
              title="Visualizar álbum"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onEdit(album)}
              className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
              title="Editar álbum"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            {/* Menu Dropdown de Mais Ações */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
                title="Mais opções"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 bottom-full mb-1 w-44 bg-white rounded-lg shadow-lg border border-stone-200 py-1 z-30 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onPreview(album);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-stone-50 flex items-center gap-2 text-stone-700"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Visualizar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(album);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-stone-50 flex items-center gap-2 text-stone-700"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onDuplicate(album);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-stone-50 flex items-center gap-2 text-stone-700"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Duplicar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onToggleStatus(album);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-stone-50 flex items-center gap-2 text-stone-700"
                  >
                    {album.status === 'active' ? (
                      <>
                        <Archive className="w-3.5 h-3.5 text-stone-500" />
                        <span>Arquivar álbum</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Tornar ativo</span>
                      </>
                    )}
                  </button>

                  <div className="my-1 border-t border-stone-100" />

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(album);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-red-50 flex items-center gap-2 text-red-600 font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Excluir álbum</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
