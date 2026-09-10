import { pgTable, varchar, text, boolean, jsonb, timestamp, index } from 'drizzle-orm/pg-core';
import { tenants } from './tenants.js';
import type { PermissionAction, UserRole, UserStatus } from '../../../src/types/index.js';

/**
 * Tabela Canônica: users (Usuários vinculados a um Tenant ou Superadmin)
 * CMS Visual para Igrejas — Fundação de Autenticação e Autorização (Fase 58)
 */
export const users = pgTable(
  'users',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 })
      .references(() => tenants.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    role: varchar('role', { length: 50 }).$type<UserRole>().notNull().default('editor'),
    status: varchar('status', { length: 20 }).$type<UserStatus>().notNull().default('active'),
    isActive: boolean('is_active').notNull().default(true),
    customPermissions: jsonb('custom_permissions').$type<PermissionAction[]>(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => [
    index('idx_users_tenant').on(table.tenantId),
    index('idx_users_email').on(table.email),
    index('idx_users_role').on(table.role),
  ]
);

/**
 * Tabela de Sessões e Revogação de Refresh Tokens (Fase 58)
 */
export const userSessions = pgTable(
  'user_sessions',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    userId: varchar('user_id', { length: 64 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    refreshTokenHash: varchar('refresh_token_hash', { length: 255 }).notNull(),
    ipAddress: varchar('ip_address', { length: 45 }),
    userAgent: text('user_agent'),
    isRevoked: boolean('is_revoked').notNull().default(false),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_user_sessions_user').on(table.userId),
    index('idx_user_sessions_hash').on(table.refreshTokenHash),
  ]
);

export type UserRecord = typeof users.$inferSelect;
export type NewUserRecord = typeof users.$inferInsert;
export type UserSessionRecord = typeof userSessions.$inferSelect;
export type NewUserSessionRecord = typeof userSessions.$inferInsert;

