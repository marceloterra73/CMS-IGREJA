/**
 * CMS CORE — DOMÍNIO: TEMPLATES (FASE 7)
 * Responsabilidade Arquitetural:
 * Define a fronteira declarativa dos templates canônicos do CMS.
 *
 * Arquitetura Oficial:
 * Template -> Page Composition (pages[]) -> Sections -> Blocks -> BlockDefinition -> BlockDataSchema -> BlockInstance.data
 *
 * Fronteira estritamente declarativa e de contratos de tipos.
 * Proibido implementar TemplateEngine, TemplateRenderer, TemplateLoader, TemplateResolver ou geradores operacionais.
 */

export type {
  TemplateDefinition,
  TemplateStatus,
  TemplateCategory,
  TemplatePageDefinition,
  PageTemplate,
} from '../types';
