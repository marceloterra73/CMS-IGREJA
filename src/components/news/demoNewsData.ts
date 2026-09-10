import { ChurchNews } from '../../types';

/**
 * Dataset demonstrativo de notícias da igreja local.
 * Consome estritamente o contrato canônico ChurchNews.
 * Tenant: 'ib_central'
 */
export const INITIAL_DEMO_NEWS: ChurchNews[] = [
  {
    id: 'news_01',
    tenantId: 'ib_central',
    title: 'Campanha do Quilo: Mais de 2 toneladas arrecadadas para famílias da região',
    slug: 'campanha-do-quilo-arrecadacao-recorde',
    summary: 'A solidariedade da igreja levou esperança e cestas básicas a dezenas de lares em situação de vulnerabilidade.',
    content: `Com imensa gratidão ao Senhor, compartilhamos os frutos da nossa recente Ação de Amor e Solidariedade. Durante todo o último mês, os membros e amigos da igreja uniram forças em prol das famílias assistidas pelo projeto comunitário da IBC.

Ao todo, foram arrecadados mais de 2.100 kg de alimentos não perecíveis, itens de higiene pessoal e agasalhos. O ministério de Ação Social já iniciou a triagem e distribuição das cestas básicas diretamente nos bairros atendidos.

Agradecemos a cada voluntário que dedicou seu tempo para embalar, organizar e entregar cada item, refletindo de maneira prática o amor de Cristo que nos constrange e nos move a servir ao próximo.`,
    imageMediaId: 'med_03',
    author: 'Ministério de Ação Social',
    publishedAt: '2026-09-04T10:00:00Z',
    status: 'published',
    createdAt: '2026-09-02T14:30:00Z',
    updatedAt: '2026-09-04T10:00:00Z',
  },
  {
    id: 'news_02',
    tenantId: 'ib_central',
    title: 'Inscrições abertas para o novo semestre da Escola Bíblica Dominical',
    slug: 'inscricoes-abertas-novo-semestre-ebd',
    summary: 'Classes temáticas para crianças, adolescentes, jovens e adultos terão início no próximo domingo.',
    content: `A formação bíblica e doutrinária sólida é um dos pilares mais preciosos da nossa caminhada cristã. A partir do próximo domingo, daremos início ao segundo semestre letivo da nossa Escola Bíblica Dominical (EBD).

Neste semestre, contaremos com classes estruturadas por faixa etária e módulos especiais para novos convertidos, liderança e família cristã. O material didático já está disponível para retirada na secretaria da igreja.

Convidamos todas as famílias a chegarem às 09h pontualmente para desfrutarmos juntos de uma manhã de comunhão, aprendizado e aprofundamento nas Escrituras Sagradas.`,
    imageMediaId: 'med_05',
    author: 'Coordenação de Educação Cristã',
    publishedAt: '2026-09-01T08:00:00Z',
    status: 'published',
    createdAt: '2026-08-28T09:15:00Z',
    updatedAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'news_03',
    tenantId: 'ib_central',
    title: 'Culto de Celebração reúne centenas de pessoas em profunda adoração',
    slug: 'culto-de-celebracao-reune-centenas',
    summary: 'Uma noite inesquecível de quebrantamento, batismos nas águas e acolhimento de novos membros.',
    content: `No último domingo à noite, vivemos momentos marcantes de edificação comunitária em nosso santuário principal. A mensagem pastoral enfatizou a importância da perseverança na fé e do testemunho público de renovação espiritual.

Durante o culto, tivemos a alegria de testemunhar 18 irmãos descendo às águas batismais, declarando publicamente sua fé e dedicação ao Senhor. Além disso, acolhemos calorosamente 12 novas famílias que agora passam a congregar ativamente conosco.

Se você perdeu a transmissão ou deseja rever os melhores momentos do louvor e da mensagem, acesse a aba de Sermões no site oficial da igreja.`,
    imageMediaId: 'med_02',
    author: 'Pastor Paulo Roberto',
    publishedAt: '2026-08-30T19:00:00Z',
    status: 'published',
    createdAt: '2026-08-29T11:00:00Z',
    updatedAt: '2026-08-30T22:30:00Z',
  },
  {
    id: 'news_04',
    tenantId: 'ib_central',
    title: 'Comunicado Pastoral: Ajuste de horários nas reuniões de oração matinais',
    slug: 'comunicado-pastoral-ajuste-horarios-oracao',
    summary: 'A partir da próxima quarta-feira, a oração das manhãs terá novo formato na capela e transmissão online.',
    content: `Prezada igreja e amados irmãos em Cristo,

Visando proporcionar maior acessibilidade para aqueles que precisam se deslocar ao trabalho logo no início da manhã, informamos que a partir desta semana os nossos encontros de oração e consagração matinal iniciarão às 06h15, com término pontual às 07h00.

O espaço da capela de oração estará aberto diariamente a partir das 06h00 com música instrumental para momentos de clamor silencioso e devocional individual. 

A oração conjunta é o motor das nossas vidas e ministérios. Venha começar o seu dia na presença do Pai!`,
    imageMediaId: 'med_01',
    author: 'Conselho Pastoral',
    publishedAt: '2026-08-25T11:00:00Z',
    status: 'published',
    createdAt: '2026-08-24T16:00:00Z',
    updatedAt: '2026-08-25T11:00:00Z',
  },
  {
    id: 'news_05',
    tenantId: 'ib_central',
    title: 'Encontro Conectados: Juventude prepara vigília de oração e louvor',
    slug: 'encontro-conectados-prepara-vigilia',
    summary: 'Jovens de toda a cidade estão convidados para uma madrugada dedicada à busca espiritual e comunhão.',
    content: `O ministério de juventude Conectados está mobilizando os jovens para a Vigília Anual 'Despertar'. O encontro acontecerá no auditório secundário da IBC com bandas convidadas, ministrações dinâmicas e momentos de intercessão pelos desafios da nossa geração.

Haverá cantina solidária com arrecadação destinada aos custos de transporte dos jovens para o retiro espiritual de fim de ano. Traga seus amigos e participe dessa noite especial de louvor e adoração!`,
    imageMediaId: 'med_06',
    author: 'Liderança Conectados',
    publishedAt: '2026-08-18T15:00:00Z',
    status: 'published',
    createdAt: '2026-08-17T12:00:00Z',
    updatedAt: '2026-08-18T15:00:00Z',
  },
  {
    id: 'news_06',
    tenantId: 'ib_central',
    title: 'Planejamento das obras de ampliação do anexo infantil e berçário',
    slug: 'planejamento-obras-anexo-infantil-bercario',
    summary: 'Nova estrutura contará com climatização adequada, salas temáticas e maior segurança para as crianças.',
    content: `A equipe de patrimônio e infraestrutura da igreja concluiu a etapa de desenho arquitetônico para a revitalização do ministério infantil. A reforma contemplará pisos emborrachados, banheiros adaptados para os pequenos, novos brinquedos educativos e sistema integrado de monitoramento.

Este comunicado está atualmente em revisão pelo conselho diaconal para definição do cronograma de início das intervenções durante o mês de outubro. Em breve divulgaremos todos os detalhes aos pais.`,
    imageMediaId: 'med_04',
    author: 'Diaconia e Patrimônio',
    status: 'draft',
    createdAt: '2026-09-05T09:00:00Z',
    updatedAt: '2026-09-06T14:00:00Z',
  },
  {
    id: 'news_07',
    tenantId: 'ib_central',
    title: 'Relatório Preliminar: Visita Missionária aos campos do Sertão Nordestino',
    slug: 'relatorio-preliminar-missao-sertao',
    summary: 'Equipe de voluntários e profissionais de saúde prestou atendimento humanitário e espiritual a três comunidades.',
    content: `Nosso pastor de missões retornou com notícias encorajadoras da viagem de prospecção e apoio ao polo missionário do sertão. Foram distribuídos filtros de água, kits escolares e medicamentos básicos.

O relatório completo com fotos, depoimentos e próximos passos para adoção das famílias missionárias será publicado após a consolidação final dos dados com a junta regional.`,
    imageMediaId: 'med_05',
    author: 'Secretaria de Missões',
    status: 'draft',
    createdAt: '2026-09-03T16:00:00Z',
    updatedAt: '2026-09-05T10:30:00Z',
  },
  {
    id: 'news_08',
    tenantId: 'ib_central',
    title: 'Retrospectiva: Congresso de Mulheres 2025 impactou mais de 800 participantes',
    slug: 'retrospectiva-congresso-mulheres-2025',
    summary: 'Registros do encontro anual que marcou o ministério feminino com palestras de cura e propósito.',
    content: `Recordamos com alegria os momentos vividos no Congresso Feminino realizado no ano passado. Com o tema 'Edificadas na Rocha', o evento proporcionou renovação, testemunhos edificantes e fortalecimento de amizades preciosas.

Este artigo arquivado permanece em nosso acervo histórico para consulta das participantes e registro da fidelidade de Deus em nossa congregação.`,
    imageMediaId: 'med_04',
    author: 'Ministério Mulheres de Fé',
    publishedAt: '2025-11-20T18:00:00Z',
    status: 'archived',
    createdAt: '2025-11-15T10:00:00Z',
    updatedAt: '2025-11-22T09:00:00Z',
  },
  {
    id: 'news_09',
    tenantId: 'ib_central',
    title: 'Bazar Beneficente de Inverno encerra atividades com meta financeira atingida',
    slug: 'bazar-beneficente-inverno-concluido',
    summary: 'Recursos arrecadados serão direcionados integralmente para o fundo de socorro a famílias em emergência.',
    content: `A comissão organizadora do Bazar Solidário agradece a todos que doaram roupas em excelente estado, calçados e utensílios domésticos. As vendas superaram as expectativas e permitiram abastecer o fundo emergencial de auxílio à comunidade local.

O evento foi oficialmente concluído e arquivado em nossos registros contábeis e pastorais.`,
    imageMediaId: 'med_03',
    author: 'Comitê Social',
    publishedAt: '2026-07-10T17:00:00Z',
    status: 'archived',
    createdAt: '2026-07-01T14:00:00Z',
    updatedAt: '2026-07-15T11:00:00Z',
  },
];
