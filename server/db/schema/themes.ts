import { pgTable, varchar, text, boolean, jsonb, timestamp, index } from 'drizzle-orm/pg-core';
import { tenants } from './tenants.js';
import type { DesignTokens } from '../../../src/types/index.js';

/**
 * Tabela Canônica: visual_themes (Temas Visuais do CMS)
 * CMS Visual para Igrejas — Fundação de Persistência (Fase 57)
 */
export const visualThemes = pgTable(
  'visual_themes',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 })
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    version: varchar('version', { length: 20 }).notNull().default('1.0.0'),
    isDefault: boolean('is_default').notNull().default(false),
    status: varchar('status', { length: 20 }).notNull().default('active'), // 'active' | 'draft' | 'archived'
    tokens: jsonb('tokens').$type<DesignTokens>().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_visual_themes_tenant').on(table.tenantId),
    index('idx_visual_themes_status').on(table.status),
  ]
);

export type VisualThemeRecord = typeof visualThemes.$inferSelect;
export type NewVisualThemeRecord = typeof visualThemes.$inferInsert;
