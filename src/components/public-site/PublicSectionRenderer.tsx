import React from 'react';
import {
  ChurchDonationInfo,
  ChurchLiveStreamInfo,
  ChurchSchedule,
  InstitutionalContent,
  SectionInstance,
  VisualTheme,
} from '../../types';
import { PublicBlockRenderer } from './PublicBlockRenderer';

interface PublicSectionRendererProps {
  section: SectionInstance;
  theme?: VisualTheme;
  institutional?: InstitutionalContent;
  schedules?: ChurchSchedule[];
  donationInfo?: ChurchDonationInfo;
  liveStreamInfo?: ChurchLiveStreamInfo;
  onNavigatePage?: (pageIdOrSlug: string) => void;
}

/**
 * Renderizador canônico de Seções do CMS (Fase 50).
 *
 * Princípio Arquitetural:
 * PÁGINAS -> SEÇÕES -> BLOCOS -> CONFIGURAÇÕES -> DADOS
 *
 * Responsabilidades:
 * - Respeitar ordem e visibilidade existentes.
 * - Aplicar configurações permitidas de layout (padding, largura, tema da seção).
 * - Renderizar a coleção ordenada de blocos da seção.
 */
export const PublicSectionRenderer: React.FC<PublicSectionRendererProps> = ({
  section,
  theme,
  institutional,
  schedules,
  donationInfo,
  liveStreamInfo,
  onNavigatePage,
}) => {
  if (!section || section.isVisible === false) {
    return null;
  }

  const config = section.config || {};

  // Resolução de Padding Vertical
  const getPaddingClass = (paddingY?: string) => {
    switch (paddingY) {
      case 'none':
        return 'py-0';
      case 'small':
        return 'py-6 sm:py-8';
      case 'large':
        return 'py-16 sm:py-24';
      case 'medium':
      default:
        return 'py-10 sm:py-16';
    }
  };

  // Resolução de Largura do Container
  const getContainerWidthClass = (width?: string) => {
    switch (width) {
      case 'narrow':
        return 'max-w-3xl';
      case 'wide':
        return 'max-w-7xl';
      case 'full':
        return 'w-full';
      case 'standard':
      default:
        return 'max-w-5xl';
    }
  };

  // Resolução de Variante Temática da Seção
  const getThemeVariantClass = (variant?: string) => {
    switch (variant) {
      case 'dark':
        return 'bg-stone-900 text-white';
      case 'accent':
        return 'bg-amber-900 text-amber-50';
      case 'neutral':
        return 'bg-stone-100 text-stone-900';
      case 'light':
      default:
        return 'bg-transparent text-inherit';
    }
  };

  const bgStyle =
    config.backgroundColor || section.backgroundColor
      ? { backgroundColor: config.backgroundColor || section.backgroundColor }
      : undefined;

  const textStyle = config.textColor ? { color: config.textColor } : undefined;

  // Filtragem e ordenação estrita dos blocos da seção
  const sortedBlocks = (section.blocks || [])
    .filter((b) => b && b.isVisible !== false)
    .sort((a, b) => a.order - b.order);

  if (sortedBlocks.length === 0) {
    return null;
  }

  return (
    <section
      id={section.id}
      data-section-id={section.id}
      data-section-order={section.order}
      className={`w-full transition-colors ${getPaddingClass(
        config.paddingY
      )} ${getThemeVariantClass(config.themeVariant)}`}
      style={{ ...bgStyle, ...textStyle }}
    >
      <div
        className={`mx-auto px-4 sm:px-6 lg:px-8 space-y-12 ${getContainerWidthClass(
          config.containerWidth
        )}`}
      >
        {sortedBlocks.map((block) => (
          <PublicBlockRenderer
            key={block.id}
            block={block}
            section={section}
            theme={theme}
            institutional={institutional}
            schedules={schedules}
            donationInfo={donationInfo}
            liveStreamInfo={liveStreamInfo}
            onNavigatePage={onNavigatePage}
          />
        ))}
      </div>
    </section>
  );
};
