import type { PermissionAction, UserRole } from '../../src/types/index.js';

/**
 * Matriz Canônica de Papéis e Permissões (RBAC) (Fase 58)
 *
 * Mapeia os 5 papéis oficiais e 13 permissões canônicas definidos
 * em ARCHITECTURE.md (seções 3.4 e 3.5) e PRODUCTION_ARCHITECTURE.md (seção 7).
 */

export const ALL_CANONICAL_PERMISSIONS: PermissionAction[] = [
  ...(['people','groups','education','finance','assets','calendar','media'].flatMap((module) =>
    ['view','create','update','delete','manage'].map((action) => `${module}.${action}` as PermissionAction),
  )),
  'manage:tenant',
  'manage:users',
  'manage:pages',
  'publish:pages',
  'manage:blocks',
  'manage:media',
  'manage:navigation',
  'manage:themes',
  'manage:modules',
  'manage:sermons',
  'manage:events',
  'manage:prayer_requests',
  'view:analytics',
];

export const ROLE_PERMISSIONS: Record<UserRole, PermissionAction[]> = {
  superadmin: [...ALL_CANONICAL_PERMISSIONS],
  tenant_admin: [...ALL_CANONICAL_PERMISSIONS],
  pastor: [
    'manage:pages',
    'publish:pages',
    'manage:modules',
    'manage:sermons',
    'manage:events',
    'manage:prayer_requests',
    'view:analytics',
  ],
  editor: [
    'manage:pages',
    'manage:blocks',
    'manage:modules',
    'manage:events',
    'manage:sermons',
    'manage:media',
    'manage:navigation',
  ],
  media_volunteer: ['manage:media', 'manage:modules'],
};

export const CANONICAL_ROLES: UserRole[] = [
  'superadmin',
  'tenant_admin',
  'pastor',
  'editor',
  'media_volunteer',
];

export function isValidRole(role: string): role is UserRole {
  return CANONICAL_ROLES.includes(role as UserRole);
}

export function getUserEffectivePermissions(
  role: UserRole,
  customPermissions?: PermissionAction[] | null
): PermissionAction[] {
  const basePermissions = ROLE_PERMISSIONS[role] || [];
  if (!customPermissions || !Array.isArray(customPermissions)) {
    return [...basePermissions];
  }

  // Combina e remove duplicatas
  const set = new Set<PermissionAction>([...basePermissions, ...customPermissions]);
  return Array.from(set);
}

export function hasPermission(
  role: UserRole,
  customPermissions: PermissionAction[] | null | undefined,
  requiredPermission: PermissionAction
): boolean {
  if (role === 'superadmin') {
    return true;
  }
  const effective = getUserEffectivePermissions(role, customPermissions);
  return effective.includes(requiredPermission);
}

export function hasRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  if (userRole === 'superadmin') {
    return true;
  }
  return allowedRoles.includes(userRole);
}
