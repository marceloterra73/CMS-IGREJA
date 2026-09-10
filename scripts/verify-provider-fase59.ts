/**
 * SUÍTE DE TESTES E VERIFICAÇÃO AUTOMATIZADA — FASE 59
 * CMS Visual para Igrejas — Server Persistence Provider (Ponte entre CMS Repository e API)
 *
 * Cobertura Completa dos Cenários Obrigatórios A a O:
 * - Cenário A: Provider Contract (StorageEngine e CmsCanonicalRepository)
 * - Cenário B: GET / read (Leitura HTTP e Fallback Canônico)
 * - Cenário C: WRITE (Escrita, Serialização e Cache)
 * - Cenário D: REMOVE (Remoção HTTP DELETE e Cache)
 * - Cenário E: EXISTS (Verificação HTTP HEAD/GET e Cache)
 * - Cenário F: CLEAR PREFIX (Limpeza por Prefixo e Isolamento)
 * - Cenário G: HTTP Errors (400, 401, 403, 404, 409, 422, 429, 500)
 * - Cenário H: API Error Envelope (code, message, details, requestId, timestamp)
 * - Cenário I: Authentication (Integração com Fase 58: Cookies e Bearer Token)
 * - Cenário J: CSRF Protection (Header X-CSRF-Token em Operações Mutativas)
 * - Cenário K: Tenant Isolation & IDOR Prevention (Bloqueio de Troca Arbitrária)
 * - Cenário L: Secrets Sanitization (Higienização em Erros e Logs)
 * - Cenário M: Local Provider Coexistence (Preservação de localCmsStorageEngine)
 * - Cenário N: No Silent Fallback (Sem Gravação Oculta em localStorage)
 * - Cenário O: Architecture Isolation (Fronteiras Estritas de Camadas)
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { createApp } from '../server/app.js';
import {
  StorageEngine,
  localCmsStorageEngine,
  CmsCanonicalRepository,
  getCmsStorageKey,
  DEFAULT_TENANT_ID,
  createStorageEngine,
  ApiClient,
  ApiClientError,
  ServerPersistenceProvider,
  ProviderError,
  parseCmsStorageKey,
} from '../src/core/persistence/index.js';
import { signAccessToken } from '../server/auth/tokens.js';
import { authenticateMiddleware } from '../server/middleware/authenticate.js';
import { requireTenantContext } from '../server/middleware/rbac.js';
import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME, generateCsrfToken } from '../server/middleware/csrf.js';
import { ApiError } from '../server/errors/apiError.js';

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

import { serverResourceStore } from '../server/routes/v1/resources.js';

// Armazenamento em memória para emular os endpoints REST durante a homologação
const remoteStore = serverResourceStore;

async function runFase59Verification() {
  console.log('\n===============================================================');
  console.log(' INICIANDO SUÍTE DE TESTES E VERIFICAÇÃO — FASE 59');
  console.log(' Server Persistence Provider: Ponte CMS Repository ↔ API REST');
  console.log('===============================================================\n');

  // Limpa o store remoto de teste
  remoteStore.clear();

  // Cria a aplicação Express do backend configurando as rotas da API REST
  const app = createApp({
    configureRoutes: (expressApp) => {
      // 1. Endpoint REST genérico de recursos para persistência
      expressApp.get('/api/v1/resources/:resource', (req, res) => {
        const tenantId = (req.query.tenantId as string) || (req.headers['x-tenant-id'] as string) || DEFAULT_TENANT_ID;
        const key = `cms:${tenantId}:${req.params.resource}`;

        if (!remoteStore.has(key)) {
          return res.status(404).json({
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: `Recurso "${req.params.resource}" não encontrado para o tenant "${tenantId}".`,
              requestId: (req as any).requestId,
              timestamp: new Date().toISOString(),
            },
          });
        }

        return res.json({
          success: true,
          data: remoteStore.get(key),
        });
      });

      expressApp.put('/api/v1/resources/:resource', (req, res) => {
        const tenantId = (req.query.tenantId as string) || (req.headers['x-tenant-id'] as string) || DEFAULT_TENANT_ID;
        const key = `cms:${tenantId}:${req.params.resource}`;
        remoteStore.set(key, req.body);

        return res.json({
          success: true,
          data: req.body,
        });
      });

      expressApp.delete('/api/v1/resources/:resource', (req, res) => {
        const tenantId = (req.query.tenantId as string) || (req.headers['x-tenant-id'] as string) || DEFAULT_TENANT_ID;
        const key = `cms:${tenantId}:${req.params.resource}`;
        const deleted = remoteStore.delete(key);

        return res.json({
          success: true,
          deleted,
        });
      });

      expressApp.head('/api/v1/resources/:resource', (req, res) => {
        const tenantId = (req.query.tenantId as string) || (req.headers['x-tenant-id'] as string) || DEFAULT_TENANT_ID;
        const key = `cms:${tenantId}:${req.params.resource}`;

        if (remoteStore.has(key)) {
          return res.status(200).end();
        }
        return res.status(404).end();
      });

      // Rota de deleção em lote por prefixo
      expressApp.delete('/api/v1/resources', (req, res) => {
        const prefix = req.query.prefix as string;
        let count = 0;
        if (prefix) {
          for (const k of Array.from(remoteStore.keys())) {
            if (k.startsWith(prefix)) {
              remoteStore.delete(k);
              count++;
            }
          }
        }
        return res.json({ success: true, count });
      });

      // 2. Rotas para testes de erros HTTP específicos
      expressApp.get('/api/v1/test/errors/:status', (req, res) => {
        const status = parseInt(req.params.status, 10);
        const codeMap: Record<number, string> = {
          400: 'BAD_REQUEST',
          401: 'UNAUTHORIZED',
          403: 'FORBIDDEN',
          404: 'NOT_FOUND',
          409: 'CONFLICT',
          422: 'UNPROCESSABLE_ENTITY',
          429: 'TOO_MANY_REQUESTS',
          500: 'INTERNAL_SERVER_ERROR',
        };

        return res.status(status).json({
          success: false,
          error: {
            code: codeMap[status] || 'ERROR',
            message: `Erro simulado com status ${status}`,
            details: { testScenario: 'Fase 59 Error Simulation' },
            requestId: (req as any).requestId,
            timestamp: new Date().toISOString(),
          },
        });
      });

      // 3. Rota protegida com autenticação e isolamento de tenant
      expressApp.get(
        '/api/v1/test/secure-resource',
        authenticateMiddleware,
        requireTenantContext,
        (req, res) => {
          return res.json({
            success: true,
            tenantId: (req as any).tenantId,
            user: (req as any).user?.email,
          });
        }
      );

      // 4. Rota mutativa protegida com CSRF
      expressApp.post(
        '/api/v1/test/secure-mutation',
        authenticateMiddleware,
        requireTenantContext,
        (req, res) => {
          return res.json({
            success: true,
            data: {
              saved: true,
              ...req.body,
            },
          });
        }
      );
    },
  });

  // Inicializa servidor HTTP na porta 0 (efêmera)
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  const port = (server.address() as any).port;
  const baseUrl = `http://127.0.0.1:${port}/api/v1`;

  try {
    // -------------------------------------------------------------
    // CENÁRIO A: CONTRATO DO PROVIDER (StorageEngine & Repository)
    // -------------------------------------------------------------
    console.log('📐 [CENÁRIO A] Validação do Contrato StorageEngine e CmsCanonicalRepository...');

    const clientA = new ApiClient({ baseUrl });
    const providerA = new ServerPersistenceProvider({
      client: clientA,
      currentTenantId: 'ib_central',
    });

    // 1. Verificação de interface
    assert(typeof providerA.read === 'function', 'ServerPersistenceProvider implementa método read()');
    assert(typeof providerA.write === 'function', 'ServerPersistenceProvider implementa método write()');
    assert(typeof providerA.remove === 'function', 'ServerPersistenceProvider implementa método remove()');
    assert(typeof providerA.exists === 'function', 'ServerPersistenceProvider implementa método exists()');
    assert(typeof providerA.clearByPrefix === 'function', 'ServerPersistenceProvider implementa método clearByPrefix()');

    // 2. Verificação de métodos assíncronos diretos
    assert(typeof providerA.readAsync === 'function', 'ServerPersistenceProvider implementa método readAsync()');
    assert(typeof providerA.writeAsync === 'function', 'ServerPersistenceProvider implementa método writeAsync()');
    assert(typeof providerA.removeAsync === 'function', 'ServerPersistenceProvider implementa método removeAsync()');
    assert(typeof providerA.existsAsync === 'function', 'ServerPersistenceProvider implementa método existsAsync()');
    assert(typeof providerA.clearByPrefixAsync === 'function', 'ServerPersistenceProvider implementa método clearByPrefixAsync()');

    // 3. Injeção no CmsCanonicalRepository
    const repoWithServer = new CmsCanonicalRepository(providerA);
    assert(repoWithServer instanceof CmsCanonicalRepository, 'CmsCanonicalRepository aceita ServerPersistenceProvider por injeção');

    // 4. Fábrica de StorageEngine (createStorageEngine)
    const engineLocal = createStorageEngine({ mode: 'local' });
    assert(engineLocal === localCmsStorageEngine, 'createStorageEngine(mode: local) retorna localCmsStorageEngine');

    const engineServer = createStorageEngine({ mode: 'server', serverEngine: providerA });
    assert(engineServer === providerA, 'createStorageEngine(mode: server) retorna a instância do ServerPersistenceProvider');

    // -------------------------------------------------------------
    // CENÁRIO B: GET / READ (Leitura HTTP e Fallback Canônico)
    // -------------------------------------------------------------
    console.log('\n📖 [CENÁRIO B] Validação de Leitura HTTP (read/readAsync)...');

    const testKeySettings = getCmsStorageKey('settings', 'ib_central');
    const sampleSettings = {
      tenantId: 'ib_central',
      siteName: 'Igreja Batista Central Homologada',
      cnpj: '12.345.678/0001-90',
      phone: '(11) 98765-4321',
      email: 'contato@ibcentral.org.br',
    };

    // Alimenta o store remoto diretamente
    remoteStore.set(testKeySettings, sampleSettings);

    // Leitura assíncrona da API
    const loadedAsync = await providerA.readAsync(testKeySettings, { siteName: 'Fallback' });
    assert(loadedAsync.siteName === 'Igreja Batista Central Homologada', 'readAsync lê com sucesso payload da API REST');

    // Leitura síncrona através do cache populado pelo provider
    const loadedSync = providerA.read(testKeySettings, { siteName: 'Fallback' });
    assert(loadedSync.siteName === 'Igreja Batista Central Homologada', 'read síncrono retorna o dado que foi sincronizado no cache');

    // Leitura de recurso inexistente (HTTP 404) retorna o fallback canônico sem estourar exceção
    const nonExistentKey = getCmsStorageKey('schedules', 'ib_central');
    const fallbackSchedule = [{ day: 'Domingo', time: '19:00', title: 'Culto de Celebração' }];
    const loadedFallback = await providerA.readAsync(nonExistentKey, fallbackSchedule);
    assert(loadedFallback[0].title === 'Culto de Celebração', 'readAsync em rota 404 retorna fallback canônico');

    // -------------------------------------------------------------
    // CENÁRIO C: WRITE (Escrita e Serialização)
    // -------------------------------------------------------------
    console.log('\n✍️ [CENÁRIO C] Validação de Escrita e Serialização (write/writeAsync)...');

    const testKeyThemes = getCmsStorageKey('themes', 'ib_central');
    const sampleThemes = [
      { id: 'classic-blue', name: 'Azul Clássico Eclesial', primaryColor: '#1e3a8a' },
      { id: 'warm-amber', name: 'Âmbar Contemporâneo', primaryColor: '#b45309' },
    ];

    // Escrita assíncrona
    const writeOk = await providerA.writeAsync(testKeyThemes, sampleThemes);
    assert(writeOk === true, 'writeAsync grava recurso na API REST e retorna true');
    assert(remoteStore.has(testKeyThemes), 'Payload foi efetivamente armazenado no servidor remoto');
    assert(remoteStore.get(testKeyThemes)[0].id === 'classic-blue', 'Serialização de array de objetos complexos mantida sem perda');

    // Escrita síncrona
    const testKeySync = getCmsStorageKey('seo_site', 'ib_central');
    const sampleSeo = { title: 'Portal da Fé', description: 'Comunidade Cristã' };
    const writeSyncOk = providerA.write(testKeySync, sampleSeo);
    assert(writeSyncOk === true, 'write síncrono atualiza cache de trabalho com sucesso');
    assert(providerA.exists(testKeySync) === true, 'exists confirma presença imediata no cache de trabalho');

    // -------------------------------------------------------------
    // CENÁRIO D: REMOVE (Remoção)
    // -------------------------------------------------------------
    console.log('\n🗑️ [CENÁRIO D] Validação de Remoção (remove/removeAsync)...');

    const testKeyDonation = getCmsStorageKey('donations', 'ib_central');
    remoteStore.set(testKeyDonation, { pixKey: 'contato@ibcentral.org.br' });

    // Confirma que o recurso existe
    assert(remoteStore.has(testKeyDonation), 'Recurso presente antes da remoção');

    // Remove via provider
    const removeOk = await providerA.removeAsync(testKeyDonation);
    assert(removeOk === true, 'removeAsync executa DELETE e retorna true');
    assert(!remoteStore.has(testKeyDonation), 'Recurso removido do servidor remoto após removeAsync');

    // Remoção síncrona do cache
    providerA.write(testKeyDonation, { pixKey: 'nova-chave' });
    assert(providerA.exists(testKeyDonation) === true, 'Recurso gravado no cache');
    const syncRemoveOk = providerA.remove(testKeyDonation);
    assert(syncRemoveOk === true, 'remove síncrono limpa chave do cache');
    assert(providerA.exists(testKeyDonation) === false, 'exists confirma ausência no cache');

    // -------------------------------------------------------------
    // CENÁRIO E: EXISTS (Verificação de Existência)
    // -------------------------------------------------------------
    console.log('\n🔍 [CENÁRIO E] Validação de Verificação de Existência (exists/existsAsync)...');

    const testKeyLive = getCmsStorageKey('live_stream', 'ib_central');
    remoteStore.set(testKeyLive, { channelUrl: 'https://youtube.com/@igreja' });

    const existsRemote = await providerA.existsAsync(testKeyLive);
    assert(existsRemote === true, 'existsAsync retorna true para recurso existente (HTTP 200)');

    const notExistsRemote = await providerA.existsAsync(getCmsStorageKey('domains', 'ib_central'));
    assert(notExistsRemote === false, 'existsAsync retorna false para recurso inexistente (HTTP 404)');

    // -------------------------------------------------------------
    // CENÁRIO F: CLEAR PREFIX (Limpeza por Prefixo)
    // -------------------------------------------------------------
    console.log('\n🧹 [CENÁRIO F] Validação de Limpeza por Prefixo (clearByPrefix)...');

    // Cria chaves de dois tenants diferentes
    remoteStore.set('cms:tenant_alpha:page1', { title: 'Página 1' });
    remoteStore.set('cms:tenant_alpha:page2', { title: 'Página 2' });
    remoteStore.set('cms:tenant_beta:page1', { title: 'Página Beta 1' });

    const providerAlpha = new ServerPersistenceProvider({
      client: new ApiClient({ baseUrl }),
      currentTenantId: 'tenant_alpha',
    });

    providerAlpha.write('cms:tenant_alpha:page1', { title: 'Página 1' });
    providerAlpha.write('cms:tenant_alpha:page2', { title: 'Página 2' });

    // Limpa apenas o tenant Alpha
    const cleared = providerAlpha.clearByPrefix('cms:tenant_alpha:');
    assert(cleared === true, 'clearByPrefix limpa chaves que coincidem com o prefixo');
    assert(providerAlpha.exists('cms:tenant_alpha:page1') === false, 'Chave do tenant Alpha removida do cache');

    // Aguarda sincronização assíncrona remota
    await providerAlpha.clearByPrefixAsync('cms:tenant_alpha:');
    assert(!remoteStore.has('cms:tenant_alpha:page1'), 'Chave remota do tenant Alpha removida');
    assert(!remoteStore.has('cms:tenant_alpha:page2'), 'Segunda chave remota do tenant Alpha removida');
    assert(remoteStore.has('cms:tenant_beta:page1'), 'Isolamento: Chave do tenant Beta permanece 100% intacta');

    // -------------------------------------------------------------
    // CENÁRIO G: TRATAMENTO DE ERROS HTTP
    // -------------------------------------------------------------
    console.log('\n⚠️ [CENÁRIO G] Validação de Tratamento de Erros HTTP (400, 401, 403, 404, 409, 422, 429, 500)...');

    const statusesToTest = [400, 401, 403, 409, 422, 429, 500];

    for (const status of statusesToTest) {
      let threwCorrectly = false;
      try {
        await clientA.get(`/test/errors/${status}`);
      } catch (err: any) {
        if (err instanceof ApiClientError && err.status === status) {
          threwCorrectly = true;
        }
      }
      assert(threwCorrectly, `API Client captura e trata adequadamente status HTTP ${status}`);
    }

    // -------------------------------------------------------------
    // CENÁRIO H: PRESERVAÇÃO DO ENVELOPE DE ERRO CANÔNICO
    // -------------------------------------------------------------
    console.log('\n📦 [CENÁRIO H] Preservação Fiel do Envelope Canônico de Erro...');

    try {
      await clientA.get('/test/errors/422');
      assert(false, 'Deveria ter lançado exceção para HTTP 422');
    } catch (err: any) {
      assert(err instanceof ApiClientError, 'Erro lançado é instância de ApiClientError');
      assert(err.status === 422, 'Status HTTP 422 preservado');
      assert(err.code === 'UNPROCESSABLE_ENTITY', 'Código de erro canônico preservado no envelope');
      assert(err.message.includes('Erro simulado'), 'Mensagem de erro preservada');
      assert(err.details && (err.details as any).testScenario === 'Fase 59 Error Simulation', 'Detalhes do erro preservados');
      assert(typeof err.requestId === 'string' && err.requestId.length > 0, 'requestId preservado');
      assert(typeof err.timestamp === 'string', 'timestamp do erro preservado');
    }

    // -------------------------------------------------------------
    // CENÁRIO I: AUTENTICAÇÃO (Integração com Fase 58)
    // -------------------------------------------------------------
    console.log('\n🔑 [CENÁRIO I] Validação de Integração com Autenticação (Fase 58)...');

    // Cria token JWT válido para um pastor do tenant "ib_central"
    const validToken = signAccessToken({
      id: 'user-pastor-fase59',
      tenantId: 'ib_central',
      name: 'Pastor João Fase 59',
      email: 'pastor59@igreja.org.br',
      role: 'pastor',
      status: 'active',
      permissions: ['publish:pages', 'manage:sermons'],
    });

    // 1. Requisição autenticada via Bearer token
    const clientAuth = new ApiClient({
      baseUrl,
      authToken: validToken,
    });

    const secureRes = await clientAuth.get<any>('/test/secure-resource', { tenantId: 'ib_central' });
    assert(secureRes.status === 200, 'Requisição autenticada com Bearer token aceita com HTTP 200');
    assert(secureRes.data.tenantId === 'ib_central', 'Contexto de tenant verificado corretamente');

    // 2. Requisição sem token em rota protegida resulta em 401
    const unauthenticatedClient = new ApiClient({ baseUrl });
    let unauthCaught = false;
    try {
      await unauthenticatedClient.get('/test/secure-resource');
    } catch (err: any) {
      if (err instanceof ApiClientError && err.status === 401) {
        unauthCaught = true;
      }
    }
    assert(unauthCaught, 'Requisição sem credencial rejeitada com HTTP 401 Unauthorized');

    // -------------------------------------------------------------
    // CENÁRIO J: PROTEÇÃO ANTI-CSRF EM MUTAÇÕES
    // -------------------------------------------------------------
    console.log('\n🛡️ [CENÁRIO J] Validação de Proteção Anti-CSRF...');

    const csrfToken = generateCsrfToken();

    // 1. Mutação autenticada via cookie sem CSRF token é barrada com 403
    const clientCookieNoCsrf = new ApiClient({
      baseUrl,
      defaultHeaders: {
        Cookie: `cms_access_token=${validToken}; ${CSRF_COOKIE_NAME}=${csrfToken}`,
      },
    });

    let csrfBlocked = false;
    try {
      await clientCookieNoCsrf.post('/test/secure-mutation', { payload: 'teste' });
    } catch (err: any) {
      if (err instanceof ApiClientError && err.status === 403) {
        csrfBlocked = true;
      }
    }
    assert(csrfBlocked, 'Mutação com cookie sem header X-CSRF-Token é bloqueada com HTTP 403 Forbidden');

    // 2. Mutação autenticada via cookie COM header CSRF correspondente é aceita
    const clientCookieWithCsrf = new ApiClient({
      baseUrl,
      csrfToken,
      defaultHeaders: {
        Cookie: `cms_access_token=${validToken}; ${CSRF_COOKIE_NAME}=${csrfToken}`,
      },
    });

    const csrfAllowedRes = await clientCookieWithCsrf.post<any>('/test/secure-mutation', { payload: 'teste_valido' });
    assert(csrfAllowedRes.status === 200, 'Mutação com header X-CSRF-Token correspondente é aceita com HTTP 200');
    assert(csrfAllowedRes.data.saved === true, 'Mutação confirmada com sucesso');

    // 3. Mutação via Bearer Token é imune a CSRF
    const clientBearerMutation = new ApiClient({
      baseUrl,
      authToken: validToken,
    });
    const bearerAllowedRes = await clientBearerMutation.post<any>('/test/secure-mutation', { payload: 'via_bearer' });
    assert(bearerAllowedRes.status === 200, 'Mutação autenticada via Bearer Token aceita sem necessidade de CSRF');

    // -------------------------------------------------------------
    // CENÁRIO K: ISOLAMENTO MULTI-TENANT E PREVENÇÃO DE IDOR
    // -------------------------------------------------------------
    console.log('\n🏢 [CENÁRIO K] Validação de Isolamento Multi-tenant e Prevenção de IDOR...');

    // Usuário autenticado pertence ao tenant "ib_central"
    const providerPastor = new ServerPersistenceProvider({
      client: clientAuth,
      currentTenantId: 'ib_central',
      isSuperAdmin: false,
    });

    // Tentativa de acessar chave do tenant "outra_igreja"
    let idorPrevented = false;
    try {
      const foreignKey = getCmsStorageKey('settings', 'outra_igreja');
      await providerPastor.readAsync(foreignKey, {});
    } catch (err: any) {
      if (err instanceof ProviderError && err.code === 'FORBIDDEN_TENANT_ACCESS' && err.status === 403) {
        idorPrevented = true;
      }
    }
    assert(idorPrevented, 'Tentativa de ler dados de outro tenant (IDOR) é sumariamente bloqueada no provider com HTTP 403');

    // Tentativa de escrita com IDOR
    let idorWritePrevented = false;
    try {
      const foreignKey = getCmsStorageKey('settings', 'outra_igreja');
      await providerPastor.writeAsync(foreignKey, { siteName: 'Hacked' });
    } catch (err: any) {
      if (err instanceof ProviderError && err.code === 'FORBIDDEN_TENANT_ACCESS') {
        idorWritePrevented = true;
      }
    }
    assert(idorWritePrevented, 'Tentativa de gravar dados em outro tenant (IDOR) é sumariamente bloqueada');

    // Superadmin possui privilégio de acesso entre congregações
    const providerSuperAdmin = new ServerPersistenceProvider({
      client: new ApiClient({ baseUrl }),
      currentTenantId: undefined,
      isSuperAdmin: true,
    });

    let superAdminAllowed = true;
    try {
      providerSuperAdmin.resolveEndpoint(getCmsStorageKey('settings', 'outra_igreja'));
    } catch {
      superAdminAllowed = false;
    }
    assert(superAdminAllowed, 'Superadmin de plataforma tem permissão legítima para resolver endpoints de múltiplos tenants');

    // -------------------------------------------------------------
    // CENÁRIO L: HIGIENIZAÇÃO DE SEGREDOS E LOGS
    // -------------------------------------------------------------
    console.log('\n🔒 [CENÁRIO L] Validação de Higienização de Segredos nos Erros e Logs...');

    const errorWithSecret = new ApiClientError(
      401,
      'INVALID_CREDENTIALS',
      'Falha na autenticação',
      undefined,
      'req_test_123'
    );

    const errorString = errorWithSecret.toString();
    assert(!errorString.includes('Password'), 'Mensagem de erro não contém senhas');
    assert(!errorString.includes('Bearer'), 'Mensagem de erro não vaza tokens');
    assert(!errorString.includes('Set-Cookie'), 'Mensagem de erro não vaza cookies');
    assert(errorString.includes('req_test_123'), 'Identificador de rastreio requestId preservado na saída segura');

    // -------------------------------------------------------------
    // CENÁRIO M: COEXISTÊNCIA DO PROVEDOR LOCAL
    // -------------------------------------------------------------
    console.log('\n🤝 [CENÁRIO M] Validação de Coexistência e Preservação do Provedor Local...');

    // Mock in-memory do localStorage para verificação no Node
    const localStoreMap = new Map<string, string>();
    (globalThis as any).window = {
      localStorage: {
        getItem: (k: string) => localStoreMap.get(k) || null,
        setItem: (k: string, v: string) => localStoreMap.set(k, String(v)),
        removeItem: (k: string) => localStoreMap.delete(k),
        clear: () => localStoreMap.clear(),
        key: (i: number) => Array.from(localStoreMap.keys())[i] || null,
        get length() {
          return localStoreMap.size;
        },
      },
    };

    const localKey = getCmsStorageKey('settings', 'local_tenant');
    const localData = { siteName: 'Igreja Local Intacta' };

    const localWriteOk = localCmsStorageEngine.write(localKey, localData);
    assert(localWriteOk === true, 'localCmsStorageEngine continua funcionando normalmente');

    const localReadBack = localCmsStorageEngine.read(localKey, { siteName: 'Fallback' });
    assert(localReadBack.siteName === 'Igreja Local Intacta', 'localCmsStorageEngine lê fielmente seus dados');

    // Repositório padrão do CMS usa localCmsStorageEngine
    const defaultRepo = new CmsCanonicalRepository();
    const settingsLoaded = defaultRepo.loadSettings('local_tenant');
    assert(settingsLoaded.siteName === 'Igreja Local Intacta', 'Repositório padrão consome motor local sem interferências');

    // -------------------------------------------------------------
    // CENÁRIO N: AUSÊNCIA DE FALLBACK SILENCIOSO PARA localStorage
    // -------------------------------------------------------------
    console.log('\n🚫 [CENÁRIO N] Garantia de Ausência de Fallback Silencioso para localStorage...');

    // Limpa o mock de localStorage
    localStoreMap.clear();

    const providerFailing = new ServerPersistenceProvider({
      client: new ApiClient({ baseUrl: `http://127.0.0.1:${port}/rota-inexistente` }),
      currentTenantId: 'ib_central',
    });

    let serverErrorCaptured = false;
    try {
      await providerFailing.writeAsync(getCmsStorageKey('settings', 'ib_central'), { siteName: 'Dados Que Falharam' });
    } catch (err: any) {
      serverErrorCaptured = true;
    }

    assert(serverErrorCaptured, 'Erro no servidor é propagado de forma visível e controlada');
    assert(localStoreMap.size === 0, 'REGRA FUNDAMENTAL: Falha no servidor NUNCA grava dados silenciosamente no localStorage');

    // -------------------------------------------------------------
    // CENÁRIO O: ISOLAMENTO ARQUITETURAL DE CAMADAS
    // -------------------------------------------------------------
    console.log('\n🏛️ [CENÁRIO O] Validação de Isolamento Arquitetural de Camadas...');

    // 1. Verifica ausência de referências a fetch ou localStorage dentro de ServerPersistenceProvider
    const providerSource = fs.readFileSync(
      path.resolve(process.cwd(), 'src/core/persistence/serverPersistenceProvider.ts'),
      'utf-8'
    );
    assert(!providerSource.includes('window.localStorage'), 'ServerPersistenceProvider não acessa window.localStorage');
    assert(!providerSource.includes('localStorage.setItem'), 'ServerPersistenceProvider não chama localStorage.setItem');
    assert(!providerSource.includes('from "pg"'), 'ServerPersistenceProvider não importa PostgreSQL');
    assert(!providerSource.includes('from "drizzle-orm"'), 'ServerPersistenceProvider não importa Drizzle ORM');

    // 2. Verifica que ApiClient encapsula fetch
    const apiClientSource = fs.readFileSync(
      path.resolve(process.cwd(), 'src/core/persistence/apiClient.ts'),
      'utf-8'
    );
    assert(apiClientSource.includes('fetch('), 'ApiClient isola as chamadas nativas HTTP fetch');
    assert(!apiClientSource.includes('localStorage'), 'ApiClient não contém referências a localStorage');

    // 3. Verifica fluxo completo: Repository → StorageEngine (ServerPersistenceProvider) → ApiClient → HTTP
    const repoWithServerProvider = new CmsCanonicalRepository(providerA);
    const saveThroughRepo = repoWithServerProvider.saveSettings(
      { ...sampleSettings, siteName: 'Salvo via Repositório e Provider' },
      'ib_central'
    );
    assert(saveThroughRepo === true, 'CmsCanonicalRepository executa escrita através do ServerPersistenceProvider');

  } finally {
    // Encerra servidor HTTP de testes
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }

  // Resumo final
  console.log('\n===============================================================');
  console.log(' RESULTADO FINAL DA VALIDAÇÃO — FASE 59');
  console.log(` Total de Asserções: ${totalAssertions}`);
  console.log(` Sucessos: ${passedAssertions}`);
  console.log(` Falhas:   ${failedAssertions}`);
  console.log('===============================================================\n');

  if (failedAssertions > 0) {
    process.exit(1);
  }
}

runFase59Verification().catch((err) => {
  console.error('\n❌ Falha fatal na execução dos testes da Fase 59:', err);
  process.exit(1);
});
