/**
 * MAPEADOR DE RECURSOS E ORDENAÇÃO DE DEPENDÊNCIAS — FASE 60
 * CMS Visual para Igrejas
 *
 * Mapeia contratos locais para tabelas do PostgreSQL e define
 * a ordem topológica obrigatória de migração para respeitar Foreign Keys e RLS.
 */

export interface ResourceTableMapping {
  localResource: string;
  apiPath: string;
  targetTable: string;
  dependencyOrder: number;
  isHierarchical?: boolean;
}

export const RESOURCE_MAPPINGS: Record<string, ResourceTableMapping> = {
  // 1. Temas visuais (devem ser inseridos logo após a existência do tenant)
  themes: {
    localResource: 'themes',
    apiPath: '/api/v1/resources/themes',
    targetTable: 'visual_themes',
    dependencyOrder: 10,
  },
  active_theme_id: {
    localResource: 'active_theme_id',
    apiPath: '/api/v1/resources/active_theme_id',
    targetTable: 'visual_themes',
    dependencyOrder: 15,
  },

  // 2. Configurações gerais e institucionais
  settings: {
    localResource: 'settings',
    apiPath: '/api/v1/resources/settings',
    targetTable: 'site_settings',
    dependencyOrder: 20,
  },
  institutional: {
    localResource: 'institutional',
    apiPath: '/api/v1/resources/institutional',
    targetTable: 'institutional_contents',
    dependencyOrder: 25,
  },
  analytics: {
    localResource: 'analytics',
    apiPath: '/api/v1/resources/analytics',
    targetTable: 'site_analytics',
    dependencyOrder: 30,
  },
  domains: {
    localResource: 'domains',
    apiPath: '/api/v1/resources/domains',
    targetTable: 'site_domains',
    dependencyOrder: 35,
  },

  // 3. Módulos eclesiais
  schedules: {
    localResource: 'schedules',
    apiPath: '/api/v1/resources/schedules',
    targetTable: 'church_schedules',
    dependencyOrder: 40,
  },
  donations: {
    localResource: 'donations',
    apiPath: '/api/v1/resources/donations',
    targetTable: 'church_donations',
    dependencyOrder: 45,
  },
  live_stream: {
    localResource: 'live_stream',
    apiPath: '/api/v1/resources/live_stream',
    targetTable: 'church_live_streams',
    dependencyOrder: 50,
  },

  // 4. Navegação
  navigation: {
    localResource: 'navigation',
    apiPath: '/api/v1/resources/navigation',
    targetTable: 'navigation_menus',
    dependencyOrder: 60,
  },

  // 5. Páginas hierárquicas (pages -> page_sections -> page_blocks)
  pages: {
    localResource: 'pages',
    apiPath: '/api/v1/resources/pages',
    targetTable: 'pages',
    dependencyOrder: 70,
    isHierarchical: true,
  },

  seo_site: {
    localResource: 'seo_site',
    apiPath: '/api/v1/resources/seo_site',
    targetTable: 'site_settings',
    dependencyOrder: 80,
  },
};

/**
 * Retorna os recursos canônicos ordenados pela dependência estrita de chaves estrangeiras.
 */
export function getOrderedMigrationResources(): ResourceTableMapping[] {
  return Object.values(RESOURCE_MAPPINGS).sort(
    (a, b) => a.dependencyOrder - b.dependencyOrder
  );
}
