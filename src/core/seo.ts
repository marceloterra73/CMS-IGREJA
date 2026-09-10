/**
 * CMS CORE — DOMÍNIO: SEO E METADADOS DO SITE (FASE 16)
 * Responsabilidade Arquitetural:
 * Define a fronteira declarativa para configurações de SEO e metadados estruturais do CMS.
 *
 * Arquitetura Oficial:
 * Tenant -> SiteSEO (defaults globais do site da igreja)
 * Page   -> PageSEO (override conceitual/específico da página)
 *
 * Fronteira estritamente declarativa de contratos de dados.
 * Proibido implementar geradores de HTML/tags, engines de SEO, renderers (<Helmet>),
 * geradores de sitemap/robots.txt, crawlers, analíticos ou rotinas de publicação/runtime.
 */

export type {
  RobotsDirective,
  OpenGraphMetadata,
  TwitterCardMetadata,
  SiteSEO,
  PageSEO,
} from '../types';
