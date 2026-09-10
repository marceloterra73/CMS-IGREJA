import React from 'react';
import {
  Image as ImageIcon,
  Video as VideoIcon,
  Music as AudioIcon,
  FileText as DocumentIcon,
  Eye,
  Check,
  ExternalLink,
} from 'lucide-react';
import { MediaItem } from '../../types';
import { formatFileSize, formatDimensions, getMediaTypeLabel } from './mediaUtils';

interface MediaListProps {
  items: MediaItem[];
  selectedMediaId?: string;
  onItemClick: (media: MediaItem) => void;
  onSelect?: (media: MediaItem) => void;
  isPickerMode?: boolean;
}

export const MediaList: React.FC<MediaListProps> = ({
  items,
  selectedMediaId,
  onItemClick,
  onSelect,
  isPickerMode,
}) => {
  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
      {/* Tabela em Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
              <th className="py-3 px-4 w-16">Miniatura</th>
              <th className="py-3 px-4">Nome / Arquivo</th>
              <th className="py-3 px-4">Tipo</th>
              <th className="py-3 px-4">Tamanho</th>
              <th className="py-3 px-4">Dimensões</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
            {items.map((media) => {
              const isSelected = selectedMediaId === media.id;

              return (
                <tr
                  key={media.id}
                  onClick={() => onItemClick(media)}
                  className={`hover:bg-amber-50/50 cursor-pointer transition-colors ${
                    isSelected ? 'bg-amber-50/80 font-medium' : ''
                  }`}
                >
                  {/* Miniatura */}
                  <td className="py-2.5 px-4">
                    <div className="w-12 h-9 rounded-lg overflow-hidden border border-stone-200 bg-stone-100 flex items-center justify-center shrink-0">
                      {media.type === 'image' ? (
                        <img
                          src={media.url}
                          alt={media.title || media.filename}
                          className="w-full h-full object-cover"
                        />
                      ) : media.type === 'video' ? (
                        <VideoIcon className="w-4 h-4 text-amber-700" />
                      ) : media.type === 'audio' ? (
                        <AudioIcon className="w-4 h-4 text-emerald-700" />
                      ) : (
                        <DocumentIcon className="w-4 h-4 text-blue-700" />
                      )}
                    </div>
                  </td>

                  {/* Nome e arquivo */}
                  <td className="py-2.5 px-4">
                    <div className="font-bold text-stone-900 line-clamp-1">
                      {media.title || media.filename}
                    </div>
                    <div className="text-[11px] text-stone-400 font-mono line-clamp-1">
                      {media.filename}
                    </div>
                  </td>

                  {/* Tipo */}
                  <td className="py-2.5 px-4 text-stone-600">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-stone-100 text-stone-700">
                      {getMediaTypeLabel(media.type)}
                    </span>
                  </td>

                  {/* Tamanho */}
                  <td className="py-2.5 px-4 font-mono text-stone-600">
                    {formatFileSize(media.sizeBytes)}
                  </td>

                  {/* Dimensões */}
                  <td className="py-2.5 px-4 font-mono text-stone-500">
                    {formatDimensions(media.dimensions)}
                  </td>

                  {/* Status */}
                  <td className="py-2.5 px-4">
                    <span
                      className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        media.status === 'archived'
                          ? 'bg-stone-100 text-stone-600'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {media.status === 'archived' ? 'Arquivado' : 'Ativo'}
                    </span>
                  </td>

                  {/* Ações */}
                  <td className="py-2.5 px-4 text-right">
                    {isPickerMode ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelect) onSelect(media);
                          else onItemClick(media);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Selecionar</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onItemClick(media);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-stone-700 hover:text-amber-800 hover:bg-stone-100 rounded-lg transition-colors border border-stone-200"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detalhes</span>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Lista em formato Cards no Mobile */}
      <div className="block md:hidden divide-y divide-stone-100">
        {items.map((media) => (
          <div
            key={media.id}
            onClick={() => onItemClick(media)}
            className="p-3.5 flex items-center justify-between gap-3 hover:bg-stone-50 cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-lg overflow-hidden border border-stone-200 bg-stone-100 flex items-center justify-center shrink-0">
                {media.type === 'image' ? (
                  <img
                    src={media.url}
                    alt={media.title || media.filename}
                    className="w-full h-full object-cover"
                  />
                ) : media.type === 'video' ? (
                  <VideoIcon className="w-5 h-5 text-amber-700" />
                ) : media.type === 'audio' ? (
                  <AudioIcon className="w-5 h-5 text-emerald-700" />
                ) : (
                  <DocumentIcon className="w-5 h-5 text-blue-700" />
                )}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-stone-900 truncate">
                  {media.title || media.filename}
                </h4>
                <p className="text-[11px] text-stone-400 font-mono truncate">{media.filename}</p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-stone-500">
                  <span>{formatFileSize(media.sizeBytes)}</span>
                  <span>•</span>
                  <span>{getMediaTypeLabel(media.type)}</span>
                </div>
              </div>
            </div>

            {isPickerMode ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelect) onSelect(media);
                  else onItemClick(media);
                }}
                className="p-2 text-white bg-amber-600 rounded-lg shrink-0"
              >
                <Check className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onItemClick(media);
                }}
                className="p-2 text-stone-500 hover:text-stone-800 bg-stone-100 rounded-lg shrink-0"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
