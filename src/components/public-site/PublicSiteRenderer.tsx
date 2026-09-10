import React, { useMemo } from 'react';
import {
  ChurchDonationInfo,
  ChurchLiveStreamInfo,
  ChurchSchedule,
  InstitutionalContent,
  NavigationMenu,
  Page,
  VisualTheme,
} from '../../types';
import { PublicSiteHeader } from './PublicSiteHeader';
import { PublicPageRenderer } from './PublicPageRenderer';
import { PublicSiteFooter } from './PublicSiteFooter';
import { INITIAL_DEMO_THEMES } from '../appearance/demoAppearanceData';
import { INITIAL_DEMO_INSTITUTIONAL } from '../settings/demoSettingsData';
import { INITIAL_DEMO_MENUS } from '../navigation/demoNavigationData';
import { INITIAL_DEMO_SCHEDULES } from '../schedules/demoSchedulesData';
import { INITIAL_DEMO_DONATION } from '../donations/demoDonationData';
import { INITIAL_DEMO_LIVESTREAM } from '../live-stream/demoLiveStreamData';
import { cmsRepository } from '../../core/persistence';

export interface PublicSiteRendererProps {
  page: Page | null;
  pages?: Page[];
  menu?: NavigationMenu;
  theme?: VisualTheme;
  institutional?: InstitutionalContent;
  schedules?: ChurchSchedule[];
  donationInfo?: ChurchDonationInfo;
  liveStreamInfo?: ChurchLiveStreamInfo;
  onNavigatePage?: (pageIdOrSlug: string) => void;
  allowDraftPreview?: boolean;
}

/**
 * Componente Raiz do Site Público / Public Site Renderer (Fase 50).
 *
 * Princípio Arquitetural:
 * PÁGINAS -> SEÇÕES -> BLOCOS -> CONFIGURAÇÕES -> DADOS
 *
 * Responsabilidades:
 * - Orquestrar a renderização do site público da igreja.
 * - Aplicar os tokens visuais canônicos do VisualTheme (Fase 43).
 * - Renderizar cabeçalho público institucional (Fase 9/31).
 * - Renderizar o resolutor de páginas canônicas (Fase 32).
 * - Renderizar rodapé público institucional (Fase 11).
 * - Manter isolamento absoluto sem dependências de componentes administrativos.
 */
export const PublicSiteRenderer: React.FC<PublicSiteRendererProps> = ({
  page,
  pages = cmsRepository.loadPages(),
  menu = cmsRepository.loadMenus()[0] || INITIAL_DEMO_MENUS[0],
  theme = cmsRepository.loadActiveTheme(),
  institutional = cmsRepository.loadInstitutional(),
  schedules = cmsRepository.loadSchedules(),
  donationInfo = cmsRepository.loadDonations(),
  liveStreamInfo = cmsRepository.loadLiveStream(),
  onNavigatePage,
  allowDraftPreview = true,
}) => {
  // Consumo estrito dos DesignTokens existentes no VisualTheme
  const themeStyles = useMemo<React.CSSProperties>(() => {
    if (!theme?.tokens) return {};

    const { colors, typography, spacing, borders } = theme.tokens;
    return {
      '--color-theme-primary': colors.primary,
      '--color-theme-secondary': colors.secondary,
      '--color-theme-accent': colors.accent,
      '--color-theme-background': colors.background,
      '--color-theme-surface': colors.surface,
      '--color-theme-text': colors.text,
      '--color-theme-muted': colors.muted,
      '--color-theme-border': colors.border,
      '--font-family-heading': typography.fontFamilyHeading,
      '--font-family-body': typography.fontFamilyBody,
      '--radius-base': borders.radiusMedium,
      backgroundColor: colors.background || '#fafaf9',
      color: colors.text || '#1c1917',
      fontFamily: typography.fontFamilyBody || 'system-ui, sans-serif',
    } as React.CSSProperties;
  }, [theme]);

  return (
    <div
      id="public-site-root"
      data-theme-id={theme.id}
      style={themeStyles}
      className="min-h-screen flex flex-col antialiased selection:bg-amber-200 selection:text-amber-950 transition-colors"
    >
      {/* 1. Header Canônico do Site */}
      <PublicSiteHeader
        menu={menu}
        institutional={institutional}
        currentPageId={page?.id}
        currentPageSlug={page?.slug}
        onNavigatePage={onNavigatePage}
      />

      {/* 2. Conteúdo da Página Atual */}
      <PublicPageRenderer
        page={page}
        theme={theme}
        institutional={institutional}
        schedules={schedules}
        donationInfo={donationInfo}
        liveStreamInfo={liveStreamInfo}
        onNavigatePage={onNavigatePage}
        allowDraftPreview={allowDraftPreview}
      />

      {/* 3. Rodapé Canônico do Site */}
      <PublicSiteFooter
        institutional={institutional}
        onNavigatePage={onNavigatePage}
      />
    </div>
  );
};
