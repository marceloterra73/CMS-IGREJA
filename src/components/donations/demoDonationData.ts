import { ChurchDonationInfo } from '../../types';

/**
 * Dados de demonstração canônicos para o módulo de Dízimos e Ofertas (Fase 48).
 * Contrato Canônico: ChurchDonationInfo (Fase 12)
 *
 * PROIBIÇÃO ARQUITETURAL:
 * - Não criar dados transacionais, de pagamento ou gateways.
 * - Não criar campos adicionais fora do contrato ChurchDonationInfo.
 * - Manter o tenantId 'ib_central' rigorosamente isolado.
 */
export const INITIAL_DEMO_DONATION: ChurchDonationInfo = {
  id: 'donation_central',
  tenantId: 'ib_central',
  title: 'Dízimos e Ofertas Missionárias',
  description:
    'Sua generosidade sustenta os projetos ministeriais, o acolhimento pastoral da nossa comunidade e o envio de missionários no Brasil e nas nações.',
  bankAccountInfo:
    'Banco do Brasil (001)\nAgência: 3456-7\nConta Corrente: 89012-3\nFavorecido: Igreja Batista Central\nCNPJ: 12.345.678/0001-90',
  pixKey: 'pix@igrejacentral.org.br',
  instructions:
    'Para envio do comprovante para a secretaria da igreja ou para destinar sua oferta a uma finalidade específica (Missões, Ação Social ou Obras), envie uma mensagem para o WhatsApp oficial (11) 98765-4321.',
  status: 'active',
  updatedAt: '2026-09-08T10:00:00.000Z',
};
