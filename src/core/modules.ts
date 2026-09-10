/**
 * CMS CORE — DOMÍNIO: MODULES (MÓDULOS ECLESIAIS NO CORE) (FASE 12)
 * Responsabilidade Arquitetural:
 * Define a fronteira de integração declarativa entre o núcleo do CMS e os módulos específicos para igrejas.
 * Expõe tipos conceituais, catálogo estrutural de módulos disponíveis e contratos dos domínios de conteúdo.
 *
 * Arquitetura Oficial:
 * Tenant -> InstitutionalContent -> Church Modules -> Module Content Contracts
 *
 * Fronteira estritamente declarativa de contratos de dados.
 * Proibido implementar registro dinâmico, hooks operacionais, carregamento tardio, engines, CRUD ou ativadores em tempo de execução.
 */

export type {
  ChurchModuleType,
  ChurchModuleDefinition,
  ModuleDefinitionStatus,
  ChurchEvent,
  EventStatus,
  ChurchNews,
  NewsStatus,
  ChurchSermon,
  SermonStatus,
  ChurchSchedule,
  ScheduleStatus,
  ChurchMinistry,
  MinistryStatus,
  ChurchLeader,
  LeaderStatus,
  ChurchGalleryAlbum,
  GalleryStatus,
  ChurchPrayerRequest,
  PrayerRequestStatus,
  ChurchDonationInfo,
  DonationStatus,
  ChurchLiveStreamInfo,
  LiveStreamStatus,
} from '../types';

export { CHURCH_MODULES_CATALOG } from '../constants';
