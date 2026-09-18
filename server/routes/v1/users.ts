import crypto from 'node:crypto';
import { Router, type Request, type Response, type NextFunction } from 'express';
import { and, eq } from 'drizzle-orm';
import { users } from '../../db/schema/users.js';
import { getDb } from '../../db/index.js';
import { ApiError } from '../../errors/apiError.js';
import { authenticateMiddleware } from '../../middleware/authenticate.js';
import { hasPermission as hasRbacPermission, isValidRole } from '../../auth/rbac.js';
import { hashPassword } from '../../auth/password.js';

const router = Router();
router.use(authenticateMiddleware);

function currentUser(req: Request) { return (req as any).user; }
function requireUserManagement(req: Request) {
  const user = currentUser(req);
  if (!user || !hasRbacPermission(user.role, user.permissions, 'manage:users')) throw ApiError.forbidden('Permissão de gerenciamento de usuários necessária.');
  return user;
}
function db() { const value=getDb(); if(!value) throw ApiError.serviceUnavailable('Banco de dados indisponível.'); return value; }

router.get('/', async (req,res,next)=>{ try {
  const user=requireUserManagement(req); const rows=await db().select({id:users.id,name:users.name,email:users.email,role:users.role,status:users.status,isActive:users.isActive,customPermissions:users.customPermissions,createdAt:users.createdAt}).from(users).where(user.tenantId ? eq(users.tenantId,user.tenantId) : undefined);
  res.json({success:true,data:rows});
} catch(e){next(e);} });

router.post('/', async(req,res,next)=>{ try {
  const actor=requireUserManagement(req); const input=req.body||{};
  if(!input.name||!input.email||!input.password) throw ApiError.badRequest('name, email e password são obrigatórios.');
  if(String(input.password).length<8) throw ApiError.badRequest('A senha deve possuir pelo menos 8 caracteres.');
  const role=input.role||'editor'; if(!isValidRole(role)) throw ApiError.badRequest('Papel de usuário inválido.');
  if(actor.role!=='superadmin' && role==='superadmin') throw ApiError.forbidden('Somente superadmin pode criar outro superadmin.');
  const tenantId=actor.tenantId; if(!tenantId && actor.role!=='superadmin') throw ApiError.forbidden('Tenant não definido.');
  const normalized=String(input.email).toLowerCase().trim();
  const [exists]=await db().select({id:users.id}).from(users).where(and(eq(users.email,normalized),tenantId?eq(users.tenantId,tenantId):undefined)).limit(1);
  if(exists) throw ApiError.conflict('Já existe usuário com este e-mail neste tenant.');
  const passwordHash=await hashPassword(String(input.password));
  const [row]=await db().insert(users).values({id:crypto.randomUUID(),tenantId:tenantId||null,name:String(input.name).trim(),email:normalized,passwordHash,role,status:input.status||'active',isActive:true,customPermissions:Array.isArray(input.customPermissions)?input.customPermissions:undefined}).returning({id:users.id,name:users.name,email:users.email,role:users.role,status:users.status,isActive:users.isActive,customPermissions:users.customPermissions,createdAt:users.createdAt});
  res.status(201).json({success:true,data:row});
} catch(e){next(e);} });

router.patch('/:id', async(req,res,next)=>{ try {
  const actor=requireUserManagement(req); const input=req.body||{}; const conditions=[eq(users.id,req.params.id)]; if(actor.tenantId) conditions.push(eq(users.tenantId,actor.tenantId));
  const [target]=await db().select().from(users).where(and(...conditions)).limit(1); if(!target) throw ApiError.notFound('Usuário não encontrado.');
  if(input.role){ if(!isValidRole(input.role)) throw ApiError.badRequest('Papel de usuário inválido.'); if(actor.role!=='superadmin'&&input.role==='superadmin') throw ApiError.forbidden('Somente superadmin pode atribuir superadmin.'); }
  const update:any={updatedAt:new Date()}; for(const key of ['name','email','role','status','isActive','customPermissions']) if(input[key]!==undefined) update[key]=key==='email'?String(input[key]).toLowerCase().trim():input[key];
  if(input.password!==undefined){ if(String(input.password).length<8) throw ApiError.badRequest('A senha deve possuir pelo menos 8 caracteres.'); update.passwordHash=await hashPassword(String(input.password)); }
  const [row]=await db().update(users).set(update).where(and(...conditions)).returning({id:users.id,name:users.name,email:users.email,role:users.role,status:users.status,isActive:users.isActive,customPermissions:users.customPermissions,updatedAt:users.updatedAt});
  res.json({success:true,data:row});
} catch(e){next(e);} });

router.delete('/:id', async(req,res,next)=>{ try {
  const actor=requireUserManagement(req); if(actor.id===req.params.id) throw ApiError.badRequest('Não é permitido remover o próprio usuário.');
  const conditions=[eq(users.id,req.params.id)]; if(actor.tenantId) conditions.push(eq(users.tenantId,actor.tenantId));
  const [row]=await db().update(users).set({isActive:false,status:'inactive',deletedAt:new Date(),updatedAt:new Date()}).where(and(...conditions)).returning({id:users.id});
  if(!row) throw ApiError.notFound('Usuário não encontrado.');
  res.json({success:true,data:row});
} catch(e){next(e);} });

export const usersRouter = router;
