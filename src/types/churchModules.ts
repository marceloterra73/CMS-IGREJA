export type ChurchModuleKey =
  | 'people'
  | 'groups'
  | 'education'
  | 'finance'
  | 'assets'
  | 'calendar'
  | 'media';

export type PermissionAction = 'view' | 'create' | 'update' | 'delete' | 'manage';

export interface ChurchModuleDefinition {
  key: ChurchModuleKey;
  label: string;
  description: string;
  permissions: `${ChurchModuleKey}.${PermissionAction}`[];
}

const actions: PermissionAction[] = ['view', 'create', 'update', 'delete', 'manage'];

export const CHURCH_MODULES: ChurchModuleDefinition[] = [
  {
    key: 'people',
    label: 'Pessoas',
    description: 'Membros, cargos, cartões, categorias e campos personalizados.',
    permissions: actions.map((action) => `people.${action}` as const),
  },
  {
    key: 'groups',
    label: 'Grupos',
    description: 'Células, ministérios, líderes, frequências e relatórios.',
    permissions: actions.map((action) => `groups.${action}` as const),
  },
  {
    key: 'education',
    label: 'Ensino',
    description: 'Estudos, escolas, turmas, alunos e discipulado.',
    permissions: actions.map((action) => `education.${action}` as const),
  },
  {
    key: 'finance',
    label: 'Financeiro',
    description: 'Receitas, despesas, contas, fornecedores e centros de custos.',
    permissions: actions.map((action) => `finance.${action}` as const),
  },
  {
    key: 'assets',
    label: 'Patrimônio',
    description: 'Bens, categorias, localizações e movimentações.',
    permissions: actions.map((action) => `assets.${action}` as const),
  },
  {
    key: 'calendar',
    label: 'Agenda',
    description: 'Eventos, recorrências, mural, notificações e notas privadas.',
    permissions: actions.map((action) => `calendar.${action}` as const),
  },
  {
    key: 'media',
    label: 'Mídias',
    description: 'Álbuns, fotos, vídeos, documentos e arquivos para download.',
    permissions: actions.map((action) => `media.${action}` as const),
  },
];

export const ALL_CHURCH_PERMISSIONS = CHURCH_MODULES.flatMap((module) => module.permissions);

export function hasPermission(
  grantedPermissions: readonly string[],
  requiredPermission: string,
): boolean {
  return grantedPermissions.includes('*') || grantedPermissions.includes(requiredPermission);
}
