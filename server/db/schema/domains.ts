import { pgTable, varchar, text, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { tenants } from './tenants.js';
import type {
  SiteDomainType,
  SiteDomainStatus,
  SiteRedirectType,
  SiteRedirectTargetType,
} from '../../../src/types/index.js';

/**
 * Tabela Canônica: site_domains (Domínios e Endereços do Site por Tenant)
 * CMS Visual para Igrejas — Fundação de Persistência (Fase 57)
 */
export const siteDomains = pgTable(
  'site_domains',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 })
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    hostname: varchar('hostname', { length: 255 }).notNull().unique(),
    type: varchar('type', { length: 50 }).$type<SiteDomainType>().notNull(),
    status: varchar('status', { length: 20 }).$type<SiteDomainStatus>().notNull().default('pending'),
    isPrimary: boolean('is_primary').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_site_domains_tenant').on(table.tenantId),
    index('idx_site_domains_hostname').on(table.hostname),
    index('idx_site_domains_status').on(table.status),
  ]
);

/**
 * Tabela Canônica: site_redirects (Redirecionamentos e Aliases de URL)
 * CMS Visual para Igrejas — Fundação de Persistência (Fase 57)
 */
export const siteRedirects = pgTable(
  'site_redirects',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 })
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    sourcePath: varchar('source_path', { length: 500 }).notNull(),
    targetType: varchar('target_type', { length: 20 }).$type<SiteRedirectTargetType>().notNull(),
    targetPageId: varchar('target_page_id', { length: 64 }),
    targetUrl: text('target_url'),
    type: varchar('type', { length: 20 }).$type<SiteRedirectType>().notNull().default('permanent'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_site_redirects_tenant').on(table.tenantId),
    index('idx_site_redirects_source').on(table.sourcePath),
  ]
);

export type SiteDomainRecord = typeof siteDomains.$inferSelect;
export type NewSiteDomainRecord = typeof siteDomains.$inferInsert;
export type SiteRedirectRecord = typeof siteRedirects.$inferSelect;
export type NewSiteRedirectRecord = typeof siteRedirects.$inferInsert;
