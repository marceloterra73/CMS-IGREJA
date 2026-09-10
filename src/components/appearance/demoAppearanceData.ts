import { VisualTheme } from '../../types';

/**
 * Temas visuais canônicos demonstrativos iniciais
 * Respeitam 100% o contrato canônico VisualTheme e DesignTokens (Fase 8):
 * - colors: ColorTokens (primary, secondary, accent, background, surface, text, muted, border, success, warning, error)
 * - typography: TypographyTokens (fontFamilyHeading, fontFamilyBody, fontSizeBase, fontSizeHeading, fontWeightNormal, fontWeightBold, lineHeightBase, letterSpacingBase)
 * - spacing: SpacingTokens (base, sectionPaddingYSmall, sectionPaddingYMedium, sectionPaddingYLarge, containerNarrow, containerStandard, containerWide)
 * - borders: BorderTokens (radiusSmall, radiusMedium, radiusLarge, radiusFull, borderWidthThin, borderWidthThick)
 * - elevations: ElevationTokens (shadowNone, shadowLow, shadowMedium, shadowHigh)
 */
export const INITIAL_DEMO_THEMES: VisualTheme[] = [
  {
    id: 'theme_default_warm',
    name: 'Harmonia Eclesiástica (Padrão)',
    description: 'Paleta acolhedora com tons terrosos quentes, âmbar e pedra nobre, ideal para congregações contemporâneas.',
    version: '1.0.0',
    isDefault: true,
    status: 'active',
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-08T10:00:00Z',
    tokens: {
      colors: {
        primary: '#78350f', // amber-900
        secondary: '#d97706', // amber-600
        accent: '#f59e0b', // amber-500
        background: '#fafaf9', // stone-50
        surface: '#ffffff', // white
        text: '#1c1917', // stone-900
        muted: '#78716c', // stone-500
        border: '#e7e5e4', // stone-200
        success: '#16a34a', // green-600
        warning: '#d97706', // amber-600
        error: '#dc2626', // red-600
      },
      typography: {
        fontFamilyHeading: 'Georgia, serif',
        fontFamilyBody: 'system-ui, -apple-system, sans-serif',
        fontSizeBase: '16px',
        fontSizeHeading: '32px',
        fontWeightNormal: '400',
        fontWeightBold: '700',
        lineHeightBase: '1.6',
        letterSpacingBase: '-0.01em',
      },
      spacing: {
        base: '16px',
        sectionPaddingYSmall: '32px',
        sectionPaddingYMedium: '64px',
        sectionPaddingYLarge: '96px',
        containerNarrow: '768px',
        containerStandard: '1024px',
        containerWide: '1280px',
      },
      borders: {
        radiusSmall: '4px',
        radiusMedium: '8px',
        radiusLarge: '16px',
        radiusFull: '9999px',
        borderWidthThin: '1px',
        borderWidthThick: '2px',
      },
      elevations: {
        shadowNone: 'none',
        shadowLow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        shadowMedium: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        shadowHigh: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  {
    id: 'theme_liturgic_blue',
    name: 'Serenidade Litúrgica',
    description: 'Tons sóbrios de azul profundo e cinzas neutros, conferindo reverência e tradição solene.',
    version: '1.0.0',
    isDefault: false,
    status: 'draft',
    createdAt: '2026-09-02T10:00:00Z',
    updatedAt: '2026-09-08T10:00:00Z',
    tokens: {
      colors: {
        primary: '#1e3a8a', // blue-900
        secondary: '#2563eb', // blue-600
        accent: '#38bdf8', // sky-400
        background: '#f8fafc', // slate-50
        surface: '#ffffff', // white
        text: '#0f172a', // slate-900
        muted: '#64748b', // slate-500
        border: '#e2e8f0', // slate-200
        success: '#15803d',
        warning: '#b45309',
        error: '#b91c1c',
      },
      typography: {
        fontFamilyHeading: 'Palatino, Times New Roman, serif',
        fontFamilyBody: 'system-ui, -apple-system, sans-serif',
        fontSizeBase: '16px',
        fontSizeHeading: '34px',
        fontWeightNormal: '400',
        fontWeightBold: '700',
        lineHeightBase: '1.65',
        letterSpacingBase: '0em',
      },
      spacing: {
        base: '16px',
        sectionPaddingYSmall: '28px',
        sectionPaddingYMedium: '56px',
        sectionPaddingYLarge: '84px',
        containerNarrow: '768px',
        containerStandard: '1024px',
        containerWide: '1280px',
      },
      borders: {
        radiusSmall: '2px',
        radiusMedium: '6px',
        radiusLarge: '12px',
        radiusFull: '9999px',
        borderWidthThin: '1px',
        borderWidthThick: '2px',
      },
      elevations: {
        shadowNone: 'none',
        shadowLow: '0 1px 3px 0 rgba(15, 23, 42, 0.05)',
        shadowMedium: '0 4px 6px -1px rgba(15, 23, 42, 0.08)',
        shadowHigh: '0 10px 15px -3px rgba(15, 23, 42, 0.1)',
      },
    },
  },
  {
    id: 'theme_olive_grace',
    name: 'Graça & Renovação (Oliva)',
    description: 'Matizes verdes de oliva, esperança e vida comunitária em equilíbrio com fundos orgânicos.',
    version: '1.0.0',
    isDefault: false,
    status: 'draft',
    createdAt: '2026-09-03T10:00:00Z',
    updatedAt: '2026-09-08T10:00:00Z',
    tokens: {
      colors: {
        primary: '#14532d', // green-900
        secondary: '#16a34a', // green-600
        accent: '#84cc16', // lime-500
        background: '#fcfdfa',
        surface: '#ffffff',
        text: '#142319',
        muted: '#52665a',
        border: '#e1e8e2',
        success: '#16a34a',
        warning: '#d97706',
        error: '#dc2626',
      },
      typography: {
        fontFamilyHeading: 'Garamond, Baskerville, serif',
        fontFamilyBody: 'system-ui, -apple-system, sans-serif',
        fontSizeBase: '16px',
        fontSizeHeading: '32px',
        fontWeightNormal: '400',
        fontWeightBold: '700',
        lineHeightBase: '1.6',
        letterSpacingBase: '-0.01em',
      },
      spacing: {
        base: '16px',
        sectionPaddingYSmall: '32px',
        sectionPaddingYMedium: '64px',
        sectionPaddingYLarge: '96px',
        containerNarrow: '768px',
        containerStandard: '1024px',
        containerWide: '1280px',
      },
      borders: {
        radiusSmall: '6px',
        radiusMedium: '10px',
        radiusLarge: '20px',
        radiusFull: '9999px',
        borderWidthThin: '1px',
        borderWidthThick: '2px',
      },
      elevations: {
        shadowNone: 'none',
        shadowLow: '0 1px 2px 0 rgba(20, 83, 45, 0.04)',
        shadowMedium: '0 4px 6px -1px rgba(20, 83, 45, 0.08)',
        shadowHigh: '0 10px 15px -3px rgba(20, 83, 45, 0.12)',
      },
    },
  },
];
