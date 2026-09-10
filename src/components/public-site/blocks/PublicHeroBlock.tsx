import React from 'react';
import { ArrowRight, Calendar, Sparkles } from 'lucide-react';
import {
  BlockInstance,
  ButtonFieldData,
  ImageFieldData,
  InstitutionalContent,
} from '../../../types';

export interface PublicBlockProps {
  block: BlockInstance;
  institutional?: InstitutionalContent;
  onNavigatePage?: (pageIdOrSlug: string) => void;
}

export const PublicHeroBlock: React.FC<PublicBlockProps> = ({
  block,
  institutional,
  onNavigatePage,
}) => {
  const data = (block.data || {}) as Record<string, unknown>;
  const config = block.config || {};

  const title =
    (data.title as string) ||
    institutional?.profile?.tagline ||
    institutional?.profile?.name ||
    'Uma Igreja Viva para Todas as Famílias';

  const subtitle =
    (data.subtitle as string) ||
    institutional?.profile?.description ||
    institutional?.profile?.slogan ||
    'Comunhão bíblica, adoração reverente e missão para transformar vidas na nossa cidade.';

  const bgImage = data.backgroundImage as ImageFieldData | string | undefined;
  const bgUrl =
    typeof bgImage === 'string'
      ? bgImage
      : bgImage?.url ||
        'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1920&q=80';

  const primaryButton = data.primaryButton as ButtonFieldData | undefined;
  const secondaryButton = data.secondaryButton as ButtonFieldData | undefined;

  const alignmentClass =
    config.alignment === 'left'
      ? 'text-left items-start'
      : config.alignment === 'right'
      ? 'text-right items-end'
      : 'text-center items-center';

  return (
    <div
      data-block-id={block.id}
      className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-stone-900 text-white min-h-[440px] sm:min-h-[520px] flex items-center shadow-xl border border-stone-800"
    >
      {/* Background Image com Overlay Nobre */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-105"
        style={{ backgroundImage: `url(${bgUrl})` }}
      />
      <div className="absolute inset-0 bg-linear-to-t from-stone-950/95 via-stone-900/80 to-stone-900/60" />

      {/* Conteúdo Central */}
      <div className="relative z-10 w-full px-6 py-16 sm:px-12 sm:py-24 max-w-4xl mx-auto flex flex-col justify-center">
        <div className={`flex flex-col gap-5 ${alignmentClass}`}>
          {/* Badge institucional superior */}
          {institutional?.profile?.name && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{institutional.profile.name}</span>
            </div>
          )}

          {/* Título Principal */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight font-serif drop-shadow-xs">
            {title}
          </h1>

          {/* Subtítulo */}
          <p className="text-base sm:text-lg text-stone-300 max-w-2xl leading-relaxed">
            {subtitle}
          </p>

          {/* Botões de Ação */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (primaryButton?.url) {
                  if (primaryButton.openInNewTab) {
                    window.open(primaryButton.url, '_blank', 'noopener,noreferrer');
                  } else {
                    window.location.href = primaryButton.url;
                  }
                } else if (onNavigatePage) {
                  onNavigatePage('page_schedule');
                }
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm shadow-lg shadow-amber-950/30 transition-all hover:translate-y-[-1px] cursor-pointer"
            >
              <span>{primaryButton?.label || 'Conheça Nossos Cultos'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                if (secondaryButton?.url) {
                  if (secondaryButton.openInNewTab) {
                    window.open(secondaryButton.url, '_blank', 'noopener,noreferrer');
                  } else {
                    window.location.href = secondaryButton.url;
                  }
                } else if (onNavigatePage) {
                  onNavigatePage('page_about');
                }
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 backdrop-blur-xs transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-amber-300" />
              <span>{secondaryButton?.label || 'Quem Somos'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
