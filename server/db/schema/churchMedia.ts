import { pgTable, varchar, text, boolean, bigint, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { tenants } from './tenants.js';

export const mediaFolders = pgTable(
  'media_folders',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 }).notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    parentId: varchar('parent_id', { length: 64 }),
    name: varchar('name', { length: 180 }).notNull(),
    description: text('description'),
    isPublic: boolean('is_public').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_media_folders_tenant').on(table.tenantId),
    index('idx_media_folders_parent').on(table.tenantId, table.parentId),
    index('idx_media_folders_public').on(table.tenantId, table.isPublic),
  ],
);

export const churchMedia = pgTable(
  'church_media',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 }).notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    folderId: varchar('folder_id', { length: 64 }).references(() => mediaFolders.id, { onDelete: 'set null' }),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    mediaType: varchar('media_type', { length: 30 }).notNull(),
    mimeType: varchar('mime_type', { length: 120 }),
    storageKey: text('storage_key').notNull(),
    publicUrl: text('public_url'),
    thumbnailUrl: text('thumbnail_url'),
    fileName: varchar('file_name', { length: 255 }),
    fileSizeBytes: bigint('file_size_bytes', { mode: 'number' }),
    durationSeconds: integer('duration_seconds'),
    width: integer('width'),
    height: integer('height'),
    isPublic: boolean('is_public').notNull().default(false),
    isDownloadable: boolean('is_downloadable').notNull().default(true),
    uploadedByUserId: varchar('uploaded_by_user_id', { length: 64 }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_church_media_tenant').on(table.tenantId),
    index('idx_church_media_folder').on(table.tenantId, table.folderId),
    index('idx_church_media_type').on(table.tenantId, table.mediaType),
    index('idx_church_media_public').on(table.tenantId, table.isPublic),
  ],
);

export const mediaDocuments = pgTable(
  'media_documents',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 }).notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    mediaId: varchar('media_id', { length: 64 }).references(() => churchMedia.id, { onDelete: 'cascade' }),
    documentType: varchar('document_type', { length: 50 }).notNull(),
    documentNumber: varchar('document_number', { length: 100 }),
    subjectName: varchar('subject_name', { length: 180 }),
    issuedAt: timestamp('issued_at', { withTimezone: true }),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_media_documents_tenant').on(table.tenantId),
    index('idx_media_documents_type').on(table.tenantId, table.documentType),
    index('idx_media_documents_subject').on(table.tenantId, table.subjectName),
  ],
);

export type MediaFolderRecord = typeof mediaFolders.$inferSelect;
export type NewMediaFolderRecord = typeof mediaFolders.$inferInsert;
export type ChurchMediaRecord = typeof churchMedia.$inferSelect;
export type NewChurchMediaRecord = typeof churchMedia.$inferInsert;
export type MediaDocumentRecord = typeof mediaDocuments.$inferSelect;
export type NewMediaDocumentRecord = typeof mediaDocuments.$inferInsert;
