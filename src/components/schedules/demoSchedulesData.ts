import { ChurchSchedule } from '../../types';

/**
 * Dados demonstrativos canônicos da Programação e Horários de Culto (Fase 47)
 * Tenant proprietário: 'ib_central'
 *
 * Respeita 100% o contrato canônico ChurchSchedule:
 * - id: string
 * - tenantId: TenantId ('ib_central')
 * - title: string
 * - dayOfWeek?: string
 * - time: string
 * - description?: string
 * - location?: string
 * - status: ScheduleStatus ('active' | 'inactive')
 * - createdAt?: string
 * - updatedAt?: string
 */
export const INITIAL_DEMO_SCHEDULES: ChurchSchedule[] = [
  {
    id: 'sched_01',
    tenantId: 'ib_central',
    title: 'Culto da Família & EBD',
    dayOfWeek: 'Domingo',
    time: '10:00',
    description:
      'Culto matutino com louvor comunitário, celebração em família e classes simultâneas da Escola Bíblica Dominical para crianças, jovens e adultos.',
    location: 'Templo Principal',
    status: 'active',
    createdAt: '2026-01-10T10:00:00.000Z',
    updatedAt: '2026-03-01T10:00:00.000Z',
  },
  {
    id: 'sched_02',
    tenantId: 'ib_central',
    title: 'Culto de Celebração & Adoração',
    dayOfWeek: 'Domingo',
    time: '18:00',
    description:
      'Culto solene de domingo à noite com ministração da Palavra de Deus, celebração mensal da Ceia do Senhor e coral congregacional.',
    location: 'Templo Principal',
    status: 'active',
    createdAt: '2026-01-10T10:00:00.000Z',
    updatedAt: '2026-03-01T10:00:00.000Z',
  },
  {
    id: 'sched_03',
    tenantId: 'ib_central',
    title: 'Reunião de Oração & Estudo Bíblico',
    dayOfWeek: 'Quarta-feira',
    time: '19:30',
    description:
      'Encontro de meio de semana dedicado à intercessão pastoral pelas famílias da igreja, oração por enfermos e estudo bíblico expositivo versículo a versículo.',
    location: 'Salão Nobre / Templo',
    status: 'active',
    createdAt: '2026-01-12T10:00:00.000Z',
    updatedAt: '2026-03-02T14:30:00.000Z',
  },
  {
    id: 'sched_04',
    tenantId: 'ib_central',
    title: 'Culto Conexão Jovem',
    dayOfWeek: 'Sábado',
    time: '19:30',
    description:
      'Culto da juventude e ministério universitário com louvor contemporâneo, mensagens práticas e comunhão fraterna após a reunião.',
    location: 'Espaço Jovem / Auditório B',
    status: 'active',
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-03-03T18:00:00.000Z',
  },
  {
    id: 'sched_05',
    tenantId: 'ib_central',
    title: 'Café & Comunhão dos Homens',
    dayOfWeek: 'Sábado',
    time: '07:30',
    description:
      'Café da manhã de comunhão quinzenal, oração matinal e estudos bíblicos focados na liderança cristã no lar e no ambiente de trabalho.',
    location: 'Salão Social',
    status: 'active',
    createdAt: '2026-02-01T10:00:00.000Z',
    updatedAt: '2026-03-01T11:00:00.000Z',
  },
  {
    id: 'sched_06',
    tenantId: 'ib_central',
    title: 'Tarde com Propósito (Mulheres)',
    dayOfWeek: 'Terça-feira',
    time: '14:30',
    description:
      'Tarde de oração, estudo bíblico e aconselhamento mútuo para mulheres da congregação e visitantes convidadas.',
    location: 'Salão Social',
    status: 'inactive',
    createdAt: '2026-02-10T10:00:00.000Z',
    updatedAt: '2026-03-04T16:00:00.000Z',
  },
];
