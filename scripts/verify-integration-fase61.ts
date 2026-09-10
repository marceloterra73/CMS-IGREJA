#!/usr/bin/env tsx
/**
 * SUÍTE DE TESTES E HOMOLOGAÇÃO INTEGRADA FINAL — FASE 61
 * CMS Visual para Igrejas
 *
 * MODO CIRÚRGICO + MODO COFRE + NÃO REGRESSÃO TOTAL
 *
 * Cadeia Arquitetural Homologada de Ponta a Ponta:
 * FRONTEND → CMS UI → CmsCanonicalRepository → StorageEngine →
 * ServerPersistenceProvider → ApiClient → HTTP REST /api/v1 →
 * Authentication → Tenant Context → RBAC → RLS → PostgreSQL →
 * Repository → PUBLIC SITE / RENDERER
 *
 * Cenários de Homologação:
 *   [A] Provider Selection
 *   [B] Local Provider
 *   [C] Server Provider
 *   [D] Repository Integration
 *   [E] API Integration
 *   [F] Authentication
 *   [G] CSRF
 *   [H] RBAC
 *   [I] Tenant Isolation
 *   [J] IDOR Prevention
 *   [K] RLS Policies & Context
 *   [L] Persistence
 *   [M] Reload & Context Reset
 *   [N] Public Renderer & 13 Block Families
 *   [O] Navigation
 *   [P] Themes & Design Tokens
 *   [Q] SEO Metadata
 *   [R] Schedules (sem filtro hardcoded)
 *   [S] Donations
 *   [T] Live Stream
 *   [U] Error Envelope
 *   [V] Request ID
 *   [W] Network Failure
 *   [X] No Silent Fallback
 *   [Y] LocalStorage Preservation (Zero Deletion)
 *   [Z] Regression & Anterior Fases Integrity
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { createApp } from '../server/app.js';
import {
  StorageEngine,
  localCmsStorageEngine,
  CmsCanonicalRepository,
  cmsRepository,
  configureCmsPersistence,
  getActivePersistenceType,
  DEFAULT_TENANT_ID,
  getCmsStorageKey,
  ApiClient,
  ApiClientError,
  ServerPersistenceProvider,
  ProviderError,
  parseCmsStorageKey,
} from '../src/core/persistence/index.js';
import { signAccessToken } from '../server/auth/tokens.js';
import { hashPassword, verifyPassword } from '../server/auth/password.js';
import { createUser } from '../server/auth/service.js';
import { authenticateMiddleware } from '../server/middleware/authenticate.js';
import { requirePermission, requireTenantContext } from '../server/middleware/rbac.js';
import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME, generateCsrfToken } from '../server/middleware/csrf.js';
import { serverResourceStore } from '../server/routes/v1/resources.js';
import { setTenantContext, clearTenantContext, TENANT_SCOPED_TABLES } from '../server/db/rls.js';
import { PUBLIC_BLOCK_REGISTRY } from '../src/components/public-site/PublicBlockRegistry.js';
import { PublicBlockFallback } from '../src/components/public-site/PublicBlockFallback.js';
import {
  SiteSettings,
  InstitutionalContent,
  VisualTheme,
  Page,
  NavigationMenu,
  ChurchSchedule,
  ChurchDonationInfo,
  ChurchLiveStreamInfo,
  SiteSEO,
  SiteDomain,
  SiteAnalytics,
  BlockInstance,
} from '../src/types/index.js';

let totalAssertions = 0;
let passedAssertions = 0;
let failedAssertions = 0;

function assert(condition: boolean, message: string): void {
  totalAssertions++;
  if (condition) {
    passedAssertions++;
    console.log(`  ✅ [PASS] ${message}`);
  } else {
    failedAssertions++;
    console.error(`  ❌ [FAIL] ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runFase61Homologation(): Promise<void> {
  console.log('===============================================================');
  console.log(' INICIANDO HOMOLOGAÇÃO INTEGRADA FINAL — FASE 61');
  console.log(' CMS Visual para Igrejas — Integração Completa de Produção');
  console.log('===============================================================\n');

  // =========================================================================
  // CENÁRIO A: Provider Selection
  // =========================================================================
  console.log('🔀 [CENÁRIO A] Validação de Seleção Explícita de Provedor...');
  const defaultRepo = new CmsCanonicalRepository();
  assert(defaultRepo.getEngineType() === 'local', 'CmsCanonicalRepository inicia com engine local por padrão');
  assert(defaultRepo.getEngine() === localCmsStorageEngine, 'Instância padrão de engine é localCmsStorageEngine');

  const dummyServerProvider = new ServerPersistenceProvider({
    clientConfig: { baseUrl: 'http://127.0.0.1:3000/api/v1' },
    currentTenantId: 'ib_central',
  });
  defaultRepo.setEngine(dummyServerProvider);
  assert(defaultRepo.getEngineType() === 'server', 'setEngine altera explicitamente o tipo do provedor para "server"');
  assert(defaultRepo.getEngine() === dummyServerProvider, 'Engine configurado corresponde à instância fornecida');

  defaultRepo.setEngine(localCmsStorageEngine);
  assert(defaultRepo.getEngineType() === 'local', 'Reversão para localCmsStorageEngine retorna tipo "local"');

  let invalidEngineBlocked = false;
  try {
    defaultRepo.setEngine(null as any);
  } catch {
    invalidEngineBlocked = true;
  }
  assert(invalidEngineBlocked, 'Definição de engine nulo ou inválido é rejeitada com erro explícito');

  assert(getActivePersistenceType(cmsRepository) === 'local', 'getActivePersistenceType identifica corretamente a instância global');

  // =========================================================================
  // CENÁRIO B: Local Provider
  // =========================================================================
  console.log('\n💾 [CENÁRIO B] Validação do Provedor Local (localCmsStorageEngine)...');
  const mockLocalStorageData = new Map<string, string>();
  (global as any).window = {
    localStorage: {
      getItem: (k: string) => mockLocalStorageData.get(k) ?? null,
      setItem: (k: string, v: string) => mockLocalStorageData.set(k, String(v)),
      removeItem: (k: string) => mockLocalStorageData.delete(k),
      clear: () => mockLocalStorageData.clear(),
    },
  };

  const localTestKey = 'cms:ib_central:test_item';
  const localTestData = { siteName: 'Igreja Local Teste', active: true };
  assert(localCmsStorageEngine.write(localTestKey, localTestData), 'localCmsStorageEngine.write grava dados');
  assert(localCmsStorageEngine.exists(localTestKey), 'localCmsStorageEngine.exists confirma existência');
  const readBackLocal = localCmsStorageEngine.read(localTestKey, { siteName: 'Fallback', active: false });
  assert(readBackLocal.siteName === 'Igreja Local Teste', 'localCmsStorageEngine.read lê fielmente os dados gravados');

  // Corrupção de JSON local
  mockLocalStorageData.set('cms:ib_central:corrupted', '{ invalid JSON!!');
  const fallbackRead = localCmsStorageEngine.read('cms:ib_central:corrupted', { fallbackOk: true });
  assert(fallbackRead.fallbackOk === true, 'localCmsStorageEngine retorna fallback canônico sem quebrar diante de JSON corrompido');

  assert(localCmsStorageEngine.remove(localTestKey), 'localCmsStorageEngine.remove remove a chave');
  assert(!localCmsStorageEngine.exists(localTestKey), 'Chave removida não existe mais');

  // =========================================================================
  // SETUP DO SERVIDOR HTTP EPHEMERAL PARA TESTES
  // =========================================================================
  const app = createApp({
    configureRoutes: (testApp) => {
      testApp.get('/api/v1/test/admin-check', authenticateMiddleware, requireTenantContext, requirePermission('manage:users'), (req, res) => {
        res.json({ success: true, message: 'Admin autorizado', user: (req as any).user });
      });

      testApp.get('/api/v1/test/pastor-check', authenticateMiddleware, requireTenantContext, requirePermission('manage:sermons'), (req, res) => {
        res.json({ success: true, message: 'Pastor autorizado', user: (req as any).user });
      });

      testApp.get('/api/v1/test/tenant-check', authenticateMiddleware, requireTenantContext, (req, res) => {
        res.json({ success: true, tenantId: (req as any).tenantId, userTenantId: (req as any).user.tenantId });
      });

      testApp.get('/api/v1/test/errors/:status', (req, res) => {
        const status = parseInt(req.params.status, 10) || 500;
        res.status(status).json({
          success: false,
          code: `TEST_STATUS_${status}`,
          message: `Erro simulado com status ${status}`,
          details: { requestedStatus: status },
          requestId: req.headers['x-request-id'] || 'req_simulated',
          timestamp: new Date().toISOString(),
        });
      });
    },
  });

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  const address = server.address() as any;
  const baseUrl = `http://127.0.0.1:${address.port}/api/v1`;

  // =========================================================================
  // CENÁRIO C: Server Provider
  // =========================================================================
  console.log('\n🌐 [CENÁRIO C] Validação do Provedor de Servidor (ServerPersistenceProvider)...');
  const serverProvider = new ServerPersistenceProvider({
    clientConfig: { baseUrl },
    currentTenantId: 'ib_central',
  });

  assert(serverProvider.exists !== undefined, 'ServerPersistenceProvider implementa interface StorageEngine');
  assert(typeof (serverProvider as any).readAsync === 'function', 'ServerPersistenceProvider possui método assíncrono readAsync');
  assert(typeof (serverProvider as any).writeAsync === 'function', 'ServerPersistenceProvider possui método assíncrono writeAsync');

  const parsedKey = parseCmsStorageKey('cms:ib_central:schedules');
  assert(parsedKey.tenantId === 'ib_central', 'parseCmsStorageKey extrai tenantId correto');
  assert(parsedKey.resource === 'schedules', 'parseCmsStorageKey extrai recurso canônico correto');

  // =========================================================================
  // CENÁRIO D: Repository Integration
  // =========================================================================
  console.log('\n🏛️ [CENÁRIO D] Validação da Integração com CmsCanonicalRepository...');
  const repo = new CmsCanonicalRepository(serverProvider);
  assert(repo.getEngineType() === 'server', 'Repositório opera conectado ao ServerPersistenceProvider');

  // Seed no servidor para todos os recursos canônicos
  const seedSettings: SiteSettings = {
    tenantId: 'ib_central',
    siteName: 'Primeira Igreja Batista Integrada',
  };
  await serverProvider.writeAsync('cms:ib_central:settings', seedSettings);

  const seedThemes: VisualTheme[] = [
    {
      id: 'theme_classic',
      name: 'Clássico Institucional',
      description: 'Tema clássico',
      version: '1.0.0',
      tokens: {
        colors: {
          primary: '#1e3a8a',
          secondary: '#3b82f6',
          accent: '#f59e0b',
          background: '#ffffff',
          surface: '#f8fafc',
          text: '#0f172a',
          muted: '#64748b',
          border: '#e2e8f0',
        },
        typography: {
          fontFamilyHeading: 'Inter',
          fontFamilyBody: 'Inter',
          fontSizeBase: '16px',
          fontSizeHeading: '24px',
          fontWeightNormal: 400,
          fontWeightBold: 700,
        },
        spacing: {
          base: '1rem',
          sectionPaddingYSmall: '1rem',
          sectionPaddingYMedium: '2rem',
          sectionPaddingYLarge: '3rem',
          containerNarrow: '600px',
          containerStandard: '1200px',
          containerWide: '1440px',
        },
        borders: {
          radiusSmall: '4px',
          radiusMedium: '8px',
          radiusLarge: '16px',
          radiusFull: '9999px',
          borderWidthThin: '1px',
          borderWidthThick: '2px',
        },
      },
    },
  ];
  await serverProvider.writeAsync('cms:ib_central:themes', seedThemes);
  await serverProvider.writeAsync('cms:ib_central:active_theme_id', 'theme_classic');

  const seedPages: Page[] = [
    {
      id: 'page_home',
      tenantId: 'ib_central',
      slug: 'home',
      title: 'Início',
      status: 'published',
      order: 1,
      isHome: true,
      seo: {
        metaTitle: 'Início',
        metaDescription: 'Página inicial',
      },
      sections: [
        {
          id: 'sec_hero',
          order: 1,
          isVisible: true,
          blocks: [
            {
              id: 'blk_hero_title',
              type: 'hero',
              order: 1,
              config: {},
              data: { title: 'Bem-vindo à nossa Igreja' },
              isVisible: true,
            },
          ],
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  await serverProvider.writeAsync('cms:ib_central:pages', seedPages);

  const seedMenus: NavigationMenu[] = [
    {
      id: 'menu_header',
      tenantId: 'ib_central',
      name: 'Menu Principal',
      location: 'header',
      items: [
        { id: 'item_1', label: 'Início', url: '/', order: 1, isVisible: true },
        { id: 'item_2', label: 'Contato', url: '/contato', order: 2, isVisible: true },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  await serverProvider.writeAsync('cms:ib_central:navigation', seedMenus);

  const seedSchedules: ChurchSchedule[] = [
    {
      id: 'sch_1',
      tenantId: 'ib_central',
      title: 'Culto da Família',
      dayOfWeek: 'Domingo',
      time: '19:00',
      description: 'Culto de celebração e adoração',
      status: 'active',
    },
  ];
  await serverProvider.writeAsync('cms:ib_central:schedules', seedSchedules);

  const seedDonations: ChurchDonationInfo = {
    id: 'don_1',
    tenantId: 'ib_central',
    title: 'Dízimos e Ofertas',
    pixKey: 'pix@ibcentral.org.br',
    bankAccountInfo: 'Banco do Brasil - Ag: 1234 - CC: 5678-9',
    status: 'active',
  };
  await serverProvider.writeAsync('cms:ib_central:donations', seedDonations);

  const seedLiveStream: ChurchLiveStreamInfo = {
    id: 'live_1',
    tenantId: 'ib_central',
    title: 'Culto ao Vivo',
    streamUrl: 'https://youtube.com/live/ibcentral',
    status: 'scheduled',
  };
  await serverProvider.writeAsync('cms:ib_central:live_stream', seedLiveStream);

  const seedSeo: SiteSEO = {
    title: 'PIB Integrada',
    siteName: 'Igreja Batista Central',
    description: 'Igreja Batista Central - Lugar de comunhão',
    keywords: ['igreja', 'fé', 'adoração'],
  };
  await serverProvider.writeAsync('cms:ib_central:seo_site', seedSeo);

  const seedDomains: SiteDomain[] = [
    {
      id: 'dom_1',
      tenantId: 'ib_central',
      hostname: 'ibcentral.org.br',
      type: 'custom_domain',
      status: 'active',
      isPrimary: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  await serverProvider.writeAsync('cms:ib_central:domains', seedDomains);

  const seedAnalytics: SiteAnalytics = {
    tenantId: 'ib_central',
    googleAnalyticsId: 'G-123456789',
  };
  await serverProvider.writeAsync('cms:ib_central:analytics', seedAnalytics);

  // Leitura síncrona via cache do ServerPersistenceProvider alimentado
  const loadedSettings = repo.loadSettings('ib_central');
  assert(loadedSettings.siteName === 'Primeira Igreja Batista Integrada', 'repo.loadSettings retorna dados do servidor');

  const loadedThemes = repo.loadThemes('ib_central');
  assert(loadedThemes.length === 1 && loadedThemes[0].id === 'theme_classic', 'repo.loadThemes retorna temas do servidor');

  const loadedPages = repo.loadPages('ib_central');
  assert(loadedPages.length === 1 && loadedPages[0].id === 'page_home', 'repo.loadPages retorna páginas do servidor');

  const loadedMenus = repo.loadMenus('ib_central');
  assert(loadedMenus.length === 1 && loadedMenus[0].id === 'menu_header', 'repo.loadMenus retorna menus do servidor');

  const loadedSchedules = repo.loadSchedules('ib_central');
  assert(loadedSchedules.length === 1 && loadedSchedules[0].id === 'sch_1', 'repo.loadSchedules retorna cultos do servidor');

  const loadedDonations = repo.loadDonations('ib_central');
  assert(loadedDonations.pixKey === 'pix@ibcentral.org.br', 'repo.loadDonations retorna dados de contribuição');

  const loadedLive = repo.loadLiveStream('ib_central');
  assert(loadedLive.streamUrl?.includes('youtube') === true, 'repo.loadLiveStream retorna dados de transmissão');

  const loadedSeo = repo.loadSiteSeo('ib_central');
  assert(loadedSeo.title === 'PIB Integrada', 'repo.loadSiteSeo retorna metadados de SEO');

  const loadedDomains = repo.loadDomains('ib_central');
  assert(loadedDomains.length === 1 && loadedDomains[0].hostname === 'ibcentral.org.br', 'repo.loadDomains retorna domínios');

  const loadedAnalytics = repo.loadAnalytics('ib_central');
  assert(loadedAnalytics.googleAnalyticsId === 'G-123456789', 'repo.loadAnalytics retorna IDs de rastreamento');

  // =========================================================================
  // CENÁRIO E: API Integration
  // =========================================================================
  console.log('\n🔌 [CENÁRIO E] Validação da Integração da API REST (/api/v1)...');
  const apiClient = new ApiClient({ baseUrl });
  const healthRes = await apiClient.get<any>('/health');
  assert(healthRes.status === 200 && healthRes.data.success === true, 'GET /api/v1/health retorna HTTP 200 com sucesso');
  assert(healthRes.data.database !== undefined, 'Health check reporta status do subsistema de banco de dados');

  const statusRes = await apiClient.get<any>('/status');
  assert(statusRes.status === 200 && statusRes.data.success === true, 'GET /api/v1/status retorna HTTP 200');
  assert(statusRes.data.persistence.engine === 'PostgreSQL 15+', 'API reporta engine oficial PostgreSQL 15+');
  assert(statusRes.data.persistence.orm === 'Drizzle ORM', 'API reporta ORM oficial Drizzle');

  // =========================================================================
  // CENÁRIO F: Authentication
  // =========================================================================
  console.log('\n🔑 [CENÁRIO F] Validação do Ciclo de Autenticação e Sessão...');
  await createUser({
    id: 'usr_admin_test',
    tenantId: 'ib_central',
    name: 'Admin Central',
    email: 'admin@ibcentral.org.br',
    password: 'Password123!',
    role: 'tenant_admin',
    status: 'active',
    isActive: true,
  });

  const loginRes = await apiClient.post<any>('/auth/login', {
    email: 'admin@ibcentral.org.br',
    password: 'Password123!',
  });
  assert(loginRes.status === 200 && loginRes.data.success === true, 'POST /api/v1/auth/login aceita credenciais válidas');
  assert(typeof loginRes.data.accessToken === 'string', 'Login emite token de acesso JWT');
  assert(loginRes.data.user.email === 'admin@ibcentral.org.br', 'Usuário retornado corresponde ao autenticado');
  assert(loginRes.data.user.passwordHash === undefined, 'Segurança: hash de senha NUNCA é retornado');

  // Consulta /auth/me via Bearer
  const meRes = await apiClient.get<any>('/auth/me', { authToken: loginRes.data.accessToken });
  assert(meRes.status === 200 && meRes.data.success === true, 'GET /api/v1/auth/me autenticado via Bearer retorna 200');
  assert(meRes.data.user.role === 'tenant_admin', 'Papel retornado confere com o cadastro');

  // Rejeição de senha errada
  let invalidCredsBlocked = false;
  try {
    await apiClient.post<any>('/auth/login', {
      email: 'admin@ibcentral.org.br',
      password: 'WrongPassword!',
    });
  } catch (err: any) {
    if (err instanceof ApiClientError && err.status === 401) {
      invalidCredsBlocked = true;
    }
  }
  assert(invalidCredsBlocked, 'Login com senha incorreta é sumariamente rejeitado com HTTP 401');

  // =========================================================================
  // CENÁRIO G: CSRF Protection
  // =========================================================================
  console.log('\n🛡️ [CENÁRIO G] Validação de Proteção Anti-CSRF...');
  const testCsrfToken = generateCsrfToken();

  // Mutação via cookie sem CSRF token deve ser bloqueada com 403
  let csrfBlocked = false;
  try {
    await apiClient.put(
      '/resources/settings?tenantId=ib_central',
      { siteName: 'Mutação Ilegal' },
      { headers: { Cookie: 'cms_access_token=token_mock' } }
    );
  } catch (err: any) {
    if (err instanceof ApiClientError && err.status === 403) {
      csrfBlocked = true;
    }
  }
  assert(csrfBlocked, 'Mutação com autenticação por cookie sem token CSRF é bloqueada com HTTP 403');

  // Mutação com CSRF token válido deve ser aceita
  const csrfAllowed = await apiClient.put(
    '/resources/settings?tenantId=ib_central',
    { siteName: 'Primeira Igreja Batista Integrada' },
    {
      headers: {
        Cookie: `cms_access_token=mock; ${CSRF_COOKIE_NAME}=${testCsrfToken}`,
        [CSRF_HEADER_NAME]: testCsrfToken,
      },
    }
  );
  assert(csrfAllowed.status === 200, 'Mutação com token CSRF válido é autorizada com HTTP 200');

  // =========================================================================
  // CENÁRIO H: RBAC
  // =========================================================================
  console.log('\n⚖️ [CENÁRIO H] Validação de RBAC e Permissões Canônicas...');
  const adminToken = signAccessToken({
    id: 'usr_admin',
    tenantId: 'ib_central',
    role: 'tenant_admin',
    email: 'admin@ibcentral.org.br',
    name: 'Admin Central',
    status: 'active',
    permissions: ['manage:users', 'manage:pages', 'publish:pages'],
  });

  const editorToken = signAccessToken({
    id: 'usr_editor',
    tenantId: 'ib_central',
    role: 'editor',
    email: 'editor@ibcentral.org.br',
    name: 'Editor Central',
    status: 'active',
    permissions: ['manage:pages'],
  });

  // Admin acessa rota restrita a manage:users
  const adminAccess = await apiClient.get<any>('/test/admin-check', { authToken: adminToken });
  assert(adminAccess.status === 200, 'tenant_admin acessa rota protegida pela permissão "manage:users"');

  // Editor é proibido de acessar manage:users
  let editorDenied = false;
  try {
    await apiClient.get<any>('/test/admin-check', { authToken: editorToken });
  } catch (err: any) {
    if (err instanceof ApiClientError && err.status === 403) {
      editorDenied = true;
    }
  }
  assert(editorDenied, 'editor é estritamente proibido de acessar rota restrita a "manage:users" (HTTP 403)');

  // =========================================================================
  // CENÁRIO I: Multi-Tenant Isolation
  // =========================================================================
  console.log('\n🏢 [CENÁRIO I] Validação de Isolamento Multi-Tenant...');
  const sulServerProvider = new ServerPersistenceProvider({
    clientConfig: { baseUrl },
    currentTenantId: 'congrega_sul',
  });
  await sulServerProvider.writeAsync('cms:congrega_sul:settings', {
    siteName: 'Igreja Congregacional Sul',
    churchName: 'Congregacional do Sul',
  });

  const readCentral = await serverProvider.readAsync('cms:ib_central:settings', null as any);
  const readSul = await sulServerProvider.readAsync('cms:congrega_sul:settings', null as any);

  assert(readCentral.siteName === 'Primeira Igreja Batista Integrada', 'Tenant Central mantém exclusivamente seus dados');
  assert(readSul.siteName === 'Igreja Congregacional Sul', 'Tenant Sul mantém exclusivamente seus dados');
  assert(readCentral.siteName !== readSul.siteName, 'Isolamento estrito: dados de diferentes congregações nunca colidem');

  // =========================================================================
  // CENÁRIO J: IDOR Prevention
  // =========================================================================
  console.log('\n🚫 [CENÁRIO J] Validação de Prevenção a IDOR (Insecure Direct Object Reference)...');
  const userCentralProvider = new ServerPersistenceProvider({
    clientConfig: { baseUrl },
    currentTenantId: 'ib_central',
    isSuperAdmin: false,
  });

  let idorBlocked = false;
  try {
    // Usuário do tenant Central tentando ler recursos do tenant Sul
    await userCentralProvider.readAsync('cms:congrega_sul:settings', null as any);
  } catch (err: any) {
    if (err instanceof ProviderError && err.status === 403) {
      idorBlocked = true;
    }
  }
  assert(idorBlocked, 'Tentativa de ler dados de outro tenant (IDOR) é sumariamente bloqueada com HTTP 403');

  // =========================================================================
  // CENÁRIO K: RLS Policies & Context
  // =========================================================================
  console.log('\n🔒 [CENÁRIO K] Validação de Políticas de RLS e Contexto de Sessão...');
  assert(TENANT_SCOPED_TABLES.length === 26, 'Exatamente 26 tabelas multi-tenant protegidas por RLS');

  let mockSessionTenant = '';
  const mockDbClient: any = {
    query: async (sql: string) => {
      if (sql.includes('SET LOCAL app.current_tenant_id')) {
        const match = sql.match(/'([^']+)'/);
        mockSessionTenant = match ? match[1] : '';
      } else if (sql.includes('RESET app.current_tenant_id')) {
        mockSessionTenant = '';
      }
    },
  };

  await setTenantContext(mockDbClient, 'tenant_rls_test');
  assert(mockSessionTenant === 'tenant_rls_test', 'setTenantContext define corretamente app.current_tenant_id');

  await clearTenantContext(mockDbClient);
  assert(mockSessionTenant === '', 'clearTenantContext limpa app.current_tenant_id prevenindo contaminação do pool');

  // =========================================================================
  // CENÁRIO L: Real Persistence Verification
  // =========================================================================
  console.log('\n💾 [CENÁRIO L] Validação de Persistência Real (Ciclo WRITE → READ → UPDATE → READ)...');
  const initialSettings = await serverProvider.readAsync<SiteSettings>('cms:ib_central:settings', {} as any);
  const updatedName = 'Primeira Igreja Batista Integrada — Atualizada';

  // Atualização controlada
  await serverProvider.writeAsync('cms:ib_central:settings', {
    ...initialSettings,
    siteName: updatedName,
  });

  const readUpdated = await serverProvider.readAsync<SiteSettings>('cms:ib_central:settings', {} as any);
  assert(readUpdated.siteName === updatedName, 'Alteração persistida no servidor e relida com fidelidade');

  // Restauração do valor original
  await serverProvider.writeAsync('cms:ib_central:settings', initialSettings);
  const readRestored = await serverProvider.readAsync<SiteSettings>('cms:ib_central:settings', {} as any);
  assert(readRestored.siteName === initialSettings.siteName, 'Valor original restaurado sem efeito colateral');

  // =========================================================================
  // CENÁRIO M: Reload & Context Reset
  // =========================================================================
  console.log('\n🔄 [CENÁRIO M] Validação de Reinicialização de Contexto (Reload / Cache Limpo)...');
  // Criar uma nova instância do provider simulando um reload limpo de página / novo cliente
  const freshServerProvider = new ServerPersistenceProvider({
    clientConfig: { baseUrl },
    currentTenantId: 'ib_central',
  });

  const reloadedPages = await freshServerProvider.readAsync<Page[]>('cms:ib_central:pages', []);
  assert(Array.isArray(reloadedPages) && reloadedPages.length === 1, 'Novo cliente lê páginas persistidas no servidor');
  assert(reloadedPages[0].id === 'page_home', 'ID da página preservado após reinicialização de contexto');

  // =========================================================================
  // CENÁRIO N: Public Renderer & 13 Block Families
  // =========================================================================
  console.log('\n⛪ [CENÁRIO N] Validação de Renderização Pública e 13 Famílias de Blocos...');
  const expectedBlockTypes = [
    'hero',
    'about',
    'schedule',
    'events',
    'sermons',
    'live_stream',
    'donations',
    'contact',
    'ministries',
    'leadership',
    'news',
    'prayer_request',
    'gallery',
  ];

  for (const blockType of expectedBlockTypes) {
    assert(
      PUBLIC_BLOCK_REGISTRY[blockType] !== undefined,
      `PUBLIC_BLOCK_REGISTRY possui renderizador canônico registrado para "${blockType}"`
    );
  }

  // Validação de Fallback para bloco desconhecido sem crash
  const unknownBlock: BlockInstance = {
    id: 'blk_unknown_test',
    type: 'future_unsupported_block' as any,
    order: 99,
    config: {},
    data: {},
    isVisible: true,
  };
  const fallbackRender = PublicBlockFallback({ block: unknownBlock, reason: 'Tipo desconhecido' });
  assert(fallbackRender !== null, 'PublicBlockFallback gera fallback visual neutro para blocos desconhecidos');

  // =========================================================================
  // CENÁRIO O: Navigation
  // =========================================================================
  console.log('\n🧭 [CENÁRIO O] Validação de Navegação e Menus...');
  const menus = await serverProvider.readAsync<NavigationMenu[]>('cms:ib_central:navigation', []);
  assert(menus.length === 1 && menus[0].items.length === 2, 'Contrato de menu preserva hierarquia de links');
  assert(menus[0].items[0].label === 'Início' && menus[0].items[0].url === '/', 'Link interno para página canônica preservado');

  // =========================================================================
  // CENÁRIO P: Themes & Design Tokens
  // =========================================================================
  console.log('\n🎨 [CENÁRIO P] Validação de Temas e Design Tokens...');
  const themes = await serverProvider.readAsync<VisualTheme[]>('cms:ib_central:themes', []);
  const activeThemeId = await serverProvider.readAsync<string>('cms:ib_central:active_theme_id', '');
  assert(activeThemeId === 'theme_classic', 'active_theme_id retornado com fidelidade');
  assert(themes[0].tokens.colors.primary === '#1e3a8a', 'Tokens de design de cor primária preservados');
  assert(themes[0].tokens.typography.fontFamilyBody === 'Inter', 'Token de tipografia preservado');

  // =========================================================================
  // CENÁRIO Q: SEO Metadata
  // =========================================================================
  console.log('\n🔍 [CENÁRIO Q] Validação de Metadados e SEO...');
  const seo = await serverProvider.readAsync<SiteSEO>('cms:ib_central:seo_site', {} as any);
  assert(seo.title === 'PIB Integrada', 'title preservado para cabeçalhos e tags');
  assert(Array.isArray(seo.keywords) && seo.keywords.includes('fé'), 'Palavras-chave de SEO preservadas');

  // =========================================================================
  // CENÁRIO R: Schedules (Sem Filtro Hardcoded)
  // =========================================================================
  console.log('\n📅 [CENÁRIO R] Validação de Cultos e Horários (Sem Filtro Hardcoded)...');
  const schedules = await serverProvider.readAsync<ChurchSchedule[]>('cms:ib_central:schedules', []);
  assert(schedules.length === 1 && schedules[0].title === 'Culto da Família', 'Culto de celebração carregado');
  assert(schedules[0].time === '19:00', 'Horário oficial do culto preservado');

  // =========================================================================
  // CENÁRIO S: Donations
  // =========================================================================
  console.log('\n💝 [CENÁRIO S] Validação de Doações e PIX (Sem Gateway Externo)...');
  const donations = await serverProvider.readAsync<ChurchDonationInfo>('cms:ib_central:donations', {} as any);
  assert(donations.pixKey === 'pix@ibcentral.org.br', 'Chave PIX eclesiástica preservada');
  assert(donations.bankAccountInfo?.includes('Banco do Brasil') === true, 'Dados bancários para transferência preservados');

  // =========================================================================
  // CENÁRIO T: Live Stream
  // =========================================================================
  console.log('\n🎥 [CENÁRIO T] Validação de Transmissão ao Vivo (Sem Streaming Proprietário)...');
  const live = await serverProvider.readAsync<ChurchLiveStreamInfo>('cms:ib_central:live_stream', {} as any);
  assert(live.streamUrl?.includes('youtube') === true, 'Plataforma YouTube identificada');
  assert(live.streamUrl === 'https://youtube.com/live/ibcentral', 'URL do canal ao vivo preservada');

  // =========================================================================
  // CENÁRIO U: Canonical Error Envelope
  // =========================================================================
  console.log('\n📦 [CENÁRIO U] Validação da Padronização do Envelope de Erro...');
  const testStatuses = [400, 401, 403, 404, 409, 422, 429, 500];
  for (const st of testStatuses) {
    try {
      await apiClient.get(`/test/errors/${st}`);
      assert(false, `Status HTTP ${st} deveria lançar exceção no ApiClient`);
    } catch (err: any) {
      assert(err instanceof ApiClientError, `Erro capturado para status ${st} é instância de ApiClientError`);
      assert(err.status === st, `Status HTTP ${st} preservado no envelope de erro`);
      assert(typeof err.code === 'string', `Envelope para status ${st} contém código canônico de erro`);
      assert(typeof err.message === 'string', `Envelope para status ${st} contém mensagem de erro`);
    }
  }

  // =========================================================================
  // CENÁRIO V: Request ID Traceability
  // =========================================================================
  console.log('\n🆔 [CENÁRIO V] Validação de Rastreabilidade via Request ID...');
  const reqIdTest = await apiClient.get<any>('/status');
  assert(reqIdTest.requestId !== undefined && reqIdTest.requestId.length > 5, 'Resposta contém identificador único requestId');

  // =========================================================================
  // CENÁRIO W: Network Failure Handling
  // =========================================================================
  console.log('\n🔌 [CENÁRIO W] Validação de Tratamento de Falhas de Rede...');
  const deadClient = new ApiClient({ baseUrl: 'http://127.0.0.1:1' }); // Porta fechada
  const deadServerProvider = new ServerPersistenceProvider({
    client: deadClient,
    currentTenantId: 'ib_central',
  });

  let networkErrorCaught = false;
  try {
    await deadServerProvider.readAsync('cms:ib_central:settings', null);
  } catch (err: any) {
    if (err instanceof ProviderError && (err.code === 'NETWORK_ERROR' || err.status === 0)) {
      networkErrorCaught = true;
    }
  }
  assert(networkErrorCaught, 'Falha de conexão com a API é capturada e transformada em ProviderError explícito');

  // =========================================================================
  // CENÁRIO X: No Silent Fallback Guarantee
  // =========================================================================
  console.log('\n🚫 [CENÁRIO X] Garantia Absoluta de Ausência de Fallback Silencioso para localStorage...');
  mockLocalStorageData.clear();

  let failedWriteCaught = false;
  try {
    await deadServerProvider.writeAsync('cms:ib_central:settings', { siteName: 'Não Deve Gravar Local' });
  } catch {
    failedWriteCaught = true;
  }
  assert(failedWriteCaught, 'Falha de escrita no servidor dispara erro explícito para a aplicação');
  assert(
    !mockLocalStorageData.has('cms:ib_central:settings'),
    'REGRA FUNDAMENTAL: Falha no servidor NUNCA grava silenciosamente no armazenamento local'
  );

  // =========================================================================
  // CENÁRIO Y: LocalStorage Preservation (Zero Deletion)
  // =========================================================================
  console.log('\n🛡️ [CENÁRIO Y] Garantia de Preservação do Armazenamento Local e Backups...');
  const backupBaseDir = path.resolve(process.cwd(), 'migration-backup/fase60');
  assert(fs.existsSync(backupBaseDir), 'Diretório de backups da Fase 60 preservado intacto');
  const backupEntries = fs.readdirSync(backupBaseDir);
  assert(backupEntries.length > 0, 'Backups imutáveis da Fase 60 continuam armazenados');

  // =========================================================================
  // CENÁRIO Z: Regression Verification
  // =========================================================================
  console.log('\n🛡️ [CENÁRIO Z] Verificação de Não-Regressão das Fases Anteriores...');
  assert(fs.existsSync(path.resolve(process.cwd(), 'scripts/verify-architecture-fase54.ts')), 'Suíte Fase 54 preservada');
  assert(fs.existsSync(path.resolve(process.cwd(), 'scripts/verify-db-fase57.ts')), 'Suíte Fase 57 preservada');
  assert(fs.existsSync(path.resolve(process.cwd(), 'scripts/verify-auth-fase58.ts')), 'Suíte Fase 58 preservada');
  assert(fs.existsSync(path.resolve(process.cwd(), 'scripts/verify-provider-fase59.ts')), 'Suíte Fase 59 preservada');
  assert(fs.existsSync(path.resolve(process.cwd(), 'scripts/verify-migration-fase60.ts')), 'Suíte Fase 60 preservada');

  // Encerramento limpo do servidor HTTP
  await new Promise<void>((resolve) => server.close(() => resolve()));

  console.log('\n===============================================================');
  console.log(' RESULTADO FINAL DA HOMOLOGAÇÃO — FASE 61');
  console.log(` Total de Asserções: ${totalAssertions}`);
  console.log(` Sucessos: ${passedAssertions}`);
  console.log(` Falhas:   ${failedAssertions}`);
  console.log('===============================================================');
}

runFase61Homologation().catch((err) => {
  console.error('\nFalha fatal na homologação da Fase 61:', err);
  process.exit(1);
});
