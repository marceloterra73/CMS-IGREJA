import React, { useState, useMemo } from 'react';
import { ChurchPrayerRequest, PrayerRequestStatus } from '../../types';
import { INITIAL_DEMO_PRAYER_REQUESTS } from './demoPrayerRequestsData';
import {
  PrayerRequestsToolbar,
  PrayerStatusFilter,
  PrayerSortOption,
  PrayerViewMode,
} from './PrayerRequestsToolbar';
import { PrayerRequestList } from './PrayerRequestList';
import { PrayerRequestEditorModal } from './PrayerRequestEditorModal';
import { PrayerRequestPreviewModal } from './PrayerRequestPreviewModal';
import { DeletePrayerRequestConfirmModal } from './DeletePrayerRequestConfirmModal';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { getPrayerStatusLabel } from './prayerRequestsUtils';

export const PrayerRequestsView: React.FC = () => {
  // Estado mestre em memória dos pedidos de oração
  const [requests, setRequests] = useState<ChurchPrayerRequest[]>(INITIAL_DEMO_PRAYER_REQUESTS);

  // Estados de controle da toolbar
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PrayerStatusFilter>('all');
  const [sortBy, setSortBy] = useState<PrayerSortOption>('recent');
  const [viewMode, setViewMode] = useState<PrayerViewMode>('table');

  // Estados dos modais
  const [previewRequest, setPreviewRequest] = useState<ChurchPrayerRequest | null>(null);
  const [editorRequest, setEditorRequest] = useState<ChurchPrayerRequest | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [deleteTargetRequest, setDeleteTargetRequest] = useState<ChurchPrayerRequest | null>(null);

  // Notificação Toast
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'info';
  } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Cálculo das Métricas
  const stats = useMemo(() => {
    const total = requests.length;
    let pending = 0;
    let praying = 0;
    let answered = 0;
    let archived = 0;

    for (const req of requests) {
      if (req.status === 'pending') pending++;
      else if (req.status === 'praying') praying++;
      else if (req.status === 'answered') answered++;
      else if (req.status === 'archived') archived++;
    }

    return { total, pending, praying, answered, archived };
  }, [requests]);

  // Filtragem e Ordenação dos Pedidos
  const filteredAndSortedRequests = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const filtered = requests.filter((req) => {
      // Filtro de Status
      if (statusFilter !== 'all' && req.status !== statusFilter) {
        return false;
      }

      // Filtro de Busca textual
      if (query) {
        const matchesTitle = req.title ? req.title.toLowerCase().includes(query) : false;
        const matchesRequester = req.requesterName
          ? req.requesterName.toLowerCase().includes(query)
          : false;
        const matchesText = req.requestText.toLowerCase().includes(query);
        const matchesAnonymous = req.isAnonymous && 'anônimo anonimo'.includes(query);

        if (!matchesTitle && !matchesRequester && !matchesText && !matchesAnonymous) {
          return false;
        }
      }

      return true;
    });

    // Ordenação
    return filtered.sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'requester_asc') {
        const nameA = a.isAnonymous ? 'zz_anonimo' : a.requesterName || 'zz_sem_nome';
        const nameB = b.isAnonymous ? 'zz_anonimo' : b.requesterName || 'zz_sem_nome';
        return nameA.localeCompare(nameB, 'pt-BR');
      }
      if (sortBy === 'requester_desc') {
        const nameA = a.isAnonymous ? 'zz_anonimo' : a.requesterName || 'zz_sem_nome';
        const nameB = b.isAnonymous ? 'zz_anonimo' : b.requesterName || 'zz_sem_nome';
        return nameB.localeCompare(nameA, 'pt-BR');
      }
      return 0;
    });
  }, [requests, searchTerm, statusFilter, sortBy]);

  // Manipuladores de Ações
  const handleOpenNewRequest = () => {
    setEditorRequest(null);
    setIsEditorOpen(true);
  };

  const handleOpenEditRequest = (req: ChurchPrayerRequest) => {
    setEditorRequest(req);
    setIsEditorOpen(true);
  };

  const handleOpenPreview = (req: ChurchPrayerRequest) => {
    setPreviewRequest(req);
  };

  const handleSaveRequest = (payload: Partial<ChurchPrayerRequest>) => {
    const now = new Date().toISOString();

    if (editorRequest) {
      // Edição
      const updated: ChurchPrayerRequest = {
        ...editorRequest,
        ...payload,
        updatedAt: now,
      };

      setRequests((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));

      // Atualiza também no preview se estiver aberto
      if (previewRequest?.id === updated.id) {
        setPreviewRequest(updated);
      }

      showToast('Pedido de oração atualizado com sucesso!');
    } else {
      // Criação
      const newRequest: ChurchPrayerRequest = {
        id: `pray_${Date.now()}`,
        tenantId: 'ib_central',
        title: payload.title,
        requesterName: payload.requesterName,
        requestText: payload.requestText || '',
        isAnonymous: payload.isAnonymous,
        status: payload.status || 'pending',
        createdAt: now,
        updatedAt: now,
      };

      setRequests((prev) => [newRequest, ...prev]);
      showToast('Novo pedido de oração registrado com sucesso!');
    }

    setIsEditorOpen(false);
    setEditorRequest(null);
  };

  const handleChangeStatus = (req: ChurchPrayerRequest, newStatus: PrayerRequestStatus) => {
    const now = new Date().toISOString();
    const updated: ChurchPrayerRequest = {
      ...req,
      status: newStatus,
      updatedAt: now,
    };

    setRequests((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));

    if (previewRequest?.id === updated.id) {
      setPreviewRequest(updated);
    }

    const statusLabel = getPrayerStatusLabel(newStatus);
    showToast(`Status alterado para "${statusLabel}"!`, 'info');
  };

  const handleDuplicate = (req: ChurchPrayerRequest) => {
    const now = new Date().toISOString();
    const duplicated: ChurchPrayerRequest = {
      ...req,
      id: `pray_${Date.now()}`,
      title: req.title ? `${req.title} (Cópia)` : 'Cópia de Pedido de Oração',
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    setRequests((prev) => [duplicated, ...prev]);
    showToast('Pedido de oração duplicado como "Pendente"!');
  };

  const handleDeleteClick = (req: ChurchPrayerRequest) => {
    setDeleteTargetRequest(req);
  };

  const handleConfirmDelete = () => {
    if (!deleteTargetRequest) return;

    setRequests((prev) => prev.filter((item) => item.id !== deleteTargetRequest.id));

    if (previewRequest?.id === deleteTargetRequest.id) {
      setPreviewRequest(null);
    }

    showToast('Pedido de oração removido do painel.');
    setDeleteTargetRequest(null);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  return (
    <div id="prayer-requests-view" className="space-y-6 animate-in fade-in duration-150">
      {/* Toast Notificação de Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-stone-900 text-white rounded-2xl shadow-xl text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200">
          {toastMessage.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-sky-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Toolbar Principal */}
      <PrayerRequestsToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNewRequest={handleOpenNewRequest}
        stats={stats}
        filteredCount={filteredAndSortedRequests.length}
      />

      {/* Listagem de Pedidos */}
      <PrayerRequestList
        requests={filteredAndSortedRequests}
        viewMode={viewMode}
        onView={handleOpenPreview}
        onEdit={handleOpenEditRequest}
        onChangeStatus={handleChangeStatus}
        onDuplicate={handleDuplicate}
        onDelete={handleDeleteClick}
        onResetFilters={handleResetFilters}
        isFiltered={Boolean(searchTerm || statusFilter !== 'all')}
        onNewRequest={handleOpenNewRequest}
      />

      {/* Modal de Criação / Edição */}
      <PrayerRequestEditorModal
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditorRequest(null);
        }}
        onSave={handleSaveRequest}
        initialData={editorRequest}
      />

      {/* Modal de Visualização Detalhada (Preview Confidencial) */}
      <PrayerRequestPreviewModal
        isOpen={Boolean(previewRequest)}
        onClose={() => setPreviewRequest(null)}
        request={previewRequest}
        onEdit={(req) => {
          setPreviewRequest(null);
          handleOpenEditRequest(req);
        }}
        onChangeStatus={handleChangeStatus}
        onDuplicate={handleDuplicate}
      />

      {/* Modal de Confirmação de Exclusão */}
      <DeletePrayerRequestConfirmModal
        isOpen={Boolean(deleteTargetRequest)}
        onClose={() => setDeleteTargetRequest(null)}
        onConfirm={handleConfirmDelete}
        request={deleteTargetRequest}
      />
    </div>
  );
};
