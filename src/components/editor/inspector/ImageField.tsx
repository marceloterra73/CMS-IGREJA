import React, { useState } from 'react';
import { ImageEditableField, ImageFieldData, MediaItem } from '../../../types';
import { Image as ImageIcon, Link as LinkIcon, FileText, FolderOpen } from 'lucide-react';
import { MediaPickerModal } from '../../media/MediaPickerModal';

interface ImageFieldProps {
  field: ImageEditableField;
  value: ImageFieldData | string;
  onChange: (newValue: ImageFieldData) => void;
}

export const ImageField: React.FC<ImageFieldProps> = ({ field, value, onChange }) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // Normaliza o valor para ImageFieldData estruturado
  const currentData: ImageFieldData =
    typeof value === 'string'
      ? { url: value, altText: '' }
      : {
          url: value?.url || '',
          altText: value?.altText || '',
          mediaId: value?.mediaId,
          width: value?.width,
          height: value?.height,
        };

  // Ao editar manualmente a URL: remove a referência mediaId antiga
  const updateUrl = (url: string) => {
    onChange({
      ...currentData,
      url,
      mediaId: undefined,
    });
  };

  const updateAltText = (altText: string) => {
    onChange({ ...currentData, altText });
  };

  // Ao selecionar mídia da biblioteca: preenche coerentemente todos os campos
  const handleSelectMedia = (media: MediaItem) => {
    onChange({
      mediaId: media.id,
      url: media.url,
      altText: media.altText || currentData.altText || '',
      width: media.dimensions?.width,
      height: media.dimensions?.height,
    });
  };

  return (
    <div className="space-y-2.5 p-3 rounded-xl border border-stone-200 bg-stone-50/40">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
          <span>{field.label}</span>
        </label>
        {field.required && <span className="text-red-500 text-xs">*</span>}
      </div>

      {field.description && (
        <p className="text-[10px] text-stone-400">{field.description}</p>
      )}

      {/* Pré-visualização da Imagem se houver URL */}
      {currentData.url ? (
        <div className="relative rounded-lg overflow-hidden border border-stone-200 bg-stone-100 aspect-video flex items-center justify-center">
          <img
            src={currentData.url}
            alt={currentData.altText || 'Prévia'}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          {currentData.mediaId && (
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-stone-900/80 text-amber-300 text-[10px] font-mono backdrop-blur-xs flex items-center gap-1">
              <span>Biblioteca</span>
              {currentData.width && currentData.height && (
                <span className="text-stone-300">
                  • {currentData.width}×{currentData.height}
                </span>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-stone-200 bg-stone-100/50 p-4 flex flex-col items-center justify-center text-center text-stone-400">
          <ImageIcon className="w-6 h-6 mb-1 text-stone-300" />
          <span className="text-[11px] font-medium text-stone-500">
            Nenhuma imagem selecionada
          </span>
          <span className="text-[10px] text-stone-400 mt-0.5">
            Selecione da biblioteca ou insira uma URL direta
          </span>
        </div>
      )}

      {/* Botão para Selecionar da Biblioteca Visual */}
      <button
        type="button"
        onClick={() => setIsPickerOpen(true)}
        className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100/80 rounded-lg border border-amber-200 transition-colors shadow-xs"
      >
        <FolderOpen className="w-3.5 h-3.5 text-amber-700" />
        <span>Selecionar da biblioteca</span>
      </button>

      {/* URL da Imagem */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">
            URL da Imagem
          </label>
          {currentData.mediaId && (
            <span className="text-[9px] text-stone-400 font-mono">
              Vinculado a {currentData.mediaId}
            </span>
          )}
        </div>
        <div className="relative">
          <LinkIcon className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={currentData.url}
            onChange={(e) => updateUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full text-xs pl-8 pr-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-900 font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Texto Alternativo (Acessibilidade) */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">
            Texto Alternativo (Alt Text)
          </label>
          {field.altTextRequired && (
            <span className="text-[9px] text-amber-700 bg-amber-50 px-1 py-0.2 rounded font-medium">
              Recomendado
            </span>
          )}
        </div>
        <div className="relative">
          <FileText className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={currentData.altText}
            onChange={(e) => updateAltText(e.target.value)}
            placeholder="Descreva brevemente a imagem para leitores de tela..."
            className="w-full text-xs pl-8 pr-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Modal de Seleção da Biblioteca */}
      <MediaPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelectImage={handleSelectMedia}
        selectedMediaId={currentData.mediaId}
      />
    </div>
  );
};
