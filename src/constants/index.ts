/**
 * CMS VISUAL PARA IGREJAS — CONSTANTES CENTRAIS
 * Catálogos oficiais, papéis, módulos e configurações permitidas.
 */

import { BlockType, BlockDefinition, BlockDataSchema, ChurchModuleType, UserRole } from '../types';

/**
 * Catálogo de papéis de usuários e suas descrições
 */
export const USER_ROLES: Record<UserRole, { label: string; description: string; level: number }> = {
  superadmin: {
    label: 'Super Administrador',
    description: 'Controle total da plataforma SaaS e gestão de todos os tenants.',
    level: 100,
  },
  tenant_admin: {
    label: 'Administrador da Igreja',
    description: 'Administrador principal da congregação com acesso total ao painel do tenant.',
    level: 80,
  },
  pastor: {
    label: 'Pastor / Líder Ministerial',
    description: 'Gestão de cultos, sermões, pedidos de oração e comunicados pastorais.',
    level: 60,
  },
  editor: {
    label: 'Editor de Conteúdo',
    description: 'Criação e edição de páginas, notícias, eventos e blogs.',
    level: 40,
  },
  media_volunteer: {
    label: 'Voluntário de Mídia',
    description: 'Upload de fotos, organização de galerias e vídeos de transmissões.',
    level: 20,
  },
};

/**
 * Catálogo dos Módulos Específicos para Igrejas
 */
export const CHURCH_MODULES_CATALOG: Array<{
  id: ChurchModuleType;
  name: string;
  description: string;
  category: 'worship' | 'community' | 'engagement' | 'media';
  defaultEnabled: boolean;
}> = [
  {
    id: 'schedule',
    name: 'Agenda de Cultos',
    description: 'Horários, dias da semana e descrições dos cultos da congregação.',
    category: 'worship',
    defaultEnabled: true,
  },
  {
    id: 'sermons',
    name: 'Cultos Gravados e Mensagens',
    description: 'Acervo de mensagens em vídeo e áudio organizados por séries e preletores.',
    category: 'worship',
    defaultEnabled: true,
  },
  {
    id: 'live_stream',
    name: 'Transmissão ao Vivo',
    description: 'Integração de cultos ao vivo com contador de início de transmissão.',
    category: 'worship',
    defaultEnabled: false,
  },
  {
    id: 'ministries',
    name: 'Ministérios e Departamentos',
    description: 'Divulgação dos grupos da igreja (Jovens, Infantil, Louvor, Casais, etc.).',
    category: 'community',
    defaultEnabled: true,
  },
  {
    id: 'leadership',
    name: 'Liderança e Pastores',
    description: 'Apresentação do corpo pastoral e liderança da congregação.',
    category: 'community',
    defaultEnabled: true,
  },
  {
    id: 'small_groups',
    name: 'Células e Pequenos Grupos',
    description: 'Localização, horários e líderes dos grupos caseiros da igreja.',
    category: 'community',
    defaultEnabled: false,
  },
  {
    id: 'events',
    name: 'Eventos e Conferências',
    description: 'Divulgação de congressos, retiros, vigílias e formulários de inscrição.',
    category: 'engagement',
    defaultEnabled: true,
  },
  {
    id: 'news',
    name: 'Notícias e Avisos',
    description: 'Informativos semanais, avisos aos membros e cartas pastorais.',
    category: 'engagement',
    defaultEnabled: true,
  },
  {
    id: 'prayer_requests',
    name: 'Pedidos de Oração',
    description: 'Canal seguro e confidencial para intercessão com opção anônima.',
    category: 'engagement',
    defaultEnabled: true,
  },
  {
    id: 'testimonies',
    name: 'Testemunhos',
    description: 'Espaço para relatos de fé com fluxo de moderação pela liderança.',
    category: 'engagement',
    defaultEnabled: false,
  },
  {
    id: 'donations',
    name: 'Dízimos e Ofertas',
    description: 'Orientações de contribuição, chave PIX, contas bancárias e doações online.',
    category: 'engagement',
    defaultEnabled: true,
  },
  {
    id: 'gallery',
    name: 'Galeria de Fotos',
    description: 'Álbuns de fotos de batismos, conferências e eventos sociais.',
    category: 'media',
    defaultEnabled: true,
  },
  {
    id: 'social_links',
    name: 'Redes Sociais e Contato',
    description: 'Links diretos para canais oficiais (Instagram, YouTube, WhatsApp, Maps).',
    category: 'media',
    defaultEnabled: true,
  },
];

/**
 * Schema genérico de dados editáveis do Bloco Destaque Principal (Hero)
 */
export const HERO_DATA_SCHEMA: BlockDataSchema = {
  blockType: 'hero',
  title: 'Destaque Principal (Hero)',
  description: 'Campos editáveis permitidos para o banner principal.',
  fields: [
    {
      id: 'title',
      type: 'text',
      label: 'Título Principal',
      placeholder: 'Boas-vindas à nossa igreja',
      required: true,
      maxLength: 120,
    },
    {
      id: 'subtitle',
      type: 'textarea',
      label: 'Subtítulo ou Mensagem',
      placeholder: 'Um lugar de comunhão, fé e esperança.',
      required: false,
      maxLength: 300,
      rows: 3,
    },
    {
      id: 'backgroundImage',
      type: 'image',
      label: 'Imagem de Fundo',
      description: 'Imagem de destaque do banner visual.',
      required: false,
      altTextRequired: true,
    },
    {
      id: 'primaryButton',
      type: 'button',
      label: 'Botão de Ação Principal',
      description: 'Dados de chamada para ação primária.',
      defaultLabel: 'Conheça Mais',
      allowedProtocols: ['https', 'http'],
    },
    {
      id: 'secondaryButton',
      type: 'button',
      label: 'Botão de Ação Secundário',
      description: 'Dados de chamada para ação secundária.',
      defaultLabel: 'Ver Horários',
      allowedProtocols: ['https', 'http'],
    },
  ],
};

/**
 * Schema genérico de dados editáveis do Bloco Sobre a Igreja
 */
export const ABOUT_DATA_SCHEMA: BlockDataSchema = {
  blockType: 'about',
  title: 'Sobre a Igreja',
  description: 'Campos editáveis permitidos para apresentação institucional.',
  fields: [
    {
      id: 'title',
      type: 'text',
      label: 'Título da Seção',
      placeholder: 'Nossa História e Visão',
      required: true,
      maxLength: 100,
    },
    {
      id: 'content',
      type: 'rich_text',
      label: 'Texto Institucional',
      description: 'Apresentação estruturada da história, missão e valores da congregação.',
      required: true,
      maxLength: 4000,
    },
    {
      id: 'featuredImage',
      type: 'image',
      label: 'Imagem Institucional',
      description: 'Foto representativa da comunidade ou templo.',
      required: false,
      altTextRequired: true,
    },
  ],
};

/**
 * Schema genérico de dados editáveis do Bloco Localização e Contato
 */
export const CONTACT_DATA_SCHEMA: BlockDataSchema = {
  blockType: 'contact',
  title: 'Localização e Contato',
  description: 'Campos editáveis permitidos para informações de contato e localização.',
  fields: [
    {
      id: 'title',
      type: 'text',
      label: 'Título da Seção',
      placeholder: 'Fale Conosco',
      required: true,
      maxLength: 80,
    },
    {
      id: 'description',
      type: 'textarea',
      label: 'Instruções / Boas-vindas',
      placeholder: 'Estamos de portas abertas para receber você e sua família.',
      required: false,
      maxLength: 250,
      rows: 2,
    },
    {
      id: 'phone',
      type: 'text',
      label: 'Telefone Principal',
      placeholder: '(11) 99999-9999',
      required: false,
      maxLength: 30,
    },
    {
      id: 'email',
      type: 'text',
      label: 'E-mail de Contato',
      placeholder: 'contato@igreja.org.br',
      required: false,
      maxLength: 100,
    },
    {
      id: 'showMap',
      type: 'boolean',
      label: 'Exibir Mapa de Localização',
      description: 'Indica se a visualização do mapa deve ser exibida.',
      defaultValue: true,
    },
  ],
};

/**
 * Schema genérico de dados editáveis do Bloco Rodapé Oficial
 */
export const FOOTER_DATA_SCHEMA: BlockDataSchema = {
  blockType: 'footer',
  title: 'Rodapé Oficial',
  description: 'Campos editáveis permitidos para encerramento da página.',
  fields: [
    {
      id: 'copyrightText',
      type: 'text',
      label: 'Texto de Copyright',
      placeholder: '© Todos os direitos reservados.',
      required: false,
      maxLength: 150,
    },
    {
      id: 'showSocialLinks',
      type: 'boolean',
      label: 'Exibir Links de Redes Sociais',
      description: 'Habilita a exibição dos ícones oficiais de redes sociais da congregação.',
      defaultValue: true,
    },
  ],
};

/**
 * Definições Canônicas e Declarativas dos 15 Blocos Estruturais do CMS (Fase 5)
 * Relação Oficial: BLOCK TYPE -> BLOCK DEFINITION -> DATA SCHEMA -> BLOCK DATA
 *
 * Cada entrada representa a única fonte da verdade para o bloco correspondente.
 * Módulos eclesiásticos específicos (doações, transmissões, cultos, eventos, etc.)
 * terão seus schemas de dados detalhados nas fases de seus respectivos módulos.
 */
export const BLOCK_CATALOG: Record<BlockType, BlockDefinition> = {
  header: {
    type: 'header',
    name: 'Cabeçalho e Menu',
    description: 'Barra de navegação principal com logo, menu de páginas e botão de contato.',
    category: 'navigation',
  },
  hero: {
    type: 'hero',
    name: 'Destaque Principal (Hero)',
    description: 'Banner visual de entrada com imagem/vídeo de fundo, chamada de boas-vindas e ações.',
    category: 'hero',
    dataSchema: HERO_DATA_SCHEMA,
  },
  about: {
    type: 'about',
    name: 'Sobre a Igreja',
    description: 'Apresentação histórica, visão, missão e valores da congregação.',
    category: 'content',
    dataSchema: ABOUT_DATA_SCHEMA,
  },
  ministries: {
    type: 'ministries',
    name: 'Grade de Ministérios',
    description: 'Cartões com foto, descrição e líder de cada ministério.',
    category: 'church_specific',
  },
  schedule: {
    type: 'schedule',
    name: 'Agenda Semanal de Cultos',
    description: 'Quadro visual com dias, horários e detalhes dos cultos regulares.',
    category: 'church_specific',
  },
  events: {
    type: 'events',
    name: 'Próximos Eventos',
    description: 'Lista ou carrossel dos eventos com datas, local e botão de inscrição.',
    category: 'church_specific',
  },
  news: {
    type: 'news',
    name: 'Notícias e Comunicados',
    description: 'Artigos recentes e avisos importantes da comunidade.',
    category: 'content',
  },
  sermons: {
    type: 'sermons',
    name: 'Mensagens Recentes',
    description: 'Destaque para o último culto gravado ou lista de pregações.',
    category: 'church_specific',
  },
  live_stream: {
    type: 'live_stream',
    name: 'Transmissão Ao Vivo',
    description: 'Player de vídeo com banner de contagem regressiva para o próximo culto.',
    category: 'church_specific',
  },
  prayer_request: {
    type: 'prayer_request',
    name: 'Mural de Oração',
    description: 'Formulário acolhedor para envio de pedidos confidenciais à equipe de intercessão.',
    category: 'church_specific',
  },
  donations: {
    type: 'donations',
    name: 'Dízimos e Ofertas',
    description: 'Bloco de generosidade com orientações, dados e opções de contribuição.',
    category: 'church_specific',
  },
  leadership: {
    type: 'leadership',
    name: 'Corpo Pastoral e Líderes',
    description: 'Apresentação com fotos, biografias breves e redes sociais dos líderes.',
    category: 'church_specific',
  },
  gallery: {
    type: 'gallery',
    name: 'Galeria de Mídia',
    description: 'Mural de fotos e momentos da vida comunitária.',
    category: 'content',
  },
  contact: {
    type: 'contact',
    name: 'Localização e Contato',
    description: 'Endereço físico com mapa integrado, telefone, WhatsApp e horário de secretaria.',
    category: 'content',
    dataSchema: CONTACT_DATA_SCHEMA,
  },
  footer: {
    type: 'footer',
    name: 'Rodapé Oficial',
    description: 'Encerramento da página com links institucionais, horários, copyright e redes.',
    category: 'footer',
    dataSchema: FOOTER_DATA_SCHEMA,
  },
};

/**
 * Coleção canônica de definições dos blocos (alias para BLOCK_CATALOG garantindo fonte única da verdade)
 */
export const BLOCK_DEFINITIONS: Record<BlockType, BlockDefinition> = BLOCK_CATALOG;


/**
 * Variantes de temas visuais eclesiásticos suportadas
 */
export const THEME_VARIANTS = ['light', 'dark', 'accent', 'neutral'] as const;

/**
 * Larguras de container permitidas para blocos
 */
export const CONTAINER_WIDTHS = ['narrow', 'standard', 'wide', 'full'] as const;

/**
 * Espaçamentos verticais permitidos
 */
export const PADDING_VARIANTS = ['none', 'small', 'medium', 'large'] as const;
