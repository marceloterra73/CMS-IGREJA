import React from 'react';
import { X, Globe, Eye, Home, Layers, Search, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import { Page } from '../../types';
import { PageStatusBadge } from './PageStatusBadge';

interface PagePreviewModalProps {
  page: Page | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenEditor: (page: Page) => void;
}

export const PagePreviewModal: React.FC<PagePreviewModalProps> = ({
  page,
  isOpen,
  onClose,
  onOpenEditor,
}) => {
  if (!isOpen || !page) return null;

  return (
    <div
      id="page-preview-modal-backdrop"
      className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-all"
    >
      <div
        id="page-preview-modal-card"
        className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-stone-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header da Prévia */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-stone-900 truncate max-w-xs">
                  {page.title}
                </h3>
                {page.isHome && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    <Home className="w-3 h-3 text-amber-700" />
                    <span>Home</span>
                  </span>
                )}
                <PageStatusBadge status={page.status} size="sm" />
              </div>
              <p className="text-xs font-mono text-stone-500">
                https://igrejabatistacentral.com.br{page.slug}
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

        {/* Conteúdo da Prévia */}
        <div className="p-6 space-y-5 text-xs overflow-y-auto max-h-[75vh]">
          {/* Simulação do Snippet do Google / SEO */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
              <span className="flex items-center gap-1 font-semibold text-stone-700">
                <Search className="w-3.5 h-3.5 text-stone-500" />
                Prévia nos Motores de Busca (Google SEO)
              </span>
              <span>Snippet público</span>
            </div>
            <div className="text-xs text-stone-600 font-mono">
              https://igrejabatistacentral.com.br{page.slug}
            </div>
            <div className="text-sm font-semibold text-blue-800 hover:underline cursor-pointer">
              {page.seo?.metaTitle || `${page.title} — Igreja Batista Central`}
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              {page.seo?.metaDescription ||
                'Acompanhe as atividades, cultos e notícias da Igreja Batista Central.'}
            </p>
          </div>

          {/* Árvore Canônica de Estrutura da Página */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 font-bold text-stone-900">
                <Layers className="w-4 h-4 text-amber-600" />
                <span>Estrutura Canônica ({page.sections?.length || 0} seções)</span>
              </div>
              <span className="text-[11px] text-stone-400">
                Page └── sections[] └── blocks[]
              </span>
            </div>

            <div className="space-y-2">
              {page.sections && page.sections.length > 0 ? (
                page.sections.map((sec, idx) => (
                  <div
                    key={sec.id || idx}
                    className="p-3 bg-stone-50/80 rounded-lg border border-stone-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-700 text-[10px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-semibold text-stone-900">
                          {sec.title || `Seção ${idx + 1}`}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {sec.blocks?.length || 0} blocos configurados
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-medium text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200">
                      ID: {sec.id}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-stone-50 rounded-lg text-center text-stone-500 text-xs">
                  Esta página ainda não possui seções cadastradas.
                </div>
              )}
            </div>
          </div>

          {/* Aviso sobre a Fase 27 */}
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-2.5 text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>Prévia Estrutural (Fase 26):</strong> Esta visualização demonstra a composição canônica da página. O editor visual com renderização interativa e inspeção de blocos será implementado na <strong>Fase 27</strong>.
            </div>
          </div>
        </div>

        {/* Rodapé do Modal */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            Última atualização: {page.updatedAt}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition-colors"
            >
              Fechar
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenEditor(page);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-stone-950 bg-amber-500 hover:bg-amber-600 shadow-xs transition-colors"
            >
              <span>Abrir no Editor</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
