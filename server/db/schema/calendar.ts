import { pgTable, varchar, text, boolean, timestamp, date, time, index } from 'drizzle-orm/pg-core';
import { tenants } from './tenants.js';

export const calendarEvents = pgTable(
  'calendar_events',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 }).notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    eventDate: date('event_date').notNull(),
    startTime: time('start_time'),
    endTime: time('end_time'),
    location: varchar('location', { length: 255 }),
    category: varchar('category', { length: 80 }),
    visibility: varchar('visibility', { length: 30 }).notNull().default('church'),
    isAllDay: boolean('is_all_day').notNull().default(false),
    isRecurring: boolean('is_recurring').notNull().default(false),
    recurrenceRule: text('recurrence_rule'),
    color: varchar('color', { length: 30 }),
    organizerName: varchar('organizer_name', { length: 160 }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_calendar_events_tenant').on(table.tenantId),
    index('idx_calendar_events_date').on(table.tenantId, table.eventDate),
    index('idx_calendar_events_category').on(table.tenantId, table.category),
    index('idx_calendar_events_visibility').on(table.tenantId, table.visibility),
  ],
);

export const calendarRecurringPrograms = pgTable(
  'calendar_recurring_programs',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 }).notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    dayOfWeek: varchar('day_of_week', { length: 20 }).notNull(),
    startTime: time('start_time'),
    endTime: time('end_time'),
    location: varchar('location', { length: 255 }),
    responsibleName: varchar('responsible_name', { length: 160 }),
    recurrenceRule: text('recurrence_rule'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_calendar_recurring_tenant').on(table.tenantId),
    index('idx_calendar_recurring_day').on(table.tenantId, table.dayOfWeek),
    index('idx_calendar_recurring_active').on(table.tenantId, table.isActive),
  ],
);

export const calendarBulletins = pgTable(
  'calendar_bulletins',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 }).notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    content: text('content').notNull(),
    publishAt: timestamp('publish_at', { withTimezone: true }),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    visibility: varchar('visibility', { length: 30 }).notNull().default('church'),
    isPublished: boolean('is_published').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_calendar_bulletins_tenant').on(table.tenantId),
    index('idx_calendar_bulletins_publish').on(table.tenantId, table.publishAt),
    index('idx_calendar_bulletins_active').on(table.tenantId, table.isPublished),
  ],
);

export const calendarNotifications = pgTable(
  'calendar_notifications',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 }).notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    message: text('message').notNull(),
    channel: varchar('channel', { length: 30 }).notNull().default('in_app'),
    targetType: varchar('target_type', { length: 40 }).notNull().default('all'),
    targetId: varchar('target_id', { length: 64 }),
    scheduledAt: timestamp('scheduled_at', { withTimezone: true }),
    sentAt: timestamp('sent_at', { withTimezone: true }),
    status: varchar('status', { length: 30 }).notNull().default('scheduled'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_calendar_notifications_tenant').on(table.tenantId),
    index('idx_calendar_notifications_status').on(table.tenantId, table.status),
    index('idx_calendar_notifications_schedule').on(table.tenantId, table.scheduledAt),
  ],
);

export const calendarPrivateNotes = pgTable(
  'calendar_private_notes',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 }).notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    authorUserId: varchar('author_user_id', { length: 64 }).notNull(),
    title: varchar('title', { length: 255 }),
    content: text('content').notNull(),
    noteDate: date('note_date'),
    reminderAt: timestamp('reminder_at', { withTimezone: true }),
    isCompleted: boolean('is_completed').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_calendar_notes_tenant').on(table.tenantId),
    index('idx_calendar_notes_author').on(table.tenantId, table.authorUserId),
    index('idx_calendar_notes_reminder').on(table.tenantId, table.reminderAt),
  ],
);

export type CalendarEventRecord = typeof calendarEvents.$inferSelect;
export type NewCalendarEventRecord = typeof calendarEvents.$inferInsert;
export type CalendarRecurringProgramRecord = typeof calendarRecurringPrograms.$inferSelect;
export type NewCalendarRecurringProgramRecord = typeof calendarRecurringPrograms.$inferInsert;
export type CalendarBulletinRecord = typeof calendarBulletins.$inferSelect;
export type NewCalendarBulletinRecord = typeof calendarBulletins.$inferInsert;
export type CalendarNotificationRecord = typeof calendarNotifications.$inferSelect;
export type NewCalendarNotificationRecord = typeof calendarNotifications.$inferInsert;
export type CalendarPrivateNoteRecord = typeof calendarPrivateNotes.$inferSelect;
export type NewCalendarPrivateNoteRecord = typeof calendarPrivateNotes.$inferInsert;
