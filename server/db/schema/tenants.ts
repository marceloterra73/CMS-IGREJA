import { pgTable, varchar, text, jsonb, timestamp, index } from 'drizzle-orm/pg-core';
import type { ChurchModuleType } from '../../../src/types/index.js';

/**
 * Tabela Canônica: tenants (Igrejas / Congregações)
 * CMS Visual para Igrejas — Fundação de Persistência (Fase 57)
 *
 * Raiz de todo o isolamento multi-tenant do sistema.
 */
export const tenants = pgTable(
  'tenants',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 100 }).notNull().unique(),
    status: varchar('status', { length: 20 }).notNull().default('active'), // 'active' | 'inactive' | 'suspended'
    customDomain: varchar('custom_domain', { length: 255 }),
    logoUrl: text('logo_url'),
    contactEmail: varchar('contact_email', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 50 }),
    activeModules: jsonb('active_modules').$type<ChurchModuleType[]>().notNull().default([]),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => [
    index('idx_tenants_slug').on(table.slug),
    index('idx_tenants_status').on(table.status),
  ]
);

export type TenantRecord = typeof tenants.$inferSelect;
export type NewTenantRecord = typeof tenants.$inferInsert;
