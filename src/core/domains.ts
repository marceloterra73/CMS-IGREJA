/**
 * CMS CORE — DOMÍNIO: DOMÍNIOS E ENDEREÇOS DO SITE (FASE 18)
 * Responsabilidade Arquitetural:
 * Define a fronteira declarativa para domínios, subdomínios e endereços do site por Tenant.
 *
 * Arquitetura Oficial:
 * Tenant -> domains[] -> SiteDomain
 *
 * Fronteira estritamente declarativa de contratos de dados.
 * Proibido implementar resolução de domínio em runtime, detecção de tenant por hostname,
 * middlewares, DNS, SSL, proxies, servidores, deploy, roteamento ou lógica operacional.
 */

export type {
  SiteDomainType,
  SiteDomainStatus,
  SiteDomain,
} from '../types';
