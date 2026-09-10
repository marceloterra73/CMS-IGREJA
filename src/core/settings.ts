/**
 * CMS CORE — DOMÍNIO: SETTINGS (CONFIGURAÇÃO GERAL E IDENTIDADE DO SITE) (FASE 17)
 * Responsabilidade Arquitetural:
 * Define a fronteira declarativa para configurações gerais e identidade operacional do site da igreja.
 *
 * Arquitetura Oficial:
 * Tenant -> SiteSettings
 *
 * Fronteira estritamente declarativa de contratos de dados.
 * Proibido implementar formatadores de data/hora, conversores de timezone, engines de tradução/i18n,
 * painéis de UI, formulários, persistência, APIs ou execução em runtime.
 */

export type {
  SiteSettings,
} from '../types';
