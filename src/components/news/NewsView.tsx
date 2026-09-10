import React, { useState, useMemo } from 'react';
import { Newspaper, Plus, RefreshCw, CheckCircle2 } from 'lucide-react';
import { ChurchNews, NewsStatus } from '../../types';
import { INITIAL_DEMO_NEWS } from './demoNewsData';
import {
  NewsToolbar,
  NewsStatusFilter,
  NewsSortOption,
  NewsViewMode,
} from './NewsToolbar';
import { NewsList } from './NewsList';
import { NewsCard } from './NewsCard';
import { NewsEditorModal } from './NewsEditorModal';
import { NewsPreviewModal } from './NewsPreviewModal';
import { DeleteNewsConfirmModal } from './DeleteNewsConfirmModal';
import { ensureUniqueNewsSlug } from './newsUtils';

export const NewsView: React.FC = () => {
  // Estado principal em memória
  const [newsList, setNewsList] = useState<ChurchNews[]>(INITIAL_DEMO_NEWS);

  // Estados de controle e filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<NewsStatusFilter>('all');
  const [sortBy, setSortBy] = useState<NewsSortOption>('recent');
  const [viewMode, setViewMode] = useState<NewsViewMode>('table');

  // Estados dos Modais
  const [editingNews, setEditingNews] = useState<ChurchNews | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const [previewingNews, setPreviewingNews] = useState<ChurchNews | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [deletingNews, setDeletingNews] = useState<ChurchNews | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Notificação toast temporária
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Contadores globais
  const stats = useMemo(() => {
    const total = newsList.length;
    let published = 0;
    let draft = 0;
    let archived = 0;

    for (const item of newsList) {
      if (item.status === 'published') published++;
      else if (item.status === 'draft') draft++;
      else if (item.status === 'archived') archived++;
    }

    return { total, published, draft, archived };
  }, [newsList]);

  // Filtragem e Busca
  const filteredNews = useMemo(() => {
    return newsList.filter((item) => {
      // Filtro por Status
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }

      // Filtro por Busca (title, slug, summary, author)
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchSlug = item.slug.toLowerCase().includes(query);
        const matchSummary = item.summary
          ? item.summary.toLowerCase().includes(query)
          : false;
        const matchAuthor = item.author
          ? item.author.toLowerCase().includes(query)
          : false;

        if (!matchTitle && !matchSlug && !matchSummary && !matchAuthor) {
          return false;
        }
      }

      return true;
    });
  }, [newsList, statusFilter, searchTerm]);

  // Ordenação
  const sortedNews = useMemo(() => {
    const items = [...filteredNews];

    switch (sortBy) {
      case 'recent':
        return items.sort((a, b) => {
          const dateA = a.publishedAt || a.createdAt;
          const dateB = b.publishedAt || b.createdAt;
          return dateB.localeCompare(dateA);
        });
      case 'oldest':
        return items.sort((a, b) => {
          const dateA = a.publishedAt || a.createdAt;
          const dateB = b.publishedAt || b.createdAt;
          return dateA.localeCompare(dateB);
        });
      case 'title_asc':
        return items.sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));
      case 'title_desc':
        return items.sort((a, b) => b.title.localeCompare(a.title, 'pt-BR'));
      default:
        return items;
    }
  }, [filteredNews, sortBy]);

  // Operações de CRUD em memória
  const handleSaveNews = (saved: ChurchNews) => {
    setNewsList((prev) => {
      const exists = prev.some((n) => n.id === saved.id);
      if (exists) {
        showToast(`Notícia "${saved.title}" atualizada com sucesso.`);
        return prev.map((n) => (n.id === saved.id ? saved : n));
      } else {
        showToast(`Nova notícia "${saved.title}" criada com sucesso.`);
        return [saved, ...prev];
      }
    });
  };

  const handleDuplicateNews = (original: ChurchNews) => {
    const baseSlug = `${original.slug}-copia`;
    const uniqueSlug = ensureUniqueNewsSlug(baseSlug, newsList);

    const duplicate: ChurchNews = {
      ...original,
      id: `news_${Date.now()}`,
      title: `${original.title} (Cópia)`,
      slug: uniqueSlug,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setNewsList((prev) => [duplicate, ...prev]);
    showToast(`Notícia duplicada como rascunho com o slug /${uniqueSlug}.`);
  };

  const handleDeleteNews = (target: ChurchNews) => {
    setNewsList((prev) => prev.filter((n) => n.id !== target.id));
    showToast(`Notícia "${target.title}" removida.`);
  };

  const handleStatusChange = (target: ChurchNews, newStatus: NewsStatus) => {
    setNewsList((prev) =>
      prev.map((n) => (n.id === target.id ? { ...n, status: newStatus } : n))
    );
    showToast(`Status alterado para "${newStatus}".`);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  return (
    <div id="news-management-view" className="space-y-6 animate-in fade-in duration-150">
      {/* Toast de Notificação */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-stone-800 flex items-center gap-2 animate-in slide-in-from-bottom-4 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Barra de Ferramentas com Métricas e Filtros */}
      <NewsToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNewNews={() => {
          setEditingNews(null);
          setIsEditorOpen(true);
        }}
        stats={stats}
        filteredCount={sortedNews.length}
      />

      {/* Conteúdo Principal: Tabela ou Cards */}
      {sortedNews.length > 0 ? (
        viewMode === 'table' ? (
          <NewsList
            newsList={sortedNews}
            onPreview={(item) => {
              setPreviewingNews(item);
              setIsPreviewOpen(true);
            }}
            onEdit={(item) => {
              setEditingNews(item);
              setIsEditorOpen(true);
            }}
            onDuplicate={handleDuplicateNews}
            onDelete={(item) => {
              setDeletingNews(item);
              setIsDeleteOpen(true);
            }}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sortedNews.map((item) => (
              <NewsCard
                key={item.id}
                news={item}
                onPreview={(n) => {
                  setPreviewingNews(n);
                  setIsPreviewOpen(true);
                }}
                onEdit={(n) => {
                  setEditingNews(n);
                  setIsEditorOpen(true);
                }}
                onDuplicate={handleDuplicateNews}
                onDelete={(n) => {
                  setDeletingNews(n);
                  setIsDeleteOpen(true);
                }}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )
      ) : (
        /* Empty State */
        <div
          id="news-empty-state"
          className="bg-white rounded-2xl border border-dashed border-stone-300 p-8 sm:p-12 text-center space-y-4 shadow-xs"
        >
          <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
            <Newspaper className="w-7 h-7" />
          </div>

          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-stone-900">
              Nenhuma notícia encontrada
            </h3>
            <p className="text-xs sm:text-sm text-stone-500">
              Tente alterar os filtros ou criar uma nova notícia para o site da sua igreja.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {(searchTerm || statusFilter !== 'all') && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl text-xs font-semibold hover:bg-stone-200 transition-colors cursor-pointer"
              >
                Limpar filtros
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setEditingNews(null);
                setIsEditorOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nova notícia</span>
            </button>
          </div>
        </div>
      )}

      {/* Modais da Gestão de Notícias */}
      <NewsEditorModal
        news={editingNews}
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingNews(null);
        }}
        onSave={handleSaveNews}
        existingNews={newsList}
      />

      <NewsPreviewModal
        news={previewingNews}
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setPreviewingNews(null);
        }}
        onEdit={(item) => {
          setIsPreviewOpen(false);
          setEditingNews(item);
          setIsEditorOpen(true);
        }}
      />

      <DeleteNewsConfirmModal
        news={deletingNews}
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingNews(null);
        }}
        onConfirm={handleDeleteNews}
      />
    </div>
  );
};
