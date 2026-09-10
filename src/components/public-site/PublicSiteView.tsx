import React, { useState } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  ArrowLeft,
  ExternalLink,
  Layers,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Page } from '../../types';
import { INITIAL_DEMO_PAGES } from '../pages/demoPagesData';
import { cmsRepository } from '../../core/persistence';
import { PublicSiteRenderer } from './PublicSiteRenderer';

interface PublicSiteViewProps {
  onBackToAdmin?: () => void;
  initialPageId?: string;
}

type ViewportMode = 'desktop' | 'tablet' | 'mobile';

/**
 * Visualizador de demonstração do Site Público (Fase 50).
 *
 * PROIBIÇÃO ARQUITETURAL:
 * - Não importa ferramentas de edição nem AdminShell.
 * - Fornece apenas uma barra de teste superior para alternar páginas e viewport.
 * - Comprova que o CMS é renderizado publicamente de forma canônica e responsiva.
 */
export const PublicSiteView: React.FC<PublicSiteViewProps> = ({
  onBackToAdmin,
  initialPageId = 'page_home',
}) => {
  const [currentPageId, setCurrentPageId] = useState<string>(initialPageId);
  const [viewport, setViewport] = useState<ViewportMode>('desktop');

  // Carrega páginas atualizadas do repositório canônico
  const pages = cmsRepository.loadPages();

  // Selecionar página atual a partir dos dados canônicos existentes
  const activePage =
    pages.find((p) => p.id === currentPageId || p.slug === currentPageId) ||
    pages[0] ||
    INITIAL_DEMO_PAGES[0];

  const handleNavigatePage = (pageIdOrSlug: string) => {
    const found = pages.find(
      (p) => p.id === pageIdOrSlug || p.slug === pageIdOrSlug
    );
    if (found) {
      setCurrentPageId(found.id);
    } else {
      setCurrentPageId(pageIdOrSlug);
    }
  };

  // Resolução de largura máxima pelo viewport selecionado
  const getViewportWidthClass = () => {
    switch (viewport) {
      case 'mobile':
        return 'max-w-[375px] shadow-2xl rounded-2xl border border-stone-300 my-4 overflow-hidden';
      case 'tablet':
        return 'max-w-[768px] shadow-2xl rounded-2xl border border-stone-300 my-4 overflow-hidden';
      case 'desktop':
      default:
        return 'w-full';
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
      {/* Barra de Simulação e Controle do Modo Público (Fase 50) */}
      <div className="sticky top-0 z-50 bg-stone-900 text-white px-4 py-2.5 shadow-md flex flex-wrap items-center justify-between gap-3 border-b border-stone-800">
        {/* Lado Esquerdo: Identificação da Fundação */}
        <div className="flex items-center gap-3">
          {onBackToAdmin && (
            <button
              type="button"
              onClick={onBackToAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors cursor-pointer"
              title="Retornar ao painel administrativo"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar ao Painel Admin</span>
            </button>
          )}

          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium text-[11px]">
              <CheckCircle2 className="w-3 h-3" />
              Site Público Ativo
            </span>
            <span className="text-stone-400 text-xs">
              Fundação do Renderer • Fase 50
            </span>
          </div>
        </div>

        {/* Centro: Seletor de Página */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-stone-400 text-[11px] hidden md:inline">
            Página:
          </span>
          <div className="flex items-center bg-stone-800 p-1 rounded-lg border border-stone-700">
            {INITIAL_DEMO_PAGES.map((page) => {
              const isSelected = activePage.id === page.id;
              return (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => setCurrentPageId(page.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-amber-600 text-white font-semibold'
                      : 'text-stone-300 hover:text-white hover:bg-stone-700'
                  }`}
                >
                  {page.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Lado Direito: Alternador de Viewport (Desktop / Tablet / Mobile) */}
        <div className="flex items-center gap-1 bg-stone-800 p-1 rounded-lg border border-stone-700">
          <button
            type="button"
            onClick={() => setViewport('desktop')}
            className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
              viewport === 'desktop'
                ? 'bg-stone-700 text-amber-400'
                : 'text-stone-400 hover:text-white'
            }`}
            title="Visualizar em Desktop (100%)"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewport('tablet')}
            className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
              viewport === 'tablet'
                ? 'bg-stone-700 text-amber-400'
                : 'text-stone-400 hover:text-white'
            }`}
            title="Visualizar em Tablet (768px)"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewport('mobile')}
            className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
              viewport === 'mobile'
                ? 'bg-stone-700 text-amber-400'
                : 'text-stone-400 hover:text-white'
            }`}
            title="Visualizar em Celular (375px)"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Frame de Renderização Pública */}
      <div className="flex-1 flex justify-center items-start overflow-x-auto">
        <div className={`w-full transition-all duration-300 ${getViewportWidthClass()}`}>
          <PublicSiteRenderer
            page={activePage}
            pages={pages}
            onNavigatePage={handleNavigatePage}
          />
        </div>
      </div>
    </div>
  );
};
