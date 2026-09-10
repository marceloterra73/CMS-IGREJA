import { ChurchLiveStreamInfo } from '../../types';

/**
 * Dados de demonstração canônicos para o módulo de Transmissão ao Vivo (Fase 49).
 * Contrato Canônico: ChurchLiveStreamInfo (Fase 12)
 *
 * PROIBIÇÃO ARQUITETURAL:
 * - Não criar dados de streaming real, encoders ou RTMP.
 * - Não criar campos adicionais fora do contrato ChurchLiveStreamInfo.
 * - Manter o tenantId 'ib_central' rigorosamente isolado.
 */
export const INITIAL_DEMO_LIVESTREAM: ChurchLiveStreamInfo = {
  id: 'livestream_central',
  tenantId: 'ib_central',
  title: 'Culto de Celebração & Ceia do Senhor — Ao Vivo',
  description:
    'Acompanhe nossa transmissão ao vivo todos os domingos às 10h e 18h. Participe da adoração comunitária, louvor e ministração da Palavra de Deus de onde você estiver.',
  streamUrl: 'https://www.youtube.com/watch?v=live_stream_central',
  status: 'live',
  scheduledAt: '2026-09-13T10:00:00.000Z',
  updatedAt: '2026-09-08T10:30:00.000Z',
};
