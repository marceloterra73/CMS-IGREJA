import React, { useState, useMemo } from 'react';
import { Users, Plus, RefreshCw, CheckCircle2 } from 'lucide-react';
import { ChurchMinistry, MinistryStatus } from '../../types';
import { INITIAL_DEMO_MINISTRIES } from './demoMinistriesData';
import {
  MinistriesToolbar,
  MinistryStatusFilter,
  MinistrySortOption,
  MinistryViewMode,
} from './MinistriesToolbar';
import { MinistryList } from './MinistryList';
import { MinistryCard } from './MinistryCard';
import { MinistryEditorModal } from './MinistryEditorModal';
import { MinistryPreviewModal } from './MinistryPreviewModal';
import { DeleteMinistryConfirmModal } from './DeleteMinistryConfirmModal';
import { ensureUniqueMinistrySlug } from './ministriesUtils';

export const MinistriesView: React.FC = () => {
  // Estado principal em memória
  const [ministriesList, setMinistriesList] = useState<ChurchMinistry[]>(INITIAL_DEMO_MINISTRIES);

  // Estados de controle e filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<MinistryStatusFilter>('all');
  const [sortBy, setSortBy] = useState<MinistrySortOption>('recent');
  const [viewMode, setViewMode] = useState<MinistryViewMode>('table');

  // Estados dos Modais
  const [editingMinistry, setEditingMinistry] = useState<ChurchMinistry | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const [previewingMinistry, setPreviewingMinistry] = useState<ChurchMinistry | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [deletingMinistry, setDeletingMinistry] = useState<ChurchMinistry | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Notificação toast temporária
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Contadores globais
  const stats = useMemo(() => {
    const total = ministriesList.length;
    let active = 0;
    let inactive = 0;

    for (const item of ministriesList) {
      if (item.status === 'active') active++;
      else if (item.status === 'inactive') inactive++;
    }

    return { total, active, inactive };
  }, [ministriesList]);

  // Filtragem e Busca
  const filteredMinistries = useMemo(() => {
    return ministriesList.filter((item) => {
      // Filtro por Status
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }

      // Filtro por Busca (name, slug, leaderName, description)
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(query);
        const matchSlug = item.slug.toLowerCase().includes(query);
        const matchLeader = item.leaderName
          ? item.leaderName.toLowerCase().includes(query)
          : false;
        const matchDesc = item.description
          ? item.description.toLowerCase().includes(query)
          : false;

        if (!matchName && !matchSlug && !matchLeader && !matchDesc) {
          return false;
        }
      }

      return true;
    });
  }, [ministriesList, statusFilter, searchTerm]);

  // Ordenação
  const sortedMinistries = useMemo(() => {
    const items = [...filteredMinistries];

    switch (sortBy) {
      case 'recent':
        return items.sort((a, b) => {
          const dateA = a.updatedAt || a.createdAt || '';
          const dateB = b.updatedAt || b.createdAt || '';
          return dateB.localeCompare(dateA);
        });
      case 'oldest':
        return items.sort((a, b) => {
          const dateA = a.createdAt || a.updatedAt || '';
          const dateB = b.createdAt || b.updatedAt || '';
          return dateA.localeCompare(dateB);
        });
      case 'name_asc':
        return items.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
      case 'name_desc':
        return items.sort((a, b) => b.name.localeCompare(a.name, 'pt-BR'));
      case 'leader_asc':
        return items.sort((a, b) => (a.leaderName || '').localeCompare(b.leaderName || '', 'pt-BR'));
      case 'leader_desc':
        return items.sort((a, b) => (b.leaderName || '').localeCompare(a.leaderName || '', 'pt-BR'));
      default:
        return items;
    }
  }, [filteredMinistries, sortBy]);

  // Operações de CRUD em memória
  const handleSaveMinistry = (saved: ChurchMinistry) => {
    setMinistriesList((prev) => {
      const exists = prev.some((m) => m.id === saved.id);
      if (exists) {
        showToast(`Ministério "${saved.name}" atualizado com sucesso.`);
        return prev.map((m) => (m.id === saved.id ? saved : m));
      } else {
        showToast(`Novo ministério "${saved.name}" criado com sucesso.`);
        return [saved, ...prev];
      }
    });
  };

  const handleDuplicateMinistry = (original: ChurchMinistry) => {
    const baseSlug = `${original.slug}-copia`;
    const uniqueSlug = ensureUniqueMinistrySlug(baseSlug, ministriesList);

    const now = new Date().toISOString();
    const duplicate: ChurchMinistry = {
      ...original,
      id: `min_${Date.now()}`,
      name: `${original.name} (Cópia)`,
      slug: uniqueSlug,
      status: 'inactive', // Cópia criada como inativa
      createdAt: now,
      updatedAt: now,
    };

    setMinistriesList((prev) => [duplicate, ...prev]);
    showToast(`Cópia criada como inativa: "${duplicate.name}".`);
  };

  const handleDeleteMinistry = (target: ChurchMinistry) => {
    setMinistriesList((prev) => prev.filter((m) => m.id !== target.id));
    showToast(`Ministério "${target.name}" excluído da sessão.`);
  };

  const handleStatusChange = (target: ChurchMinistry, newStatus: MinistryStatus) => {
    setMinistriesList((prev) =>
      prev.map((m) =>
        m.id === target.id
          ? { ...m, status: newStatus, updatedAt: new Date().toISOString() }
          : m
      )
    );
    const label = newStatus === 'active' ? 'ativado' : 'desativado';
    showToast(`Ministério "${target.name}" ${label}.`);
  };

  return (
    <div id="ministries-management-view" className="space-y-6">
      {/* Barra de Ferramentas, Métricas e Filtros */}
      <MinistriesToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNewMinistry={() => {
          setEditingMinistry(null);
          setIsEditorOpen(true);
        }}
        stats={stats}
        filteredCount={sortedMinistries.length}
      />

      {/* Conteúdo: Tabela ou Grid de Cartões */}
      {sortedMinistries.length > 0 ? (
        viewMode === 'table' ? (
          <MinistryList
            ministriesList={sortedMinistries}
            onPreview={(ministry) => {
              setPreviewingMinistry(ministry);
              setIsPreviewOpen(true);
            }}
            onEdit={(ministry) => {
              setEditingMinistry(ministry);
              setIsEditorOpen(true);
            }}
            onDuplicate={handleDuplicateMinistry}
            onDelete={(ministry) => {
              setDeletingMinistry(ministry);
              setIsDeleteOpen(true);
            }}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedMinistries.map((ministry) => (
              <MinistryCard
                key={ministry.id}
                ministry={ministry}
                onPreview={(m) => {
                  setPreviewingMinistry(m);
                  setIsPreviewOpen(true);
                }}
                onEdit={(m) => {
                  setEditingMinistry(m);
                  setIsEditorOpen(true);
                }}
                onDuplicate={handleDuplicateMinistry}
                onDelete={(m) => {
                  setDeletingMinistry(m);
                  setIsDeleteOpen(true);
                }}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )
      ) : (
        /* Estado Vazio */
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 mx-auto flex items-center justify-center mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-900">
            Nenhum ministério encontrado
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
            {searchTerm || statusFilter !== 'all'
              ? 'Nenhum resultado corresponde aos filtros aplicados. Tente ajustar os termos de busca.'
              : 'Nenhum ministério cadastrado no momento. Adicione a primeira frente de atuação da congregação.'}
          </p>

          <div className="mt-5 flex items-center justify-center gap-3">
            {searchTerm || statusFilter !== 'all' ? (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Limpar filtros</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setEditingMinistry(null);
                  setIsEditorOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Novo ministério</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal de Criação / Edição */}
      <MinistryEditorModal
        ministry={editingMinistry}
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingMinistry(null);
        }}
        onSave={handleSaveMinistry}
        existingMinistries={ministriesList}
      />

      {/* Modal de Pré-visualização */}
      <MinistryPreviewModal
        ministry={previewingMinistry}
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setPreviewingMinistry(null);
        }}
        onEdit={(ministry) => {
          setIsPreviewOpen(false);
          setEditingMinistry(ministry);
          setIsEditorOpen(true);
        }}
      />

      {/* Modal de Confirmação de Exclusão */}
      <DeleteMinistryConfirmModal
        ministry={deletingMinistry}
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingMinistry(null);
        }}
        onConfirm={handleDeleteMinistry}
      />

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-stone-700 flex items-center gap-2.5 text-xs animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
