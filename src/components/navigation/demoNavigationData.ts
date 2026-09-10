import { NavigationMenu } from '../../types';

/**
 * Dados demonstrativos para a tela de Gestão Visual de Navegação (Fase 31).
 * Não constitui novo contrato: consome estritamente NavigationMenu, NavigationItem e NavigationTarget.
 */
export const INITIAL_DEMO_MENUS: NavigationMenu[] = [
  {
    id: 'menu_main_header',
    tenantId: 'ib_central',
    name: 'Menu Principal',
    location: 'header',
    status: 'active',
    createdAt: '2026-08-20T10:00:00Z',
    updatedAt: 'Hoje, às 09:15',
    items: [
      {
        id: 'item_home',
        label: 'Início',
        order: 1,
        isVisible: true,
        target: {
          type: 'page',
          pageId: 'page_home',
        },
      },
      {
        id: 'item_about',
        label: 'Quem Somos',
        order: 2,
        isVisible: true,
        target: {
          type: 'page',
          pageId: 'page_about',
        },
        children: [
          {
            id: 'item_about_history',
            label: 'Nossa História',
            order: 1,
            isVisible: true,
            parentId: 'item_about',
            target: {
              type: 'page',
              pageId: 'page_about',
            },
          },
          {
            id: 'item_about_leadership',
            label: 'Corpo Pastoral',
            order: 2,
            isVisible: true,
            parentId: 'item_about',
            target: {
              type: 'page',
              pageId: 'page_about',
            },
          },
        ],
      },
      {
        id: 'item_schedule',
        label: 'Cultos & Horários',
        order: 3,
        isVisible: true,
        target: {
          type: 'page',
          pageId: 'page_schedule',
        },
      },
      {
        id: 'item_ministries',
        label: 'Ministérios',
        order: 4,
        isVisible: true,
        target: {
          type: 'page',
          pageId: 'page_ministries',
        },
      },
      {
        id: 'item_events',
        label: 'Eventos',
        order: 5,
        isVisible: true,
        target: {
          type: 'page',
          pageId: 'page_events',
        },
      },
      {
        id: 'item_bible',
        label: 'Bíblia Online',
        order: 6,
        isVisible: true,
        target: {
          type: 'external',
          url: 'https://www.bibliaonline.com.br',
          openInNewTab: true,
        },
        url: 'https://www.bibliaonline.com.br',
        isExternal: true,
        openInNewTab: true,
      },
    ],
  },
  {
    id: 'menu_footer_main',
    tenantId: 'ib_central',
    name: 'Menu do Rodapé',
    location: 'footer',
    status: 'active',
    createdAt: '2026-08-20T10:30:00Z',
    updatedAt: 'Ontem, às 17:40',
    items: [
      {
        id: 'item_foot_schedule',
        label: 'Horários dos Cultos',
        order: 1,
        isVisible: true,
        target: {
          type: 'page',
          pageId: 'page_schedule',
        },
      },
      {
        id: 'item_foot_sermons',
        label: 'Mensagens em Vídeo',
        order: 2,
        isVisible: true,
        target: {
          type: 'page',
          pageId: 'page_sermons',
        },
      },
      {
        id: 'item_foot_contact',
        label: 'Como Chegar & Contato',
        order: 3,
        isVisible: true,
        target: {
          type: 'page',
          pageId: 'page_contact',
        },
      },
      {
        id: 'item_foot_youtube',
        label: 'Canal no YouTube',
        order: 4,
        isVisible: true,
        target: {
          type: 'external',
          url: 'https://youtube.com',
          openInNewTab: true,
        },
        url: 'https://youtube.com',
        isExternal: true,
        openInNewTab: true,
      },
    ],
  },
  {
    id: 'menu_mobile_drawer',
    tenantId: 'ib_central',
    name: 'Menu Mobile (Gaveta)',
    location: 'mobile_drawer',
    status: 'active',
    createdAt: '2026-08-22T14:10:00Z',
    updatedAt: 'Há 3 dias',
    items: [
      {
        id: 'item_mob_home',
        label: 'Página Inicial',
        order: 1,
        isVisible: true,
        target: {
          type: 'page',
          pageId: 'page_home',
        },
      },
      {
        id: 'item_mob_about',
        label: 'Sobre Nossa Igreja',
        order: 2,
        isVisible: true,
        target: {
          type: 'page',
          pageId: 'page_about',
        },
      },
      {
        id: 'item_mob_schedule',
        label: 'Programação da Semana',
        order: 3,
        isVisible: true,
        target: {
          type: 'page',
          pageId: 'page_schedule',
        },
      },
      {
        id: 'item_mob_prayer',
        label: 'Fale Conosco',
        order: 4,
        isVisible: true,
        target: {
          type: 'page',
          pageId: 'page_contact',
        },
      },
    ],
  },
];
