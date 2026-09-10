/**
 * CMS CORE — DOMÍNIO: CONTENT (CONTEÚDO INSTITUCIONAL) (FASE 11)
 * Responsabilidade Arquitetural:
 * Define a fronteira estrutural do conteúdo institucional da igreja e as regras de composição:
 * Tenant └── InstitutionalContent (Profile, Address, Contact, SocialLinks)
 *
 * Fronteira estritamente declarativa de contratos de dados.
 * Proibido implementar formulários, editores, rotinas de envio de mensagens ou integrações externas.
 */

export type {
  ContentStatus,
  PageSEO,
  PageStatus,
  InstitutionalContent,
  ChurchProfile,
  ChurchAddress,
  ChurchContact,
  ChurchSocialLinks,
} from '../types';
