/**
 * CMS CORE — DOMÍNIO: REDIRECIONAMENTOS E ALIASES DE URL (FASE 21)
 * Responsabilidade Arquitetural:
 * Define a fronteira declarativa para regras de redirecionamento e aliases de URL do site por Tenant.
 *
 * Arquitetura Oficial:
 * Tenant -> redirects[] -> SiteRedirect
 *
 * Fronteira estritamente declarativa de contratos de dados.
 * Proibido implementar routers, middlewares, HTTP redirects (301/302), URL matchers,
 * servidores, Nginx, Apache, CDNs, edge functions, APIs ou bancos de dados.
 */

export type {
  SiteRedirectType,
  SiteRedirectTargetType,
  SiteRedirect,
} from '../types';
