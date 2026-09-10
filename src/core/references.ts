/**
 * CMS CORE — DOMÍNIO: REFERENCES (RELACIONAMENTOS E REFERÊNCIAS DECLARATIVAS) (FASE 14)
 * Responsabilidade Arquitetural:
 * Define a fronteira declarativa para relacionamentos e referências entre entidades do CMS.
 *
 * Arquitetura Oficial:
 * Entidade de Origem -> ContentReference -> Entidade de Destino (via identificador canônico)
 *
 * Fronteira estritamente declarativa de contratos de dados.
 * Proibido implementar resolvers, loaders, query engines, cache, hidratação automática ou execução em runtime.
 */

export type {
  ContentReference,
  ContentReferenceType,
} from '../types';
