import crypto from 'crypto';
import { eq, and } from 'drizzle-orm';
import { getDb } from '../db/index.js';
import { users, userSessions, type UserRecord } from '../db/schema/users.js';
import { hashPassword, verifyPassword } from './password.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  type AuthenticatedUser,
} from './tokens.js';
import { getUserEffectivePermissions } from './rbac.js';
import { ApiError } from '../errors/apiError.js';
import type { UserRole, UserStatus, PermissionAction } from '../../src/types/index.js';

export interface LoginParams {
  email: string;
  password: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface LoginResult {
  user: AuthenticatedUser;
  accessToken: string;
  refreshToken: string;
  sessionId: string;
}

export interface CreateUserParams {
  id?: string;
  tenantId?: string | null;
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  status?: UserStatus;
  isActive?: boolean;
  customPermissions?: PermissionAction[];
}

// Repositório em memória para ambiente de testes ou quando DB não estiver conectado
const inMemoryUsers = new Map<string, UserRecord>();
const inMemorySessions = new Map<
  string,
  {
    id: string;
    userId: string;
    refreshTokenHash: string;
    isRevoked: boolean;
    expiresAt: Date;
    createdAt: Date;
  }
>();

export function clearInMemoryAuthStore(): void {
  inMemoryUsers.clear();
  inMemorySessions.clear();
}

/**
 * Cria/registra usuário garantindo hashing seguro de senha.
 * Usado para semeadura controlada e testes de identidade.
 */
export async function createUser(params: CreateUserParams): Promise<UserRecord> {
  const normalizedEmail = params.email.toLowerCase().trim();
  const passwordHash = await hashPassword(params.password);
  const userId = params.id || crypto.randomUUID();

  const record: UserRecord = {
    id: userId,
    tenantId: params.tenantId || null,
    name: params.name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: params.role || 'editor',
    status: params.status || 'active',
    isActive: params.isActive ?? true,
    customPermissions: params.customPermissions || null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const db = getDb();
  if (db) {
    try {
      await db.insert(users).values(record);
    } catch {
      // Se falhar (ex: DB mock/offline), salva no store local
      inMemoryUsers.set(normalizedEmail, record);
    }
  } else {
    inMemoryUsers.set(normalizedEmail, record);
  }

  return record;
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const normalizedEmail = email.toLowerCase().trim();

  const db = getDb();
  if (db) {
    try {
      const results = await db
        .select()
        .from(users)
        .where(eq(users.email, normalizedEmail))
        .limit(1);
      if (results.length > 0) {
        return results[0];
      }
    } catch {
      // Fallback para store em memória
    }
  }

  return inMemoryUsers.get(normalizedEmail) || null;
}

export async function findUserById(id: string): Promise<UserRecord | null> {
  const db = getDb();
  if (db) {
    try {
      const results = await db.select().from(users).where(eq(users.id, id)).limit(1);
      if (results.length > 0) {
        return results[0];
      }
    } catch {
      // Fallback para store em memória
    }
  }

  for (const user of inMemoryUsers.values()) {
    if (user.id === id) return user;
  }
  return null;
}

/**
 * Autenticação de credenciais com proteção contra enumeração de contas
 */
export async function authenticate(params: LoginParams): Promise<LoginResult> {
  const { email, password, ipAddress, userAgent } = params;

  if (!email || typeof email !== 'string' || !email.includes('@') || email.length > 255) {
    throw ApiError.badRequest('Email inválido ou não informado.');
  }

  if (!password || typeof password !== 'string' || password.length > 128) {
    throw ApiError.badRequest('Senha inválida ou excede o comprimento máximo permitido.');
  }

  const user = await findUserByEmail(email);

  // Mensagem genérica: previne enumeração de contas
  if (!user) {
    throw ApiError.unauthorized('Credenciais inválidas.');
  }

  const isPasswordValid = await verifyPassword(password, user.passwordHash);
  if (!isPasswordValid) {
    throw ApiError.unauthorized('Credenciais inválidas.');
  }

  // Validação do status da conta
  if (user.status === 'suspended') {
    throw ApiError.forbidden('Conta suspensa pela administração.');
  }

  if (user.status === 'inactive' || !user.isActive) {
    throw ApiError.forbidden('Conta de usuário inativa no sistema.');
  }

  // Permissões canônicas calculadas
  const permissions = getUserEffectivePermissions(user.role, user.customPermissions);

  const authenticatedUser: AuthenticatedUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    tenantId: user.tenantId,
    role: user.role,
    status: user.status,
    permissions,
  };

  const sessionId = crypto.randomUUID();
  const accessToken = signAccessToken(authenticatedUser);
  const refreshToken = signRefreshToken(user.id, sessionId);

  // Hash do refresh token para persistência segura
  const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  const sessionExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const db = getDb();
  if (db) {
    try {
      await db.insert(userSessions).values({
        id: sessionId,
        userId: user.id,
        refreshTokenHash,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
        isRevoked: false,
        expiresAt: sessionExpiresAt,
      });
    } catch {
      inMemorySessions.set(sessionId, {
        id: sessionId,
        userId: user.id,
        refreshTokenHash,
        isRevoked: false,
        expiresAt: sessionExpiresAt,
        createdAt: new Date(),
      });
    }
  } else {
    inMemorySessions.set(sessionId, {
      id: sessionId,
      userId: user.id,
      refreshTokenHash,
      isRevoked: false,
      expiresAt: sessionExpiresAt,
      createdAt: new Date(),
    });
  }

  return {
    user: authenticatedUser,
    accessToken,
    refreshToken,
    sessionId,
  };
}

/**
 * Encerramento de sessão (Logout)
 */
export async function revokeSession(sessionId: string): Promise<void> {
  const db = getDb();
  if (db) {
    try {
      await db
        .update(userSessions)
        .set({ isRevoked: true, updatedAt: new Date() })
        .where(eq(userSessions.id, sessionId));
    } catch {
      const s = inMemorySessions.get(sessionId);
      if (s) s.isRevoked = true;
    }
  } else {
    const s = inMemorySessions.get(sessionId);
    if (s) s.isRevoked = true;
  }
}

/**
 * Renovação de sessão segura (Refresh Token Rotation)
 */
export async function refreshSessionToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string; user: AuthenticatedUser }> {
  const payload = verifyRefreshToken(refreshToken);

  const db = getDb();
  let sessionValid = false;

  const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

  if (db) {
    try {
      const sessions = await db
        .select()
        .from(userSessions)
        .where(and(eq(userSessions.id, payload.sessionId), eq(userSessions.isRevoked, false)))
        .limit(1);

      if (sessions.length > 0 && sessions[0].refreshTokenHash === tokenHash && sessions[0].expiresAt > new Date()) {
        sessionValid = true;
      }
    } catch {
      const s = inMemorySessions.get(payload.sessionId);
      if (s && !s.isRevoked && s.refreshTokenHash === tokenHash && s.expiresAt > new Date()) {
        sessionValid = true;
      }
    }
  } else {
    const s = inMemorySessions.get(payload.sessionId);
    if (s && !s.isRevoked && s.refreshTokenHash === tokenHash && s.expiresAt > new Date()) {
      sessionValid = true;
    }
  }

  if (!sessionValid) {
    throw ApiError.unauthorized('Sessão revogada ou expirada. Efetue login novamente.');
  }

  const user = await findUserById(payload.sub);
  if (!user || user.status !== 'active' || !user.isActive) {
    throw ApiError.forbidden('Conta inativa ou inexistente.');
  }

  // Revoga sessão anterior (rotação)
  await revokeSession(payload.sessionId);

  // Cria nova sessão
  const newSessionId = crypto.randomUUID();
  const permissions = getUserEffectivePermissions(user.role, user.customPermissions);
  const authenticatedUser: AuthenticatedUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    tenantId: user.tenantId,
    role: user.role,
    status: user.status,
    permissions,
  };

  const newAccessToken = signAccessToken(authenticatedUser);
  const newRefreshToken = signRefreshToken(user.id, newSessionId);
  const newRefreshTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
  const sessionExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  if (db) {
    try {
      await db.insert(userSessions).values({
        id: newSessionId,
        userId: user.id,
        refreshTokenHash: newRefreshTokenHash,
        isRevoked: false,
        expiresAt: sessionExpiresAt,
      });
    } catch {
      inMemorySessions.set(newSessionId, {
        id: newSessionId,
        userId: user.id,
        refreshTokenHash: newRefreshTokenHash,
        isRevoked: false,
        expiresAt: sessionExpiresAt,
        createdAt: new Date(),
      });
    }
  } else {
    inMemorySessions.set(newSessionId, {
      id: newSessionId,
      userId: user.id,
      refreshTokenHash: newRefreshTokenHash,
      isRevoked: false,
      expiresAt: sessionExpiresAt,
      createdAt: new Date(),
    });
  }

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    user: authenticatedUser,
  };
}
