import { pgTable, varchar, text, boolean, jsonb, timestamp, index } from 'drizzle-orm/pg-core';
import { tenants } from './tenants.js';
import type {
  ChurchProfile,
  ChurchAddress,
  ChurchContact,
  ChurchSocialLinks,
} from '../../../src/types/index.js';

/**
 * Tabela Canônica: site_settings (Configuração Geral e Identidade do Site)
 * CMS Visual para Igrejas — Fundação de Persistência (Fase 57)
 */
export const siteSettings = pgTable(
  'site_settings',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 })
      .notNull()
      .unique()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    siteName: varchar('site_name', { length: 255 }),
    language: varchar('language', { length: 20 }).default('pt-BR'),
    locale: varchar('locale', { length: 20 }).default('pt-BR'),
    timezone: varchar('timezone', { length: 100 }).default('America/Sao_Paulo'),
    dateFormat: varchar('date_format', { length: 50 }).default('DD/MM/YYYY'),
    timeFormat: varchar('time_format', { length: 50 }).default('HH:mm'),
    faviconMediaId: varchar('favicon_media_id', { length: 64 }),
    faviconUrl: text('favicon_url'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_site_settings_tenant').on(table.tenantId),
  ]
);

/**
 * Tabela Canônica: institutional_contents (Conteúdo Institucional Eclesiástico)
 * CMS Visual para Igrejas — Fundação de Persistência (Fase 57)
 */
export const institutionalContents = pgTable(
  'institutional_contents',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 })
      .notNull()
      .unique()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    profile: jsonb('profile').$type<ChurchProfile>().notNull().default({}),
    address: jsonb('address').$type<ChurchAddress>(),
    contact: jsonb('contact').$type<ChurchContact>(),
    socialLinks: jsonb('social_links').$type<ChurchSocialLinks>(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_institutional_tenant').on(table.tenantId),
  ]
);

/**
 * Tabela Canônica: site_publication_settings (Publicação e Visibilidade do Site)
 * CMS Visual para Igrejas — Fundação de Persistência (Fase 57)
 */
export const sitePublicationSettings = pgTable(
  'site_publication_settings',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 })
      .notNull()
      .unique()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    visibility: varchar('visibility', { length: 20 }).notNull().default('public'), // 'public' | 'private'
    maintenanceMode: boolean('maintenance_mode').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_site_publication_tenant').on(table.tenantId),
  ]
);

/**
 * Tabela Canônica: site_analytics (Configurações de Analytics e Métricas)
 * CMS Visual para Igrejas — Fundação de Persistência (Fase 57)
 */
export const siteAnalytics = pgTable(
  'site_analytics',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 })
      .notNull()
      .unique()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    googleAnalyticsId: varchar('google_analytics_id', { length: 100 }),
    googleTagManagerId: varchar('google_tag_manager_id', { length: 100 }),
    metaPixelId: varchar('meta_pixel_id', { length: 100 }),
    searchConsoleVerificationToken: varchar('search_console_token', { length: 255 }),
    anonymizeIp: boolean('anonymize_ip').default(true),
    consentRequired: boolean('consent_required').default(false),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_site_analytics_tenant').on(table.tenantId),
  ]
);

export type SiteSettingsRecord = typeof siteSettings.$inferSelect;
export type InstitutionalContentRecord = typeof institutionalContents.$inferSelect;
export type SitePublicationRecord = typeof sitePublicationSettings.$inferSelect;
export type SiteAnalyticsRecord = typeof siteAnalytics.$inferSelect;
