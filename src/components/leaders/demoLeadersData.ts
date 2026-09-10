import { ChurchLeader } from '../../types';

/**
 * Dataset demonstrativo inicial de lideranças da igreja local.
 * Consome estritamente o contrato canônico ChurchLeader.
 * Tenant proprietário: 'ib_central'
 */
export const INITIAL_DEMO_LEADERS: ChurchLeader[] = [
  {
    id: 'ldr_01',
    tenantId: 'ib_central',
    name: 'Pr. Roberto Albuquerque',
    role: 'Pastor Presidente / Sênior',
    description:
      'Bacharel em Teologia pelo Seminário Bíblico e mestre em Liderança Cristã. Serve à Igreja Batista Central há mais de 16 anos, dedicando-se ao ensino expositivo das Escrituras e à mentoria espiritual da congregação.',
    photoMediaId: 'med_03',
    order: 1,
    status: 'active',
    createdAt: '2026-01-10T09:00:00Z',
    updatedAt: '2026-09-01T14:30:00Z',
  },
  {
    id: 'ldr_02',
    tenantId: 'ib_central',
    name: 'Pra. Helena Albuquerque',
    role: 'Pastora de Famílias e Aconselhamento',
    description:
      'Pedagoga com especialização em Terapia Familiar e Aconselhamento Pastoral. Coordena a rede de casais, cursos pré-matrimoniais e encontros de fortalecimento para lares cristãos.',
    photoMediaId: undefined,
    order: 2,
    status: 'active',
    createdAt: '2026-01-10T09:15:00Z',
    updatedAt: '2026-08-20T10:00:00Z',
  },
  {
    id: 'ldr_03',
    tenantId: 'ib_central',
    name: 'Pr. Lucas Ferreira',
    role: 'Pastor de Juventude e Missões Urbanas',
    description:
      'Lidera o ministério de jovens e adolescentes, coordenando acampamentos anuais, vigílias e projetos de evangelismo em universidades e comunidades da região metropolitana.',
    photoMediaId: undefined,
    order: 3,
    status: 'active',
    createdAt: '2026-02-05T11:00:00Z',
    updatedAt: '2026-08-25T16:45:00Z',
  },
  {
    id: 'ldr_04',
    tenantId: 'ib_central',
    name: 'Ministra Camila Duarte',
    role: 'Coordenadora de Louvor e Expressão Artística',
    description:
      'Formada em Música Sacra e regência coral. Coordena os coros da igreja, equipes de instrumentalistas dos cultos dominicais e oficinas de formação musical para novos talentos.',
    photoMediaId: 'med_07',
    order: 4,
    status: 'active',
    createdAt: '2026-02-15T15:20:00Z',
    updatedAt: '2026-09-02T08:30:00Z',
  },
  {
    id: 'ldr_05',
    tenantId: 'ib_central',
    name: 'Diácono Samuel Mendes',
    role: 'Coordenador da Diaconia e Ação Social',
    description:
      'Responsável pelo comitê diaconal, atendimento de assistência social a famílias necessitadas, distribuição mensal de cestas básicas e apoio logístico nos eventos da comunidade.',
    photoMediaId: undefined,
    order: 5,
    status: 'active',
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-07-15T11:00:00Z',
  },
  {
    id: 'ldr_06',
    tenantId: 'ib_central',
    name: 'Profª Débora Santos',
    role: 'Superintendente de Ensino Bíblico (EBD)',
    description:
      'Especialista em Didática do Ensino Religioso. Lidera a formação continuada de professores da Escola Bíblica Dominical e a seleção dos currículos teológicos por faixas etárias.',
    photoMediaId: 'med_06',
    order: 6,
    status: 'active',
    createdAt: '2026-03-12T14:00:00Z',
    updatedAt: '2026-08-10T12:00:00Z',
  },
  {
    id: 'ldr_07',
    tenantId: 'ib_central',
    name: 'Pr. Estêvão Valença',
    role: 'Pastor Emérito e Conselheiro Consultivo',
    description:
      'Liderou a comunidade pastoral por mais de 25 anos. Atualmente atua como conselheiro sênior da diretoria, preletor convidado em simpósios e mentor para a nova geração pastoral.',
    photoMediaId: undefined,
    order: 7,
    status: 'inactive',
    createdAt: '2026-01-05T08:00:00Z',
    updatedAt: '2026-06-30T10:00:00Z',
  },
];
