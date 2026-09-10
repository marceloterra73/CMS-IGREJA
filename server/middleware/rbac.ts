import type { Request, Response, NextFunction } from 'express';
import type { PermissionAction, UserRole } from '../../src/types/index.js';
import { ApiError } from '../errors/apiError.js';
import { hasRole } from '../auth/rbac.js';

/**
 * Middleware de Autorização Baseada em Papéis (RBAC) (Fase 58)
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(ApiError.unauthorized('Autenticação obrigatória antes da verificação de papel.'));
    }

    if (hasRole(req.user.role, allowedRoles)) {
      return next();
    }

    return next(
      ApiError.forbidden(
        `Acesso negado: papel "${req.user.role}" não possui autorização para este recurso.`
      )
    );
  };
}

/**
 * Middleware de Autorização Granular por Permissão (Fase 58)
 */
export function requirePermission(...requiredPermissions: PermissionAction[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(ApiError.unauthorized('Autenticação obrigatória antes da verificação de permissão.'));
    }

    // Superadmin possui todas as permissões do sistema
    if (req.user.role === 'superadmin') {
      return next();
    }

    const userPermissions = new Set(req.user.permissions || []);
    const missingPermissions = requiredPermissions.filter((perm) => !userPermissions.has(perm));

    if (missingPermissions.length > 0) {
      return next(
        ApiError.forbidden(
          `Acesso negado: permissão(ões) ausente(s): [${missingPermissions.join(', ')}].`
        )
      );
    }

    return next();
  };
}

/**
 * Middleware de Isolamento e Validação Estrita de Tenant (Anti-IDOR) (Fase 58)
 *
 * Garante que:
 * 1. O usuário regular só pode operar estritamente no seu próprio tenant (req.user.tenantId).
 * 2. Qualquer tentativa de acessar tenant diferente (via header X-Tenant-ID, query ou params)
 *    por um usuário regular é sumariamente rejeitada com 403 Forbidden.
 * 3. O papel 'superadmin' pode gerenciar congregações informando X-Tenant-ID.
 */
export function requireTenantContext(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) {
    return next(ApiError.unauthorized('Autenticação obrigatória.'));
  }

  const requestedTenantId =
    (req.headers['x-tenant-id'] as string | undefined) ||
    req.params.tenantId ||
    (req.query.tenantId as string | undefined);

  if (req.user.role === 'superadmin') {
    // Superadmin pode definir o tenant alvo ou operar globalmente
    if (requestedTenantId) {
      req.tenantId = requestedTenantId;
    } else {
      req.tenantId = req.user.tenantId || null;
    }
    return next();
  }

  // Usuário regular NÃO PODE operar sem tenantId vinculado
  if (!req.user.tenantId) {
    return next(ApiError.forbidden('Usuário não possui congregação vinculada.'));
  }

  // Se solicitou explicitamente outro tenant, rejeita violação de isolamento multi-tenant
  if (requestedTenantId && requestedTenantId !== req.user.tenantId) {
    return next(
      ApiError.forbidden(
        'Violação de isolamento multi-tenant: não é permitido acessar dados de outra congregação.'
      )
    );
  }

  // Trava o tenantId estritamente na identidade autenticada
  req.tenantId = req.user.tenantId;
  return next();
}
