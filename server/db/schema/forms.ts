import { pgTable, varchar, text, jsonb, timestamp, index } from 'drizzle-orm/pg-core';
import { tenants } from './tenants.js';
import type {
  FormStatus,
  FormFieldDefinition,
  FormSubmissionStatus,
  FormSubmissionValue,
} from '../../../src/types/index.js';

/**
 * Tabela Canônica: form_definitions (Definições de Formulários por Tenant)
 * CMS Visual para Igrejas — Fundação de Persistência (Fase 57)
 */
export const formDefinitions = pgTable(
  'form_definitions',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 })
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    description: text('description'),
    status: varchar('status', { length: 20 }).$type<FormStatus>().notNull().default('draft'),
    fields: jsonb('fields').$type<FormFieldDefinition[]>().notNull().default([]),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_form_definitions_tenant').on(table.tenantId),
    index('idx_form_definitions_slug').on(table.slug),
    index('idx_form_definitions_status').on(table.status),
  ]
);

/**
 * Tabela Canônica: form_submissions (Submissões de Formulários de Visitantes)
 * CMS Visual para Igrejas — Fundação de Persistência (Fase 57)
 */
export const formSubmissions = pgTable(
  'form_submissions',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 })
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    formId: varchar('form_id', { length: 64 })
      .notNull()
      .references(() => formDefinitions.id, { onDelete: 'cascade' }),
    status: varchar('status', { length: 20 }).$type<FormSubmissionStatus>().notNull().default('received'),
    values: jsonb('values').$type<Record<string, FormSubmissionValue>>().notNull().default({}),
    submittedAt: timestamp('submitted_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_form_submissions_tenant').on(table.tenantId),
    index('idx_form_submissions_form').on(table.formId),
    index('idx_form_submissions_status').on(table.status),
  ]
);

export type FormDefinitionRecord = typeof formDefinitions.$inferSelect;
export type NewFormDefinitionRecord = typeof formDefinitions.$inferInsert;
export type FormSubmissionRecord = typeof formSubmissions.$inferSelect;
export type NewFormSubmissionRecord = typeof formSubmissions.$inferInsert;
