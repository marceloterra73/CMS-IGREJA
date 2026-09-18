import { pgTable, varchar, text, integer, boolean, date, timestamp, index } from 'drizzle-orm/pg-core';
import { tenants } from './tenants.js';

/** Grupos, células, ministérios e departamentos da congregação. */
export const churchGroups = pgTable(
  'church_groups',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 }).notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    category: varchar('category', { length: 100 }).notNull().default('cell'),
    description: text('description'),
    meetingDay: varchar('meeting_day', { length: 30 }),
    meetingTime: varchar('meeting_time', { length: 20 }),
    location: varchar('location', { length: 255 }),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_church_groups_tenant').on(table.tenantId),
    index('idx_church_groups_category').on(table.category),
    index('idx_church_groups_active').on(table.isActive),
  ]
);

/** Até quatro líderes por grupo, com ordem de responsabilidade. */
export const churchGroupLeaders = pgTable(
  'church_group_leaders',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 }).notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    groupId: varchar('group_id', { length: 64 }).notNull().references(() => churchGroups.id, { onDelete: 'cascade' }),
    personId: varchar('person_id', { length: 64 }).notNull(),
    leadershipOrder: integer('leadership_order').notNull().default(1),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_group_leaders_tenant').on(table.tenantId),
    index('idx_group_leaders_group').on(table.groupId),
    index('idx_group_leaders_person').on(table.personId),
  ]
);

/** Registro de reuniões, presença, visitantes e observações pastorais. */
export const churchGroupMeetings = pgTable(
  'church_group_meetings',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 }).notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    groupId: varchar('group_id', { length: 64 }).notNull().references(() => churchGroups.id, { onDelete: 'cascade' }),
    meetingDate: date('meeting_date').notNull(),
    theme: varchar('theme', { length: 255 }),
    presentCount: integer('present_count').notNull().default(0),
    visitorCount: integer('visitor_count').notNull().default(0),
    absentCount: integer('absent_count').notNull().default(0),
    selfieUrl: text('selfie_url'),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_group_meetings_tenant').on(table.tenantId),
    index('idx_group_meetings_group_date').on(table.groupId, table.meetingDate),
  ]
);

export type ChurchGroupRecord = typeof churchGroups.$inferSelect;
export type NewChurchGroupRecord = typeof churchGroups.$inferInsert;
export type ChurchGroupLeaderRecord = typeof churchGroupLeaders.$inferSelect;
export type ChurchGroupMeetingRecord = typeof churchGroupMeetings.$inferSelect;
