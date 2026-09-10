import React from 'react';
import {
  Camera,
  Eye,
  Edit2,
  Copy,
  Trash2,
  Images,
  Archive,
  CheckCircle2,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { ChurchGalleryAlbum } from '../../types';
import { GalleryCard } from './GalleryCard';
import { GalleryStatusBadge } from './GalleryStatusBadge';
import { GalleryViewMode } from './GalleryToolbar';
import { formatGalleryDate, getMediaItemById } from './galleryUtils';

interface GalleryListProps {
  albums: ChurchGalleryAlbum[];
  viewMode: GalleryViewMode;
  onPreview: (album: ChurchGalleryAlbum) => void;
  onEdit: (album: ChurchGalleryAlbum) => void;
  onDuplicate: (album: ChurchGalleryAlbum) => void;
  onToggleStatus: (album: ChurchGalleryAlbum) => void;
  onDelete: (album: ChurchGalleryAlbum) => void;
  onResetFilters?: () => void;
}

export const GalleryList: React.FC<GalleryListProps> = ({
  albums,
  viewMode,
  onPreview,
  onEdit,
  onDuplicate,
  onToggleStatus,
  onDelete,
  onResetFilters,
}) => {
  // Estado Vazio
  if (albums.length === 0) {
    return (
      <div
        id="gallery-empty-state"
        className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-stone-200 text-center shadow-xs"
      >
        <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
          <Camera className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-stone-900">
          Nenhum álbum encontrado
        </h3>
        <p className="text-sm text-stone-500 max-w-sm mt-1 mb-5">
          Não foram encontrados álbuns fotográficos correspondentes aos filtros ou à busca selecionada.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
          >
            Redefinir busca e filtros
          </button>
        )}
      </div>
    );
  }

  // Visualização em Grade de Cards
  if (viewMode === 'cards') {
    return (
      <div
        id="gallery-cards-grid"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {albums.map((album) => (
          <GalleryCard
            key={album.id}
            album={album}
            onPreview={onPreview}
            onEdit={onEdit}
            onDuplicate={onDuplicate}
            onToggleStatus={onToggleStatus}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }

  // Visualização em Tabela (Table / Lista)
  return (
    <div
      id="gallery-table-container"
      className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50/80 text-stone-600 text-xs font-semibold tracking-wider uppercase">
              <th className="py-3.5 px-4">Álbum & Capa</th>
              <th className="py-3.5 px-4 hidden md:table-cell">Descrição</th>
              <th className="py-3.5 px-4 text-center">Fotos</th>
              <th className="py-3.5 px-4 hidden sm:table-cell">Criação</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-sm">
            {albums.map((album) => {
              const cover = getMediaItemById(album.coverMediaId) || (album.mediaIds.length > 0 ? getMediaItemById(album.mediaIds[0]) : undefined);
              const photoCount = album.mediaIds?.length || 0;

              return (
                <tr
                  key={album.id}
                  id={`gallery-row-${album.id}`}
                  className="hover:bg-stone-50/70 transition-colors group"
                >
                  {/* Álbum & Capa */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200 flex items-center justify-center">
                        {cover ? (
                          <img
                            src={cover.url}
                            alt={album.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <Camera className="w-5 h-5 text-stone-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div
                          onClick={() => onPreview(album)}
                          className="font-medium text-stone-900 group-hover:text-stone-700 cursor-pointer truncate max-w-[200px] sm:max-w-xs"
                          title={album.title}
                        >
                          {album.title}
                        </div>
                        {album.slug && (
                          <div className="text-xs text-stone-400 font-mono truncate max-w-[180px]">
                            /{album.slug}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Descrição */}
                  <td className="py-3 px-4 hidden md:table-cell text-xs text-stone-600 max-w-xs">
                    {album.description ? (
                      <span className="line-clamp-2 leading-relaxed">
                        {album.description}
                      </span>
                    ) : (
                      <span className="text-stone-400 italic">Sem descrição</span>
                    )}
                  </td>

                  {/* Quantidade de Fotos */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-700">
                      <Images className="w-3.5 h-3.5 text-stone-500" />
                      <span>{photoCount}</span>
                    </span>
                  </td>

                  {/* Data de Criação */}
                  <td className="py-3 px-4 hidden sm:table-cell text-xs text-stone-500 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      <span>{formatGalleryDate(album.createdAt)}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <GalleryStatusBadge status={album.status} size="sm" />
                  </td>

                  {/* Ações */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
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

                      <button
                        type="button"
                        onClick={() => onDuplicate(album)}
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
                        title="Duplicar álbum"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggleStatus(album)}
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
                        title={
                          album.status === 'active'
                            ? 'Arquivar álbum'
                            : 'Tornar álbum ativo'
                        }
                      >
                        {album.status === 'active' ? (
                          <Archive className="w-4 h-4 text-stone-500" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(album)}
                        className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Excluir álbum"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
