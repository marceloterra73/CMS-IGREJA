import React, { useState } from 'react';
import {
  X,
  Pencil,
  FileText,
  Layers,
  Sparkles,
  Check,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  Home,
} from 'lucide-react';
import { Page, PageStatus } from '../../types';
import { PageStatusBadge } from './PageStatusBadge';

interface PageEditorTransitionModalProps {
  page: Page | null;
  isOpen: boolean;
  onClose: () => void;
  onSavePageSettings: (updatedPage: {
    id: string;
    title: string;
    slug: string;
    status: PageStatus;
    isHome: boolean;
    seoTitle: string;
    seoDescription: string;
  }) => void;
  onOpenVisualEditor?: (page: Page) => void;
}

export const PageEditorTransitionModal: React.FC<PageEditorTransitionModalProps> = ({
  page,
  isOpen,
  onClose,
  onSavePageSettings,
  onOpenVisualEditor,
}) => {
  if (!isOpen || !page) return null;

  const [title, setTitle] = useState(page.title);
  const [slug, setSlug] = useState(page.slug);
  const [status, setStatus] = useState<PageStatus>(page.status);
  const [isHome, setIsHome] = useState(page.isHome || false);
  const [seoTitle, setSeoTitle] = useState(page.seo?.metaTitle || '');
  const [seoDescription, setSeoDescription] = useState(page.seo?.metaDescription || '');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePageSettings({
      id: page.id,
      title: title.trim() || page.title,
      slug: isHome ? '/' : slug.trim() || page.slug,
      status,
      isHome,
      seoTitle: seoTitle.trim(),
      seoDescription: seoDescription.trim(),
    });
    setSuccessMessage('Configurações da página atualizadas com sucesso!');
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 900);
  };

  return (
    <div
      id="page-editor-transition-backdrop"
      className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-all"
    >
      <div
        id="page-editor-transition-card"
        className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-stone-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header do Modal */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <Pencil className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-stone-900 truncate">
                  Configurações da Página: {page.title}
                </h3>
              </div>
              <p className="text-xs text-stone-500">
                Gerencie metadados e rota antes da edição visual de blocos
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notificação sobre Fase 27 */}
        <div className="mx-6 mt-5 p-3.5 bg-amber-50/80 rounded-xl border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-amber-950">
              Transição Arquitetural: Fase 26 ➔ Fase 27
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              O editor visual interno de seções e blocos (árvore <code>Page ➔ sections[] ➔ blocks[]</code>) pertence à <strong>Fase 27</strong>. Nesta tela da Fase 26 você pode gerenciar os metadados, status e rota da página.
            </p>
          </div>
        </div>

        {successMessage && (
          <div className="mx-6 mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Formulário de Configuração Básica */}
        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs overflow-y-auto max-h-[60vh]">
          {/* Título */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-stone-900">
              Título da Página
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-xs sm:text-sm"
            />
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-stone-900">
              Caminho / Slug (URL)
            </label>
            <input
              type="text"
              value={slug}
              disabled={isHome}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 disabled:bg-stone-100 disabled:text-stone-500"
            />
          </div>

          {/* Status e Página Inicial */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <label className="block font-semibold text-stone-900">
                Status de Publicação
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PageStatus)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                <option value="published">Publicada (Online)</option>
                <option value="draft">Rascunho (Privada)</option>
                <option value="archived">Arquivada</option>
              </select>
            </div>

            <div className="space-y-1.5 flex flex-col justify-end">
              <label className="flex items-center gap-2 p-2 bg-stone-50 border border-stone-200 rounded-lg cursor-pointer hover:bg-stone-100/70 transition-colors">
                <input
                  type="checkbox"
                  checked={isHome}
                  onChange={(e) => {
                    setIsHome(e.target.checked);
                    if (e.target.checked) setSlug('/');
                  }}
                  className="rounded border-stone-300 text-amber-600 focus:ring-amber-500/20 cursor-pointer"
                />
                <span className="font-semibold text-stone-800 flex items-center gap-1">
                  <Home className="w-3.5 h-3.5 text-amber-600" />
                  <span>Página Inicial</span>
                </span>
              </label>
            </div>
          </div>

          {/* SEO Básico */}
          <div className="space-y-1.5 pt-2 border-t border-stone-100">
            <label className="block font-semibold text-stone-900">
              Título SEO (Meta Title)
            </label>
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder={`${title} — Igreja Batista Central`}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block font-semibold text-stone-900">
              Descrição SEO (Meta Description)
            </label>
            <textarea
              rows={2}
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="Descrição curta que aparece nas buscas do Google..."
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
            />
          </div>

          {/* Resumo de Seções Existentes & Editor Visual */}
          <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-stone-900 font-bold text-xs">
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                <span>Editor Visual de Blocos</span>
                <span className="text-[10px] text-amber-800 bg-amber-200/80 px-1.5 py-0.5 rounded font-bold uppercase">
                  Fase 27
                </span>
              </div>
              <p className="text-[11px] text-stone-600 mt-0.5">
                Esta página possui <strong>{page.sections?.length || 0} seções</strong> vinculadas prontas para edição visual.
              </p>
            </div>
            {onOpenVisualEditor && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenVisualEditor(page);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold text-xs transition-colors shadow-xs shrink-0"
              >
                <span>Abrir Editor Visual</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Ações */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg font-semibold text-stone-950 bg-amber-500 hover:bg-amber-600 shadow-xs transition-colors"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
