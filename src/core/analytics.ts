/**
 * CMS CORE — DOMÍNIO: ANALYTICS E MÉTRICAS DO SITE (FASE 23)
 * Responsabilidade Arquitetural:
 * Define a fronteira declarativa para identificadores de medição, tags de terceiros e
 * preferências de privacidade por Tenant.
 *
 * Arquitetura Oficial:
 * Tenant -> analytics -> SiteAnalytics
 *
 * Fronteira estritamente declarativa de contratos de dados.
 * Proibido implementar script loaders, tag injectors, <script> runtimes, trackers operacionais,
 * coletores de eventos, pixels, beacons, chamadas a APIs externas ou manipuladores de DOM.
 */

export type {
  SiteAnalyticsProvider,
  SiteAnalytics,
} from '../types';
