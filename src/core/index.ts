/**
 * CMS CORE — NÚCLEO ESTRUTURAL E ORGANIZAÇÃO INTERNA (FASE 3)
 * Ponto central de organização e exposição arquitetural dos domínios internos do CMS Core:
 *
 * CMS CORE
 * ├── Content     (Estrutura geral de conteúdo e regras hierárquicas)
 * ├── Pages       (Fronteira de páginas: Page -> sections[] -> blocks[])
 * ├── Sections    (Fronteira de seções como contêineres de blocos)
 * ├── Blocks      (Fronteira de blocos atômicos protegidos contra código arbitrário)
 * ├── Navigation  (Fronteira de menus e estrutura de links)
 * ├── Media       (Fronteira da biblioteca de arquivos protegida por tenant)
 * └── Modules     (Integração declarativa com módulos eclesiais)
 *
 * Este arquivo é estritamente declarativo e estrutural.
 * Proibido transformá-lo em Engine, Runtime, Service Locator ou Dependency Container.
 */

// 1. Domínios arquiteturais internos organizados
export * as ContentDomain from './content';
export * as PagesDomain from './pages';
export * as TemplatesDomain from './templates';
export * as ThemeDomain from './theme';
export * as SectionsDomain from './sections';
export * as BlocksDomain from './blocks';
export * as NavigationDomain from './navigation';
export * as MediaDomain from './media';
export * as ModulesDomain from './modules';
export * as ReferencesDomain from './references';
export * as SeoDomain from './seo';
export * as SettingsDomain from './settings';
export * as DomainsDomain from './domains';
export * as PublicationDomain from './publication';
export * as RedirectsDomain from './redirects';
export * as FormsDomain from './forms';
export * as AnalyticsDomain from './analytics';
export * as PersistenceDomain from './persistence';

// 2. Exportação unificada dos contratos e catálogos a partir de seus domínios canônicos
export * from './content';
export * from './pages';
export * from './templates';
export * from './theme';
export * from './sections';
export * from './blocks';
export * from './navigation';
export * from './media';
export * from './modules';
export * from './users';
export * from './references';
export * from './seo';
export * from './settings';
export * from './domains';
export * from './publication';
export * from './redirects';
export * from './forms';
export * from './analytics';
export * from './persistence';

// 3. Contratos fundamentais do contexto superior (Tenant e RBAC)
export type {
  Tenant,
  TenantId,
  TenantStatus,
  ContentStatus,
  ChurchProfile,
  ChurchAddress,
  ChurchContact,
  ChurchSocialLinks,
  InstitutionalContent,
  User,
  UserId,
  UserRole,
  UserStatus,
  RoleDefinition,
  PermissionAction,
  ContentReference,
  ContentReferenceType,
  SiteSEO,
  PageSEO,
  RobotsDirective,
  OpenGraphMetadata,
  TwitterCardMetadata,
  SiteSettings,
  SiteDomainType,
  SiteDomainStatus,
  SiteDomain,
  SiteVisibility,
  SitePublicationSettings,
  SiteRedirectType,
  SiteRedirectTargetType,
  SiteRedirect,
  FormStatus,
  FormFieldType,
  FormFieldOption,
  FormFieldDefinition,
  FormDefinition,
  FormSubmissionStatus,
  FormSubmissionValue,
  FormSubmission,
  SiteAnalyticsProvider,
  SiteAnalytics,
} from '../types';

