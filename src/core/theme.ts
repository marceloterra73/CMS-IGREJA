/**
 * CMS CORE — DOMÍNIO: SISTEMA VISUAL E DESIGN TOKENS (FASE 8)
 * Responsabilidade Arquitetural:
 * Define a fronteira declarativa de temas visuais e design tokens do CMS.
 *
 * Arquitetura Oficial:
 * VisualTheme -> DesignTokens (colors, typography, spacing, borders, elevations)
 *
 * Fronteira estritamente declarativa e de contratos de tipos.
 * Proibido implementar ThemeEngine, ThemeProvider, ThemeResolver, ThemeLoader, ThemeRegistry ou geradores de CSS.
 */

export type {
  VisualTheme,
  ThemeStatus,
  DesignTokens,
  ColorTokens,
  TypographyTokens,
  SpacingTokens,
  BorderTokens,
  ElevationTokens,
} from '../types';
