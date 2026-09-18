/**
 * CMS VISUAL PARA IGREJAS — MODELO DE DADOS E CONTRATOS DO CMS (FASE 2)
 * Contratos conceituais fundamentais para suportar o modelo:
 * Tenant └── Pages └── Sections └── Blocks └── Config/Data
 */

// ==========================================
// 1. IDENTIFICADORES TIPADOS
// ==========================================
export type TenantId = string;
export type BlockId = string;
export type SectionId = string;
export type PageId = string;
export type UserId = string;
export type MediaId = string;
export type NavigationMenuId = string;

// ==========================================
// 2. STATUS E ENUMS CONCEITUAIS (FASE 15 — CONSOLIDAÇÃO DE ESTADOS E CICLO DE VIDA)
// ==========================================
export type TenantStatus = 'active' | 'inactive' | 'suspended';

/**
 * Ciclo de vida editorial canônico do conteúdo (Fase 15)
 * Representa os estados declarativos de ciclo de vida de conteúdos editáveis e publicáveis:
 * draft -> published -> archived
 *
 * PROIBIÇÃO ARQUITETURAL:
 * - Apenas modelo de dados declarativo.
 * - Proibido implementar máquinas de estado, workflow engines, transições automáticas ou rotinas de publicação.
 */
export type ContentStatus = 'draft' | 'published' | 'archived';

export type PageStatus = ContentStatus;

// ==========================================
// 3. CONTEÚDO INSTITUCIONAL & TENANT (IGREJA) (FASE 11)
// ==========================================

/**
 * Endereço físico da congregação
 */
export interface ChurchAddress {
  street: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city: string;
  state: string;
  postalCode?: string;
  country?: string;
}

/**
 * Canais de contato institucional
 */
export interface ChurchContact {
  email: string;
  phone?: string;
  whatsapp?: string;
}

/**
 * Links oficiais de redes sociais
 */
export interface ChurchSocialLinks {
  instagram?: string;
  youtube?: string;
  facebook?: string;
  spotify?: string;
}

/**
 * Perfil institucional eclesiástico da igreja (Fase 11 - Fonte Canônica Única)
 * Dados básicos e identidade institucional da igreja.
 * Endereço, contato e redes sociais residem exclusivamente em InstitutionalContent.
 */
export interface ChurchProfile {
  name?: string;
  shortName?: string;
  description?: string;
  tagline?: string;
  slogan?: string;
  denomination?: string;
  leadPastor?: string;
  foundingYear?: number;
  logoMediaId?: MediaId;
  logoUrl?: string;
}

/**
 * Contrato Canônico de Conteúdo Institucional da Igreja (Fase 11)
 *
 * Única fonte agrupadora canônica das informações institucionais do Tenant.
 * Reutiliza estritamente os contratos canônicos: ChurchProfile, ChurchAddress, ChurchContact, ChurchSocialLinks.
 *
 * PROIBIÇÕES ARQUITETURAIS:
 * - Não é página nem contém sections[], blocks[] ou HTML/CSS.
 * - Não é formulário nem possui validações ou rotinas de submissão.
 * - Não realiza envio de e-mails, disparos de WhatsApp ou chamadas de API externas.
 */
export interface InstitutionalContent {
  tenantId: TenantId;
  profile: ChurchProfile;
  address?: ChurchAddress;
  contact?: ChurchContact;
  socialLinks?: ChurchSocialLinks;
  updatedAt?: string;
}

/**
 * Representação conceitual do Tenant (Igreja / Congregação proprietária)
 * Utiliza exclusivamente o agrupador institucional canônico 'institutionalContent'.
 */
export interface Tenant {
  id: TenantId;
  name: string;
  slug: string;
  status: TenantStatus;
  customDomain?: string;
  logoUrl?: string;
  contactEmail: string;
  phone?: string;
  institutionalContent?: InstitutionalContent;
  activeModules: ChurchModuleType[];
  seo?: SiteSEO;
  siteSettings?: SiteSettings;
  domains?: SiteDomain[];
  pages?: Page[];
  publication?: SitePublicationSettings;
  redirects?: SiteRedirect[];
  forms?: FormDefinition[];
  analytics?: SiteAnalytics;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 4. NAVEGAÇÃO E MENUS (FASE 9)
// ==========================================

export type MenuLocation = 'header' | 'footer' | 'mobile' | 'mobile_drawer' | 'sidebar';

export type NavigationMenuStatus = 'active' | 'draft' | 'archived';

/**
 * Tipo discriminador de destino de um item de navegação
 */
export type NavigationTargetType = 'page' | 'external';

/**
 * Destino declarativo e tipado para página interna do CMS
 */
export interface NavigationPageTarget {
  type: 'page';
  pageId: PageId;
  openInNewTab?: boolean;
}

/**
 * Destino declarativo e tipado para URL externa controlada
 */
export interface NavigationExternalTarget {
  type: 'external';
  url: string;
  openInNewTab?: boolean;
}

/**
 * Destino discriminado de navegação (Fase 9)
 * Relação: NavigationItem -> target -> PageId | URL externa
 */
export type NavigationTarget = NavigationPageTarget | NavigationExternalTarget;

/**
 * Contrato Canônico de Item de Navegação (Fase 9)
 *
 * Suporta hierarquia pai/filho através de parentId e/ou children,
 * ordem sequencial, controle de visibilidade e destino tipado (target).
 */
export interface NavigationItem {
  id: string;
  label: string;
  order: number;
  isVisible: boolean;
  parentId?: string;
  target?: NavigationTarget;
  url?: string;
  isExternal?: boolean;
  openInNewTab?: boolean;
  children?: NavigationItem[];
}

/**
 * Contrato Canônico de Menu de Navegação do site (Fase 9)
 *
 * Cadeia Arquitetural:
 * Tenant -> NavigationMenu -> NavigationItem -> Target (PageId | URL externa)
 *
 * PROIBIÇÕES ARQUITETURAIS:
 * - Não é roteador nem possui listeners ou callbacks de clique.
 * - Não possui componentes React, HTML, CSS ou JavaScript.
 * - Não duplica a hierarquia Page -> Sections -> Blocks.
 */
export interface NavigationMenu {
  id: NavigationMenuId;
  tenantId: TenantId;
  name: string;
  location: MenuLocation;
  items: NavigationItem[];
  status?: NavigationMenuStatus;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 5. BIBLIOTECA DE MÍDIA (FASE 10)
// ==========================================

export type MediaType = 'image' | 'video' | 'audio' | 'document';

export type MediaStatus = 'active' | 'archived';

export interface MediaDimensions {
  width: number;
  height: number;
}

/**
 * Entidade conceitual e declarativa de Mídia vinculada por Tenant (Fase 10)
 *
 * Cadeia Arquitetural:
 * Tenant -> Media Library -> MediaItem -> BlockData (ex: ImageFieldData.mediaId)
 *
 * PROIBIÇÕES ARQUITETURAIS:
 * - Não é mecanismo de upload, storage, CDN ou processador de imagens.
 * - Não possui adaptadores de arquivos, serviços de redimensionamento ou compressão.
 * - Não possui HTML, CSS, JavaScript ou código executável.
 */
export interface MediaItem {
  id: MediaId;
  tenantId: TenantId;
  title?: string;
  filename: string;
  originalName: string;
  mimeType: string;
  type: MediaType;
  sizeBytes: number;
  url: string;
  altText?: string;
  dimensions?: MediaDimensions;
  folder?: string;
  status?: MediaStatus;
  uploadedBy?: UserId;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 6. MOTOR ESTRUTURAL DE CONTEÚDO
//    Hierarquia: Page └── sections[] └── blocks[] └── config/data
// ==========================================

/**
 * Metadados de SEO da página (Preservado e Complementado na Fase 16)
 * Permite override declarativo dos metadados globais (SiteSEO) para a página específica.
 */
export interface PageSEO {
  metaTitle: string;
  metaDescription: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
  canonicalUrl?: string;
  imageMediaId?: MediaId;
  robots?: RobotsDirective;
  openGraph?: OpenGraphMetadata;
  twitter?: TwitterCardMetadata;
}

/**
 * Catálogo de tipos de blocos suportados pelo CMS
 */
export type BlockType =
  | 'header'
  | 'hero'
  | 'about'
  | 'ministries'
  | 'schedule'
  | 'events'
  | 'news'
  | 'sermons'
  | 'live_stream'
  | 'prayer_request'
  | 'donations'
  | 'leadership'
  | 'gallery'
  | 'contact'
  | 'footer';

/**
 * Configurações permitidas para estilização e layout de bloco
 * (O usuário altera exclusivamente configurações estruturadas e seguras. CSS livre é proibido.)
 */
export interface BlockConfig {
  themeVariant?: 'light' | 'dark' | 'accent' | 'neutral';
  backgroundColor?: string;
  textColor?: string;
  paddingY?: 'none' | 'small' | 'medium' | 'large';
  containerWidth?: 'narrow' | 'standard' | 'wide' | 'full';
  alignment?: 'left' | 'center' | 'right';
  showBorders?: boolean;
}

/**
 * Instância estruturada de um Bloco em uma Seção
 */
export type BlockDataRecord = Record<string, BlockDataValue>;

export interface BlockInstance<TData = BlockDataRecord> {
  id: BlockId;
  type: BlockType;
  order: number;
  isVisible: boolean;
  config: BlockConfig;
  data: TData;
}

// ==========================================
// 7. SISTEMA DE BLOCOS E DADOS EDITÁVEIS (FASE 4)
//    Contratos e Schemas tipados para edição estruturada e segura.
//    Arquitetura: Block Type -> Data Schema -> Typed Data Instance.
// ==========================================

/**
 * Tipos conceituais de campos editáveis permitidos no CMS.
 * PROIBIÇÃO ABSOLUTA: html, raw_html, script, javascript, css, custom_css, custom_class, code.
 */
export type EditableFieldType =
  | 'text'
  | 'textarea'
  | 'rich_text'
  | 'image'
  | 'url'
  | 'button'
  | 'boolean'
  | 'number'
  | 'list'
  | 'group';

/**
 * Protocolos de URL controlados e seguros
 */
export type AllowedUrlProtocol = 'https' | 'http' | 'mailto' | 'tel';

/**
 * Dados estruturados de um campo tipo 'button'.
 * NOTA ARQUITETURAL: Isto representa exclusivamente dados estruturados de um botão (label, url, destino),
 * NÃO é um componente React nem possui lógica de renderização nesta fase.
 */
export interface ButtonFieldData {
  label: string;
  url: string;
  openInNewTab?: boolean;
}

/**
 * Dados conceituais de um campo tipo imagem
 */
export interface ImageFieldData {
  mediaId?: MediaId;
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

/**
 * Dados conceituais de conteúdo rico estruturado (Rich Text).
 * AVISO DE SEGURANÇA: rich_text NÃO aceita HTML livre nem tags arbitrárias.
 * O conteúdo rico futuro será modelado exclusivamente como nós/tokens estruturados e validados.
 */
export interface RichTextFieldData {
  rawText?: string;
  structuredContent?: unknown;
}

/**
 * Tipos de valores aceitos nos dados de um bloco (substitui 'any' e 'unknown' genérico)
 */
export type BlockDataValue =
  | string
  | number
  | boolean
  | ButtonFieldData
  | ImageFieldData
  | RichTextFieldData
  | ContentReference
  | BlockDataValue[]
  | { [key: string]: BlockDataValue }
  | null
  | undefined;

/**
 * Contrato base para qualquer campo editável do CMS
 */
export interface EditableFieldBase {
  id: string;
  type: EditableFieldType;
  label: string;
  description?: string;
  required?: boolean;
  defaultValue?: BlockDataValue;
}

/**
 * Configuração conceitual de campo de texto simples
 */
export interface TextEditableField extends EditableFieldBase {
  type: 'text';
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
}

/**
 * Configuração conceitual de campo de texto longo
 */
export interface TextareaEditableField extends EditableFieldBase {
  type: 'textarea';
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  rows?: number;
}

/**
 * Configuração conceitual de campo de conteúdo rico estruturado (NÃO HTML livre)
 */
export interface RichTextEditableField extends EditableFieldBase {
  type: 'rich_text';
  placeholder?: string;
  maxLength?: number;
}

/**
 * Configuração conceitual de campo de imagem
 */
export interface ImageEditableField extends EditableFieldBase {
  type: 'image';
  altTextRequired?: boolean;
  allowedMimeTypes?: string[];
  maxSizeBytes?: number;
  recommendedDimensions?: MediaDimensions;
}

/**
 * Configuração conceitual de campo de URL com controle de protocolos
 */
export interface UrlEditableField extends EditableFieldBase {
  type: 'url';
  placeholder?: string;
  allowedProtocols?: AllowedUrlProtocol[];
}

/**
 * Configuração conceitual de campo de botão (apenas metadados e destino do botão)
 */
export interface ButtonEditableField extends EditableFieldBase {
  type: 'button';
  defaultLabel?: string;
  allowedProtocols?: AllowedUrlProtocol[];
}

/**
 * Configuração conceitual de campo booleano / alternador
 */
export interface BooleanEditableField extends EditableFieldBase {
  type: 'boolean';
  defaultValue?: boolean;
}

/**
 * Configuração conceitual de campo numérico
 */
export interface NumberEditableField extends EditableFieldBase {
  type: 'number';
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

/**
 * Configuração conceitual de campo de lista (coleção tipada e repetível)
 */
export interface ListEditableField extends EditableFieldBase {
  type: 'list';
  itemLabel?: string;
  minItems?: number;
  maxItems?: number;
  itemField: EditableField;
}

/**
 * Configuração conceitual de campo de grupo (agrupamento de campos relacionados)
 */
export interface GroupEditableField extends EditableFieldBase {
  type: 'group';
  fields: EditableField[];
}

/**
 * União discriminada de todos os campos editáveis suportados no CMS
 */
export type EditableField =
  | TextEditableField
  | TextareaEditableField
  | RichTextEditableField
  | ImageEditableField
  | UrlEditableField
  | ButtonEditableField
  | BooleanEditableField
  | NumberEditableField
  | ListEditableField
  | GroupEditableField;

/**
 * Schema descritivo de dados editáveis de um Bloco
 * Define quais campos são permitidos para edição sem expor ou permitir alteração da estrutura interna do bloco
 */
export interface BlockDataSchema {
  blockType: BlockType;
  title: string;
  description?: string;
  fields: EditableField[];
}

/**
 * Categorias canônicas de classificação de blocos no CMS
 */
export type BlockCategory = 'navigation' | 'hero' | 'content' | 'church_specific' | 'footer';

/**
 * Definição Canônica e Declarativa de um Bloco do CMS (Fase 5)
 * Relação Oficial: BLOCK TYPE -> BLOCK DEFINITION -> DATA SCHEMA -> BLOCK DATA
 *
 * PROIBIÇÕES ARQUITETURAIS:
 * - Não é um componente React nem possui método render/renderer/renderFunction.
 * - Não possui JSX, código executável ou dependências visuais/CSS.
 * - Não possui funções operacionais ou registro dinâmico.
 */
export interface BlockDefinition {
  type: BlockType;
  name: string;
  description: string;
  category: BlockCategory;
  dataSchema?: BlockDataSchema;
}



/**
 * Configurações de layout permitidas para a Seção
 */
export interface SectionConfig {
  themeVariant?: 'light' | 'dark' | 'accent' | 'neutral';
  backgroundColor?: string;
  textColor?: string;
  paddingY?: 'none' | 'small' | 'medium' | 'large';
  containerWidth?: 'narrow' | 'standard' | 'wide' | 'full';
}

/**
 * Seção de agrupamento estrutural de blocos na página
 * Estrutura Oficial: PÁGINAS → SEÇÕES → BLOCOS → CONFIGURAÇÕES → DADOS
 */
export interface SectionInstance {
  id: SectionId;
  title?: string;
  order: number;
  isVisible: boolean;
  backgroundColor?: string;
  config?: SectionConfig;
  blocks: BlockInstance[];
}

/**
 * Entidade Página do CMS
 * Hierarquia Oficial: Page └── sections[] └── blocks[]
 */
export interface Page {
  id: PageId;
  tenantId: TenantId;
  title: string;
  slug: string;
  status: PageStatus;
  order: number;
  isHome?: boolean;
  seo: PageSEO;
  sections: SectionInstance[];
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Contrato conceitual de Template de Página (Fase 6)
 * Serve exclusivamente como modelo declarativo de composição inicial (sections[] -> blocks[]),
 * sem substituir a árvore canônica Page -> sections[] -> blocks[].
 *
 * PROIBIÇÃO ABSOLUTA: TemplateEngine, TemplateRenderer, TemplateLoader ou lógica operacional.
 */
export interface PageTemplate {
  id: string;
  name: string;
  description: string;
  category?: 'church_landing' | 'standard_page' | 'event_page' | 'about_page';
  sections: SectionInstance[];
}

/**
 * Categorias canônicas de templates do CMS (Fase 7)
 */
export type TemplateCategory =
  | 'traditional'
  | 'contemporary'
  | 'revival'
  | 'minimalist'
  | 'community';

/**
 * Representação declarativa de uma página dentro da composição de um template
 * Reutiliza estritamente a hierarquia canônica de seções e blocos existentes (sections[] -> blocks[] -> data).
 */
export interface TemplatePageDefinition {
  id: string;
  slug: string;
  title: string;
  description?: string;
  isHome?: boolean;
  sections: SectionInstance[];
}

/**
 * Definição Canônica e Declarativa de um Template do CMS (Fase 7)
 * Cadeia Arquitetural Oficial:
 * Template -> Page Composition (pages[]) -> Sections -> Blocks -> BlockDefinition -> BlockDataSchema -> BlockInstance.data
 *
 * PROIBIÇÕES ARQUITETURAIS:
 * - Não é um componente React nem possui método render/renderer/renderFunction.
 * - Não possui TemplateEngine, TemplateLoader, TemplateResolver, TemplateRegistry ou gerador operacional.
 * - Não possui HTML, CSS, JavaScript, scripts ou código executável.
 * - Não cria páginas automaticamente nem implementa CRUD, rotas funcionais ou banco de dados.
 */
export type TemplateStatus = 'draft' | 'active' | 'archived';

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  version: string;
  thumbnailUrl?: string;
  themeId?: string;
  theme?: VisualTheme;
  pages: TemplatePageDefinition[];
  status?: TemplateStatus;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Tokens estruturados e declarativos de cores do sistema visual (Fase 8)
 * Tipagem estrita evitando strings arbitrárias espalhadas pelo sistema.
 */
export interface ColorTokens {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
  border: string;
  success?: string;
  warning?: string;
  error?: string;
}

/**
 * Tokens declarativos de tipografia do sistema visual (Fase 8)
 * Exclusivamente estrutural. Não carrega fontes, scripts ou runtime.
 */
export interface TypographyTokens {
  fontFamilyHeading: string;
  fontFamilyBody: string;
  fontSizeBase: string;
  fontSizeHeading: string;
  fontWeightNormal: number | string;
  fontWeightBold: number | string;
  lineHeightBase?: string | number;
  letterSpacingBase?: string;
}

/**
 * Tokens declarativos de espaçamento e dimensões (Fase 8)
 */
export interface SpacingTokens {
  base: string;
  sectionPaddingYSmall: string;
  sectionPaddingYMedium: string;
  sectionPaddingYLarge: string;
  containerNarrow: string;
  containerStandard: string;
  containerWide: string;
}

/**
 * Tokens declarativos de bordas e raio de curvatura (Fase 8)
 */
export interface BorderTokens {
  radiusSmall: string;
  radiusMedium: string;
  radiusLarge: string;
  radiusFull: string;
  borderWidthThin: string;
  borderWidthThick: string;
}

/**
 * Tokens declarativos de elevação e sombras controladas (Fase 8)
 */
export interface ElevationTokens {
  shadowNone: string;
  shadowLow: string;
  shadowMedium: string;
  shadowHigh: string;
}

/**
 * Agrupamento canônico de Design Tokens do CMS (Fase 8)
 */
export interface DesignTokens {
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  borders: BorderTokens;
  elevations?: ElevationTokens;
}

/**
 * Contrato Canônico de Tema Visual do CMS (Fase 8)
 * Relação Arquitetural:
 * VisualTheme -> DesignTokens (colors, typography, spacing, borders, elevations)
 *
 * PROIBIÇÕES ARQUITETURAIS:
 * - Não é runtime de CSS nem ThemeProvider/ThemeEngine/ThemeResolver.
 * - Não carrega fontes, scripts ou gera regras de estilo dinâmicas.
 * - Não permite CSS arbitrário, seletores livres ou HTML.
 */
export type ThemeStatus = 'active' | 'draft' | 'archived';

export interface VisualTheme {
  id: string;
  name: string;
  description: string;
  version: string;
  tokens: DesignTokens;
  isDefault?: boolean;
  status?: ThemeStatus;
  createdAt?: string;
  updatedAt?: string;
}



// ==========================================
// 7. MÓDULOS ESPECÍFICOS PARA IGREJAS (FASE 12)
// ==========================================

export type ChurchModuleType =
  | 'news'
  | 'events'
  | 'schedule'
  | 'sermons'
  | 'live_stream'
  | 'leadership'
  | 'ministries'
  | 'small_groups'
  | 'prayer_requests'
  | 'testimonies'
  | 'donations'
  | 'gallery'
  | 'social_links';

export type ModuleDefinitionStatus = 'planned' | 'in_development' | 'active';

export interface ChurchModuleDefinition {
  id: ChurchModuleType;
  name: string;
  description: string;
  iconName: string;
  status: ModuleDefinitionStatus;
}

// ------------------------------------------
// Domínios Canônicos de Conteúdo dos Módulos (Fase 12)
// ------------------------------------------

/**
 * 1. Módulo de Eventos da Igreja
 * Dados estruturados de congressos, retiros, vigílias e programações especiais.
 */
export type EventStatus = ContentStatus;

export interface ChurchEvent {
  id: string;
  tenantId: TenantId;
  title: string;
  slug: string;
  description?: string;
  startDate: string;
  endDate?: string;
  time?: string;
  location?: string;
  imageMediaId?: MediaId;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * 2. Módulo de Notícias e Avisos
 * Informativos semanais, comunicados aos membros e artigos pastorais.
 */
export type NewsStatus = ContentStatus;

export interface ChurchNews {
  id: string;
  tenantId: TenantId;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  imageMediaId?: MediaId;
  author?: string;
  publishedAt?: string;
  status: NewsStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * 3. Módulo de Sermões e Mensagens
 * Acervo de pregações, estudos e mensagens em áudio ou vídeo.
 */
export type SermonStatus = ContentStatus;

export interface ChurchSermon {
  id: string;
  tenantId: TenantId;
  title: string;
  slug: string;
  description?: string;
  preacher: string;
  date: string;
  scriptureReference?: string;
  videoUrl?: string;
  audioMediaId?: MediaId;
  thumbnailMediaId?: MediaId;
  status: SermonStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * 4. Módulo de Programação / Horários de Culto
 * Dias da semana, horários e descrições dos cultos regulares da congregação.
 */
export type ScheduleStatus = 'active' | 'inactive';

export interface ChurchSchedule {
  id: string;
  tenantId: TenantId;
  title: string;
  dayOfWeek?: string;
  time: string;
  description?: string;
  location?: string;
  status: ScheduleStatus;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 5. Módulo de Ministérios e Departamentos
 * Grupos e departamentos da igreja (Jovens, Infantil, Louvor, Casais, etc.).
 */
export type MinistryStatus = 'active' | 'inactive';

export interface ChurchMinistry {
  id: string;
  tenantId: TenantId;
  name: string;
  slug: string;
  description?: string;
  leaderName?: string;
  imageMediaId?: MediaId;
  status: MinistryStatus;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 6. Módulo de Liderança e Pastores
 * Apresentação da equipe pastoral e corpo de líderes da congregação.
 */
export type LeaderStatus = 'active' | 'inactive';

export interface ChurchLeader {
  id: string;
  tenantId: TenantId;
  name: string;
  role: string;
  description?: string;
  photoMediaId?: MediaId;
  order: number;
  status: LeaderStatus;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 7. Módulo de Galeria de Fotos
 * Álbuns de fotos de eventos, batismos e celebrações da igreja.
 */
export type GalleryStatus = 'active' | 'archived';

export interface ChurchGalleryAlbum {
  id: string;
  tenantId: TenantId;
  title: string;
  slug?: string;
  description?: string;
  coverMediaId?: MediaId;
  mediaIds: MediaId[];
  status: GalleryStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * 8. Módulo de Pedidos de Oração
 * Dados estruturados de pedidos de oração e intercessão recebidos.
 */
export type PrayerRequestStatus = 'pending' | 'praying' | 'answered' | 'archived';

export interface ChurchPrayerRequest {
  id: string;
  tenantId: TenantId;
  title?: string;
  requesterName?: string;
  requestText: string;
  isAnonymous?: boolean;
  status: PrayerRequestStatus;
  createdAt: string;
  updatedAt?: string;
}

/**
 * 9. Módulo de Dízimos e Ofertas (Doações)
 * Orientações declarativas para contribuições, chave PIX e contas bancárias.
 */
export type DonationStatus = 'active' | 'inactive';

export interface ChurchDonationInfo {
  id: string;
  tenantId: TenantId;
  title: string;
  description?: string;
  bankAccountInfo?: string;
  pixKey?: string;
  instructions?: string;
  status: DonationStatus;
  updatedAt?: string;
}

/**
 * 10. Módulo de Transmissão ao Vivo (Live Stream)
 * Informações declarativas sobre cultos e eventos transmitidos ao vivo.
 */
export type LiveStreamStatus = 'live' | 'scheduled' | 'offline';

export interface ChurchLiveStreamInfo {
  id: string;
  tenantId: TenantId;
  title: string;
  description?: string;
  streamUrl?: string;
  status: LiveStreamStatus;
  scheduledAt?: string;
  updatedAt?: string;
}

/**
 * 11. Módulo de Banners e Destaques Visuais (Fase 41)
 * Gerenciamento declarativo dos banners e campanhas visuais da igreja.
 */
export type BannerStatus = 'active' | 'inactive';

export interface ChurchBanner {
  id: string;
  tenantId: TenantId;
  title: string;
  subtitle?: string;
  imageMediaId?: MediaId;
  primaryButtonLabel?: string;
  primaryButtonUrl?: string;
  secondaryButtonLabel?: string;
  secondaryButtonUrl?: string;
  order: number;
  status: BannerStatus;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 8. PAPÉIS E USUÁRIOS (RBAC CONCEITUAL) (FASE 13)
// ==========================================

export type UserStatus = 'active' | 'inactive' | 'suspended';

export type PermissionAction =
  | 'manage:tenant'
  | 'manage:users'
  | 'manage:pages'
  | 'publish:pages'
  | 'manage:blocks'
  | 'manage:media'
  | 'manage:navigation'
  | 'manage:themes'
  | 'manage:modules'
  | 'manage:sermons'
  | 'manage:events'
  | 'manage:prayer_requests'
  | 'view:analytics'
  | 'people.view' | 'people.create' | 'people.update' | 'people.delete' | 'people.manage'
  | 'groups.view' | 'groups.create' | 'groups.update' | 'groups.delete' | 'groups.manage'
  | 'education.view' | 'education.create' | 'education.update' | 'education.delete' | 'education.manage'
  | 'finance.view' | 'finance.create' | 'finance.update' | 'finance.delete' | 'finance.manage'
  | 'assets.view' | 'assets.create' | 'assets.update' | 'assets.delete' | 'assets.manage'
  | 'calendar.view' | 'calendar.create' | 'calendar.update' | 'calendar.delete' | 'calendar.manage'
  | 'media.view' | 'media.create' | 'media.update' | 'media.delete' | 'media.manage';

export type UserRole = 'superadmin' | 'tenant_admin' | 'pastor' | 'editor' | 'media_volunteer';

export interface RoleDefinition {
  id: UserRole;
  name: string;
  description: string;
  permissions: PermissionAction[];
}

/**
 * Entidade canônica e declarativa de Usuário (Fase 13)
 *
 * Cadeia Arquitetural Oficial:
 * Tenant -> Usuários vinculados ao Tenant (User.tenantId) -> Papéis (UserRole) -> Permissões conceituais (PermissionAction)
 *
 * PROIBIÇÕES ARQUITETURAIS:
 * - Não armazena senhas, passwordHash, tokens, secrets, chaves de API ou credenciais.
 * - Não é mecanismo de autenticação (JWT, cookies, OAuth, sessões).
 * - Não possui autorização executável, guards, ACL/RBAC runtime ou permission checkers.
 * - Não é banco de dados, API, backend ou CRUD funcional.
 */
export interface User {
  id: UserId;
  tenantId: TenantId;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  isActive?: boolean;
  customPermissions?: PermissionAction[];
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 9. RELACIONAMENTOS E REFERÊNCIAS DECLARATIVAS (FASE 14)
// ==========================================

export type ContentReferenceType =
  | 'page'
  | 'media'
  | 'event'
  | 'news'
  | 'sermon'
  | 'schedule'
  | 'ministry'
  | 'leader'
  | 'gallery_album'
  | 'prayer_request'
  | 'donation_info'
  | 'live_stream';

/**
 * Contrato Canônico de Referência entre Entidades do CMS (Fase 14)
 *
 * Representa uma referência tipada e estritamente declarativa entre entidades do CMS
 * (Páginas, Mídias e Módulos Eclesiais de Conteúdo).
 *
 * Reutilização de Identificadores Canônicos:
 * - 'page' -> PageId
 * - 'media' -> MediaId
 * - Módulos Eclesiais -> ID da entidade do módulo (string)
 *
 * PROIBIÇÕES ARQUITETURAIS:
 * - Não é resolver, loader, provider, factory, registry ou query engine.
 * - Não realiza hidratação, busca automática, sincronização ou cache em tempo de execução.
 * - Não substitui NavigationTarget (que permanece como autoridade exclusiva da navegação).
 * - Não executa código nem aceita callbacks, handlers ou URLs com script.
 */
export interface ContentReference {
  type: ContentReferenceType;
  id: string;
}

// ==========================================
// 10. METADADOS E SEO DO SITE (FASE 16)
// ==========================================

/**
 * Diretivas canônicas e declarativas para robôs de busca e indexação
 * Representa as instruções básicas de rastreamento e indexação.
 *
 * PROIBIÇÃO ARQUITETURAL:
 * - Apenas dados estruturados; não gera tags HTML <meta name="robots"> nem robots.txt.
 */
export interface RobotsDirective {
  index?: boolean;
  follow?: boolean;
  archive?: boolean;
}

/**
 * Metadados declarativos do protocolo Open Graph para compartilhamento social
 *
 * PROIBIÇÃO ARQUITETURAL:
 * - Apenas dados estruturados; não gera tags HTML <meta property="og:*"> nem renderers.
 */
export interface OpenGraphMetadata {
  title?: string;
  description?: string;
  imageMediaId?: MediaId;
  imageUrl?: string;
  type?: string;
}

/**
 * Metadados declarativos para Twitter / X Cards
 *
 * PROIBIÇÃO ARQUITETURAL:
 * - Apenas dados estruturados; não gera tags HTML <meta name="twitter:*"> nem integrações.
 */
export interface TwitterCardMetadata {
  card?: string;
  title?: string;
  description?: string;
  imageMediaId?: MediaId;
  imageUrl?: string;
}

/**
 * Contrato Canônico de SEO Global do Site / Tenant (Fase 16)
 *
 * Representa a configuração declarativa de SEO global vinculada ao Tenant (Tenant.seo).
 * Define os padrões estruturais de metadados do site, que podem ser refinados no nível
 * de cada página via PageSEO (Page.seo).
 *
 * PROIBIÇÕES ARQUITETURAIS:
 * - Não é componente React (<Helmet>, <meta>, <title>) nem renderer HTML.
 * - Não é SEO engine, generator de sitemap, gerador de robots.txt ou schema/JSON-LD runtime.
 * - Não implementa herança automática, merge, crawler, analytics ou chamadas de API externas.
 * - Não substitui InstitutionalContent (dados institucionais) nem VisualTheme (tokens visuais).
 * - Não permite código executável, HTML livre, scripts ou CSS arbitrário.
 */
export interface SiteSEO {
  title?: string;
  description?: string;
  keywords?: string[];
  siteName?: string;
  defaultImageMediaId?: MediaId;
  defaultImageUrl?: string;
  canonicalBaseUrl?: string;
  locale?: string;
  robots?: RobotsDirective;
  openGraph?: OpenGraphMetadata;
  twitter?: TwitterCardMetadata;
}

// ==========================================
// 11. CONFIGURAÇÃO GERAL E IDENTIDADE DO SITE (FASE 17)
// ==========================================

/**
 * Contrato Canônico de Configuração Geral e Identidade Operacional do Site (Fase 17)
 *
 * Representa as preferências e configurações técnicas gerais do site vinculadas ao Tenant (Tenant.siteSettings).
 * Não substitui nem duplica informações institucionais (InstitutionalContent), SEO (SiteSEO),
 * temas (VisualTheme), navegação (NavigationMenu) ou módulos eclesiais (Fase 12).
 *
 * PROIBIÇÕES ARQUITETURAIS:
 * - Não é UI, form, modal, dashboard ou editor de configurações.
 * - Não é conversor de timezone, formatador de data/hora, engine de tradução ou loader i18n.
 * - Não implementa APIs, backend, banco de dados, resolução automática ou persistência.
 * - Não contém HTML livre, CSS arbitrário, scripts ou código executável.
 */
export interface SiteSettings {
  tenantId: TenantId;
  siteName?: string;
  language?: string;
  locale?: string;
  timezone?: string;
  dateFormat?: string;
  timeFormat?: string;
  faviconMediaId?: MediaId;
  faviconUrl?: string;
  updatedAt?: string;
}

// ==========================================
// 12. DOMÍNIOS E ENDEREÇOS DO SITE (FASE 18)
// ==========================================

/**
 * Classificação declarativa do tipo de domínio associado ao Tenant
 */
export type SiteDomainType =
  | 'subdomain'
  | 'custom_domain';

/**
 * Estado declarativo do domínio/endereço
 * Representa apenas a situação cadastral do endereço, sem modelar workflows operacionais de DNS/SSL.
 */
export type SiteDomainStatus =
  | 'pending'
  | 'active'
  | 'inactive';

/**
 * Contrato Canônico de Domínio e Endereço do Site por Tenant (Fase 18)
 *
 * O domínio/endereço pertence exclusivamente ao Tenant (Tenant.domains[]),
 * representando o endereço conceitual associado à igreja para futura resolução e publicação.
 *
 * PROIBIÇÕES ARQUITETURAIS:
 * - Não é runtime de resolução (window.location, hostname matching).
 * - Não é middleware de domínio nem detector de tenant por host.
 * - Não gerencia DNS, certificados SSL, proxies, servidores ou deploy.
 * - Não implementa redirecionamento, fallback ou canonicalização automática.
 * - Não contém HTML livre, scripts ou código executável.
 */
export interface SiteDomain {
  id: string;
  tenantId: TenantId;
  hostname: string;
  type: SiteDomainType;
  status: SiteDomainStatus;
  isPrimary?: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 13. CONFIGURAÇÃO DE PUBLICAÇÃO E VISIBILIDADE DO SITE (FASE 20)
// ==========================================

/**
 * Visibilidade declarativa do site público do Tenant
 */
export type SiteVisibility =
  | 'public'
  | 'private';

/**
 * Contrato Canônico de Configuração de Publicação e Visibilidade do Site (Fase 20)
 *
 * Representa exclusivamente os metadados declarativos de disponibilidade do site vinculados ao Tenant.
 * Não se confunde com o TenantStatus (situação administrativa da organização) nem com o ContentStatus (ciclo editorial do conteúdo).
 *
 * PROIBIÇÕES ARQUITETURAIS:
 * - Não é pipeline, fila, agendador ou mecanismo de publicação operacional.
 * - Não é middleware, redirecionamento ou bloqueio de runtime para modo manutenção.
 * - Não é deploy, sincronização de arquivos, geração de HTML estático ou servidor.
 * - Não contém HTML livre, scripts ou código executável.
 */
export interface SitePublicationSettings {
  tenantId: TenantId;
  visibility: SiteVisibility;
  maintenanceMode?: boolean;
  updatedAt?: string;
}

// ==========================================
// 14. REDIRECIONAMENTOS E ALIASES DE URL (FASE 21)
// ==========================================

/**
 * Classificação declarativa do tipo de redirecionamento do site
 * Representa a intenção estrutural da regra sem implementar códigos HTTP (301, 302, 307, 308) em runtime.
 */
export type SiteRedirectType =
  | 'permanent'
  | 'temporary';

/**
 * Classificação discriminada do tipo de destino do redirecionamento
 */
export type SiteRedirectTargetType =
  | 'page'
  | 'external';

/**
 * Contrato Canônico de Redirecionamento e Aliases de URL do Site (Fase 21)
 *
 * O redirecionamento pertence exclusivamente ao nível do Tenant/site (Tenant.redirects[]),
 * representando regras declarativas para resolução conceitual de caminhos legados, aliases ou rotas externas.
 *
 * PROIBIÇÕES ARQUITETURAIS:
 * - Não é router, middleware, URL matcher ou engine de redirecionamento.
 * - Não emite respostas HTTP (301, 302, 307, 308), nem interage com headers de servidor, Nginx, Apache ou CDNs.
 * - Não busca, carrega ou hidrata a página de destino (PageId) em tempo de execução.
 * - Não contém HTML livre, scripts ou código executável.
 */
export interface SiteRedirect {
  id: string;
  tenantId: TenantId;
  sourcePath: string;
  targetType: SiteRedirectTargetType;
  targetPageId?: PageId;
  targetUrl?: string;
  type: SiteRedirectType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 15. FORMULÁRIOS E SUBMISSÕES DO SITE (FASE 22)
// ==========================================

/**
 * Status do ciclo de vida declarativo do formulário
 */
export type FormStatus =
  | 'draft'
  | 'active'
  | 'archived';

/**
 * Tipos canônicos de campos de formulário para entrada de dados de visitantes
 * Claramente separados dos tipos editáveis da Fase 4 (EditableFieldType) destinados ao CMS.
 */
export type FormFieldType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'tel'
  | 'number'
  | 'url'
  | 'date'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'boolean';

/**
 * Opção declarativa para campos de seleção, rádio ou múltipla escolha
 */
export interface FormFieldOption {
  value: string;
  label: string;
}

/**
 * Definição declarativa de um campo de formulário
 *
 * PROIBIÇÕES ARQUITETURAIS:
 * - Não contém regex executável, funções de validação, manipuladores de evento (onChange/onBlur).
 * - Não contém HTML, CSS personalizado, classes de estilização ou componentes React.
 */
export interface FormFieldDefinition {
  id: string;
  name: string;
  label: string;
  type: FormFieldType;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  options?: FormFieldOption[];
  order: number;
}

/**
 * Contrato Canônico de Definição de Formulário do Site (Fase 22)
 *
 * Representa a estrutura de um formulário configurável por Tenant (Tenant.forms[]).
 *
 * PROIBIÇÕES ARQUITETURAIS:
 * - Não contém action, submitUrl, endpoint, webhook, emailTo, callback, script ou JavaScript.
 * - Não contém renderizadores, componentes visuais ou construtores de arrastar e soltar.
 * - Não se acopla a submissions: FormDefinition define a estrutura; FormSubmission representa respostas.
 */
export interface FormDefinition {
  id: string;
  tenantId: TenantId;
  name: string;
  slug: string;
  description?: string;
  status: FormStatus;
  fields: FormFieldDefinition[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Status declarativo de processamento de uma submissão
 */
export type FormSubmissionStatus =
  | 'received'
  | 'processed'
  | 'archived';

/**
 * Tipos de valores primitivos e seguros aceitos em uma submissão de formulário
 * Proibido armazenar credenciais, senhas, tokens de API ou dados de cartão de crédito.
 */
export type FormSubmissionValue =
  | string
  | number
  | boolean
  | null
  | string[];

/**
 * Contrato Canônico de Submissão de Formulário do Site (Fase 22)
 *
 * Representa exclusivamente o registro declarativo de uma resposta recebida.
 * Estruturalmente separado de FormDefinition e referenciado via formId.
 *
 * PROIBIÇÕES ARQUITETURAIS:
 * - Não é envio real, trigger de webhook, disparo de e-mail, SMS ou WhatsApp.
 * - Não possui banco de dados operacional, API, controller, validação ou persistência.
 */
export interface FormSubmission {
  id: string;
  tenantId: TenantId;
  formId: string;
  status: FormSubmissionStatus;
  values: Record<string, FormSubmissionValue>;
  submittedAt: string;
}

// ==========================================
// 16. CONFIGURAÇÃO DE ANALYTICS E MÉTRICAS DO SITE (FASE 23)
// ==========================================

/**
 * Provedores e serviços suportados para métricas do site
 */
export type SiteAnalyticsProvider =
  | 'google_analytics'
  | 'google_tag_manager'
  | 'meta_pixel';

/**
 * Contrato Canônico de Configuração de Analytics e Métricas do Site (Fase 23)
 *
 * Representa os metadados declarativos de identificadores de medição, tags de terceiros e
 * preferências de privacidade vinculadas ao Tenant (Tenant.analytics).
 *
 * PROIBIÇÕES ARQUITETURAIS:
 * - Não é script loader, tag injector, <script> runtime ou manipulador do DOM.
 * - Não insere tags <script>, gtag.js, fbq ou código JavaScript na página.
 * - Não é tracker operacional, coletor de eventos, pixel emitter ou beacon.
 * - Não faz chamadas HTTP para o Google Analytics, Meta ou qualquer API externa.
 * - Não é banner de cookies nem widget visual de consentimento.
 * - Não contém HTML livre, JavaScript arbitrário, CSS ou código executável.
 * - Não armazena nem coleta dados pessoais sensíveis, sessões ou cookies de visitantes.
 */
export interface SiteAnalytics {
  tenantId: TenantId;
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  metaPixelId?: string;
  searchConsoleVerificationToken?: string;
  anonymizeIp?: boolean;
  consentRequired?: boolean;
  isActive?: boolean;
  updatedAt?: string;
}








