/**
 * CMS CORE — DOMÍNIO: USERS & RBAC (USUÁRIOS, PAPÉIS E PERMISSÕES) (FASE 13)
 * Responsabilidade Arquitetural:
 * Define a fronteira declarativa de identidades, papéis conceituais e permissões no CMS.
 *
 * Arquitetura Oficial:
 * Tenant -> Usuários vinculados ao Tenant (User.tenantId) -> Papéis (UserRole) -> Permissões conceituais (PermissionAction)
 *
 * Fronteira estritamente declarativa de contratos de dados.
 * Proibido implementar autenticação (JWT, cookies, OAuth, sessões), senhas,
 * autorização em tempo de execução, guards, middlewares, ACLs executáveis ou CRUD funcional.
 */

export type {
  User,
  UserId,
  UserRole,
  UserStatus,
  RoleDefinition,
  PermissionAction,
} from '../types';
