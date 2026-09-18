import { pgTable, varchar, text, boolean, integer, numeric, date, timestamp, index } from 'drizzle-orm/pg-core';
import { tenants } from './tenants.js';

export const assetCategories = pgTable(
  'asset_categories',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 }).notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 160 }).notNull(),
    description: text('description'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_asset_categories_tenant').on(table.tenantId),
    index('idx_asset_categories_active').on(table.tenantId, table.isActive),
  ],
);

export const assetLocations = pgTable(
  'asset_locations',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 }).notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 160 }).notNull(),
    address: text('address'),
    description: text('description'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_asset_locations_tenant').on(table.tenantId),
    index('idx_asset_locations_active').on(table.tenantId, table.isActive),
  ],
);

export const churchAssets = pgTable(
  'church_assets',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 }).notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    categoryId: varchar('category_id', { length: 64 }).references(() => assetCategories.id, { onDelete: 'set null' }),
    locationId: varchar('location_id', { length: 64 }).references(() => assetLocations.id, { onDelete: 'set null' }),
    name: varchar('name', { length: 255 }).notNull(),
    assetTag: varchar('asset_tag', { length: 100 }),
    serialNumber: varchar('serial_number', { length: 160 }),
    description: text('description'),
    condition: varchar('condition', { length: 40 }).notNull().default('good'),
    status: varchar('status', { length: 40 }).notNull().default('active'),
    acquisitionDate: date('acquisition_date'),
    acquisitionValue: numeric('acquisition_value', { precision: 14, scale: 2 }),
    usefulLifeMonths: integer('useful_life_months'),
    currentValue: numeric('current_value', { precision: 14, scale: 2 }),
    responsiblePersonId: varchar('responsible_person_id', { length: 64 }),
    responsibleName: varchar('responsible_name', { length: 160 }),
    warrantyUntil: date('warranty_until'),
    photoUrl: text('photo_url'),
    documentUrl: text('document_url'),
    notes: text('notes'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_church_assets_tenant').on(table.tenantId),
    index('idx_church_assets_category').on(table.tenantId, table.categoryId),
    index('idx_church_assets_location').on(table.tenantId, table.locationId),
    index('idx_church_assets_status').on(table.tenantId, table.status),
    index('idx_church_assets_tag').on(table.tenantId, table.assetTag),
    index('idx_church_assets_serial').on(table.tenantId, table.serialNumber),
  ],
);

export const assetMovements = pgTable(
  'asset_movements',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 }).notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    assetId: varchar('asset_id', { length: 64 }).notNull().references(() => churchAssets.id, { onDelete: 'cascade' }),
    fromLocationId: varchar('from_location_id', { length: 64 }).references(() => assetLocations.id, { onDelete: 'set null' }),
    toLocationId: varchar('to_location_id', { length: 64 }).references(() => assetLocations.id, { onDelete: 'set null' }),
    movementType: varchar('movement_type', { length: 40 }).notNull().default('transfer'),
    movementDate: date('movement_date').notNull(),
    responsiblePersonId: varchar('responsible_person_id', { length: 64 }),
    responsibleName: varchar('responsible_name', { length: 160 }),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_asset_movements_tenant').on(table.tenantId),
    index('idx_asset_movements_asset').on(table.tenantId, table.assetId),
    index('idx_asset_movements_date').on(table.tenantId, table.movementDate),
  ],
);

export type AssetCategoryRecord = typeof assetCategories.$inferSelect;
export type NewAssetCategoryRecord = typeof assetCategories.$inferInsert;
export type AssetLocationRecord = typeof assetLocations.$inferSelect;
export type NewAssetLocationRecord = typeof assetLocations.$inferInsert;
export type ChurchAssetRecord = typeof churchAssets.$inferSelect;
export type NewChurchAssetRecord = typeof churchAssets.$inferInsert;
export type AssetMovementRecord = typeof assetMovements.$inferSelect;
export type NewAssetMovementRecord = typeof assetMovements.$inferInsert;
