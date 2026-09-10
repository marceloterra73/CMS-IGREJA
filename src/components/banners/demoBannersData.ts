import { ChurchBanner } from '../../types';

/**
 * Dataset demonstrativo inicial de banners e destaques visuais da igreja local.
 * Consome estritamente o contrato canônico ChurchBanner.
 * Tenant proprietário: 'ib_central'
 */
export const INITIAL_DEMO_BANNERS: ChurchBanner[] = [
  {
    id: 'ban_01',
    tenantId: 'ib_central',
    title: 'Uma Igreja Acolhedora, Viva e Relevante',
    subtitle: 'Construindo vidas através da Palavra, do Amor Fraternal e da Comunhão Cristã. Cultos aos domingos às 10h e 18h.',
    imageMediaId: 'med_01', // Fachada do Templo Principal
    primaryButtonLabel: 'Planeje Sua Visita',
    primaryButtonUrl: '/sobre',
    secondaryButtonLabel: 'Assistir Culto Online',
    secondaryButtonUrl: '/sermoes',
    order: 1,
    status: 'active',
    createdAt: '2026-08-01T09:00:00Z',
    updatedAt: '2026-09-01T15:30:00Z',
  },
  {
    id: 'ban_02',
    tenantId: 'ib_central',
    title: 'Conferência de Famílias 2026',
    subtitle: 'Três dias de restauração, edificação bíblica e comunhão conjugal e familiar com preletores convidados.',
    imageMediaId: 'med_02', // Culto de Celebração de Domingo
    primaryButtonLabel: 'Inscrever Família',
    primaryButtonUrl: '/eventos',
    secondaryButtonLabel: 'Ver Programação',
    secondaryButtonUrl: '/noticias',
    order: 2,
    status: 'active',
    createdAt: '2026-08-10T11:00:00Z',
    updatedAt: '2026-09-02T10:00:00Z',
  },
  {
    id: 'ban_03',
    tenantId: 'ib_central',
    title: 'Série de Mensagens: A Esperança Viva',
    subtitle: 'Acompanhe nossa nova jornada expositiva dominical no livro de 1 Pedro, trazendo consolo e firmeza na fé.',
    imageMediaId: 'med_04', // Batismo nas Águas
    primaryButtonLabel: 'Ouvir Mensagens',
    primaryButtonUrl: '/sermoes',
    order: 3,
    status: 'active',
    createdAt: '2026-08-15T14:20:00Z',
    updatedAt: '2026-09-03T09:15:00Z',
  },
  {
    id: 'ban_04',
    tenantId: 'ib_central',
    title: 'Rede de Pequenos Grupos & Células',
    subtitle: 'Encontre um grupo de comunhão próximo à sua residência e cresça em amizade cristã e oração mútua.',
    imageMediaId: 'med_05', // Retiro de Jovens
    primaryButtonLabel: 'Localizar Grupo',
    primaryButtonUrl: '/ministerios',
    secondaryButtonLabel: 'Falar com Líder',
    secondaryButtonUrl: '/fale-conosco',
    order: 4,
    status: 'active',
    createdAt: '2026-08-20T16:00:00Z',
    updatedAt: '2026-09-04T12:00:00Z',
  },
  {
    id: 'ban_05',
    tenantId: 'ib_central',
    title: 'Campanha de Missões Nacionais: Alcance o Sertão',
    subtitle: 'Campanha especial de oração, envio missionário e contribuição voluntária para plantação de igrejas sertanejas.',
    imageMediaId: 'med_06', // Projeto Social Esperança Viva
    primaryButtonLabel: 'Contribuir com Missões',
    primaryButtonUrl: '/dizimos',
    order: 5,
    status: 'inactive',
    createdAt: '2026-07-10T08:00:00Z',
    updatedAt: '2026-08-30T18:00:00Z',
  },
  {
    id: 'ban_06',
    tenantId: 'ib_central',
    title: 'Retiro Espiritual de Carnaval 2026',
    subtitle: 'Dias abençoados de imersão espiritual, louvor e estudos bíblicos no acampamento da congregação.',
    imageMediaId: 'med_05',
    primaryButtonLabel: 'Ver Fotos do Retiro',
    primaryButtonUrl: '/galeria',
    order: 6,
    status: 'inactive',
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
];
