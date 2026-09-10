import type { Request, Response, NextFunction } from 'express';
import { extractAccessToken } from '../auth/cookies.js';
import { verifyAccessToken, type AuthenticatedUser } from '../auth/tokens.js';
import { ApiError } from '../errors/apiError.js';

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      tenantId?: string | null;
    }
  }
}

/**
 * Middleware central de Autenticação (Fase 58)
 *
 * Responsabilidade:
 * 1. Extrair e validar token de acesso assinado (Cookie HTTP-Only ou Header Bearer).
 * 2. Validar assinatura, algoritmo, integridade e expiração.
 * 3. Verificar se o status do usuário permite acesso (bloquear suspended/inactive).
 * 4. Injetar identidade canônica tipada em req.user.
 * 5. Definir o tenantId associado ao usuário.
 */
export function authenticateMiddleware(req: Request, res: Response, next: NextFunction): void {
  const token = extractAccessToken(req);

  if (!token) {
    return next(ApiError.unauthorized('Autenticação obrigatória para acessar este recurso.'));
  }

  try {
    const payload = verifyAccessToken(token);

    // Validação de status da conta do usuário
    if (payload.status === 'suspended') {
      return next(ApiError.forbidden('Conta de usuário suspensa pela administração.'));
    }

    if (payload.status === 'inactive') {
      return next(ApiError.forbidden('Conta de usuário inativa no sistema.'));
    }

    const authenticatedUser: AuthenticatedUser = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      tenantId: payload.tenantId,
      role: payload.role,
      status: payload.status,
      permissions: payload.permissions || [],
    };

    req.user = authenticatedUser;
    req.tenantId = authenticatedUser.tenantId;
    res.locals.user = authenticatedUser;

    return next();
  } catch (error) {
    return next(error);
  }
}

/**
 * Middleware de autenticação opcional (para rotas públicas que se adaptam se o usuário estiver logado)
 */
export function optionalAuthenticateMiddleware(req: Request, res: Response, next: NextFunction): void {
  const token = extractAccessToken(req);
  if (!token) {
    return next();
  }

  try {
    const payload = verifyAccessToken(token);
    if (payload.status === 'active') {
      req.user = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        tenantId: payload.tenantId,
        role: payload.role,
        status: payload.status,
        permissions: payload.permissions || [],
      };
      req.tenantId = req.user.tenantId;
      res.locals.user = req.user;
    }
  } catch {
    // Ignora erros de token em autenticação estritamente opcional
  }

  return next();
}
