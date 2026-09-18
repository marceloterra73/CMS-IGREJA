import { pgTable, varchar, text, boolean, date, timestamp, index } from 'drizzle-orm/pg-core';
import { tenants } from './tenants.js';

/** Cadastro central de pessoas/membros da congregação. */
export const churchPeople = pgTable(
  'church_people',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 }).notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    fullName: varchar('full_name', { length: 255 }).notNull(),
    preferredName: varchar('preferred_name', { length: 255 }),
    email: varchar('email', { length: 255 }),
    phone: varchar('phone', { length: 40 }),
    birthDate: date('birth_date'),
    memberSince: date('member_since'),
    category: varchar('category', { length: 80 }).notNull().default('member'),
    role: varchar('role', { length: 120 }),
    photoUrl: text('photo_url'),
    notes: text('notes'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_church_people_tenant').on(table.tenantId),
    index('idx_church_people_name').on(table.fullName),
    index('idx_church_people_birth_date').on(table.birthDate),
    index('idx_church_people_active').on(table.isActive),
  ]
);

export type ChurchPersonRecord = typeof churchPeople.$inferSelect;
export type NewChurchPersonRecord = typeof churchPeople.$inferInsert;
