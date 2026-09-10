import React, { useState, useMemo } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { ChurchLeader, LeaderStatus } from '../../types';
import { INITIAL_DEMO_LEADERS } from './demoLeadersData';
import {
  LeadersToolbar,
  LeaderStatusFilter,
  LeaderSortOption,
  LeaderViewMode,
} from './LeadersToolbar';
import { LeaderList } from './LeaderList';
import { LeaderEditorModal } from './LeaderEditorModal';
import { LeaderPreviewModal } from './LeaderPreviewModal';
import { DeleteLeaderConfirmModal } from './DeleteLeaderConfirmModal';

export const LeadersView: React.FC = () => {
  // Estado principal em memória dos líderes da congregação
  const [leadersList, setLeadersList] = useState<ChurchLeader[]>(INITIAL_DEMO_LEADERS);

  // Estados de controle, filtros e ordenação
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeaderStatusFilter>('all');
  const [sortBy, setSortBy] = useState<LeaderSortOption>('order_asc');
  const [viewMode, setViewMode] = useState<LeaderViewMode>('cards');

  // Estados dos Modais
  const [editingLeader, setEditingLeader] = useState<ChurchLeader | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const [previewingLeader, setPreviewingLeader] = useState<ChurchLeader | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [deletingLeader, setDeletingLeader] = useState<ChurchLeader | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Notificação toast temporária sem bibliotecas externas
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Contadores globais derivados dos dados reais
  const stats = useMemo(() => {
    const total = leadersList.length;
    let active = 0;
    let inactive = 0;

    for (const leader of leadersList) {
      if (leader.status === 'active') active++;
      else if (leader.status === 'inactive') inactive++;
    }

    return { total, active, inactive };
  }, [leadersList]);

  // Filtragem e Busca em campos textuais existentes no contrato
  const filteredLeaders = useMemo(() => {
    return leadersList.filter((leader) => {
      // Filtro por Status
      if (statusFilter !== 'all' && leader.status !== statusFilter) {
        return false;
      }

      // Filtro por Busca (name, role, description)
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchName = leader.name.toLowerCase().includes(query);
        const matchRole = leader.role.toLowerCase().includes(query);
        const matchDesc = leader.description
          ? leader.description.toLowerCase().includes(query)
          : false;

        if (!matchName && !matchRole && !matchDesc) {
          return false;
        }
      }

      return true;
    });
  }, [leadersList, statusFilter, searchTerm]);

  // Ordenação baseada exclusivamente em campos do contrato canônico
  const sortedLeaders = useMemo(() => {
    const result = [...filteredLeaders];

    switch (sortBy) {
      case 'order_asc':
        return result.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      case 'name_asc':
        return result.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

      case 'name_desc':
        return result.sort((a, b) => b.name.localeCompare(a.name, 'pt-BR'));

      case 'role_asc':
        return result.sort((a, b) => a.role.localeCompare(b.role, 'pt-BR'));

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
  }, [filteredLeaders, sortBy]);

  // Handlers de Ações

  // Abertura do Modal de Criação
  const handleOpenCreate = () => {
    setEditingLeader(null);
    setIsEditorOpen(true);
  };

  // Abertura do Modal de Edição
  const handleOpenEdit = (leader: ChurchLeader) => {
    setEditingLeader(leader);
    setIsEditorOpen(true);
  };

  // Abertura do Modal de Preview
  const handleOpenPreview = (leader: ChurchLeader) => {
    setPreviewingLeader(leader);
    setIsPreviewOpen(true);
  };

  // Salvamento de Criação ou Edição
  const handleSaveLeader = (savedLeader: ChurchLeader) => {
    const isEditing = leadersList.some((l) => l.id === savedLeader.id);

    if (isEditing) {
      setLeadersList((prev) =>
        prev.map((l) => (l.id === savedLeader.id ? savedLeader : l))
      );
      showToast(`Liderança "${savedLeader.name}" atualizada com sucesso.`);
    } else {
      setLeadersList((prev) => [...prev, savedLeader]);
      showToast(`Liderança "${savedLeader.name}" cadastrada com sucesso.`);
    }
  };

  // Duplicação de Liderança
  const handleDuplicate = (leader: ChurchLeader) => {
    const maxOrder = leadersList.reduce(
      (max, l) => Math.max(max, l.order || 0),
      0
    );
    const now = new Date().toISOString();

    const duplicatedLeader: ChurchLeader = {
      ...leader,
      id: `ldr_${Date.now()}`,
      name: `${leader.name} (Cópia)`,
      order: maxOrder + 1,
      createdAt: now,
      updatedAt: now,
    };

    setLeadersList((prev) => [...prev, duplicatedLeader]);
    showToast(`Cópia da liderança "${leader.name}" criada com sucesso.`);
  };

  // Alternância Rápida de Status (Ativo <-> Inativo)
  const handleToggleStatus = (leader: ChurchLeader) => {
    const nextStatus: LeaderStatus =
      leader.status === 'active' ? 'inactive' : 'active';
    const now = new Date().toISOString();

    setLeadersList((prev) =>
      prev.map((l) =>
        l.id === leader.id
          ? {
              ...l,
              status: nextStatus,
              updatedAt: now,
            }
          : l
      )
    );

    const actionLabel = nextStatus === 'active' ? 'ativada' : 'inativada';
    showToast(`Liderança "${leader.name}" foi ${actionLabel}.`);
  };

  // Abertura do Modal de Exclusão
  const handleOpenDelete = (leader: ChurchLeader) => {
    setDeletingLeader(leader);
    setIsDeleteOpen(true);
  };

  // Confirmação de Exclusão
  const handleConfirmDelete = () => {
    if (!deletingLeader) return;

    const leaderName = deletingLeader.name;
    setLeadersList((prev) => prev.filter((l) => l.id !== deletingLeader.id));
    setDeletingLeader(null);
    showToast(`Liderança "${leaderName}" excluída com sucesso.`);
  };

  return (
    <div id="leaders-view" className="space-y-6">
      {/* Barra de Ferramentas e Métricas */}
      <LeadersToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNewLeader={handleOpenCreate}
        stats={stats}
        filteredCount={sortedLeaders.length}
      />

      {/* Lista / Tabela de Lideranças */}
      <LeaderList
        leaders={sortedLeaders}
        viewMode={viewMode}
        onPreview={handleOpenPreview}
        onEdit={handleOpenEdit}
        onDuplicate={handleDuplicate}
        onToggleStatus={handleToggleStatus}
        onDelete={handleOpenDelete}
        onNewLeader={handleOpenCreate}
        hasFiltersActive={Boolean(searchTerm || statusFilter !== 'all')}
        onClearFilters={() => {
          setSearchTerm('');
          setStatusFilter('all');
        }}
      />

      {/* Modal de Criação / Edição */}
      <LeaderEditorModal
        leader={editingLeader}
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingLeader(null);
        }}
        onSave={handleSaveLeader}
        existingLeaders={leadersList}
      />

      {/* Modal de Pré-Visualização */}
      <LeaderPreviewModal
        leader={previewingLeader}
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setPreviewingLeader(null);
        }}
        onEdit={(leader) => {
          setIsPreviewOpen(false);
          setPreviewingLeader(null);
          handleOpenEdit(leader);
        }}
      />

      {/* Modal de Exclusão */}
      <DeleteLeaderConfirmModal
        leader={deletingLeader}
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingLeader(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      {/* Toast de Feedback Visual */}
      {toastMessage && (
        <div
          id="leader-toast-feedback"
          className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-xl shadow-lg border border-stone-800 flex items-center gap-2.5 text-xs sm:text-sm font-medium animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
