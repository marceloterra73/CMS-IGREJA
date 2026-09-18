import { pgTable, varchar, text, boolean, numeric, date, timestamp, index } from 'drizzle-orm/pg-core';
import { tenants } from './tenants.js';

/** Contas bancárias, caixas físicos e outras contas financeiras. */
export const financeAccounts = pgTable(
  'finance_accounts',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 }).notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 160 }).notNull(),
    accountType: varchar('account_type', { length: 40 }).notNull().default('cash'),
    initialBalance: numeric('initial_balance', { precision: 14, scale: 2 }).notNull().default('0'),
    isActive: boolean('is_active').notNull().default(true),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('idx_finance_accounts_tenant').on(table.tenantId), index('idx_finance_accounts_active').on(table.isActive)]
);

/** Categorias para classificação analítica de receitas e despesas. */
export const financeCategories = pgTable(
  'finance_categories',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 }).notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 160 }).notNull(),
    kind: varchar('kind', { length: 20 }).notNull().default('both'),
    parentId: varchar('parent_id', { length: 64 }),
    isActive: boolean('is_active').notNull().default(true),
  },
  (table) => [index('idx_finance_categories_tenant').on(table.tenantId), index('idx_finance_categories_kind').on(table.kind)]
);

/** Centros de custo para análise por ministério, projeto ou departamento. */
export const financeCostCenters = pgTable(
  'finance_cost_centers',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 }).notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 160 }).notNull(),
    code: varchar('code', { length: 40 }),
    isActive: boolean('is_active').notNull().default(true),
  },
  (table) => [index('idx_finance_cost_centers_tenant').on(table.tenantId), index('idx_finance_cost_centers_active').on(table.isActive)]
);

/** Pessoas, fornecedores e contatos vinculados aos lançamentos. */
export const financeContacts = pgTable(
  'finance_contacts',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 }).notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    contactType: varchar('contact_type', { length: 40 }).notNull().default('supplier'),
    email: varchar('email', { length: 255 }),
    phone: varchar('phone', { length: 40 }),
    taxId: varchar('tax_id', { length: 40 }),
    notes: text('notes'),
  },
  (table) => [index('idx_finance_contacts_tenant').on(table.tenantId), index('idx_finance_contacts_name').on(table.name)]
);

/** Lançamentos financeiros de receitas e despesas, previstos ou realizados. */
export const financeTransactions = pgTable(
  'finance_transactions',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 }).notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    accountId: varchar('account_id', { length: 64 }).notNull().references(() => financeAccounts.id, { onDelete: 'restrict' }),
    categoryId: varchar('category_id', { length: 64 }).references(() => financeCategories.id, { onDelete: 'set null' }),
    costCenterId: varchar('cost_center_id', { length: 64 }).references(() => financeCostCenters.id, { onDelete: 'set null' }),
    contactId: varchar('contact_id', { length: 64 }).references(() => financeContacts.id, { onDelete: 'set null' }),
    description: varchar('description', { length: 255 }).notNull(),
    kind: varchar('kind', { length: 20 }).notNull(),
    status: varchar('status', { length: 20 }).notNull().default('pending'),
    amount: numeric('amount', { precision: 14, scale: 2 }).notNull(),
    dueDate: date('due_date'),
    paidDate: date('paid_date'),
    paymentMethod: varchar('payment_method', { length: 40 }),
    referenceCode: varchar('reference_code', { length: 100 }),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_finance_transactions_tenant').on(table.tenantId),
    index('idx_finance_transactions_account').on(table.accountId),
    index('idx_finance_transactions_category').on(table.categoryId),
    index('idx_finance_transactions_kind_status').on(table.kind, table.status),
    index('idx_finance_transactions_due_date').on(table.dueDate),
  ]
);

export type FinanceAccountRecord = typeof financeAccounts.$inferSelect;
export type FinanceCategoryRecord = typeof financeCategories.$inferSelect;
export type FinanceCostCenterRecord = typeof financeCostCenters.$inferSelect;
export type FinanceContactRecord = typeof financeContacts.$inferSelect;
export type FinanceTransactionRecord = typeof financeTransactions.$inferSelect;
export type NewFinanceTransactionRecord = typeof financeTransactions.$inferInsert;
