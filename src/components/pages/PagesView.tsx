import React, { useState, useMemo, useEffect } from 'react';
import {
  FileText,
  Plus,
  Home,
  CheckCircle2,
  Sparkles,
  Search,
  Filter,
  ArrowUpDown,
  Layers,
  Check,
} from 'lucide-react';
import { Page, PageStatus } from '../../types';
import { INITIAL_DEMO_PAGES } from './demoPagesData';
import { cmsRepository } from '../../core/persistence';
import { PageFilters, StatusFilterOption, TypeFilterOption } from './PageFilters';
import { PageRow } from './PageRow';
import { NewPageModal } from './NewPageModal';
import { PagePreviewModal } from './PagePreviewModal';
import { PageEditorTransitionModal } from './PageEditorTransitionModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { PageEditorView } from '../editor/PageEditorView';

export const PagesView: React.FC = () => {
  // Estado das páginas persistido canonicamente
  const [pages, setPages] = useState<Page[]>(() => cmsRepository.loadPages());

  // Sincroniza atomicamente no armazenamento local a cada alteração
  useEffect(() => {
    cmsRepository.savePages(pages);
  }, [pages]);

  // Estados de busca e filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterOption>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilterOption>('all');

  // Estados de Modais
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [previewPage, setPreviewPage] = useState<Page | null>(null);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [activeVisualEditorPage, setActiveVisualEditorPage] = useState<Page | null>(null);
  const [deletingPage, setDeletingPage] = useState<Page | null>(null);

  // Notificação de feedback local
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showNotification = (message: string) => {
    setFeedbackToast(message);
    setTimeout(() => {
      setFeedbackToast(null);
    }, 3500);
  };

  // Contadores globais das páginas
  const counts = useMemo(() => {
    return {
      total: pages.length,
      published: pages.filter((p) => p.status === 'published').length,
      draft: pages.filter((p) => p.status === 'draft').length,
      archived: pages.filter((p) => p.status === 'archived').length,
      home: pages.filter((p) => p.isHome).length,
      internal: pages.filter((p) => !p.isHome).length,
    };
  }, [pages]);

  // Páginas filtradas
  const filteredPages = useMemo(() => {
    return pages.filter((page) => {
      // Filtro de busca por título ou slug
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = page.title.toLowerCase().includes(query);
        const matchesSlug = page.slug.toLowerCase().includes(query);
        if (!matchesTitle && !matchesSlug) return false;
      }

      // Filtro de status
      if (statusFilter !== 'all' && page.status !== statusFilter) {
        return false;
      }

      // Filtro de tipo (home vs interna)
      if (typeFilter === 'home' && !page.isHome) return false;
      if (typeFilter === 'internal' && page.isHome) return false;

      return true;
    });
  }, [pages, searchQuery, statusFilter, typeFilter]);

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'all' || typeFilter !== 'all';

  // 1. Criar nova página
  const handleCreatePage = (newPageData: {
    title: string;
    slug: string;
    isHome: boolean;
    templateType: string;
    metaDescription: string;
  }) => {
    const newId = `page_${Date.now()}`;
    const newPage: Page = {
      id: newId,
      tenantId: 'ib_central',
      title: newPageData.title,
      slug: newPageData.isHome ? '/' : newPageData.slug,
      status: 'draft',
      order: pages.length + 1,
      isHome: newPageData.isHome,
      createdAt: new Date().toISOString(),
      updatedAt: 'Agora mesmo',
      seo: {
        metaTitle: `${newPageData.title} — Igreja Batista Central`,
        metaDescription: newPageData.metaDescription,
      },
      sections:
        newPageData.templateType === 'standard'
          ? [
              { id: `sec_${Date.now()}_1`, title: 'Cabeçalho e Introdução', order: 1, isVisible: true, blocks: [] },
              { id: `sec_${Date.now()}_2`, title: 'Conteúdo Principal', order: 2, isVisible: true, blocks: [] },
              { id: `sec_${Date.now()}_3`, title: 'Chamada para Ação', order: 3, isVisible: true, blocks: [] },
            ]
          : newPageData.templateType === 'ministry'
          ? [
              { id: `sec_${Date.now()}_1`, title: 'Visão e Liderança', order: 1, isVisible: true, blocks: [] },
              { id: `sec_${Date.now()}_2`, title: 'Atividades e Reuniões', order: 2, isVisible: true, blocks: [] },
              { id: `sec_${Date.now()}_3`, title: 'Galeria de Fotos', order: 3, isVisible: true, blocks: [] },
              { id: `sec_${Date.now()}_4`, title: 'Contato / Participe', order: 4, isVisible: true, blocks: [] },
            ]
          : [{ id: `sec_${Date.now()}_1`, title: 'Seção Inicial', order: 1, isVisible: true, blocks: [] }],
    };

    setPages((prev) => {
      // Se marcada como home, desmarca qualquer outra
      if (newPageData.isHome) {
        return [newPage, ...prev.map((p) => (p.isHome ? { ...p, isHome: false } : p))];
      }
      return [...prev, newPage];
    });

    showNotification(`Página "${newPage.title}" criada com sucesso como rascunho.`);
  };

  // 2. Definir como página inicial
  const handleSetAsHome = (pageId: string) => {
    setPages((prev) =>
      prev.map((p) => {
        if (p.id === pageId) {
          return { ...p, isHome: true, slug: '/' };
        }
        if (p.isHome) {
          // A página que era home recebe um slug alternativo descritivo
          return {
            ...p,
            isHome: false,
            slug: p.slug === '/' ? '/inicio-anterior' : p.slug,
          };
        }
        return p;
      })
    );
    const target = pages.find((p) => p.id === pageId);
    showNotification(`"${target?.title || 'Página'}" foi definida como a Página Inicial (Home).`);
  };

  // 3. Alterar status
  const handleChangeStatus = (pageId: string, newStatus: PageStatus) => {
    setPages((prev) =>
      prev.map((p) => {
        if (p.id === pageId) {
          return {
            ...p,
            status: newStatus,
            updatedAt: 'Agora mesmo',
            publishedAt: newStatus === 'published' ? new Date().toISOString() : p.publishedAt,
          };
        }
        return p;
      })
    );
    const statusLabels: Record<PageStatus, string> = {
      published: 'publicada',
      draft: 'alterada para rascunho',
      archived: 'arquivada',
    };
    showNotification(`Página foi ${statusLabels[newStatus]} com sucesso.`);
  };

  // 4. Duplicar página
  const handleDuplicatePage = (sourcePage: Page) => {
    const duplicated: Page = {
      ...sourcePage,
      id: `page_${Date.now()}`,
      title: `${sourcePage.title} (Cópia)`,
      slug: `${sourcePage.slug === '/' ? '/inicio' : sourcePage.slug}-copia`,
      status: 'draft',
      isHome: false,
      order: pages.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: 'Agora mesmo',
      sections: sourcePage.sections.map((sec, i) => ({
        ...sec,
        id: `sec_dup_${Date.now()}_${i}`,
      })),
    };

    setPages((prev) => [...prev, duplicated]);
    showNotification(`Página duplicada como "${duplicated.title}".`);
  };

  // 5. Excluir página
  const handleDeleteConfirm = (pageId: string) => {
    const pageToDelete = pages.find((p) => p.id === pageId);
    setPages((prev) => prev.filter((p) => p.id !== pageId));
    showNotification(`Página "${pageToDelete?.title}" removida com sucesso.`);
  };

  // 6. Atualizar configurações salvas no modal de edição
  const handleSavePageSettings = (updated: {
    id: string;
    title: string;
    slug: string;
    status: PageStatus;
    isHome: boolean;
    seoTitle: string;
    seoDescription: string;
  }) => {
    setPages((prev) =>
      prev.map((p) => {
        if (p.id === updated.id) {
          return {
            ...p,
            title: updated.title,
            slug: updated.isHome ? '/' : updated.slug,
            status: updated.status,
            isHome: updated.isHome,
            updatedAt: 'Agora mesmo',
            seo: {
              ...p.seo,
              metaTitle: updated.seoTitle || `${updated.title} — Igreja Batista Central`,
              metaDescription: updated.seoDescription || p.seo?.metaDescription || '',
            },
          };
        }
        if (updated.isHome && p.isHome && p.id !== updated.id) {
          return { ...p, isHome: false };
        }
        return p;
      })
    );
    showNotification('Configurações da página salvas com sucesso.');
  };

  // 7. Mover ordem
  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    setPages((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index >= pages.length - 1) return;
    setPages((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const homePage = pages.find((p) => p.isHome);

  const handleSaveFromVisualEditor = (updatedPage: Page) => {
    setPages((prev) =>
      prev.map((p) => (p.id === updatedPage.id ? updatedPage : p))
    );
    showNotification(`Página "${updatedPage.title}" salva no editor visual.`);
  };

  // Se o Editor Visual estiver ativo, renderiza o PageEditorView em tela dedicada
  if (activeVisualEditorPage) {
    return (
      <PageEditorView
        page={activeVisualEditorPage}
        onBack={() => setActiveVisualEditorPage(null)}
        onSavePage={(updated) => {
          handleSaveFromVisualEditor(updated);
          setActiveVisualEditorPage(updated);
        }}
      />
    );
  }

  return (
    <div id="pages-management-view" className="space-y-6">
      {/* Toast de Notificação */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 border border-stone-800 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* 1. Cabeçalho da Seção de Páginas */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              Páginas
            </h1>
            <span className="text-xs font-semibold text-stone-600 bg-stone-200/80 px-2 py-0.5 rounded-full border border-stone-300/60">
              {pages.length} páginas
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Gerencie as páginas e a estrutura principal do seu site.
          </p>
        </div>

        <button
          id="btn-create-page-primary"
          type="button"
          onClick={() => setIsNewModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-stone-950 bg-amber-500 hover:bg-amber-600 px-4 py-2.5 rounded-xl shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4 text-stone-950" />
          <span>+ Nova página</span>
        </button>
      </div>

      {/* 2. Barra de Filtros e Pesquisa */}
      <PageFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        counts={counts}
        onResetFilters={() => {
          setSearchQuery('');
          setStatusFilter('all');
          setTypeFilter('all');
        }}
        hasActiveFilters={hasActiveFilters}
      />

      {/* 3. Tabela / Lista de Páginas */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        {filteredPages.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="hidden md:table-row bg-stone-50/90 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Página & Rota</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Estrutura</th>
                  <th className="py-3 px-4">Última Atualização</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredPages.map((page, idx) => (
                  <PageRow
                    key={page.id}
                    page={page}
                    index={idx}
                    totalCount={filteredPages.length}
                    onEdit={(p) => setActiveVisualEditorPage(p)}
                    onPreview={(p) => setPreviewPage(p)}
                    onDuplicate={handleDuplicatePage}
                    onSetAsHome={handleSetAsHome}
                    onChangeStatus={handleChangeStatus}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                    onDelete={(p) => setDeletingPage(p)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Estado Vazio */
          <div className="p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto border border-stone-200">
              {hasActiveFilters ? (
                <Search className="w-6 h-6" />
              ) : (
                <FileText className="w-6 h-6" />
              )}
            </div>

            <div className="max-w-xs mx-auto">
              <h3 className="text-sm font-bold text-stone-900">
                {hasActiveFilters
                  ? 'Nenhuma página encontrada'
                  : 'Ainda não existem páginas'}
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                {hasActiveFilters
                  ? 'Nenhum resultado corresponde aos termos da pesquisa ou filtros selecionados.'
                  : 'Crie sua primeira página para começar a construir o site da sua igreja.'}
              </p>
            </div>

            <div className="pt-2">
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setTypeFilter('all');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Limpar todos os filtros
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(true)}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-stone-950 bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-xl shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Nova página</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Barra de Resumo e Rodapé da Listagem */}
        <div className="p-3.5 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-500">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span>
              Exibindo <strong>{filteredPages.length}</strong> de <strong>{pages.length}</strong> páginas
            </span>
            <span>•</span>
            <span className="text-emerald-700 font-medium">
              {counts.published} publicadas
            </span>
            <span>•</span>
            <span className="text-amber-700 font-medium">
              {counts.draft} rascunhos
            </span>
            <span>•</span>
            <span className="text-stone-600 font-medium">
              {counts.archived} arquivadas
            </span>
          </div>

          {homePage && (
            <div className="flex items-center gap-1.5 text-stone-600">
              <Home className="w-3.5 h-3.5 text-amber-600" />
              <span>
                Página Inicial ativa: <strong className="text-stone-800">{homePage.title}</strong> ({homePage.slug})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Modais da Gestão de Páginas */}
      <NewPageModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onCreatePage={handleCreatePage}
        existingSlugs={pages.map((p) => p.slug)}
      />

      <PagePreviewModal
        page={previewPage}
        isOpen={!!previewPage}
        onClose={() => setPreviewPage(null)}
        onOpenEditor={(p) => {
          setPreviewPage(null);
          setActiveVisualEditorPage(p);
        }}
      />

      <PageEditorTransitionModal
        page={editingPage}
        isOpen={!!editingPage}
        onClose={() => setEditingPage(null)}
        onSavePageSettings={handleSavePageSettings}
        onOpenVisualEditor={(p) => {
          setEditingPage(null);
          setActiveVisualEditorPage(p);
        }}
      />

      <DeleteConfirmModal
        page={deletingPage}
        isOpen={!!deletingPage}
        onClose={() => setDeletingPage(null)}
        onConfirmDelete={handleDeleteConfirm}
      />
    </div>
  );
};
