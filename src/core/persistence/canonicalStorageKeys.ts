/**
 * CMS CORE — CHAVES CANÔNICAS DE PERSISTÊNCIA (FASE 51)
 * Convenção centralizada e isolada por tenant para chaves de armazenamento local.
 *
 * Formato Canônico:
 * cms:<tenantId>:<resource>
 */

export const DEFAULT_TENANT_ID = 'ib_central';

export type CmsResource =
  | 'settings'
  | 'institutional'
  | 'theme'
  | 'themes'
  | 'active_theme_id'
  | 'seo_site'
  | 'seo_pages'
  | 'domains'
  | 'analytics'
  | 'schedules'
  | 'donations'
  | 'live_stream'
  | 'pages'
  | 'navigation';

/**
 * Gera a chave canônica garantindo isolamento total por tenant
 */
export function getCmsStorageKey(resource: CmsResource, tenantId: string = DEFAULT_TENANT_ID): string {
  const safeTenant = (tenantId || DEFAULT_TENANT_ID).trim().toLowerCase();
  return `cms:${safeTenant}:${resource}`;
}

/**
 * Prefixo do tenant para operações de limpeza ou auditoria
 */
export function getCmsTenantPrefix(tenantId: string = DEFAULT_TENANT_ID): string {
  const safeTenant = (tenantId || DEFAULT_TENANT_ID).trim().toLowerCase();
  return `cms:${safeTenant}:`;
}
