import React, { useState, useMemo } from 'react';
import { X, Image as ImageIcon, Search, Check, Filter } from 'lucide-react';
import { MediaItem } from '../../types';
import { INITIAL_DEMO_MEDIA } from './demoMediaData';
import { MediaToolbar } from './MediaToolbar';
import { MediaCard } from './MediaCard';
import { MediaList } from './MediaList';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (media: MediaItem) => void;
  selectedMediaId?: string;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  selectedMediaId,
}) => {
  // Estado local em memória compartilhado das mídias
  const [mediaList] = useState<MediaItem[]>(INITIAL_DEMO_MEDIA);

  // Busca e Filtros (no picker, fixa o tipo 'image')
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mídia atualmente em foco/selecionada no modal
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  // Pastas únicas com imagens
  const availableFolders = useMemo(() => {
    const folders = new Set<string>();
    mediaList
      .filter((m) => m.type === 'image')
      .forEach((m) => {
        if (m.folder) folders.add(m.folder);
      });
    return Array.from(folders).sort();
  }, [mediaList]);

  // Filtragem estrita para imagens
  const filteredImages = useMemo(() => {
    return mediaList.filter((item) => {
      // Obrigatório ser do tipo image
      if (item.type !== 'image') return false;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        item.filename.toLowerCase().includes(q) ||
        item.originalName.toLowerCase().includes(q);

      const matchesStatus =
        selectedStatus === 'all' || (item.status || 'active') === selectedStatus;

      const matchesFolder =
        selectedFolder === 'all' || (item.folder && item.folder === selectedFolder);

      return matchesSearch && matchesStatus && matchesFolder;
    });
  }, [mediaList, searchQuery, selectedStatus, selectedFolder]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedItem) {
      onSelectImage(selectedItem);
      onClose();
    }
  };

  const handleDirectSelect = (media: MediaItem) => {
    onSelectImage(media);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 text-stone-800 animate-in zoom-in-95 duration-200 overflow-hidden my-auto">
        {/* Cabeçalho do Picker */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100/80 border border-amber-200 flex items-center justify-center text-amber-800">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                Selecionar Imagem da Biblioteca
              </h3>
              <p className="text-[11px] text-stone-500">
                Escolha uma foto ou imagem oficial para compor este bloco.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 p-1.5 rounded-lg hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar de Busca e Filtros adaptada ao modo picker */}
        <div className="p-4 border-b border-stone-100 bg-white">
          <MediaToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedType="image"
            onTypeChange={() => {}}
            hideTypeFilter={true}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            selectedFolder={selectedFolder}
            onFolderChange={setSelectedFolder}
            availableFolders={availableFolders}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>

        {/* Área de Conteúdo / Seleção */}
        <div className="flex-1 overflow-y-auto p-6 bg-stone-50/40 min-h-[300px]">
          {filteredImages.length === 0 ? (
            <div className="bg-white rounded-xl border border-stone-200 p-10 text-center">
              <ImageIcon className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <h4 className="text-xs font-bold text-stone-800 mb-1">
                Nenhuma imagem encontrada
              </h4>
              <p className="text-[11px] text-stone-500">
                Tente ajustar os termos da busca ou filtros selecionados.
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
              {filteredImages.map((media) => {
                const isSelected =
                  (selectedItem && selectedItem.id === media.id) ||
                  (!selectedItem && selectedMediaId === media.id);

                return (
                  <MediaCard
                    key={media.id}
                    media={media}
                    isSelected={isSelected}
                    isPickerMode={true}
                    onClick={() => setSelectedItem(media)}
                    onSelect={() => handleDirectSelect(media)}
                  />
                );
              })}
            </div>
          ) : (
            <MediaList
              items={filteredImages}
              selectedMediaId={selectedItem?.id || selectedMediaId}
              isPickerMode={true}
              onItemClick={(media) => setSelectedItem(media)}
              onSelect={(media) => handleDirectSelect(media)}
            />
          )}
        </div>

        {/* Rodapé de Ações do Modal */}
        <div className="px-6 py-3.5 border-t border-stone-200 bg-white flex items-center justify-between">
          <div className="text-xs text-stone-500">
            {selectedItem ? (
              <span className="flex items-center gap-1.5 text-stone-700 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Imagem selecionada: <strong className="font-semibold">{selectedItem.title || selectedItem.filename}</strong>
              </span>
            ) : (
              <span>Selecione uma imagem para continuar</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={!selectedItem}
              onClick={handleConfirm}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-colors shadow-xs ${
                selectedItem
                  ? 'bg-amber-600 hover:bg-amber-700 text-white cursor-pointer'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Confirmar Seleção</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
