import { ChurchPrayerRequest } from '../../types';

/**
 * Dataset demonstrativo inicial de pedidos de oração da congregação.
 * Consome estritamente o contrato canônico ChurchPrayerRequest.
 * Dados 100% fictícios, confidenciais e adequados ao contexto eclesiástico.
 * Tenant proprietário: 'ib_central'
 */
export const INITIAL_DEMO_PRAYER_REQUESTS: ChurchPrayerRequest[] = [
  {
    id: 'pray_01',
    tenantId: 'ib_central',
    title: 'Recuperação cirúrgica e saúde da família',
    requesterName: 'Helena Ribeiro Vasconcelos',
    requestText:
      'Peço oração pelo meu pai, Sr. Joaquim, que passará por uma cirurgia cardíaca na próxima quinta-feira pela manhã. Que Deus guie as mãos da equipe médica e conceda uma recuperação rápida e sem complicações.',
    isAnonymous: false,
    status: 'praying',
    createdAt: '2026-09-04T08:15:00Z',
    updatedAt: '2026-09-05T10:30:00Z',
  },
  {
    id: 'pray_02',
    tenantId: 'ib_central',
    title: 'Porta de emprego e restauração financeira',
    requesterName: 'Mateus Albuquerque dos Santos',
    requestText:
      'Irmãos, estou em processo seletivo para uma vaga de analista de sistemas após 5 meses de desemprego. Peço intercessão para que a vontade do Senhor se cumpra e que haja provisão e paz no meu lar.',
    isAnonymous: false,
    status: 'pending',
    createdAt: '2026-09-06T14:20:00Z',
    updatedAt: '2026-09-06T14:20:00Z',
  },
  {
    id: 'pray_03',
    tenantId: 'ib_central',
    title: 'Libertação e restauração de matrimônio',
    requesterName: undefined,
    requestText:
      'Peço intercessão em sigilo pelo meu casamento. Estamos enfrentando momentos de grande desgaste e distanciamento. Oro para que o Espírito Santo quebrante nossos corações, restaure o diálogo, o perdão e a comunhão em nosso lar.',
    isAnonymous: true,
    status: 'praying',
    createdAt: '2026-09-03T19:40:00Z',
    updatedAt: '2026-09-04T09:10:00Z',
  },
  {
    id: 'pray_04',
    tenantId: 'ib_central',
    title: 'Agradecimento por cura e alta médica',
    requesterName: 'Clara Silveira Mendonça',
    requestText:
      'Gostaria de compartilhar uma grande bênção e agradecer às orações da congregação! Minha filha Laura recebeu alta hospitalar ontem após 12 dias de internação por pneumonia. Louvado seja Deus pelo cuidado em cada detalhe.',
    isAnonymous: false,
    status: 'answered',
    createdAt: '2026-08-28T11:00:00Z',
    updatedAt: '2026-09-02T16:45:00Z',
  },
  {
    id: 'pray_05',
    tenantId: 'ib_central',
    title: 'Paz emocional e superação de crises de ansiedade',
    requesterName: undefined,
    requestText:
      'Tenho passado por crises constantes de ansiedade e noites de insônia que têm afetado meus estudos e trabalho. Rogo pela oração dos irmãos por fortalecimento espiritual, serenidade e clareza mental.',
    isAnonymous: true,
    status: 'pending',
    createdAt: '2026-09-07T06:30:00Z',
    updatedAt: '2026-09-07T06:30:00Z',
  },
  {
    id: 'pray_06',
    tenantId: 'ib_central',
    title: 'Viagem missionária e impacto comunitário no Sertão',
    requesterName: 'Lucas Ferreira (Líder Conectados)',
    requestText:
      'Nossa equipe de 14 jovens viajará neste fim de semana para o projeto missionário no interior da Paraíba. Orem por proteção nas estradas, suprimento de água e recursos, e que o Evangelho seja anunciado com ousadia e compaixão.',
    isAnonymous: false,
    status: 'praying',
    createdAt: '2026-09-01T17:00:00Z',
    updatedAt: '2026-09-03T11:20:00Z',
  },
  {
    id: 'pray_07',
    tenantId: 'ib_central',
    title: 'Conversão dos familiares',
    requesterName: 'Dona Maria Aparecida',
    requestText:
      'Peço a oração de toda a igreja pela conversão dos meus dois filhos, André e Gabriel. Que eles tenham um encontro genuíno com Cristo e retornem para os caminhos do Senhor.',
    isAnonymous: false,
    status: 'praying',
    createdAt: '2026-08-20T10:00:00Z',
    updatedAt: '2026-08-25T15:00:00Z',
  },
  {
    id: 'pray_08',
    tenantId: 'ib_central',
    title: 'Gratidão por aprovação em concurso público',
    requesterName: 'Renato Guimarães',
    requestText:
      'Deus é fiel! Fui nomeado no concurso do Tribunal de Justiça após 3 anos de dedicação. Agradeço a cada irmão do grupo de oração que intercedeu por mim durante as madrugadas.',
    isAnonymous: false,
    status: 'answered',
    createdAt: '2026-08-15T09:30:00Z',
    updatedAt: '2026-08-30T18:00:00Z',
  },
  {
    id: 'pray_09',
    tenantId: 'ib_central',
    title: 'Orientação profissional e vestibular',
    requesterName: 'Beatriz Costa',
    requestText:
      'Estou no último ano do ensino médio e me sinto confusa sobre a escolha do curso universitário. Peço oração por discernimento divino e paz no coração para tomar a melhor decisão.',
    isAnonymous: false,
    status: 'archived',
    createdAt: '2026-07-10T15:00:00Z',
    updatedAt: '2026-08-10T14:00:00Z',
  },
  {
    id: 'pray_10',
    tenantId: 'ib_central',
    title: 'Luto e consolo para a família Rocha',
    requesterName: 'Pastoral de Intercessão',
    requestText:
      'Consolo do Espírito Santo para a irmã Neide e seus netos pelo recente falecimento do seu esposo. Que o Deus de toda a consolação traga abrigo e sustento à família neste momento de dor.',
    isAnonymous: false,
    status: 'archived',
    createdAt: '2026-07-25T11:20:00Z',
    updatedAt: '2026-08-15T08:30:00Z',
  },
];
