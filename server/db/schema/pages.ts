import { pgTable, varchar, integer, boolean, jsonb, timestamp, index } from 'drizzle-orm/pg-core';
import { tenants } from './tenants.js';
import type {
  PageSEO,
  SectionConfig,
  BlockConfig,
  BlockDataRecord,
  BlockType,
} from '../../../src/types/index.js';

/**
 * Tabela Canônica: pages (Páginas do CMS)
 * Hierarquia: Page └── sections[] └── blocks[]
 * CMS Visual para Igrejas — Fundação de Persistência (Fase 57)
 */
export const pages = pgTable(
  'pages',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 })
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    status: varchar('status', { length: 20 }).notNull().default('draft'), // 'draft' | 'published' | 'archived'
    order: integer('order_num').notNull().default(0),
    isHome: boolean('is_home').notNull().default(false),
    seo: jsonb('seo').$type<PageSEO>().notNull().default({ metaTitle: '', metaDescription: '' }),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => [
    index('idx_pages_tenant').on(table.tenantId),
    index('idx_pages_slug').on(table.slug),
    index('idx_pages_status').on(table.status),
    index('idx_pages_order').on(table.order),
  ]
);

/**
 * Tabela Canônica: page_sections (Seções de agrupamento de blocos na página)
 * CMS Visual para Igrejas — Fundação de Persistência (Fase 57)
 */
export const pageSections = pgTable(
  'page_sections',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    pageId: varchar('page_id', { length: 64 })
      .notNull()
      .references(() => pages.id, { onDelete: 'cascade' }),
    tenantId: varchar('tenant_id', { length: 64 })
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }),
    order: integer('order_num').notNull().default(0),
    isVisible: boolean('is_visible').notNull().default(true),
    backgroundColor: varchar('background_color', { length: 50 }),
    config: jsonb('config').$type<SectionConfig>(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_page_sections_page').on(table.pageId),
    index('idx_page_sections_tenant').on(table.tenantId),
    index('idx_page_sections_order').on(table.order),
  ]
);

/**
 * Tabela Canônica: page_blocks (Blocos estruturados e seguros dentro da seção)
 * CMS Visual para Igrejas — Fundação de Persistência (Fase 57)
 */
export const pageBlocks = pgTable(
  'page_blocks',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    sectionId: varchar('section_id', { length: 64 })
      .notNull()
      .references(() => pageSections.id, { onDelete: 'cascade' }),
    tenantId: varchar('tenant_id', { length: 64 })
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    type: varchar('type', { length: 50 }).$type<BlockType>().notNull(),
    order: integer('order_num').notNull().default(0),
    isVisible: boolean('is_visible').notNull().default(true),
    config: jsonb('config').$type<BlockConfig>().notNull().default({}),
    data: jsonb('data').$type<BlockDataRecord>().notNull().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_page_blocks_section').on(table.sectionId),
    index('idx_page_blocks_tenant').on(table.tenantId),
    index('idx_page_blocks_order').on(table.order),
    index('idx_page_blocks_type').on(table.type),
  ]
);

export type PageRecord = typeof pages.$inferSelect;
export type NewPageRecord = typeof pages.$inferInsert;
export type PageSectionRecord = typeof pageSections.$inferSelect;
export type NewPageSectionRecord = typeof pageSections.$inferInsert;
export type PageBlockRecord = typeof pageBlocks.$inferSelect;
export type NewPageBlockRecord = typeof pageBlocks.$inferInsert;
