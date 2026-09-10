import { InstitutionalContent, SiteSettings } from '../../types';

/**
 * Dados demonstrativos iniciais para Configurações Gerais e Identidade da Igreja
 * Respeita 100% os contratos canônicos consolidados:
 * - InstitutionalContent (Fase 11)
 * - SiteSettings (Fase 17)
 */
export const INITIAL_DEMO_INSTITUTIONAL: InstitutionalContent = {
  tenantId: 'ib_central',
  profile: {
    name: 'Igreja Batista Central',
    shortName: 'IBC Central',
    description: 'Uma igreja viva levando a mensagem do Evangelho a todas as famílias e gerando impacto espiritual e social na cidade.',
    tagline: 'Comunhão, Adoração e Missão',
    slogan: 'Lugar de recomeços e esperança viva',
    denomination: 'Batista Tradicional',
    leadPastor: 'Pr. Alexandre Mendes',
    foundingYear: 1984,
    logoMediaId: 'media_logo_principal',
    logoUrl: 'https://images.unsplash.com/photo-1548625361-16a9a0dc1986?auto=format&fit=crop&w=400&q=80',
  },
  address: {
    street: 'Avenida das Nações',
    number: '1420',
    complement: 'Templo Sede',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    postalCode: '01310-100',
    country: 'Brasil',
  },
  contact: {
    email: 'contato@igrejabatistacentral.com.br',
    phone: '(11) 3456-7890',
    whatsapp: '(11) 98765-4321',
  },
  socialLinks: {
    instagram: 'https://instagram.com/ibcentral',
    youtube: 'https://youtube.com/@ibcentral',
    facebook: 'https://facebook.com/ibcentral',
    spotify: 'https://spotify.com/show/ibcpodcast',
  },
  updatedAt: '2026-09-08T10:00:00Z',
};

export const INITIAL_DEMO_SITE_SETTINGS: SiteSettings = {
  tenantId: 'ib_central',
  siteName: 'Igreja Batista Central — Portal Oficial',
  language: 'pt-BR',
  locale: 'pt_BR',
  timezone: 'America/Sao_Paulo',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
  faviconMediaId: 'media_favicon_01',
  faviconUrl: 'https://images.unsplash.com/photo-1548625361-16a9a0dc1986?auto=format&fit=crop&w=64&q=80',
  updatedAt: '2026-09-08T10:00:00Z',
};
