/**
 * CMS CORE — DOMÍNIO: MEDIA (BIBLIOTECA DE MÍDIA) (FASE 10)
 * Responsabilidade Arquitetural:
 * Define a fronteira arquitetural de mídias e ativos do CMS.
 * Garante que todo item de mídia seja conceitualmente vinculado ao seu tenantId proprietário.
 *
 * Arquitetura Oficial:
 * Tenant -> Media Library -> MediaItem -> BlockData (ImageFieldData.mediaId)
 *
 * Fronteira estritamente declarativa e de contratos de tipos.
 * Proibido implementar rotinas de upload, adaptadores de storage, otimizadores, CDNs ou manipuladores de arquivos.
 */

export type {
  MediaItem,
  MediaId,
  MediaType,
  MediaDimensions,
  MediaStatus,
} from '../types';
