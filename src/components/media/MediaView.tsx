import React, { useState, useMemo } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Search,
  LayoutGrid,
  List,
  Filter,
  CheckCircle2,
  Folder,
} from 'lucide-react';
import { MediaItem, MediaType, MediaStatus } from '../../types';
import { INITIAL_DEMO_MEDIA } from './demoMediaData';
import { MediaToolbar } from './MediaToolbar';
import { MediaCard } from './MediaCard';
import { MediaList } from './MediaList';
import { MediaDetailsModal } from './MediaDetailsModal';
import { AddMediaModal } from './AddMediaModal';

export const MediaView: React.FC = () => {
  // Estado local em memória dos itens de mídia
  const [mediaList, setMediaList] = useState<MediaItem[]>(INITIAL_DEMO_MEDIA);

  // Busca e Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');

  // Modo de visualização (Grade ou Lista)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mídia selecionada para modal de detalhes/edição
  const [activeMediaForDetails, setActiveMediaForDetails] = useState<MediaItem | null>(null);

  // Modal informativo de Adicionar Mídia
  const [isAddMediaModalOpen, setIsAddMediaModalOpen] = useState(false);

  // Toast de feedback visual
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showNotification = (message: string) => {
    setFeedbackToast(message);
    setTimeout(() => {
      setFeedbackToast(null);
    }, 3500);
  };

  // Pastas únicas disponíveis no dataset
  const availableFolders = useMemo(() => {
    const folders = new Set<string>();
    mediaList.forEach((m) => {
      if (m.folder) folders.add(m.folder);
    });
    return Array.from(folders).sort();
  }, [mediaList]);

  // Filtragem e busca local
  const filteredMedia = useMemo(() => {
    return mediaList.filter((item) => {
      const q = searchQuery.toLowerCase().trim();

      // Busca por title, filename, originalName
      const matchesSearch =
        !q ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        item.filename.toLowerCase().includes(q) ||
        item.originalName.toLowerCase().includes(q);

      // Filtro por tipo
      const matchesType = selectedType === 'all' || item.type === selectedType;

      // Filtro por status
      const matchesStatus =
        selectedStatus === 'all' || (item.status || 'active') === selectedStatus;

      // Filtro por pasta
      const matchesFolder =
        selectedFolder === 'all' || (item.folder && item.folder === selectedFolder);

      return matchesSearch && matchesType && matchesStatus && matchesFolder;
    });
  }, [mediaList, searchQuery, selectedType, selectedStatus, selectedFolder]);

  // Handler de salvamento local de metadados
  const handleSaveMedia = (updatedMedia: MediaItem) => {
    setMediaList((prev) => prev.map((m) => (m.id === updatedMedia.id ? updatedMedia : m)));
    setActiveMediaForDetails(null);
    showNotification(`Mídia "${updatedMedia.title || updatedMedia.filename}" atualizada.`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notifier */}
      {feedbackToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-stone-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Cabeçalho da Seção de Mídia */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-stone-900 tracking-tight">Mídia</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-semibold border border-stone-200">
              {mediaList.length} {mediaList.length === 1 ? 'arquivo' : 'arquivos'}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Gerencie as imagens, vídeos, áudios e documentos do seu site.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddMediaModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar mídia</span>
        </button>
      </div>

      {/* Barra de Filtros e Busca */}
      <MediaToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedFolder={selectedFolder}
        onFolderChange={setSelectedFolder}
        availableFolders={availableFolders}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Exibição dos Itens de Mídia */}
      {mediaList.length === 0 ? (
        // Estado Vazio: Nenhuma mídia cadastrada
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto mb-3">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-stone-800 mb-1">Sua biblioteca está vazia</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
            As mídias adicionadas ao site aparecerão aqui.
          </p>
          <button
            type="button"
            onClick={() => setIsAddMediaModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar mídia</span>
          </button>
        </div>
      ) : filteredMedia.length === 0 ? (
        // Estado Vazio: Nenhum resultado com os filtros
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 border border-stone-200 text-stone-500 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-stone-800 mb-1">Nenhuma mídia encontrada</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
            Tente alterar os filtros ou o termo de busca.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedType('all');
              setSelectedStatus('all');
              setSelectedFolder('all');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors border border-amber-200"
          >
            Limpar filtros
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        // Visualização em Grade
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map((media) => (
            <MediaCard
              key={media.id}
              media={media}
              onClick={() => setActiveMediaForDetails(media)}
            />
          ))}
        </div>
      ) : (
        // Visualização em Lista / Tabela
        <MediaList
          items={filteredMedia}
          onItemClick={(media) => setActiveMediaForDetails(media)}
        />
      )}

      {/* Modal de Detalhes e Edição */}
      <MediaDetailsModal
        isOpen={!!activeMediaForDetails}
        media={activeMediaForDetails}
        onClose={() => setActiveMediaForDetails(null)}
        onSave={handleSaveMedia}
      />

      {/* Modal Informativo de Adicionar Mídia */}
      <AddMediaModal
        isOpen={isAddMediaModalOpen}
        onClose={() => setIsAddMediaModalOpen(false)}
      />
    </div>
  );
};
