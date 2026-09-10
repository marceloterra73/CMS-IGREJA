import React from 'react';
import {
  Image as ImageIcon,
  Video as VideoIcon,
  Music as AudioIcon,
  FileText as DocumentIcon,
  Eye,
  Check,
} from 'lucide-react';
import { MediaItem } from '../../types';
import { formatFileSize, formatDimensions } from './mediaUtils';

interface MediaCardProps {
  media: MediaItem;
  isSelected?: boolean;
  onClick: () => void;
  onSelect?: () => void;
  isPickerMode?: boolean;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  media,
  isSelected,
  onClick,
  onSelect,
  isPickerMode,
}) => {
  return (
    <div
      onClick={onClick}
      className={`group relative rounded-xl border bg-white overflow-hidden transition-all cursor-pointer flex flex-col text-left ${
        isSelected
          ? 'ring-2 ring-amber-500 border-amber-500 shadow-md'
          : 'border-stone-200 hover:border-amber-300 hover:shadow-md'
      }`}
    >
      {/* Área da Imagem / Ícone de Representação */}
      <div className="relative aspect-4/3 w-full bg-stone-100 flex items-center justify-center overflow-hidden border-b border-stone-100">
        {media.type === 'image' ? (
          <img
            src={media.url}
            alt={media.altText || media.title || media.filename}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : media.type === 'video' ? (
          <div className="flex flex-col items-center justify-center text-amber-700 p-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-1">
              <VideoIcon className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-semibold text-stone-500">Vídeo</span>
          </div>
        ) : media.type === 'audio' ? (
          <div className="flex flex-col items-center justify-center text-emerald-700 p-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-1">
              <AudioIcon className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-semibold text-stone-500">Áudio</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-blue-700 p-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-1">
              <DocumentIcon className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-semibold text-stone-500">Documento</span>
          </div>
        )}

        {/* Badge de Status no canto superior */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5">
          {media.status === 'archived' && (
            <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-stone-800/80 text-white backdrop-blur-xs">
              Arquivado
            </span>
          )}
        </div>

        {/* Overlay com Ação no Hover */}
        <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
          {isPickerMode ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onSelect) onSelect();
                else onClick();
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-semibold shadow-md hover:bg-amber-700 transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Selecionar</span>
            </button>
          ) : (
            <span className="px-3 py-1.5 rounded-lg bg-white text-stone-900 text-xs font-semibold shadow-md flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>Ver Detalhes</span>
            </span>
          )}
        </div>
      </div>

      {/* Informações da Mídia */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <h4
            className="text-xs font-bold text-stone-900 line-clamp-1 group-hover:text-amber-700 transition-colors"
            title={media.title || media.filename}
          >
            {media.title || media.filename}
          </h4>
          <p
            className="text-[11px] text-stone-400 font-mono line-clamp-1 mt-0.5"
            title={media.originalName}
          >
            {media.filename}
          </p>
        </div>

        <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
          <span>{formatFileSize(media.sizeBytes)}</span>
          <span className="font-mono text-[10px] text-stone-400">
            {formatDimensions(media.dimensions)}
          </span>
        </div>
      </div>
    </div>
  );
};
