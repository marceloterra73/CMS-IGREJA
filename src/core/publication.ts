/**
 * CMS CORE — DOMÍNIO: PUBLICAÇÃO E VISIBILIDADE DO SITE (FASE 20)
 * Responsabilidade Arquitetural:
 * Define a fronteira declarativa para a intenção de disponibilidade e visibilidade do site por Tenant.
 *
 * Arquitetura Oficial:
 * Tenant -> publication -> SitePublicationSettings
 *
 * Fronteira estritamente declarativa de contratos de metadados.
 * Proibido implementar publication engines, pipelines, filas, agendadores,
 * deploy, servidores, middlewares, rotas ou lógica operacional.
 */

export type {
  SiteVisibility,
  SitePublicationSettings,
} from '../types';
