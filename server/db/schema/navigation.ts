import { pgTable, varchar, jsonb, timestamp, index } from 'drizzle-orm/pg-core';
import { tenants } from './tenants.js';
import type { NavigationItem, MenuLocation } from '../../../src/types/index.js';

/**
 * Tabela Canônica: navigation_menus (Menus de Navegação do Site)
 * CMS Visual para Igrejas — Fundação de Persistência (Fase 57)
 */
export const navigationMenus = pgTable(
  'navigation_menus',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 })
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    location: varchar('location', { length: 50 }).$type<MenuLocation>().notNull(),
    status: varchar('status', { length: 20 }).notNull().default('active'), // 'active' | 'draft' | 'archived'
    items: jsonb('items').$type<NavigationItem[]>().notNull().default([]),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_navigation_menus_tenant').on(table.tenantId),
    index('idx_navigation_menus_location').on(table.location),
  ]
);

export type NavigationMenuRecord = typeof navigationMenus.$inferSelect;
export type NewNavigationMenuRecord = typeof navigationMenus.$inferInsert;
