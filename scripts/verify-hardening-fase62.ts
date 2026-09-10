/**
 * CMS VISUAL PARA IGREJAS — SUÍTE DE HOMOLOGAÇÃO DA FASE 62
 * Hardening, Auditoria de Segurança e Preparação Real para Produção
 *
 * MODO CIRÚRGICO — MODO COFRE — NÃO-REGRESSÃO TOTAL
 */

import http from 'http';
import jwt from 'jsonwebtoken';
import { createApp } from '../server/app.js';
import { config, validateProductionConfig } from '../server/config/index.js';
import {
  createUser,
  authenticate,
  clearInMemoryAuthStore,
} from '../server/auth/service.js';
import {
  signAccessToken,
  verifyAccessToken,
  type AuthenticatedUser,
} from '../server/auth/tokens.js';
import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from '../server/middleware/csrf.js';
import { recordFailedAttempt, resetAllRateLimits } from '../server/middleware/rateLimiter.js';
import { isValidVideoUrl } from '../src/components/sermons/sermonsUtils.js';
import { CmsCanonicalRepository } from '../src/core/persistence/cmsRepository.js';
import { ServerPersistenceProvider } from '../src/core/persistence/serverPersistenceProvider.js';

let passed = 0;
let failed = 0;

function assert(condition: boolean, description: string) {
  if (condition) {
    console.log(`  ✅ [PASS] ${description}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${description}`);
    failed++;
  }
}

// Utilitário para chamadas HTTP
function makeRequest(
  options: http.RequestOptions,
  bodyData?: string
): Promise<{ statusCode: number; headers: http.IncomingHttpHeaders; body: any; rawBody: string }> {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        let parsedBody: any = null;
        try {
          parsedBody = JSON.parse(data);
        } catch {
          parsedBody = data;
        }
        resolve({
          statusCode: res.statusCode || 0,
          headers: res.headers,
          body: parsedBody,
          rawBody: data,
        });
      });
    });

    req.on('error', (err) => reject(err));

    if (bodyData) {
      req.write(bodyData);
    }
    req.end();
  });
}

async function runFase62SecurityAuditSuite() {
  console.log('===============================================================');
  console.log('  CMS VISUAL PARA IGREJAS — FASE 62: AUDITORIA E HARDENING');
  console.log('  Validação de Segurança, Conformidade e Robustez');
  console.log('===============================================================\n');

  // Inicialização do servidor Express de teste com hardening ativo
  const app = createApp();
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  const port = (server.address() as any).port;

  try {
    // -------------------------------------------------------------
    // GRUPO 1: AUDITORIA DE CONFIGURAÇÃO E SEGREDOS
    // -------------------------------------------------------------
    console.log('🔐 [GRUPO 1] Auditoria de Configuração, Segredos e Ambiente...');
    const originalEnv = config.nodeEnv;
    const originalIsProd = config.isProduction;

    // 1. Validação do utilitário de checagem para produção
    (config as any).isProduction = true;
    (config.auth as any).jwtSecret = '';
    const prodCheckFail = validateProductionConfig();
    assert(prodCheckFail.isValid === false, 'validateProductionConfig detecta ausência de segredos críticos em produção');
    assert(prodCheckFail.errors.length > 0, 'validateProductionConfig retorna detalhes dos requisitos ausentes');

    // Restaura ambiente
    (config as any).isProduction = originalIsProd;
    (config as any).nodeEnv = originalEnv;
    (config.auth as any).jwtSecret = process.env.JWT_SECRET || 'cms-igrejas-dev-jwt-secret-min-32-chars-long-secure!';

    // -------------------------------------------------------------
    // GRUPO 2: AUDITORIA DE HEADERS DE SEGURANÇA E CORS (OWASP)
    // -------------------------------------------------------------
    console.log('\n🛡️ [GRUPO 2] Auditoria de Headers de Segurança e CORS...');
    const headersRes = await makeRequest({
      hostname: '127.0.0.1',
      port,
      path: '/api/v1/health',
      method: 'GET',
      headers: {
        Origin: 'http://localhost:3000',
      },
    });

    assert(headersRes.headers['x-content-type-options'] === 'nosniff', 'Header X-Content-Type-Options: nosniff presente');
    assert(headersRes.headers['x-frame-options'] === 'SAMEORIGIN', 'Header X-Frame-Options: SAMEORIGIN presente');
    assert(headersRes.headers['referrer-policy'] === 'strict-origin-when-cross-origin', 'Header Referrer-Policy presente');
    assert(Boolean(headersRes.headers['permissions-policy']), 'Header Permissions-Policy restringe recursos sensíveis');
    assert(headersRes.headers['cross-origin-opener-policy'] === 'same-origin', 'Header Cross-Origin-Opener-Policy: same-origin presente');
    assert(headersRes.headers['x-powered-by'] === undefined, 'Header X-Powered-By explicitamente desabilitado');

    // CORS preflight
    const corsPreflightRes = await makeRequest({
      hostname: '127.0.0.1',
      port,
      path: '/api/v1/resources/settings',
      method: 'OPTIONS',
      headers: {
        Origin: 'http://localhost:3000',
        'Access-Control-Request-Method': 'PUT',
      },
    });
    assert(corsPreflightRes.statusCode === 204, 'Preflight OPTIONS responde com status 204 No Content');
    assert(corsPreflightRes.headers['access-control-allow-origin'] === 'http://localhost:3000', 'CORS reflete origem segura controlada');
    assert(corsPreflightRes.headers['access-control-allow-credentials'] === 'true', 'CORS permite credenciais com origem específica (sem wildcard *)');

    // -------------------------------------------------------------
    // GRUPO 3: AUDITORIA CRIPTOGRÁFICA DE JWT E TOKENS
    // -------------------------------------------------------------
    console.log('\n🔑 [GRUPO 3] Auditoria de Tokens JWT (HS256, Expiração e Assinatura)...');
    const mockUser: AuthenticatedUser = {
      id: 'test-user-f62',
      email: 'pastor.audit@igreja.org.br',
      name: 'Pastor Auditor',
      tenantId: 'ib_central',
      role: 'pastor',
      status: 'active',
      permissions: ['manage:pages', 'publish:pages'],
    };

    const validToken = signAccessToken(mockUser);
    assert(typeof validToken === 'string' && validToken.split('.').length === 3, 'Token JWT estruturado em três partes (header.payload.signature)');

    // Rejeição de algoritmo "none"
    const unsignedNoneToken = jwt.sign(
      { sub: mockUser.id, role: mockUser.role, type: 'access' },
      '',
      { algorithm: 'none' as any }
    );
    let noneBlocked = false;
    try {
      verifyAccessToken(unsignedNoneToken);
    } catch {
      noneBlocked = true;
    }
    assert(noneBlocked, 'Token com algoritmo "none" é estritamente rejeitado');

    // Rejeição de assinatura adulterada
    const tamperedToken = validToken.slice(0, -5) + 'xxxxx';
    let tamperedBlocked = false;
    try {
      verifyAccessToken(tamperedToken);
    } catch {
      tamperedBlocked = true;
    }
    assert(tamperedBlocked, 'Token com assinatura adulterada é rejeitado');

    // -------------------------------------------------------------
    // GRUPO 4: AUDITORIA DE VALIDAÇÃO DE RUNTIME E PREVENÇÃO DE IDOR
    // -------------------------------------------------------------
    console.log('\n🔒 [GRUPO 4] Auditoria de Validação de Runtime (Tipos, Payloads e IDOR)...');

    // 1. Rejeição de tenantId com injeção de caracteres especiais ou path traversal
    const malformedTenantRes = await makeRequest({
      hostname: '127.0.0.1',
      port,
      path: '/api/v1/resources/settings?tenantId=../../etc/passwd',
      method: 'GET',
    });
    assert(malformedTenantRes.statusCode === 400, 'tenantId contendo caracteres de path traversal (../../) é rejeitado com HTTP 400');
    assert(malformedTenantRes.body?.error?.code === 'BAD_REQUEST', 'Erro de tenantId inválido retorna código canônico BAD_REQUEST');

    // 2. Rejeição de nome de recurso inválido
    const malformedResourceRes = await makeRequest({
      hostname: '127.0.0.1',
      port,
      path: '/api/v1/resources/settings;DROP_TABLE',
      method: 'GET',
    });
    assert(malformedResourceRes.statusCode === 400, 'Nome de recurso com caracteres ilegais é rejeitado com HTTP 400');

    // 3. Validação de formato para recurso primitivo (active_theme_id espera string)
    const invalidPrimitivePut = await makeRequest(
      {
        hostname: '127.0.0.1',
        port,
        path: '/api/v1/resources/active_theme_id?tenantId=ib_central',
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      },
      JSON.stringify({ invalid: true, numbers: [1, 2, 3] })
    );
    assert(invalidPrimitivePut.statusCode === 422, 'active_theme_id recebendo objeto ao invés de string é rejeitado com HTTP 422');

    // 4. Validação válida para active_theme_id (string aceita)
    const validPrimitivePut = await makeRequest(
      {
        hostname: '127.0.0.1',
        port,
        path: '/api/v1/resources/active_theme_id?tenantId=ib_central',
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      },
      JSON.stringify('theme_classic')
    );
    assert(validPrimitivePut.statusCode === 200, 'active_theme_id recebendo string válida é aceito com HTTP 200');

    // 5. Validação de formato para recursos de coleção (pages espera Array)
    const invalidCollectionPut = await makeRequest(
      {
        hostname: '127.0.0.1',
        port,
        path: '/api/v1/resources/pages?tenantId=ib_central',
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      },
      JSON.stringify('string_invalida_nao_array')
    );
    assert(invalidCollectionPut.statusCode === 422, 'pages recebendo string ao invés de Array é rejeitado com HTTP 422');

    // 6. Validação de formato para recursos de objeto (settings espera Object)
    const invalidObjectPut = await makeRequest(
      {
        hostname: '127.0.0.1',
        port,
        path: '/api/v1/resources/settings?tenantId=ib_central',
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      },
      JSON.stringify('string_ao_inves_de_objeto')
    );
    assert(invalidObjectPut.statusCode === 422, 'settings recebendo primitivo ao invés de objeto é rejeitado com HTTP 422');

    // 7. Validação de IDOR: usuário autenticado no tenant A tentando gravar no tenant B
    const userTenantA = signAccessToken({
      id: 'user-a',
      email: 'editor@congrega-a.org',
      name: 'Editor A',
      tenantId: 'congrega_a',
      role: 'editor',
      status: 'active',
      permissions: ['manage:pages'],
    });

    const idorPut = await makeRequest(
      {
        hostname: '127.0.0.1',
        port,
        path: '/api/v1/resources/settings?tenantId=congrega_b',
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${userTenantA}`,
          'Content-Type': 'application/json',
        },
      },
      JSON.stringify({ siteName: 'Hacked' })
    );
    assert(idorPut.statusCode === 403, 'Tentativa de IDOR cruzando tenants com usuário comum é bloqueada com HTTP 403 Forbidden');

    // -------------------------------------------------------------
    // GRUPO 5: AUDITORIA DE RATE LIMITING E PROTEÇÃO CONTRA BRUTE-FORCE
    // -------------------------------------------------------------
    console.log('\n⏱️ [GRUPO 5] Auditoria de Rate Limiting e Proteção de Memória...');
    resetAllRateLimits();
    const rateLimitIp = '192.168.1.50';
    const rateLimitEmail = 'ataque@forca-bruta.org';
    const rateLimitKey = `${rateLimitIp}:${rateLimitEmail}`;

    for (let i = 0; i < 10; i++) {
      recordFailedAttempt(rateLimitKey);
    }

    const rateLimitedRes = await makeRequest(
      {
        hostname: '127.0.0.1',
        port,
        path: '/api/v1/auth/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Forwarded-For': `${rateLimitIp}, 10.0.0.1`, // Testa parsing de lista com vírgulas
        },
      },
      JSON.stringify({ email: rateLimitEmail, password: 'WrongPassword123!' })
    );

    assert(rateLimitedRes.statusCode === 429, 'Rate limiting bloqueia requisição excedente com HTTP 429 Too Many Requests');
    assert(rateLimitedRes.body?.error?.code === 'TOO_MANY_REQUESTS', 'Envelope de erro 429 contém código canônico TOO_MANY_REQUESTS');

    // -------------------------------------------------------------
    // GRUPO 6: AUDITORIA DE XSS, URLS E SANITIZAÇÃO
    // -------------------------------------------------------------
    console.log('\n🧼 [GRUPO 6] Auditoria de XSS e Sanitização de Protocolos de URL...');
    assert(isValidVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ') === true, 'URL HTTPS legítima é aceita');
    assert(isValidVideoUrl('http://vimeo.com/123456') === true, 'URL HTTP legítima é aceita');
    assert(isValidVideoUrl('javascript:alert(1)') === false, 'URL com esquema javascript: é terminantemente rejeitada');
    assert(isValidVideoUrl('data:text/html,<script>alert(1)</script>') === false, 'URL com esquema data: é terminantemente rejeitada');
    assert(isValidVideoUrl('vbscript:msgbox(1)') === false, 'URL com esquema vbscript: é terminantemente rejeitada');
    assert(isValidVideoUrl('https://evil.org/<script>') === false, 'URL com injeção de tag <script> é terminantemente rejeitada');

    // -------------------------------------------------------------
    // GRUPO 7: AUDITORIA DE PERSISTÊNCIA E AUSÊNCIA DE FALLBACK LOCAL
    // -------------------------------------------------------------
    console.log('\n📦 [GRUPO 7] Auditoria de Arquitetura de Persistência...');
    const repo = new CmsCanonicalRepository();
    assert(typeof repo.loadSettings === 'function', 'CmsCanonicalRepository expõe API canônica');
    assert(repo.getEngineType() === 'local', 'Repositório padrão inicia no modo StorageEngine local');

    const serverProvider = new ServerPersistenceProvider({
      clientConfig: { baseUrl: `http://127.0.0.1:${port}/api/v1` },
    });
    repo.setEngine(serverProvider);
    assert(repo.getEngineType() === 'server', 'Repositório alterna transparentemente para ServerPersistenceProvider');

  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }

  console.log('\n===============================================================');
  console.log(` RESULTADO FINAL DA AUDITORIA DE HARDENING — FASE 62`);
  console.log(` Total de Asserções: ${passed + failed}`);
  console.log(` Sucessos: ${passed}`);
  console.log(` Falhas:   ${failed}`);
  console.log('===============================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runFase62SecurityAuditSuite().catch((err) => {
  console.error('Erro fatal na execução da suíte de auditoria da Fase 62:', err);
  process.exit(1);
});
