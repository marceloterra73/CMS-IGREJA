import React, { useState, useMemo } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { ChurchBanner, BannerStatus } from '../../types';
import { INITIAL_DEMO_BANNERS } from './demoBannersData';
import {
  BannersToolbar,
  BannerStatusFilter,
  BannerSortOption,
  BannerViewMode,
} from './BannersToolbar';
import { BannerList } from './BannerList';
import { BannerEditorModal } from './BannerEditorModal';
import { BannerPreviewModal } from './BannerPreviewModal';
import { DeleteBannerConfirmModal } from './DeleteBannerConfirmModal';

export const BannersView: React.FC = () => {
  // Estado principal em memória dos banners da congregação
  const [bannersList, setBannersList] = useState<ChurchBanner[]>(INITIAL_DEMO_BANNERS);

  // Estados de controle, filtros e ordenação
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<BannerStatusFilter>('all');
  const [sortBy, setSortBy] = useState<BannerSortOption>('order_asc');
  const [viewMode, setViewMode] = useState<BannerViewMode>('cards');

  // Estados dos Modais
  const [editingBanner, setEditingBanner] = useState<ChurchBanner | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const [previewingBanner, setPreviewingBanner] = useState<ChurchBanner | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [deletingBanner, setDeletingBanner] = useState<ChurchBanner | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Notificação toast temporária sem bibliotecas externas
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Contadores globais derivados dos dados reais
  const stats = useMemo(() => {
    const total = bannersList.length;
    let active = 0;
    let inactive = 0;

    for (const banner of bannersList) {
      if (banner.status === 'active') active++;
      else if (banner.status === 'inactive') inactive++;
    }

    return { total, active, inactive };
  }, [bannersList]);

  // Filtragem e Busca em campos textuais existentes no contrato
  const filteredBanners = useMemo(() => {
    return bannersList.filter((banner) => {
      // Filtro por Status
      if (statusFilter !== 'all' && banner.status !== statusFilter) {
        return false;
      }

      // Filtro por Busca (title, subtitle, primaryButtonLabel)
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchTitle = banner.title.toLowerCase().includes(query);
        const matchSubtitle = banner.subtitle
          ? banner.subtitle.toLowerCase().includes(query)
          : false;
        const matchButton = banner.primaryButtonLabel
          ? banner.primaryButtonLabel.toLowerCase().includes(query)
          : false;

        if (!matchTitle && !matchSubtitle && !matchButton) {
          return false;
        }
      }

      return true;
    });
  }, [bannersList, statusFilter, searchTerm]);

  // Ordenação baseada exclusivamente em campos do contrato canônico
  const sortedBanners = useMemo(() => {
    const result = [...filteredBanners];

    switch (sortBy) {
      case 'order_asc':
        return result.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      case 'title_asc':
        return result.sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));

      case 'title_desc':
        return result.sort((a, b) => b.title.localeCompare(a.title, 'pt-BR'));

      case 'recent':
        return result.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });

      case 'oldest':
        return result.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateA - dateB;
        });

      default:
        return result;
    }
  }, [filteredBanners, sortBy]);

  // Handlers de Ações

  // Abertura do Modal de Criação
  const handleOpenCreate = () => {
    setEditingBanner(null);
    setIsEditorOpen(true);
  };

  // Abertura do Modal de Edição
  const handleOpenEdit = (banner: ChurchBanner) => {
    setEditingBanner(banner);
    setIsEditorOpen(true);
  };

  // Abertura do Modal de Preview
  const handleOpenPreview = (banner: ChurchBanner) => {
    setPreviewingBanner(banner);
    setIsPreviewOpen(true);
  };

  // Salvamento de Criação ou Edição
  const handleSaveBanner = (savedBanner: ChurchBanner) => {
    const isEditing = bannersList.some((b) => b.id === savedBanner.id);

    if (isEditing) {
      setBannersList((prev) =>
        prev.map((b) => (b.id === savedBanner.id ? savedBanner : b))
      );
      showToast(`Banner "${savedBanner.title}" atualizado com sucesso.`);
    } else {
      setBannersList((prev) => [...prev, savedBanner]);
      showToast(`Banner "${savedBanner.title}" cadastrado com sucesso.`);
    }
  };

  // Duplicação de Banner
  const handleDuplicate = (banner: ChurchBanner) => {
    const maxOrder = bannersList.reduce(
      (max, b) => Math.max(max, b.order || 0),
      0
    );
    const now = new Date().toISOString();

    const duplicatedBanner: ChurchBanner = {
      ...banner,
      id: `ban_${Date.now()}`,
      title: `${banner.title} (Cópia)`,
      order: maxOrder + 1,
      createdAt: now,
      updatedAt: now,
    };

    setBannersList((prev) => [...prev, duplicatedBanner]);
    showToast(`Cópia do banner "${banner.title}" criada com sucesso.`);
  };

  // Alternância Rápida de Status (Ativo <-> Inativo)
  const handleToggleStatus = (banner: ChurchBanner) => {
    const nextStatus: BannerStatus =
      banner.status === 'active' ? 'inactive' : 'active';
    const now = new Date().toISOString();

    setBannersList((prev) =>
      prev.map((b) =>
        b.id === banner.id
          ? {
              ...b,
              status: nextStatus,
              updatedAt: now,
            }
          : b
      )
    );

    const actionLabel = nextStatus === 'active' ? 'ativado' : 'desativado';
    showToast(`Banner "${banner.title}" foi ${actionLabel}.`);
  };

  // Abertura do Modal de Exclusão
  const handleOpenDelete = (banner: ChurchBanner) => {
    setDeletingBanner(banner);
    setIsDeleteOpen(true);
  };

  // Confirmação de Exclusão
  const handleConfirmDelete = () => {
    if (!deletingBanner) return;

    const bannerTitle = deletingBanner.title;
    setBannersList((prev) => prev.filter((b) => b.id !== deletingBanner.id));
    setDeletingBanner(null);
    showToast(`Banner "${bannerTitle}" excluído com sucesso.`);
  };

  return (
    <div id="banners-view" className="space-y-6">
      {/* Barra de Ferramentas e Métricas */}
      <BannersToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNewBanner={handleOpenCreate}
        stats={stats}
        filteredCount={sortedBanners.length}
      />

      {/* Lista / Tabela de Banners */}
      <BannerList
        banners={sortedBanners}
        viewMode={viewMode}
        onPreview={handleOpenPreview}
        onEdit={handleOpenEdit}
        onDuplicate={handleDuplicate}
        onToggleStatus={handleToggleStatus}
        onDelete={handleOpenDelete}
        onNewBanner={handleOpenCreate}
        hasFiltersActive={Boolean(searchTerm || statusFilter !== 'all')}
        onClearFilters={() => {
          setSearchTerm('');
          setStatusFilter('all');
        }}
      />

      {/* Modal de Criação / Edição */}
      <BannerEditorModal
        banner={editingBanner}
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingBanner(null);
        }}
        onSave={handleSaveBanner}
        existingBanners={bannersList}
      />

      {/* Modal de Pré-Visualização */}
      <BannerPreviewModal
        banner={previewingBanner}
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setPreviewingBanner(null);
        }}
        onEdit={(banner) => {
          setIsPreviewOpen(false);
          setPreviewingBanner(null);
          handleOpenEdit(banner);
        }}
      />

      {/* Modal de Exclusão */}
      <DeleteBannerConfirmModal
        banner={deletingBanner}
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingBanner(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      {/* Toast de Feedback Visual */}
      {toastMessage && (
        <div
          id="banner-toast-feedback"
          className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-xl shadow-lg border border-stone-800 flex items-center gap-2.5 text-xs sm:text-sm font-medium animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
