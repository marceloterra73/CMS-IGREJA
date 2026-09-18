import { pgTable, varchar, text, boolean, date, timestamp, index } from 'drizzle-orm/pg-core';
import { tenants } from './tenants.js';

/** Estudos bíblicos e materiais de ensino. */
export const educationStudies = pgTable(
  'education_studies',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 }).notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    category: varchar('category', { length: 100 }),
    imageUrl: text('image_url'),
    attachmentUrl: text('attachment_url'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_education_studies_tenant').on(table.tenantId),
    index('idx_education_studies_category').on(table.category),
    index('idx_education_studies_active').on(table.isActive),
  ]
);

/** Escolas e departamentos responsáveis pelo ensino. */
export const educationSchools = pgTable(
  'education_schools',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 }).notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    managerName: varchar('manager_name', { length: 255 }),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_education_schools_tenant').on(table.tenantId),
    index('idx_education_schools_active').on(table.isActive),
  ]
);

/** Turmas vinculadas a uma escola. */
export const educationClasses = pgTable(
  'education_classes',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 }).notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    schoolId: varchar('school_id', { length: 64 }).notNull().references(() => educationSchools.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    teacherName: varchar('teacher_name', { length: 255 }),
    room: varchar('room', { length: 120 }),
    schedule: varchar('schedule', { length: 120 }),
    capacity: varchar('capacity', { length: 20 }),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_education_classes_tenant').on(table.tenantId),
    index('idx_education_classes_school').on(table.schoolId),
    index('idx_education_classes_active').on(table.isActive),
  ]
);

/** Alunos matriculados nas turmas. */
export const educationEnrollments = pgTable(
  'education_enrollments',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 }).notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    classId: varchar('class_id', { length: 64 }).notNull().references(() => educationClasses.id, { onDelete: 'cascade' }),
    personId: varchar('person_id', { length: 64 }).notNull(),
    enrollmentDate: date('enrollment_date'),
    status: varchar('status', { length: 30 }).notNull().default('active'),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_education_enrollments_tenant').on(table.tenantId),
    index('idx_education_enrollments_class').on(table.classId),
    index('idx_education_enrollments_person').on(table.personId),
  ]
);

/** Frequência dos alunos por aula/data. */
export const educationAttendance = pgTable(
  'education_attendance',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 }).notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    classId: varchar('class_id', { length: 64 }).notNull().references(() => educationClasses.id, { onDelete: 'cascade' }),
    personId: varchar('person_id', { length: 64 }).notNull(),
    attendanceDate: date('attendance_date').notNull(),
    present: boolean('present').notNull().default(false),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_education_attendance_tenant').on(table.tenantId),
    index('idx_education_attendance_class_date').on(table.classId, table.attendanceDate),
    index('idx_education_attendance_person').on(table.personId),
  ]
);

/** Acompanhamento pessoal e discipulado. */
export const educationDiscipleship = pgTable(
  'education_discipleship',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 64 }).notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    personId: varchar('person_id', { length: 64 }).notNull(),
    mentorName: varchar('mentor_name', { length: 255 }),
    stage: varchar('stage', { length: 80 }).notNull().default('new'),
    nextFollowUpDate: date('next_follow_up_date'),
    notes: text('notes'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_education_discipleship_tenant').on(table.tenantId),
    index('idx_education_discipleship_person').on(table.personId),
    index('idx_education_discipleship_followup').on(table.nextFollowUpDate),
  ]
);

export type EducationStudyRecord = typeof educationStudies.$inferSelect;
export type EducationSchoolRecord = typeof educationSchools.$inferSelect;
export type EducationClassRecord = typeof educationClasses.$inferSelect;
export type EducationEnrollmentRecord = typeof educationEnrollments.$inferSelect;
export type EducationAttendanceRecord = typeof educationAttendance.$inferSelect;
export type EducationDiscipleshipRecord = typeof educationDiscipleship.$inferSelect;
