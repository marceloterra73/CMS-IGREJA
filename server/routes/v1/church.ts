import { Router, type Request } from 'express';
import { and, eq, desc } from 'drizzle-orm';
import { getDb } from '../../db/index.js';
import { ApiError } from '../../errors/apiError.js';
import { authenticateMiddleware } from '../../middleware/authenticate.js';
import { churchPeople } from '../../db/schema/people.js';
import { churchGroups, churchGroupLeaders, churchGroupMeetings } from '../../db/schema/groups.js';
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


function optionalString(value: unknown): string | undefined {
  return value === undefined || value === null || value === '' ? undefined : String(value);
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


router.get('/people/:id', async (req, res, next) => {
  try {
    const db = requireDb(); const tid = tenantId(req);
    const [row] = await db.select().from(churchPeople).where(and(eq(churchPeople.id, req.params.id), eq(churchPeople.tenantId, tid))).limit(1);
    if (!row) throw ApiError.notFound('Pessoa não encontrada.');
    res.json({ success: true, data: row });
  } catch (e) { next(e); }
});

router.patch('/people/:id', async (req, res, next) => {
  try {
    const db = requireDb(); const tid = tenantId(req); const input = body(req);
    const updates: Record<string, unknown> = {};
    for (const key of ['fullName','preferredName','email','phone','birthDate','memberSince','category','role','photoUrl','notes','isActive']) {
      if (input[key] !== undefined) updates[key] = key === 'isActive' ? Boolean(input[key]) : (input[key] === null || input[key] === '' ? null : String(input[key]));
    }
    if (updates.fullName === '') throw ApiError.badRequest('fullName não pode ser vazio.');
    if (!Object.keys(updates).length) throw ApiError.badRequest('Nenhum campo para atualizar.');
    updates.updatedAt = new Date();
    const [row] = await db.update(churchPeople).set(updates as any).where(and(eq(churchPeople.id, req.params.id), eq(churchPeople.tenantId, tid))).returning();
    if (!row) throw ApiError.notFound('Pessoa não encontrada.');
    res.json({ success: true, data: row });
  } catch (e) { next(e); }
});

router.delete('/people/:id', async (req, res, next) => {
  try {
    const db = requireDb(); const tid = tenantId(req);
    const [row] = await db.update(churchPeople).set({ isActive: false, updatedAt: new Date() }).where(and(eq(churchPeople.id, req.params.id), eq(churchPeople.tenantId, tid))).returning();
    if (!row) throw ApiError.notFound('Pessoa não encontrada.');
    res.json({ success: true, data: row });
  } catch (e) { next(e); }
});

router.post('/groups', async (req, res, next) => {
  try {
    const db = requireDb(); const tid = tenantId(req); const input = body(req);
    if (!input.name) throw ApiError.badRequest('name é obrigatório.');
    const [row] = await db.insert(churchGroups).values({
      id: input.id || crypto.randomUUID(), tenantId: tid, name: String(input.name),
      category: optionalString(input.category) || 'cell', description: optionalString(input.description),
      meetingDay: optionalString(input.meetingDay), meetingTime: optionalString(input.meetingTime), location: optionalString(input.location),
    }).returning();
    res.status(201).json({ success: true, data: row });
  } catch (e) { next(e); }
});

router.get('/groups/:id', async (req, res, next) => {
  try {
    const db = requireDb(); const tid = tenantId(req);
    const [row] = await db.select().from(churchGroups).where(and(eq(churchGroups.id, req.params.id), eq(churchGroups.tenantId, tid))).limit(1);
    if (!row) throw ApiError.notFound('Grupo não encontrado.');
    res.json({ success: true, data: row });
  } catch (e) { next(e); }
});

router.patch('/groups/:id', async (req, res, next) => {
  try {
    const db = requireDb(); const tid = tenantId(req); const input = body(req);
    const updates: Record<string, unknown> = {};
    for (const key of ['name','category','description','meetingDay','meetingTime','location','isActive']) {
      if (input[key] !== undefined) updates[key] = key === 'isActive' ? Boolean(input[key]) : (input[key] === null || input[key] === '' ? null : String(input[key]));
    }
    if (!Object.keys(updates).length) throw ApiError.badRequest('Nenhum campo para atualizar.');
    if (updates.name === '') throw ApiError.badRequest('name não pode ser vazio.');
    updates.updatedAt = new Date();
    const [row] = await db.update(churchGroups).set(updates as any).where(and(eq(churchGroups.id, req.params.id), eq(churchGroups.tenantId, tid))).returning();
    if (!row) throw ApiError.notFound('Grupo não encontrado.');
    res.json({ success: true, data: row });
  } catch (e) { next(e); }
});

router.delete('/groups/:id', async (req, res, next) => {
  try {
    const db = requireDb(); const tid = tenantId(req);
    const [row] = await db.update(churchGroups).set({ isActive: false, updatedAt: new Date() }).where(and(eq(churchGroups.id, req.params.id), eq(churchGroups.tenantId, tid))).returning();
    if (!row) throw ApiError.notFound('Grupo não encontrado.');
    res.json({ success: true, data: row });
  } catch (e) { next(e); }
});

router.get('/groups/:id/leaders', async (req, res, next) => {
  try {
    const db = requireDb(); const tid = tenantId(req);
    const [group] = await db.select({ id: churchGroups.id }).from(churchGroups).where(and(eq(churchGroups.id, req.params.id), eq(churchGroups.tenantId, tid))).limit(1);
    if (!group) throw ApiError.notFound('Grupo não encontrado.');
    const rows = await db.select().from(churchGroupLeaders).where(and(eq(churchGroupLeaders.groupId, req.params.id), eq(churchGroupLeaders.tenantId, tid))).orderBy(churchGroupLeaders.leadershipOrder);
    res.json({ success: true, data: rows });
  } catch (e) { next(e); }
});

router.post('/groups/:id/leaders', async (req, res, next) => {
  try {
    const db = requireDb(); const tid = tenantId(req); const input = body(req);
    const [group] = await db.select({ id: churchGroups.id }).from(churchGroups).where(and(eq(churchGroups.id, req.params.id), eq(churchGroups.tenantId, tid))).limit(1);
    if (!group) throw ApiError.notFound('Grupo não encontrado.');
    if (!input.personId) throw ApiError.badRequest('personId é obrigatório.');
    const [person] = await db.select({ id: churchPeople.id }).from(churchPeople).where(and(eq(churchPeople.id, String(input.personId)), eq(churchPeople.tenantId, tid))).limit(1);
    if (!person) throw ApiError.notFound('Pessoa não encontrada neste tenant.');
    const leaders = await db.select({ id: churchGroupLeaders.id }).from(churchGroupLeaders).where(and(eq(churchGroupLeaders.groupId, req.params.id), eq(churchGroupLeaders.tenantId, tid)));
    if (leaders.length >= 4) throw ApiError.unprocessableEntity('Um grupo pode ter no máximo quatro líderes.');
    const [row] = await db.insert(churchGroupLeaders).values({
      id: input.id || crypto.randomUUID(), tenantId: tid, groupId: req.params.id, personId: String(input.personId),
      leadershipOrder: Number(input.leadershipOrder) || leaders.length + 1,
    }).returning();
    res.status(201).json({ success: true, data: row });
  } catch (e) { next(e); }
});

router.delete('/groups/:id/leaders/:leaderId', async (req, res, next) => {
  try {
    const db = requireDb(); const tid = tenantId(req);
    const [row] = await db.delete(churchGroupLeaders).where(and(eq(churchGroupLeaders.id, req.params.leaderId), eq(churchGroupLeaders.groupId, req.params.id), eq(churchGroupLeaders.tenantId, tid))).returning();
    if (!row) throw ApiError.notFound('Líder não encontrado.');
    res.json({ success: true, data: row });
  } catch (e) { next(e); }
});

router.get('/groups/:id/meetings', async (req, res, next) => {
  try {
    const db = requireDb(); const tid = tenantId(req);
    const [group] = await db.select({ id: churchGroups.id }).from(churchGroups).where(and(eq(churchGroups.id, req.params.id), eq(churchGroups.tenantId, tid))).limit(1);
    if (!group) throw ApiError.notFound('Grupo não encontrado.');
    const rows = await db.select().from(churchGroupMeetings).where(and(eq(churchGroupMeetings.groupId, req.params.id), eq(churchGroupMeetings.tenantId, tid))).orderBy(desc(churchGroupMeetings.meetingDate));
    res.json({ success: true, data: rows });
  } catch (e) { next(e); }
});

router.post('/groups/:id/meetings', async (req, res, next) => {
  try {
    const db = requireDb(); const tid = tenantId(req); const input = body(req);
    const [group] = await db.select({ id: churchGroups.id }).from(churchGroups).where(and(eq(churchGroups.id, req.params.id), eq(churchGroups.tenantId, tid))).limit(1);
    if (!group) throw ApiError.notFound('Grupo não encontrado.');
    if (!input.meetingDate) throw ApiError.badRequest('meetingDate é obrigatório.');
    const [row] = await db.insert(churchGroupMeetings).values({
      id: input.id || crypto.randomUUID(), tenantId: tid, groupId: req.params.id, meetingDate: String(input.meetingDate),
      theme: optionalString(input.theme), presentCount: Number(input.presentCount) || 0,
      visitorCount: Number(input.visitorCount) || 0, absentCount: Number(input.absentCount) || 0,
      selfieUrl: optionalString(input.selfieUrl), notes: optionalString(input.notes),
    }).returning();
    res.status(201).json({ success: true, data: row });
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
