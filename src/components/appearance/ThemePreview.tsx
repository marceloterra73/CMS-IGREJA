import React from 'react';
import { VisualTheme } from '../../types';
import { Eye, ExternalLink, Sparkles, Heart, Calendar } from 'lucide-react';

interface ThemePreviewProps {
  theme: VisualTheme;
}

export const ThemePreview: React.FC<ThemePreviewProps> = ({ theme }) => {
  const { tokens } = theme;
  const { colors, typography, borders, elevations, spacing } = tokens;

  // Montamos estilos inline controlados derivados diretamente dos DesignTokens
  const previewContainerStyle: React.CSSProperties = {
    backgroundColor: colors.background,
    color: colors.text,
    fontFamily: typography.fontFamilyBody,
    fontSize: typography.fontSizeBase,
    lineHeight: typography.lineHeightBase || '1.6',
    letterSpacing: typography.letterSpacingBase || 'normal',
    borderRadius: borders.radiusMedium,
    borderColor: colors.border,
    borderWidth: borders.borderWidthThin,
    borderStyle: 'solid',
  };

  const cardSurfaceStyle: React.CSSProperties = {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: borders.borderWidthThin,
    borderStyle: 'solid',
    borderRadius: borders.radiusMedium,
    boxShadow: elevations?.shadowMedium || '0 2px 4px rgba(0,0,0,0.05)',
  };

  const primaryBtnStyle: React.CSSProperties = {
    backgroundColor: colors.primary,
    color: '#ffffff',
    borderRadius: borders.radiusSmall,
    fontFamily: typography.fontFamilyBody,
    fontWeight: typography.fontWeightBold,
  };

  const secondaryBtnStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    color: colors.primary,
    borderColor: colors.primary,
    borderWidth: borders.borderWidthThin,
    borderStyle: 'solid',
    borderRadius: borders.radiusSmall,
    fontFamily: typography.fontFamilyBody,
    fontWeight: typography.fontWeightBold,
  };

  const badgeStyle: React.CSSProperties = {
    backgroundColor: colors.accent + '22',
    color: colors.primary,
    borderColor: colors.accent,
    borderWidth: borders.borderWidthThin,
    borderStyle: 'solid',
    borderRadius: borders.radiusFull,
  };

  const headingStyle: React.CSSProperties = {
    fontFamily: typography.fontFamilyHeading,
    color: colors.primary,
    fontWeight: typography.fontWeightBold,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-bold text-stone-900 tracking-tight">
            Preview Visual dos Design Tokens
          </span>
        </div>
        <span className="text-[11px] text-stone-500 font-mono">
          {theme.name} (v{theme.version})
        </span>
      </div>

      {/* Caixa de visualização contextual do site */}
      <div
        id="theme-live-preview-box"
        style={previewContainerStyle}
        className="p-5 sm:p-6 transition-all duration-200 overflow-hidden"
      >
        {/* Cabeçalho simulado */}
        <div
          style={{ borderColor: colors.border }}
          className="pb-4 mb-5 border-b flex flex-wrap items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2.5">
            <div
              style={{ backgroundColor: colors.primary }}
              className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold shrink-0"
            >
              †
            </div>
            <div>
              <div style={headingStyle} className="text-sm leading-tight">
                Igreja Batista Central
              </div>
              <div style={{ color: colors.muted }} className="text-[11px]">
                Portal Institucional
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              style={badgeStyle}
              className="text-[10px] font-semibold px-2 py-0.5 tracking-wide"
            >
              Culto ao Vivo às 19h
            </span>
          </div>
        </div>

        {/* Hero Banner Simulado */}
        <div
          style={cardSurfaceStyle}
          className="p-4 sm:p-5 mb-5 transition-shadow"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-md">
              <span
                style={{ color: colors.secondary }}
                className="text-xs font-bold uppercase tracking-wider block"
              >
                Boas-Vindas à Casa
              </span>
              <h3 style={headingStyle} className="text-lg sm:text-xl leading-snug">
                Um lugar de graça, acolhimento e renovação espiritual
              </h3>
              <p style={{ color: colors.muted }} className="text-xs leading-relaxed">
                Nossos encontros são pensados para edificar a sua família e conectar corações com a palavra de Deus.
              </p>
            </div>

            <div className="flex flex-col gap-2 shrink-0">
              <button
                type="button"
                style={primaryBtnStyle}
                className="px-4 py-2 text-xs transition-opacity hover:opacity-95 text-center shadow-xs"
              >
                Conheça Nossa Comunidade
              </button>
              <button
                type="button"
                style={secondaryBtnStyle}
                className="px-4 py-2 text-xs transition-opacity hover:opacity-90 text-center"
              >
                Horários dos Cultos
              </button>
            </div>
          </div>
        </div>

        {/* Mini Cards de Conteúdo Demonstrativo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Card 1: Mensagens */}
          <div style={cardSurfaceStyle} className="p-3.5 space-y-2">
            <div className="flex items-center gap-1.5" style={{ color: colors.secondary }}>
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Sermões
              </span>
            </div>
            <div style={headingStyle} className="text-xs leading-snug">
              Caminhando pela Fé em Dias de Incerteza
            </div>
            <p style={{ color: colors.muted }} className="text-[11px] leading-normal line-clamp-2">
              Pr. Alexandre Mendes • Série Esperança Inabalável
            </p>
          </div>

          {/* Card 2: Agenda */}
          <div style={cardSurfaceStyle} className="p-3.5 space-y-2">
            <div className="flex items-center gap-1.5" style={{ color: colors.accent }}>
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Eventos
              </span>
            </div>
            <div style={headingStyle} className="text-xs leading-snug">
              Conferência Famílias com Propósito
            </div>
            <p style={{ color: colors.muted }} className="text-[11px] leading-normal line-clamp-2">
              Sábado • 19:30 • Templo Sede
            </p>
          </div>

          {/* Card 3: Oração */}
          <div style={cardSurfaceStyle} className="p-3.5 space-y-2">
            <div className="flex items-center gap-1.5" style={{ color: colors.success || colors.primary }}>
              <Heart className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Oração
              </span>
            </div>
            <div style={headingStyle} className="text-xs leading-snug">
              Envie seu Pedido Pastoral
            </div>
            <p style={{ color: colors.muted }} className="text-[11px] leading-normal line-clamp-2">
              Nossa equipe de intercessão orará por você e sua casa.
            </p>
          </div>
        </div>

        {/* Rodapé Simulado com Mostra de Status */}
        <div
          style={{ borderColor: colors.border }}
          className="mt-5 pt-3 border-t flex flex-wrap items-center justify-between text-[11px] gap-2"
        >
          <span style={{ color: colors.muted }}>
            Tokens de Sistema: {typography.fontFamilyHeading.split(',')[0]} / {typography.fontFamilyBody.split(',')[0]}
          </span>
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: colors.success || '#16a34a' }}
              title="Success Token"
            />
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: colors.warning || '#d97706' }}
              title="Warning Token"
            />
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: colors.error || '#dc2626' }}
              title="Error Token"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
