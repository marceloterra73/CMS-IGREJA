import { SiteAnalytics } from '../../types';

/**
 * Dados demonstrativos canônicos de Configuração de Analytics e Métricas do Site (Fase 23)
 * Tenant proprietário: 'ib_central'
 *
 * Respeita 100% o contrato canônico SiteAnalytics:
 * - tenantId: TenantId ('ib_central')
 * - googleAnalyticsId?: string
 * - googleTagManagerId?: string
 * - metaPixelId?: string
 * - searchConsoleVerificationToken?: string
 * - anonymizeIp?: boolean
 * - consentRequired?: boolean
 * - isActive?: boolean
 * - updatedAt?: string
 */
export const INITIAL_DEMO_ANALYTICS: SiteAnalytics = {
  tenantId: 'ib_central',
  googleAnalyticsId: 'G-7X9B2C4E6F',
  googleTagManagerId: 'GTM-K8L9M2N',
  metaPixelId: '1234567890123456',
  searchConsoleVerificationToken: 'google123456789abcdef0',
  anonymizeIp: true,
  consentRequired: true,
  isActive: true,
  updatedAt: '2026-03-01T14:30:00.000Z',
};
