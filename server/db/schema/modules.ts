import { pgTable, varchar, text, integer, boolean, jsonb, timestamp, index } from 'drizzle-orm/pg-core';
import { tenants } from './tenants.js';
import type {
  ScheduleStatus,
  EventStatus,
  NewsStatus,
  SermonStatus,
  MinistryStatus,
  LeaderStatus,
  GalleryStatus,
  PrayerRequestStatus,
  DonationStatus,
  LiveStreamStatus,
  BannerStatus,
} from '../../../src/types/index.js';

/**
 * 1. church_schedules (Programação / Horários de Culto)
 */
export const churchSchedules = pgTable(
  'church_schedules',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 })
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    dayOfWeek: varchar('day_of_week', { length: 50 }),
    time: varchar('time', { length: 50 }).notNull(),
    description: text('description'),
    location: varchar('location', { length: 255 }),
    status: varchar('status', { length: 20 }).$type<ScheduleStatus>().notNull().default('active'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_church_schedules_tenant').on(table.tenantId),
    index('idx_church_schedules_status').on(table.status),
  ]
);

/**
 * 2. church_events (Eventos da Igreja)
 */
export const churchEvents = pgTable(
  'church_events',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 })
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    description: text('description'),
    startDate: varchar('start_date', { length: 50 }).notNull(),
    endDate: varchar('end_date', { length: 50 }),
    time: varchar('time', { length: 50 }),
    location: varchar('location', { length: 255 }),
    imageMediaId: varchar('image_media_id', { length: 64 }),
    status: varchar('status', { length: 20 }).$type<EventStatus>().notNull().default('draft'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_church_events_tenant').on(table.tenantId),
    index('idx_church_events_slug').on(table.slug),
    index('idx_church_events_status').on(table.status),
  ]
);

/**
 * 3. church_news (Notícias e Avisos)
 */
export const churchNews = pgTable(
  'church_news',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 })
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    summary: text('summary'),
    content: text('content').notNull(),
    imageMediaId: varchar('image_media_id', { length: 64 }),
    author: varchar('author', { length: 255 }),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    status: varchar('status', { length: 20 }).$type<NewsStatus>().notNull().default('draft'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_church_news_tenant').on(table.tenantId),
    index('idx_church_news_slug').on(table.slug),
    index('idx_church_news_status').on(table.status),
  ]
);

/**
 * 4. church_sermons (Sermões e Mensagens)
 */
export const churchSermons = pgTable(
  'church_sermons',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 })
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    description: text('description'),
    preacher: varchar('preacher', { length: 255 }).notNull(),
    date: varchar('date', { length: 50 }).notNull(),
    scriptureReference: varchar('scripture_reference', { length: 255 }),
    videoUrl: text('video_url'),
    audioMediaId: varchar('audio_media_id', { length: 64 }),
    thumbnailMediaId: varchar('thumbnail_media_id', { length: 64 }),
    status: varchar('status', { length: 20 }).$type<SermonStatus>().notNull().default('draft'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_church_sermons_tenant').on(table.tenantId),
    index('idx_church_sermons_slug').on(table.slug),
    index('idx_church_sermons_status').on(table.status),
  ]
);

/**
 * 5. church_ministries (Ministérios e Departamentos)
 */
export const churchMinistries = pgTable(
  'church_ministries',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 })
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    description: text('description'),
    leaderName: varchar('leader_name', { length: 255 }),
    imageMediaId: varchar('image_media_id', { length: 64 }),
    status: varchar('status', { length: 20 }).$type<MinistryStatus>().notNull().default('active'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_church_ministries_tenant').on(table.tenantId),
    index('idx_church_ministries_slug').on(table.slug),
    index('idx_church_ministries_status').on(table.status),
  ]
);

/**
 * 6. church_leaders (Liderança e Pastores)
 */
export const churchLeaders = pgTable(
  'church_leaders',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 })
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    role: varchar('role', { length: 255 }).notNull(),
    description: text('description'),
    photoMediaId: varchar('photo_media_id', { length: 64 }),
    order: integer('order_num').notNull().default(0),
    status: varchar('status', { length: 20 }).$type<LeaderStatus>().notNull().default('active'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_church_leaders_tenant').on(table.tenantId),
    index('idx_church_leaders_order').on(table.order),
    index('idx_church_leaders_status').on(table.status),
  ]
);

/**
 * 7. church_gallery_albums (Álbuns de Fotos)
 */
export const churchGalleryAlbums = pgTable(
  'church_gallery_albums',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 })
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }),
    description: text('description'),
    coverMediaId: varchar('cover_media_id', { length: 64 }),
    mediaIds: jsonb('media_ids').$type<string[]>().notNull().default([]),
    status: varchar('status', { length: 20 }).$type<GalleryStatus>().notNull().default('active'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_church_gallery_tenant').on(table.tenantId),
    index('idx_church_gallery_status').on(table.status),
  ]
);

/**
 * 8. church_prayer_requests (Pedidos de Oração)
 */
export const churchPrayerRequests = pgTable(
  'church_prayer_requests',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 })
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }),
    requesterName: varchar('requester_name', { length: 255 }),
    requestText: text('request_text').notNull(),
    isAnonymous: boolean('is_anonymous').notNull().default(false),
    status: varchar('status', { length: 20 }).$type<PrayerRequestStatus>().notNull().default('pending'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_church_prayer_tenant').on(table.tenantId),
    index('idx_church_prayer_status').on(table.status),
  ]
);

/**
 * 9. church_donations (Dízimos, Ofertas e Dados de Contribuição)
 */
export const churchDonations = pgTable(
  'church_donations',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 })
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    bankAccountInfo: text('bank_account_info'),
    pixKey: varchar('pix_key', { length: 255 }),
    instructions: text('instructions'),
    status: varchar('status', { length: 20 }).$type<DonationStatus>().notNull().default('active'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_church_donations_tenant').on(table.tenantId),
    index('idx_church_donations_status').on(table.status),
  ]
);

/**
 * 10. church_live_streams (Transmissão ao Vivo)
 */
export const churchLiveStreams = pgTable(
  'church_live_streams',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 })
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    streamUrl: text('stream_url'),
    status: varchar('status', { length: 20 }).$type<LiveStreamStatus>().notNull().default('offline'),
    scheduledAt: timestamp('scheduled_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_church_livestreams_tenant').on(table.tenantId),
    index('idx_church_livestreams_status').on(table.status),
  ]
);

/**
 * 11. church_banners (Banners e Campanhas Visuais)
 */
export const churchBanners = pgTable(
  'church_banners',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 })
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    subtitle: text('subtitle'),
    imageMediaId: varchar('image_media_id', { length: 64 }),
    primaryButtonLabel: varchar('primary_button_label', { length: 100 }),
    primaryButtonUrl: text('primary_button_url'),
    secondaryButtonLabel: varchar('secondary_button_label', { length: 100 }),
    secondaryButtonUrl: text('secondary_button_url'),
    order: integer('order_num').notNull().default(0),
    status: varchar('status', { length: 20 }).$type<BannerStatus>().notNull().default('active'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_church_banners_tenant').on(table.tenantId),
    index('idx_church_banners_order').on(table.order),
    index('idx_church_banners_status').on(table.status),
  ]
);

export type ChurchScheduleRecord = typeof churchSchedules.$inferSelect;
export type ChurchEventRecord = typeof churchEvents.$inferSelect;
export type ChurchNewsRecord = typeof churchNews.$inferSelect;
export type ChurchSermonRecord = typeof churchSermons.$inferSelect;
export type ChurchMinistryRecord = typeof churchMinistries.$inferSelect;
export type ChurchLeaderRecord = typeof churchLeaders.$inferSelect;
export type ChurchGalleryAlbumRecord = typeof churchGalleryAlbums.$inferSelect;
export type ChurchPrayerRequestRecord = typeof churchPrayerRequests.$inferSelect;
export type ChurchDonationRecord = typeof churchDonations.$inferSelect;
export type ChurchLiveStreamRecord = typeof churchLiveStreams.$inferSelect;
export type ChurchBannerRecord = typeof churchBanners.$inferSelect;
