import { SiteDomain } from '../../types';

/**
 * Dados demonstrativos canônicos de Domínios e Endereços do Site (Fase 18)
 * Tenant proprietário: 'ib_central'
 *
 * Respeita 100% o contrato canônico SiteDomain:
 * - id: string
 * - tenantId: TenantId ('ib_central')
 * - hostname: string
 * - type: SiteDomainType ('subdomain' | 'custom_domain')
 * - status: SiteDomainStatus ('pending' | 'active' | 'inactive')
 * - isPrimary?: boolean
 * - createdAt: string
 * - updatedAt: string
 */
export const INITIAL_DEMO_DOMAINS: SiteDomain[] = [
  {
    id: 'dom_01',
    tenantId: 'ib_central',
    hostname: 'www.igrejabatistacentral.com.br',
    type: 'custom_domain',
    status: 'active',
    isPrimary: true,
    createdAt: '2026-01-10T09:00:00.000Z',
    updatedAt: '2026-03-01T14:30:00.000Z',
  },
  {
    id: 'dom_02',
    tenantId: 'ib_central',
    hostname: 'igrejabatistacentral.com.br',
    type: 'custom_domain',
    status: 'active',
    isPrimary: false,
    createdAt: '2026-01-10T09:05:00.000Z',
    updatedAt: '2026-03-01T14:30:00.000Z',
  },
  {
    id: 'dom_03',
    tenantId: 'ib_central',
    hostname: 'ibcentral.appigreja.com.br',
    type: 'subdomain',
    status: 'active',
    isPrimary: false,
    createdAt: '2025-12-01T08:00:00.000Z',
    updatedAt: '2025-12-01T08:00:00.000Z',
  },
  {
    id: 'dom_04',
    tenantId: 'ib_central',
    hostname: 'juventude.ibcentral.com.br',
    type: 'custom_domain',
    status: 'pending',
    isPrimary: false,
    createdAt: '2026-08-15T11:20:00.000Z',
    updatedAt: '2026-08-15T11:20:00.000Z',
  },
];
