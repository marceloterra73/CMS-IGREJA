import React, { useState, useMemo } from 'react';
import { ChurchGalleryAlbum } from '../../types';
import { INITIAL_DEMO_GALLERY } from './demoGalleryData';
import {
  GalleryToolbar,
  GalleryStatusFilter,
  GallerySortOption,
  GalleryViewMode,
} from './GalleryToolbar';
import { GalleryList } from './GalleryList';
import { GalleryEditorModal } from './GalleryEditorModal';
import { GalleryPreviewModal } from './GalleryPreviewModal';
import { DeleteGalleryConfirmModal } from './DeleteGalleryConfirmModal';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface ToastState {
  id: string;
  type: 'success' | 'info';
  message: string;
}

export const GalleryView: React.FC = () => {
  // Estado local em memória dos álbuns
  const [albums, setAlbums] = useState<ChurchGalleryAlbum[]>(INITIAL_DEMO_GALLERY);

  // Estados de busca, filtros e ordenação
  const [searchTerm, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<GalleryStatusFilter>('all');
  const [sortBy, setSortBy] = useState<GallerySortOption>('recent');
  const [viewMode, setViewMode] = useState<GalleryViewMode>('cards');

  // Estados dos Modais
  const [editingAlbum, setEditingAlbum] = useState<ChurchGalleryAlbum | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const [previewAlbum, setPreviewAlbum] = useState<ChurchGalleryAlbum | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [deletingAlbum, setDeletingAlbum] = useState<ChurchGalleryAlbum | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Toast temporário de feedback
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, type, message });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 3500);
  };

  // Métricas calculadas dinamicamente
  const stats = useMemo(() => {
    let total = albums.length;
    let active = 0;
    let archived = 0;
    let totalPhotos = 0;

    for (const alb of albums) {
      if (alb.status === 'active') active++;
      if (alb.status === 'archived') archived++;
      totalPhotos += alb.mediaIds?.length || 0;
    }

    return { total, active, archived, totalPhotos };
  }, [albums]);

  // Filtragem e Ordenação
  const filteredAndSortedAlbums = useMemo(() => {
    return albums
      .filter((album) => {
        // Filtro por status
        if (statusFilter !== 'all' && album.status !== statusFilter) {
          return false;
        }

        // Filtro por busca textual case-insensitive em campos existentes
        const q = searchTerm.toLowerCase().trim();
        if (q) {
          const matchTitle = album.title.toLowerCase().includes(q);
          const matchSlug = album.slug ? album.slug.toLowerCase().includes(q) : false;
          const matchDesc = album.description
            ? album.description.toLowerCase().includes(q)
            : false;
          if (!matchTitle && !matchSlug && !matchDesc) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'recent':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'oldest':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case 'title_asc':
            return a.title.localeCompare(b.title, 'pt-BR');
          case 'title_desc':
            return b.title.localeCompare(a.title, 'pt-BR');
          case 'photos_desc':
            return (b.mediaIds?.length || 0) - (a.mediaIds?.length || 0);
          default:
            return 0;
        }
      });
  }, [albums, searchTerm, statusFilter, sortBy]);

  // Abertura do Editor para Novo Álbum
  const handleNewAlbum = () => {
    setEditingAlbum(null);
    setIsEditorOpen(true);
  };

  // Abertura do Editor para Álbum Existente
  const handleEditAlbum = (album: ChurchGalleryAlbum) => {
    setEditingAlbum(album);
    setIsEditorOpen(true);
  };

  // Salvar (criação ou edição)
  const handleSaveAlbum = (savedAlbum: ChurchGalleryAlbum) => {
    const exists = albums.some((a) => a.id === savedAlbum.id);
    if (exists) {
      setAlbums((prev) =>
        prev.map((a) => (a.id === savedAlbum.id ? savedAlbum : a))
      );
      showToast('Álbum atualizado com sucesso!');
      if (previewAlbum?.id === savedAlbum.id) {
        setPreviewAlbum(savedAlbum);
      }
    } else {
      setAlbums((prev) => [savedAlbum, ...prev]);
      showToast('Novo álbum cadastrado com sucesso!');
    }
    setIsEditorOpen(false);
  };

  // Visualizar álbum (Preview)
  const handlePreviewAlbum = (album: ChurchGalleryAlbum) => {
    setPreviewAlbum(album);
    setIsPreviewOpen(true);
  };

  // Duplicar álbum
  const handleDuplicateAlbum = (album: ChurchGalleryAlbum) => {
    const now = new Date().toISOString();
    const duplicated: ChurchGalleryAlbum = {
      ...album,
      id: `alb_${Date.now()}`,
      title: `${album.title} (Cópia)`,
      slug: album.slug ? `${album.slug}-copia` : undefined,
      mediaIds: [...album.mediaIds],
      createdAt: now,
      updatedAt: now,
    };

    setAlbums((prev) => [duplicated, ...prev]);
    showToast(`Álbum "${album.title}" duplicado com sucesso!`, 'info');
  };

  // Alternar Status (Ativo <-> Arquivado)
  const handleToggleStatus = (album: ChurchGalleryAlbum) => {
    const newStatus = album.status === 'active' ? 'archived' : 'active';
    const updated: ChurchGalleryAlbum = {
      ...album,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    setAlbums((prev) =>
      prev.map((a) => (a.id === album.id ? updated : a))
    );

    if (previewAlbum?.id === album.id) {
      setPreviewAlbum(updated);
    }

    showToast(
      newStatus === 'active'
        ? `Álbum "${album.title}" agora está ativo!`
        : `Álbum "${album.title}" arquivado no histórico.`,
      'info'
    );
  };

  // Solicitar exclusão
  const handleDeleteRequest = (album: ChurchGalleryAlbum) => {
    setDeletingAlbum(album);
    setIsDeleteOpen(true);
  };

  // Confirmar exclusão
  const handleConfirmDelete = () => {
    if (!deletingAlbum) return;

    setAlbums((prev) => prev.filter((a) => a.id !== deletingAlbum.id));
    showToast(`Álbum "${deletingAlbum.title}" excluído do painel.`);

    if (previewAlbum?.id === deletingAlbum.id) {
      setIsPreviewOpen(false);
      setPreviewAlbum(null);
    }

    setIsDeleteOpen(false);
    setDeletingAlbum(null);
  };

  // Resetar busca e filtros
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  return (
    <div id="gallery-management-view" className="space-y-5">
      {/* Toast Notifier */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-70 max-w-sm bg-stone-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-stone-300 shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Barra de Ferramentas com Métricas, Filtros e Busca */}
      <GalleryToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNewAlbum={handleNewAlbum}
        stats={stats}
        filteredCount={filteredAndSortedAlbums.length}
      />

      {/* Lista / Grade de Álbuns */}
      <GalleryList
        albums={filteredAndSortedAlbums}
        viewMode={viewMode}
        onPreview={handlePreviewAlbum}
        onEdit={handleEditAlbum}
        onDuplicate={handleDuplicateAlbum}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDeleteRequest}
        onResetFilters={handleResetFilters}
      />

      {/* Modal de Criação / Edição */}
      <GalleryEditorModal
        isOpen={isEditorOpen}
        album={editingAlbum}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveAlbum}
      />

      {/* Modal de Visualização (Preview) */}
      <GalleryPreviewModal
        album={previewAlbum}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onEdit={(album) => {
          setIsPreviewOpen(false);
          handleEditAlbum(album);
        }}
        onDuplicate={handleDuplicateAlbum}
        onToggleStatus={handleToggleStatus}
      />

      {/* Modal de Confirmação de Exclusão */}
      <DeleteGalleryConfirmModal
        album={deletingAlbum}
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingAlbum(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
