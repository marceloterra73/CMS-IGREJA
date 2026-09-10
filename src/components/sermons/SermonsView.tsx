import React, { useState, useMemo } from 'react';
import { Video, Plus, RefreshCw, CheckCircle2 } from 'lucide-react';
import { ChurchSermon, SermonStatus } from '../../types';
import { INITIAL_DEMO_SERMONS } from './demoSermonsData';
import {
  SermonsToolbar,
  SermonStatusFilter,
  SermonSortOption,
  SermonViewMode,
} from './SermonsToolbar';
import { SermonList } from './SermonList';
import { SermonCard } from './SermonCard';
import { SermonEditorModal } from './SermonEditorModal';
import { SermonPreviewModal } from './SermonPreviewModal';
import { DeleteSermonConfirmModal } from './DeleteSermonConfirmModal';
import { ensureUniqueSermonSlug } from './sermonsUtils';

export const SermonsView: React.FC = () => {
  // Estado principal em memória
  const [sermonsList, setSermonsList] = useState<ChurchSermon[]>(INITIAL_DEMO_SERMONS);

  // Estados de controle e filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<SermonStatusFilter>('all');
  const [sortBy, setSortBy] = useState<SermonSortOption>('recent');
  const [viewMode, setViewMode] = useState<SermonViewMode>('table');

  // Estados dos Modais
  const [editingSermon, setEditingSermon] = useState<ChurchSermon | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const [previewingSermon, setPreviewingSermon] = useState<ChurchSermon | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [deletingSermon, setDeletingSermon] = useState<ChurchSermon | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Notificação toast temporária
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Contadores globais
  const stats = useMemo(() => {
    const total = sermonsList.length;
    let published = 0;
    let draft = 0;
    let archived = 0;

    for (const item of sermonsList) {
      if (item.status === 'published') published++;
      else if (item.status === 'draft') draft++;
      else if (item.status === 'archived') archived++;
    }

    return { total, published, draft, archived };
  }, [sermonsList]);

  // Filtragem e Busca
  const filteredSermons = useMemo(() => {
    return sermonsList.filter((item) => {
      // Filtro por Status
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }

      // Filtro por Busca (title, slug, preacher, scriptureReference, description)
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchSlug = item.slug.toLowerCase().includes(query);
        const matchPreacher = item.preacher.toLowerCase().includes(query);
        const matchScripture = item.scriptureReference
          ? item.scriptureReference.toLowerCase().includes(query)
          : false;
        const matchDesc = item.description
          ? item.description.toLowerCase().includes(query)
          : false;

        if (!matchTitle && !matchSlug && !matchPreacher && !matchScripture && !matchDesc) {
          return false;
        }
      }

      return true;
    });
  }, [sermonsList, statusFilter, searchTerm]);

  // Ordenação
  const sortedSermons = useMemo(() => {
    const items = [...filteredSermons];

    switch (sortBy) {
      case 'recent':
        return items.sort((a, b) => b.date.localeCompare(a.date));
      case 'oldest':
        return items.sort((a, b) => a.date.localeCompare(b.date));
      case 'title_asc':
        return items.sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));
      case 'title_desc':
        return items.sort((a, b) => b.title.localeCompare(a.title, 'pt-BR'));
      case 'preacher_asc':
        return items.sort((a, b) => a.preacher.localeCompare(b.preacher, 'pt-BR'));
      case 'preacher_desc':
        return items.sort((a, b) => b.preacher.localeCompare(a.preacher, 'pt-BR'));
      default:
        return items;
    }
  }, [filteredSermons, sortBy]);

  // Operações de CRUD em memória
  const handleSaveSermon = (saved: ChurchSermon) => {
    setSermonsList((prev) => {
      const exists = prev.some((s) => s.id === saved.id);
      if (exists) {
        showToast(`Sermão "${saved.title}" atualizado com sucesso.`);
        return prev.map((s) => (s.id === saved.id ? saved : s));
      } else {
        showToast(`Novo sermão "${saved.title}" criado com sucesso.`);
        return [saved, ...prev];
      }
    });
  };

  const handleDuplicateSermon = (original: ChurchSermon) => {
    const baseSlug = `${original.slug}-copia`;
    const uniqueSlug = ensureUniqueSermonSlug(baseSlug, sermonsList);

    const now = new Date().toISOString();
    const duplicate: ChurchSermon = {
      ...original,
      id: `sermon_${Date.now()}`,
      title: `${original.title} (Cópia)`,
      slug: uniqueSlug,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
    };

    setSermonsList((prev) => [duplicate, ...prev]);
    showToast(`Cópia criada em rascunho: "${duplicate.title}".`);
  };

  const handleDeleteSermon = (target: ChurchSermon) => {
    setSermonsList((prev) => prev.filter((s) => s.id !== target.id));
    showToast(`Sermão "${target.title}" excluído da sessão.`);
  };

  const handleStatusChange = (target: ChurchSermon, newStatus: SermonStatus) => {
    setSermonsList((prev) =>
      prev.map((s) =>
        s.id === target.id
          ? { ...s, status: newStatus, updatedAt: new Date().toISOString() }
          : s
      )
    );
    const label =
      newStatus === 'published'
        ? 'publicado'
        : newStatus === 'draft'
        ? 'movido para rascunho'
        : 'arquivado';
    showToast(`Sermão "${target.title}" ${label}.`);
  };

  return (
    <div id="sermons-management-view" className="space-y-6">
      {/* Barra de Ferramentas, Métricas e Filtros */}
      <SermonsToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNewSermon={() => {
          setEditingSermon(null);
          setIsEditorOpen(true);
        }}
        stats={stats}
        filteredCount={sortedSermons.length}
      />

      {/* Conteúdo: Tabela ou Grid de Cartões */}
      {sortedSermons.length > 0 ? (
        viewMode === 'table' ? (
          <SermonList
            sermonsList={sortedSermons}
            onPreview={(sermon) => {
              setPreviewingSermon(sermon);
              setIsPreviewOpen(true);
            }}
            onEdit={(sermon) => {
              setEditingSermon(sermon);
              setIsEditorOpen(true);
            }}
            onDuplicate={handleDuplicateSermon}
            onDelete={(sermon) => {
              setDeletingSermon(sermon);
              setIsDeleteOpen(true);
            }}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedSermons.map((sermon) => (
              <SermonCard
                key={sermon.id}
                sermon={sermon}
                onPreview={(s) => {
                  setPreviewingSermon(s);
                  setIsPreviewOpen(true);
                }}
                onEdit={(s) => {
                  setEditingSermon(s);
                  setIsEditorOpen(true);
                }}
                onDuplicate={handleDuplicateSermon}
                onDelete={(s) => {
                  setDeletingSermon(s);
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
            <Video className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-900">
            Nenhum sermão encontrado
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
            {searchTerm || statusFilter !== 'all'
              ? 'Nenhum resultado corresponde aos filtros aplicados. Tente ajustar os termos de busca.'
              : 'Nenhum sermão cadastrado no momento. Adicione a primeira mensagem da congregação.'}
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
                  setEditingSermon(null);
                  setIsEditorOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Novo sermão</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal de Criação / Edição */}
      <SermonEditorModal
        sermon={editingSermon}
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingSermon(null);
        }}
        onSave={handleSaveSermon}
        existingSermons={sermonsList}
      />

      {/* Modal de Pré-visualização */}
      <SermonPreviewModal
        sermon={previewingSermon}
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setPreviewingSermon(null);
        }}
        onEdit={(sermon) => {
          setIsPreviewOpen(false);
          setEditingSermon(sermon);
          setIsEditorOpen(true);
        }}
      />

      {/* Modal de Confirmação de Exclusão */}
      <DeleteSermonConfirmModal
        sermon={deletingSermon}
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingSermon(null);
        }}
        onConfirm={handleDeleteSermon}
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
