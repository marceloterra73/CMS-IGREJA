import React, { useEffect } from 'react';
import { AlertTriangle, FileText, ArrowLeft } from 'lucide-react';
import {
  ChurchDonationInfo,
  ChurchLiveStreamInfo,
  ChurchSchedule,
  InstitutionalContent,
  Page,
  VisualTheme,
} from '../../types';
import { PublicSectionRenderer } from './PublicSectionRenderer';

interface PublicPageRendererProps {
  page: Page | null;
  theme?: VisualTheme;
  institutional?: InstitutionalContent;
  schedules?: ChurchSchedule[];
  donationInfo?: ChurchDonationInfo;
  liveStreamInfo?: ChurchLiveStreamInfo;
  onNavigatePage?: (pageIdOrSlug: string) => void;
  allowDraftPreview?: boolean;
}

/**
 * Renderizador canônico de Páginas do CMS (Fase 50).
 *
 * Princípio Arquitetural:
 * PÁGINAS -> SEÇÕES -> BLOCOS -> CONFIGURAÇÕES -> DADOS
 *
 * Responsabilidades:
 * - Validar existência da página.
 * - Respeitar o ciclo de vida e status de publicação (Fase 32).
 * - Sincronizar SEO básico (título da página).
 * - Iterar ordenadamente as seções visíveis da página.
 */
export const PublicPageRenderer: React.FC<PublicPageRendererProps> = ({
  page,
  theme,
  institutional,
  schedules,
  donationInfo,
  liveStreamInfo,
  onNavigatePage,
  allowDraftPreview = true,
}) => {
  // Sincronização de título no documento (SEO canônico)
  useEffect(() => {
    if (page) {
      const churchName = institutional?.profile?.name || 'Igreja';
      const pageTitle = page.seo?.metaTitle || page.title;
      document.title = `${pageTitle} — ${churchName}`;
    }
  }, [page, institutional]);

  // Caso 1: Página não encontrada (404)
  if (!page) {
    return (
      <div className="py-24 px-4 text-center max-w-lg mx-auto space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-500 mx-auto flex items-center justify-center">
          <FileText className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-stone-900 font-serif">
          Página não encontrada
        </h2>
        <p className="text-xs text-stone-500 leading-relaxed">
          A rota solicitada não corresponde a nenhuma página cadastrada ou ativa no CMS desta igreja.
        </p>
        {onNavigatePage && (
          <button
            type="button"
            onClick={() => onNavigatePage('page_home')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-800 text-white text-xs font-semibold hover:bg-amber-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar para a Página Inicial</span>
          </button>
        )}
      </div>
    );
  }

  // Caso 2: Status não publicado (a não ser que seja preview permitido)
  const isPublished = page.status === 'published';
  if (!isPublished && !allowDraftPreview) {
    return (
      <div className="py-24 px-4 text-center max-w-lg mx-auto space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 mx-auto flex items-center justify-center border border-amber-200">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-stone-900 font-serif">
          Página não publicada ({page.status})
        </h2>
        <p className="text-xs text-stone-500 leading-relaxed">
          Esta página está com status &quot;{page.status}&quot; no CMS e não está visível para visitantes públicos no momento.
        </p>
        {onNavigatePage && (
          <button
            type="button"
            onClick={() => onNavigatePage('page_home')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Ir para a Página Inicial</span>
          </button>
        )}
      </div>
    );
  }

  // Filtragem e ordenação estrita das seções canônicas
  const visibleSections = [...(page.sections || [])]
    .filter((sec) => sec && sec.isVisible !== false)
    .sort((a, b) => a.order - b.order);

  return (
    <main
      id={`page-${page.id}`}
      data-page-id={page.id}
      data-page-slug={page.slug}
      className="w-full flex-1"
    >
      {/* Aviso discreto quando visualizando rascunho em modo preview */}
      {!isPublished && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-center text-xs text-amber-900 font-medium">
          Aviso: Visualizando rascunho da página &quot;{page.title}&quot; (Status: {page.status})
        </div>
      )}

      {visibleSections.length === 0 ? (
        <div className="py-24 px-4 text-center text-xs text-stone-400">
          Esta página não possui seções visíveis cadastradas no CMS.
        </div>
      ) : (
        visibleSections.map((section) => (
          <PublicSectionRenderer
            key={section.id}
            section={section}
            theme={theme}
            institutional={institutional}
            schedules={schedules}
            donationInfo={donationInfo}
            liveStreamInfo={liveStreamInfo}
            onNavigatePage={onNavigatePage}
          />
        ))
      )}
    </main>
  );
};
