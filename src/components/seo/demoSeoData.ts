import { SiteSEO, Page } from '../../types';
import { INITIAL_DEMO_PAGES } from '../pages/demoPagesData';

/**
 * Dados demonstrativos iniciais de SEO Global do Site (SiteSEO)
 * Respeita 100% o contrato canônico SiteSEO (Fase 16):
 * - title?: string
 * - description?: string
 * - keywords?: string[]
 * - siteName?: string
 * - defaultImageMediaId?: MediaId
 * - defaultImageUrl?: string
 * - canonicalBaseUrl?: string
 * - locale?: string
 * - robots?: RobotsDirective (index?, follow?, archive?)
 * - openGraph?: OpenGraphMetadata (title?, description?, imageMediaId?, imageUrl?, type?)
 * - twitter?: TwitterCardMetadata (card?, title?, description?, imageMediaId?, imageUrl?)
 */
export const INITIAL_DEMO_SITE_SEO: SiteSEO = {
  title: 'Igreja Batista Central — Comunhão, Adoração e Missão em São Paulo',
  description:
    'Portal oficial da Igreja Batista Central em São Paulo. Cultos dominicais às 10h e 18h, transmissão ao vivo, ministérios para toda a família e mensagens bíblicas edificantes.',
  keywords: [
    'igreja batista',
    'igreja em são paulo',
    'cultos presenciais',
    'culto ao vivo',
    'sermões bíblicos',
    'comunhão cristã',
    'família',
  ],
  siteName: 'Igreja Batista Central',
  defaultImageMediaId: 'med_01',
  defaultImageUrl:
    'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1920&q=80',
  canonicalBaseUrl: 'https://www.igrejabatistacentral.com.br',
  locale: 'pt_BR',
  robots: {
    index: true,
    follow: true,
    archive: true,
  },
  openGraph: {
    title: 'Igreja Batista Central — Portal Oficial',
    description:
      'Um lugar de acolhimento, palavra viva e esperança para você e sua casa.',
    imageMediaId: 'med_01',
    imageUrl:
      'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1920&q=80',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Igreja Batista Central — Portal Oficial',
    description:
      'Cultos dominicais, mensagens pastorais e ministérios para todas as famílias.',
    imageMediaId: 'med_01',
    imageUrl:
      'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1920&q=80',
  },
};

/**
 * Cópia demonstrativa inicial das páginas do CMS com suporte a PageSEO (Fase 16 e Fase 26)
 */
export const INITIAL_DEMO_PAGES_SEO: Page[] = JSON.parse(
  JSON.stringify(INITIAL_DEMO_PAGES)
);
