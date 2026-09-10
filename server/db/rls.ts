/**
 * Suporte e Utilitários de Row-Level Security (RLS) para PostgreSQL
 * CMS Visual para Igrejas — Fase 57
 *
 * Garante que nenhuma query possa acessar dados de congregações diferentes,
 * mesmo em caso de omissão acidental de filtros no código da aplicação.
 */

import type { PoolClient } from 'pg';

/**
 * Lista exaustiva de todas as tabelas com escopo de tenant que utilizam RLS.
 */
export const TENANT_SCOPED_TABLES = [
  'users',
  'site_settings',
  'institutional_contents',
  'site_publication_settings',
  'site_analytics',
  'visual_themes',
  'pages',
  'page_sections',
  'page_blocks',
  'navigation_menus',
  'media_items',
  'church_schedules',
  'church_events',
  'church_news',
  'church_sermons',
  'church_ministries',
  'church_leaders',
  'church_gallery_albums',
  'church_prayer_requests',
  'church_donations',
  'church_live_streams',
  'church_banners',
  'site_domains',
  'site_redirects',
  'form_definitions',
  'form_submissions',
] as const;

export type TenantScopedTableName = typeof TENANT_SCOPED_TABLES[number];

/**
 * Gera as instruções SQL necessárias para ativar RLS e criar a política de isolamento
 * para uma tabela específica.
 */
export function generateTableRlsSql(tableName: TenantScopedTableName): string {
  const policyName = `policy_${tableName}_tenant_isolation`;
  return [
    `-- Ativação de RLS para ${tableName}`,
    `ALTER TABLE "${tableName}" ENABLE ROW LEVEL SECURITY;`,
    `DROP POLICY IF EXISTS "${policyName}" ON "${tableName}";`,
    `CREATE POLICY "${policyName}" ON "${tableName}"`,
    `  FOR ALL`,
    `  USING (tenant_id = current_setting('app.current_tenant_id', true))`,
    `  WITH CHECK (tenant_id = current_setting('app.current_tenant_id', true));`,
  ].join('\n');
}

/**
 * Gera o script SQL completo com as políticas RLS para todas as tabelas do sistema.
 */
export function generateAllRlsMigrationSql(): string {
  const statements: string[] = [
    '--',
    '-- CMS VISUAL PARA IGREJAS — POLÍTICAS DE ROW-LEVEL SECURITY (RLS)',
    '-- Fase 57: Fundação de Isolamento Multi-tenant no Banco de Dados',
    '--',
    '',
  ];

  for (const table of TENANT_SCOPED_TABLES) {
    statements.push(generateTableRlsSql(table));
    statements.push('');
  }

  return statements.join('\n');
}

/**
 * Define o identificador do tenant atual na sessão/transação PostgreSQL local.
 * Utiliza SET LOCAL para garantir que a configuração seja válida apenas dentro da transação atual.
 */
export async function setTenantContext(
  client: PoolClient | { execute: (query: string) => Promise<unknown> },
  tenantId: string
): Promise<void> {
  if (!tenantId || typeof tenantId !== 'string' || tenantId.trim() === '') {
    throw new Error('Identificador de tenantId inválido para contexto RLS.');
  }

  // Sanitização estrita contra injeção SQL em variáveis de sessão
  const sanitizedTenantId = tenantId.replace(/'/g, "''");

  if ('query' in client && typeof client.query === 'function') {
    await client.query(`SET LOCAL app.current_tenant_id = '${sanitizedTenantId}';`);
  } else if ('execute' in client && typeof client.execute === 'function') {
    await client.execute(`SET LOCAL app.current_tenant_id = '${sanitizedTenantId}';`);
  }
}

/**
 * Remove o identificador do tenant da sessão local.
 */
export async function clearTenantContext(
  client: PoolClient | { execute: (query: string) => Promise<unknown> }
): Promise<void> {
  if ('query' in client && typeof client.query === 'function') {
    await client.query(`RESET app.current_tenant_id;`);
  } else if ('execute' in client && typeof client.execute === 'function') {
    await client.execute(`RESET app.current_tenant_id;`);
  }
}
