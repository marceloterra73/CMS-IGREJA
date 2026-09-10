/**
 * CMS CORE — DOMÍNIO: PAGES (PÁGINAS E ESTRUTURA PÚBLICA) (FASE 19)
 * Responsabilidade Arquitetural:
 * Define a fronteira arquitetural das páginas estruturadas e rotas conceituais do CMS.
 *
 * Regras Estruturais e de Imutabilidade:
 * - A hierarquia oficial é estritamente: Tenant -> pages[] -> Page -> sections[] -> blocks[].
 * - Proibido associar blocos diretamente à página (Page.blocks não existe).
 * - A identidade pública e rota conceitual da página é governada por 'Page.slug' e 'Page.isHome'.
 * - Os metadados de busca são governados por 'Page.seo' (PageSEO).
 *
 * Fronteira estritamente declarativa.
 * Proibido implementar PageEngine, roteadores operacionais (React Router), renderizadores,
 * resolvedores de URL, publishers, sitemaps ou páginas 404 dinâmicas.
 */

export type {
  Page,
  PageId,
  PageTemplate,
  PageStatus,
  PageSEO,
} from '../types';


