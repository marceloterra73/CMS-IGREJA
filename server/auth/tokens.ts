import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import type { PermissionAction, UserRole, UserStatus } from '../../src/types/index.js';
import { ApiError } from '../errors/apiError.js';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  tenantId: string | null;
  role: UserRole;
  status: UserStatus;
  permissions: PermissionAction[];
}

export interface AccessTokenPayload {
  sub: string;
  email: string;
  name: string;
  tenantId: string | null;
  role: UserRole;
  status: UserStatus;
  permissions: PermissionAction[];
  type: 'access';
  iss?: string;
  aud?: string;
  exp?: number;
  iat?: number;
}

export interface RefreshTokenPayload {
  sub: string;
  sessionId: string;
  type: 'refresh';
  iss?: string;
  aud?: string;
  exp?: number;
  iat?: number;
}

const TOKEN_ISSUER = 'cms-visual-igrejas';
const TOKEN_AUDIENCE = 'cms-visual-client';
const ALLOWED_ALGORITHMS: jwt.Algorithm[] = ['HS256'];

export function signAccessToken(user: AuthenticatedUser): string {
  const secret = config.auth.jwtSecret;
  if (!secret) {
    throw new Error('JWT_SECRET não configurado.');
  }

  const payload: Omit<AccessTokenPayload, 'exp' | 'iat' | 'iss' | 'aud'> = {
    sub: user.id,
    email: user.email,
    name: user.name,
    tenantId: user.tenantId,
    role: user.role,
    status: user.status,
    permissions: user.permissions,
    type: 'access',
  };

  return jwt.sign(payload, secret, {
    algorithm: 'HS256',
    issuer: TOKEN_ISSUER,
    audience: TOKEN_AUDIENCE,
    expiresIn: config.auth.jwtExpiresIn,
  } as jwt.SignOptions);
}

export function signRefreshToken(userId: string, sessionId: string): string {
  const secret = config.auth.jwtRefreshSecret;
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET não configurado.');
  }

  const payload: Omit<RefreshTokenPayload, 'exp' | 'iat' | 'iss' | 'aud'> = {
    sub: userId,
    sessionId,
    type: 'refresh',
  };

  return jwt.sign(payload, secret, {
    algorithm: 'HS256',
    issuer: TOKEN_ISSUER,
    audience: TOKEN_AUDIENCE,
    expiresIn: config.auth.jwtRefreshExpiresIn,
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  if (!token || typeof token !== 'string') {
    throw ApiError.unauthorized('Token de acesso ausente ou inválido.');
  }

  const secret = config.auth.jwtSecret;
  if (!secret) {
    throw new Error('JWT_SECRET não configurado.');
  }

  try {
    const decoded = jwt.verify(token, secret, {
      algorithms: ALLOWED_ALGORITHMS,
      issuer: TOKEN_ISSUER,
      audience: TOKEN_AUDIENCE,
    }) as AccessTokenPayload;

    if (decoded.type !== 'access') {
      throw ApiError.unauthorized('Tipo de token inválido para acesso.');
    }

    if (!decoded.sub || !decoded.role) {
      throw ApiError.unauthorized('Payload de token corrompido ou incompleto.');
    }

    return decoded;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw ApiError.unauthorized('Token de acesso expirado. Por favor, renove sua sessão.');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw ApiError.unauthorized('Token de acesso inválido ou assinatura corrompida.');
    }
    throw ApiError.unauthorized('Falha na validação do token de acesso.');
  }
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  if (!token || typeof token !== 'string') {
    throw ApiError.unauthorized('Token de renovação ausente ou inválido.');
  }

  const secret = config.auth.jwtRefreshSecret;
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET não configurado.');
  }

  try {
    const decoded = jwt.verify(token, secret, {
      algorithms: ALLOWED_ALGORITHMS,
      issuer: TOKEN_ISSUER,
      audience: TOKEN_AUDIENCE,
    }) as RefreshTokenPayload;

    if (decoded.type !== 'refresh') {
      throw ApiError.unauthorized('Tipo de token inválido para renovação.');
    }

    if (!decoded.sub || !decoded.sessionId) {
      throw ApiError.unauthorized('Payload de token de renovação corrompido.');
    }

    return decoded;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw ApiError.unauthorized('Sessão expirada. Por favor, faça login novamente.');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw ApiError.unauthorized('Token de renovação inválido ou com assinatura corrompida.');
    }
    throw ApiError.unauthorized('Falha na validação do token de renovação.');
  }
}
