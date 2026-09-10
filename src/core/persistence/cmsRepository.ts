/**
 * CMS CORE — REPOSITÓRIO CANÔNICO DE PERSISTÊNCIA LOCAL (FASE 51)
 *
 * Responsabilidade Arquitetural:
 * - Camada técnica especializada para carregar e persistir dados canônicos do CMS.
 * - Respeita rigorosamente os contratos já existentes (Zero contratos paralelos).
 * - Garante isolamento absoluto por tenantId (padrão: 'ib_central').
 * - Carrega os dados persistidos se existirem; se não existirem, faz fallback seguro para os dados iniciais.
 * - Impede que recarregamentos ou reinicializações sobrescrevam dados salvos pelo usuário.
 */

import {
  ChurchDonationInfo,
  ChurchLiveStreamInfo,
  ChurchSchedule,
  InstitutionalContent,
  NavigationMenu,
  Page,
  SiteAnalytics,
  SiteDomain,
  SiteSEO,
  SiteSettings,
  VisualTheme,
} from '../../types';
import { localCmsStorageEngine, StorageEngine } from './storageEngine';
import { getCmsStorageKey, DEFAULT_TENANT_ID } from './canonicalStorageKeys';

// Fontes canônicas de dados iniciais (utilizadas estritamente como fallback quando ainda não houver dados gravados)
import {
  INITIAL_DEMO_INSTITUTIONAL,
  INITIAL_DEMO_SITE_SETTINGS,
} from '../../components/settings/demoSettingsData';
import { INITIAL_DEMO_THEMES } from '../../components/appearance/demoAppearanceData';
import { INITIAL_DEMO_SITE_SEO } from '../../components/seo/demoSeoData';
import { INITIAL_DEMO_DOMAINS } from '../../components/domains/demoDomainsData';
import { INITIAL_DEMO_ANALYTICS } from '../../components/analytics/demoAnalyticsData';
import { INITIAL_DEMO_SCHEDULES } from '../../components/schedules/demoSchedulesData';
import { INITIAL_DEMO_DONATION } from '../../components/donations/demoDonationData';
import { INITIAL_DEMO_LIVESTREAM } from '../../components/live-stream/demoLiveStreamData';
import { INITIAL_DEMO_PAGES } from '../../components/pages/demoPagesData';
import { INITIAL_DEMO_MENUS } from '../../components/navigation/demoNavigationData';

export class CmsCanonicalRepository {
  private engine: StorageEngine;

  constructor(engine: StorageEngine = localCmsStorageEngine) {
    this.engine = engine;
  }

  /**
   * Retorna o StorageEngine atualmente configurado no repositório.
   */
  public getEngine(): StorageEngine {
    return this.engine;
  }

  /**
   * Atualiza explicitamente o StorageEngine ativo.
   * Não realiza fallback silencioso caso o novo motor encontre erros.
   */
  public setEngine(engine: StorageEngine): void {
    if (!engine) {
      throw new Error('[CmsCanonicalRepository] StorageEngine fornecido é inválido.');
    }
    this.engine = engine;
  }

  /**
   * Identifica de forma determinística e explícita o tipo de provedor ativo.
   */
  public getEngineType(): 'local' | 'server' | 'custom' {
    if (this.engine === localCmsStorageEngine) {
      return 'local';
    }
    if (
      typeof (this.engine as any).readAsync === 'function' &&
      typeof (this.engine as any).writeAsync === 'function' &&
      'client' in (this.engine as any)
    ) {
      return 'server';
    }
    return 'custom';
  }

  // ==========================================
  // SETTINGS & CONTEÚDO INSTITUCIONAL (Fase 42)
  // ==========================================

  public loadSettings(tenantId: string = DEFAULT_TENANT_ID): SiteSettings {
    const key = getCmsStorageKey('settings', tenantId);
    return this.engine.read<SiteSettings>(key, INITIAL_DEMO_SITE_SETTINGS);
  }

  public saveSettings(data: SiteSettings, tenantId: string = DEFAULT_TENANT_ID): boolean {
    const key = getCmsStorageKey('settings', tenantId);
    return this.engine.write<SiteSettings>(key, data);
  }

  public loadInstitutional(tenantId: string = DEFAULT_TENANT_ID): InstitutionalContent {
    const key = getCmsStorageKey('institutional', tenantId);
    return this.engine.read<InstitutionalContent>(key, INITIAL_DEMO_INSTITUTIONAL);
  }

  public saveInstitutional(data: InstitutionalContent, tenantId: string = DEFAULT_TENANT_ID): boolean {
    const key = getCmsStorageKey('institutional', tenantId);
    return this.engine.write<InstitutionalContent>(key, data);
  }

  // ==========================================
  // APARÊNCIA & TEMAS VISUAIS (Fase 43)
  // ==========================================

  public loadThemes(tenantId: string = DEFAULT_TENANT_ID): VisualTheme[] {
    const key = getCmsStorageKey('themes', tenantId);
    return this.engine.read<VisualTheme[]>(key, INITIAL_DEMO_THEMES);
  }

  public saveThemes(data: VisualTheme[], tenantId: string = DEFAULT_TENANT_ID): boolean {
    const key = getCmsStorageKey('themes', tenantId);
    return this.engine.write<VisualTheme[]>(key, data);
  }

  public loadActiveThemeId(tenantId: string = DEFAULT_TENANT_ID): string {
    const key = getCmsStorageKey('active_theme_id', tenantId);
    const defaultId = INITIAL_DEMO_THEMES.find((t) => t.isDefault)?.id || INITIAL_DEMO_THEMES[0].id;
    return this.engine.read<string>(key, defaultId);
  }

  public saveActiveThemeId(themeId: string, tenantId: string = DEFAULT_TENANT_ID): boolean {
    const key = getCmsStorageKey('active_theme_id', tenantId);
    return this.engine.write<string>(key, themeId);
  }

  public loadActiveTheme(tenantId: string = DEFAULT_TENANT_ID): VisualTheme {
    const themes = this.loadThemes(tenantId);
    const activeId = this.loadActiveThemeId(tenantId);
    const found = themes.find((t) => t.id === activeId);
    return found || themes[0] || INITIAL_DEMO_THEMES[0];
  }

  public saveActiveTheme(theme: VisualTheme, tenantId: string = DEFAULT_TENANT_ID): boolean {
    const themes = this.loadThemes(tenantId);
    const updatedThemes = themes.map((t) => (t.id === theme.id ? theme : t));
    const savedThemes = this.saveThemes(updatedThemes, tenantId);
    const savedActiveId = this.saveActiveThemeId(theme.id, tenantId);
    return savedThemes && savedActiveId;
  }

  // ==========================================
  // SEO & METADADOS (Fase 44)
  // ==========================================

  public loadSiteSeo(tenantId: string = DEFAULT_TENANT_ID): SiteSEO {
    const key = getCmsStorageKey('seo_site', tenantId);
    return this.engine.read<SiteSEO>(key, INITIAL_DEMO_SITE_SEO);
  }

  public saveSiteSeo(data: SiteSEO, tenantId: string = DEFAULT_TENANT_ID): boolean {
    const key = getCmsStorageKey('seo_site', tenantId);
    return this.engine.write<SiteSEO>(key, data);
  }

  // ==========================================
  // DOMÍNIOS (Fase 45)
  // ==========================================

  public loadDomains(tenantId: string = DEFAULT_TENANT_ID): SiteDomain[] {
    const key = getCmsStorageKey('domains', tenantId);
    return this.engine.read<SiteDomain[]>(key, INITIAL_DEMO_DOMAINS);
  }

  public saveDomains(data: SiteDomain[], tenantId: string = DEFAULT_TENANT_ID): boolean {
    const key = getCmsStorageKey('domains', tenantId);
    return this.engine.write<SiteDomain[]>(key, data);
  }

  // ==========================================
  // ANALYTICS & TAGS (Fase 46)
  // ==========================================

  public loadAnalytics(tenantId: string = DEFAULT_TENANT_ID): SiteAnalytics {
    const key = getCmsStorageKey('analytics', tenantId);
    return this.engine.read<SiteAnalytics>(key, INITIAL_DEMO_ANALYTICS);
  }

  public saveAnalytics(data: SiteAnalytics, tenantId: string = DEFAULT_TENANT_ID): boolean {
    const key = getCmsStorageKey('analytics', tenantId);
    return this.engine.write<SiteAnalytics>(key, data);
  }

  // ==========================================
  // AGENDA DE CULTOS (Fase 47)
  // ==========================================

  public loadSchedules(tenantId: string = DEFAULT_TENANT_ID): ChurchSchedule[] {
    const key = getCmsStorageKey('schedules', tenantId);
    return this.engine.read<ChurchSchedule[]>(key, INITIAL_DEMO_SCHEDULES);
  }

  public saveSchedules(data: ChurchSchedule[], tenantId: string = DEFAULT_TENANT_ID): boolean {
    const key = getCmsStorageKey('schedules', tenantId);
    return this.engine.write<ChurchSchedule[]>(key, data);
  }

  // ==========================================
  // DOAÇÕES & PIX (Fase 48)
  // ==========================================

  public loadDonations(tenantId: string = DEFAULT_TENANT_ID): ChurchDonationInfo {
    const key = getCmsStorageKey('donations', tenantId);
    return this.engine.read<ChurchDonationInfo>(key, INITIAL_DEMO_DONATION);
  }

  public saveDonations(data: ChurchDonationInfo, tenantId: string = DEFAULT_TENANT_ID): boolean {
    const key = getCmsStorageKey('donations', tenantId);
    return this.engine.write<ChurchDonationInfo>(key, data);
  }

  // ==========================================
  // TRANSMISSÃO AO VIVO (Fase 49)
  // ==========================================

  public loadLiveStream(tenantId: string = DEFAULT_TENANT_ID): ChurchLiveStreamInfo {
    const key = getCmsStorageKey('live_stream', tenantId);
    return this.engine.read<ChurchLiveStreamInfo>(key, INITIAL_DEMO_LIVESTREAM);
  }

  public saveLiveStream(data: ChurchLiveStreamInfo, tenantId: string = DEFAULT_TENANT_ID): boolean {
    const key = getCmsStorageKey('live_stream', tenantId);
    return this.engine.write<ChurchLiveStreamInfo>(key, data);
  }

  // ==========================================
  // PÁGINAS DO CMS (Fase 32 / Core)
  // ==========================================

  public loadPages(tenantId: string = DEFAULT_TENANT_ID): Page[] {
    const key = getCmsStorageKey('pages', tenantId);
    return this.engine.read<Page[]>(key, INITIAL_DEMO_PAGES);
  }

  public savePages(data: Page[], tenantId: string = DEFAULT_TENANT_ID): boolean {
    const key = getCmsStorageKey('pages', tenantId);
    return this.engine.write<Page[]>(key, data);
  }

  // ==========================================
  // NAVEGAÇÃO E MENUS (Fase 31 / Core)
  // ==========================================

  public loadMenus(tenantId: string = DEFAULT_TENANT_ID): NavigationMenu[] {
    const key = getCmsStorageKey('navigation', tenantId);
    return this.engine.read<NavigationMenu[]>(key, INITIAL_DEMO_MENUS);
  }

  public saveMenus(data: NavigationMenu[], tenantId: string = DEFAULT_TENANT_ID): boolean {
    const key = getCmsStorageKey('navigation', tenantId);
    return this.engine.write<NavigationMenu[]>(key, data);
  }
}

/**
 * Instância canônica global do repositório de persistência
 */
export const cmsRepository = new CmsCanonicalRepository();

/**
 * Utilitário explícito para configuração do motor de persistência canônico.
 */
export function configureCmsPersistence(engine: StorageEngine): CmsCanonicalRepository {
  cmsRepository.setEngine(engine);
  return cmsRepository;
}

/**
 * Retorna o tipo de persistência ativa na instância global ou informada.
 */
export function getActivePersistenceType(repo: CmsCanonicalRepository = cmsRepository): 'local' | 'server' | 'custom' {
  return repo.getEngineType();
}
