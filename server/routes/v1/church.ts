import { Router, type Request } from 'express';
import { eq, desc } from 'drizzle-orm';
import { getDb } from '../../db/index.js';
import { ApiError } from '../../errors/apiError.js';
import { authenticateMiddleware } from '../../middleware/authenticate.js';
import { churchPeople } from '../../db/schema/people.js';
import { churchGroups } from '../../db/schema/groups.js';
import { financeTransactions } from '../../db/schema/finance.js';
import { churchAssets } from '../../db/schema/assets.js';
import { calendarEvents } from '../../db/schema/calendar.js';
import { churchMedia } from '../../db/schema/churchMedia.js';
import {
  educationStudies,
  educationSchools,
  educationClasses,
  educationEnrollments,
  educationAttendance,
  educationDiscipleship,
} from '../../db/schema/education.js';

const router = Router();
router.use(authenticateMiddleware);

function tenantId(req: Request): string {
  const id = (req as any).user?.tenantId;
  if (!id) throw ApiError.forbidden('Usuário autenticado sem tenant associado.');
  return id;
}

function requireDb() {
  const db = getDb();
  if (!db) throw ApiError.serviceUnavailable('Banco de dados não configurado.');
  return db;
}

function body(req: Request): Record<string, any> {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    throw ApiError.badRequest('Corpo da requisição inválido.');
  }
  return req.body;
}

router.get('/people', async (req, res, next) => {
  try {
    const db = requireDb(); const tid = tenantId(req);
    const rows = await db.select().from(churchPeople).where(eq(churchPeople.tenantId, tid)).orderBy(desc(churchPeople.createdAt));
    res.json({ success: true, data: rows });
  } catch (e) { next(e); }
});

router.post('/people', async (req, res, next) => {
  try {
    const db = requireDb(); const tid = tenantId(req); const input = body(req);
    if (!input.fullName) throw ApiError.badRequest('fullName é obrigatório.');
    const [row] = await db.insert(churchPeople).values({
      id: input.id || crypto.randomUUID(), tenantId: tid, fullName: String(input.fullName),
      preferredName: input.preferredName ? String(input.preferredName) : undefined,
      email: input.email ? String(input.email) : undefined, phone: input.phone ? String(input.phone) : undefined,
      birthDate: input.birthDate ? String(input.birthDate) : undefined, memberSince: input.memberSince ? String(input.memberSince) : undefined,
      category: input.category ? String(input.category) : undefined, role: input.role ? String(input.role) : undefined,
      photoUrl: input.photoUrl ? String(input.photoUrl) : undefined, notes: input.notes ? String(input.notes) : undefined,
    }).returning();
    res.status(201).json({ success: true, data: row });
  } catch (e) { next(e); }
});

router.get('/groups', async (req, res, next) => {
  try {
    const db = requireDb(); const tid = tenantId(req);
    const rows = await db.select().from(churchGroups).where(eq(churchGroups.tenantId, tid)).orderBy(desc(churchGroups.createdAt));
    res.json({ success: true, data: rows });
  } catch (e) { next(e); }
});

router.get('/finance/transactions', async (req, res, next) => {
  try {
    const db = requireDb(); const tid = tenantId(req);
    const rows = await db.select().from(financeTransactions).where(eq(financeTransactions.tenantId, tid)).orderBy(desc(financeTransactions.dueDate));
    res.json({ success: true, data: rows });
  } catch (e) { next(e); }
});

router.get('/assets', async (req, res, next) => {
  try {
    const db = requireDb(); const tid = tenantId(req);
    const rows = await db.select().from(churchAssets).where(eq(churchAssets.tenantId, tid)).orderBy(desc(churchAssets.createdAt));
    res.json({ success: true, data: rows });
  } catch (e) { next(e); }
});

router.get('/calendar/events', async (req, res, next) => {
  try {
    const db = requireDb(); const tid = tenantId(req);
    const rows = await db.select().from(calendarEvents).where(eq(calendarEvents.tenantId, tid)).orderBy(desc(calendarEvents.eventDate));
    res.json({ success: true, data: rows });
  } catch (e) { next(e); }
});

router.get('/media', async (req, res, next) => {
  try {
    const db = requireDb(); const tid = tenantId(req);
    const rows = await db.select().from(churchMedia).where(eq(churchMedia.tenantId, tid)).orderBy(desc(churchMedia.createdAt));
    res.json({ success: true, data: rows });
  } catch (e) { next(e); }
});

router.get('/education/studies', async (req, res, next) => {
  try {
    const db = requireDb(); const tid = tenantId(req);
    const rows = await db.select().from(educationStudies).where(eq(educationStudies.tenantId, tid)).orderBy(desc(educationStudies.createdAt));
    res.json({ success: true, data: rows });
  } catch (e) { next(e); }
});

router.get('/education/schools', async (req, res, next) => {
  try {
    const db = requireDb(); const tid = tenantId(req);
    const rows = await db.select().from(educationSchools).where(eq(educationSchools.tenantId, tid)).orderBy(desc(educationSchools.createdAt));
    res.json({ success: true, data: rows });
  } catch (e) { next(e); }
});

router.get('/education/classes', async (req, res, next) => {
  try {
    const db = requireDb(); const tid = tenantId(req);
    const rows = await db.select().from(educationClasses).where(eq(educationClasses.tenantId, tid)).orderBy(desc(educationClasses.createdAt));
    res.json({ success: true, data: rows });
  } catch (e) { next(e); }
});

router.get('/education/enrollments', async (req, res, next) => {
  try {
    const db = requireDb(); const tid = tenantId(req);
    const rows = await db.select().from(educationEnrollments).where(eq(educationEnrollments.tenantId, tid)).orderBy(desc(educationEnrollments.createdAt));
    res.json({ success: true, data: rows });
  } catch (e) { next(e); }
});

router.get('/education/attendance', async (req, res, next) => {
  try {
    const db = requireDb(); const tid = tenantId(req);
    const rows = await db.select().from(educationAttendance).where(eq(educationAttendance.tenantId, tid)).orderBy(desc(educationAttendance.createdAt));
    res.json({ success: true, data: rows });
  } catch (e) { next(e); }
});

router.get('/education/discipleship', async (req, res, next) => {
  try {
    const db = requireDb(); const tid = tenantId(req);
    const rows = await db.select().from(educationDiscipleship).where(eq(educationDiscipleship.tenantId, tid)).orderBy(desc(educationDiscipleship.createdAt));
    res.json({ success: true, data: rows });
  } catch (e) { next(e); }
});

router.post('/education/studies', async (req, res, next) => {
  try {
    const db = requireDb(); const tid = tenantId(req); const input = body(req);
    if (!input.title) throw ApiError.badRequest('title é obrigatório.');
    const [row] = await db.insert(educationStudies).values({
      id: input.id || crypto.randomUUID(), tenantId: tid, title: String(input.title),
      description: input.description ? String(input.description) : undefined,
      category: input.category ? String(input.category) : undefined,
      imageUrl: input.imageUrl ? String(input.imageUrl) : undefined,
      attachmentUrl: input.attachmentUrl ? String(input.attachmentUrl) : undefined,
    }).returning();
    res.status(201).json({ success: true, data: row });
  } catch (e) { next(e); }
});

export const churchRouter = router;
