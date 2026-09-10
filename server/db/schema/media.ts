import { pgTable, varchar, text, bigint, jsonb, timestamp, index } from 'drizzle-orm/pg-core';
import { tenants } from './tenants.js';
import type { MediaType, MediaStatus, MediaDimensions } from '../../../src/types/index.js';

/**
 * Tabela Canônica: media_items (Biblioteca de Mídia vinculada por Tenant)
 * CMS Visual para Igrejas — Fundação de Persistência (Fase 57)
 */
export const mediaItems = pgTable(
  'media_items',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 })
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }),
    filename: varchar('filename', { length: 255 }).notNull(),
    originalName: varchar('original_name', { length: 255 }).notNull(),
    mimeType: varchar('mime_type', { length: 100 }).notNull(),
    type: varchar('type', { length: 20 }).$type<MediaType>().notNull(),
    sizeBytes: bigint('size_bytes', { mode: 'number' }).notNull(),
    url: text('url').notNull(),
    altText: text('alt_text'),
    dimensions: jsonb('dimensions').$type<MediaDimensions>(),
    folder: varchar('folder', { length: 100 }),
    status: varchar('status', { length: 20 }).$type<MediaStatus>().notNull().default('active'),
    uploadedBy: varchar('uploaded_by', { length: 64 }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_media_items_tenant').on(table.tenantId),
    index('idx_media_items_type').on(table.type),
    index('idx_media_items_status').on(table.status),
  ]
);

export type MediaItemRecord = typeof mediaItems.$inferSelect;
export type NewMediaItemRecord = typeof mediaItems.$inferInsert;
