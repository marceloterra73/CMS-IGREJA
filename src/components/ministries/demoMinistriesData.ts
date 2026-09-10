import { ChurchMinistry } from '../../types';

/**
 * Dataset demonstrativo inicial de ministérios e departamentos da congregação.
 * Consome estritamente o contrato canônico ChurchMinistry.
 * Tenant proprietário: 'ib_central'
 */
export const INITIAL_DEMO_MINISTRIES: ChurchMinistry[] = [
  {
    id: 'min_01',
    tenantId: 'ib_central',
    name: 'Ministério de Louvor & Adoração',
    slug: 'louvor-adoracao',
    description:
      'Responsável pela condução musical, equipes de instrumentistas, cantores e preparação litúrgica para os cultos de adoração da congregação.',
    leaderName: 'Pr. Carlos Eduardo e Mariana Costa',
    imageMediaId: 'med_07',
    status: 'active',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-08-28T14:30:00Z',
  },
  {
    id: 'min_02',
    tenantId: 'ib_central',
    name: 'Ministério de Jovens — Conectados',
    slug: 'jovens-conectados',
    description:
      'Comunidade de jovens e universitários focada no discipulado, missões urbanas, células semanais e cultos especiais de sábado à noite.',
    leaderName: 'Lucas e Beatriz Mendes',
    imageMediaId: 'med_04',
    status: 'active',
    createdAt: '2026-01-15T11:00:00Z',
    updatedAt: '2026-09-01T16:00:00Z',
  },
  {
    id: 'min_03',
    tenantId: 'ib_central',
    name: 'Ministério Infantil — Geração Futuro',
    slug: 'infantil-geracao-futuro',
    description:
      'Ambiente dedicado ao ensino bíblico acolhedor, dinâmicas lúdicas e evangelização para crianças de 0 a 11 anos durante os cultos dominicais.',
    leaderName: 'Tia Débora Vasconcelos',
    imageMediaId: 'med_06',
    status: 'active',
    createdAt: '2026-02-01T09:00:00Z',
    updatedAt: '2026-08-30T10:15:00Z',
  },
  {
    id: 'min_04',
    tenantId: 'ib_central',
    name: 'Ação Social & Diaconia — Mãos Estendidas',
    slug: 'acao-social-maos-estendidas',
    description:
      'Atuação solidária na comunidade através de distribuição de cestas básicas, apoio aos necessitados, visitas hospitalares e acolhimento comunitário.',
    leaderName: 'Diácono Marcos Ferreira',
    imageMediaId: 'med_05',
    status: 'active',
    createdAt: '2026-02-10T14:00:00Z',
    updatedAt: '2026-08-25T11:00:00Z',
  },
  {
    id: 'min_05',
    tenantId: 'ib_central',
    name: 'Ministério de Casais & Famílias',
    slug: 'casais-familias',
    description:
      'Fortalecimento de casamentos e núcleos familiares por meio de encontros mensais, aconselhamento pastoral, cursos pré-matrimoniais e jantares de comunhão.',
    leaderName: 'Pr. Roberto e Silvana Silveira',
    imageMediaId: 'med_03',
    status: 'active',
    createdAt: '2026-02-20T19:30:00Z',
    updatedAt: '2026-09-02T15:00:00Z',
  },
  {
    id: 'min_06',
    tenantId: 'ib_central',
    name: 'Ministério de Mulheres — Mulheres de Fé',
    slug: 'mulheres-de-fe',
    description:
      'Rede de comunhão, oração intercessória, estudos bíblicos temáticos e apoio mútuo para mulheres de todas as idades da comunidade.',
    leaderName: 'Pastora Silvana Silveira',
    imageMediaId: 'med_02',
    status: 'active',
    createdAt: '2026-03-05T08:30:00Z',
    updatedAt: '2026-08-15T17:40:00Z',
  },
  {
    id: 'min_07',
    tenantId: 'ib_central',
    name: 'Ministério de Homens — Homens de Honra',
    slug: 'homens-de-honra',
    description:
      'Encontros mensais de homens para café da manhã, comunhão, estudo bíblico sobre liderança cristã no lar e no trabalho.',
    leaderName: 'Pb. Marcelo Ribeiro',
    imageMediaId: 'med_01',
    status: 'active',
    createdAt: '2026-03-12T07:00:00Z',
    updatedAt: '2026-07-20T18:10:00Z',
  },
  {
    id: 'min_08',
    tenantId: 'ib_central',
    name: 'Ministério de Intercessão & Vigílias',
    slug: 'intercessao-vigilias',
    description:
      'Equipe constante de oração em favor da igreja, pedidos pastorais, enfermos, missionários e reuniões matutinas de clamor.',
    leaderName: 'Irmã Neide Albuquerque',
    imageMediaId: 'med_08',
    status: 'active',
    createdAt: '2026-04-01T06:00:00Z',
    updatedAt: '2026-08-10T12:00:00Z',
  },
  {
    id: 'min_09',
    tenantId: 'ib_central',
    name: 'Ministério de Integração & Boas-Vindas',
    slug: 'integracao-boas-vindas',
    description:
      'Acolhimento aos novos visitantes, acompanhamento no pós-culto, direcionamento para classes de novos membros e integração congregacional.',
    leaderName: 'Renata Gusmão',
    imageMediaId: 'med_02',
    status: 'inactive',
    createdAt: '2026-04-15T15:00:00Z',
    updatedAt: '2026-08-01T09:30:00Z',
  },
  {
    id: 'min_10',
    tenantId: 'ib_central',
    name: 'Comunicação Visual & Transmissão',
    slug: 'comunicacao-transmissao',
    description:
      'Produção técnica de transmissões ao vivo, fotografia dos cultos, gerenciamento do portal web e projeção das letras de louvor.',
    leaderName: 'Felipe Alencar',
    imageMediaId: 'med_07',
    status: 'inactive',
    createdAt: '2026-05-10T14:20:00Z',
    updatedAt: '2026-07-15T11:45:00Z',
  },
];
