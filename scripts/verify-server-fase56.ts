/**
 * SUÍTE DE TESTES E VERIFICAÇÃO AUTOMATIZADA — FASE 56
 * CMS Visual para Igrejas — Estrutura do Backend e Servidor Base da API
 *
 * Validações:
 * 1. Inicialização do servidor HTTP e vinculação de porta
 * 2. Endpoint raiz da API (/api)
 * 3. Health Check (/api/v1/health)
 * 4. Status Check (/api/v1/status)
 * 5. Middleware de Request ID (geração automática e propagação segura)
 * 6. Tratamento de rotas inexistentes (404 com envelope canônico de erro)
 * 7. Tratamento de exceções e erros (500 com envelope canônico de erro)
 * 8. Isolamento arquitetural (zero referências a localStorage no backend)
 * 9. Desacoplamento frontend -> backend (zero contaminação em src/)
 * 10. Encerramento gracioso do servidor
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { createApp } from '../server/app.js';
import { ApiError } from '../server/errors/apiError.js';

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

// Helper para fazer requisições HTTP locais no Node
function makeRequest(
  options: http.RequestOptions,
  bodyData?: string
): Promise<{ statusCode: number; headers: http.IncomingHttpHeaders; body: any }> {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : null;
          resolve({
            statusCode: res.statusCode || 0,
            headers: res.headers,
            body: parsed,
          });
        } catch {
          resolve({
            statusCode: res.statusCode || 0,
            headers: res.headers,
            body: data,
          });
        }
      });
    });

    req.on('error', reject);

    if (bodyData) {
      req.write(bodyData);
    }
    req.end();
  });
}

async function runPhase56Verification() {
  console.log('=============================================================');
  console.log(' FASE 56: VERIFICAÇÃO DO BACKEND E SERVIDOR BASE DA API');
  console.log('=============================================================\n');

  // Configurar app em modo de teste
  process.env.NODE_ENV = 'test';
  const app = createApp({
    configureRoutes: (testApp) => {
      // Adicionar rota de teste para forçar erro 500 no handler
      testApp.get('/api/v1/test-error', () => {
        throw new Error('Falha de teste simulada para validação de erro');
      });

      // Adicionar rota de teste para erro operacional tipado
      testApp.get('/api/v1/test-api-error', () => {
        throw ApiError.badRequest('Parâmetro inválido para teste', 'INVALID_PARAM', { field: 'test' });
      });
    },
  });
  const testPort = 3099;
  const testHost = '127.0.0.1';

  const server = http.createServer(app);

  await new Promise<void>((resolve) => {
    server.listen(testPort, testHost, () => {
      resolve();
    });
  });

  try {
    // --- TESTE 1: INICIALIZAÇÃO DO SERVIDOR ---
    console.log('--- TESTE 1: INICIALIZAÇÃO E RESPONSIVIDADE DO SERVIDOR ---');
    assert(server.listening, 'Servidor HTTP inicializado e escutando na porta de teste');

    // --- TESTE 2: ENDPOINT RAIZ /api ---
    console.log('\n--- TESTE 2: ENDPOINT RAIZ DA API (/api) ---');
    const rootRes = await makeRequest({
      hostname: testHost,
      port: testPort,
      path: '/api',
      method: 'GET',
    });
    assert(rootRes.statusCode === 200, 'GET /api responde com status 200 OK');
    assert(rootRes.body?.success === true, 'GET /api retorna success: true');
    assert(Array.isArray(rootRes.body?.activeVersions), 'GET /api lista versões ativas da API');
    assert(rootRes.body?.activeVersions.includes('v1'), 'GET /api inclui versão v1');

    // --- TESTE 3: HEALTH CHECK (/api/v1/health) ---
    console.log('\n--- TESTE 3: HEALTH CHECK (/api/v1/health) ---');
    const healthRes = await makeRequest({
      hostname: testHost,
      port: testPort,
      path: '/api/v1/health',
      method: 'GET',
    });
    assert(healthRes.statusCode === 200, 'GET /api/v1/health responde com status 200 OK');
    assert(healthRes.body?.status === 'healthy', 'GET /api/v1/health retorna status "healthy"');
    assert(typeof healthRes.body?.uptime === 'number', 'GET /api/v1/health retorna uptime numérico');
    assert(Boolean(healthRes.body?.timestamp), 'GET /api/v1/health retorna timestamp ISO válido');

    // --- TESTE 4: STATUS TÉCNICO (/api/v1/status) ---
    console.log('\n--- TESTE 4: STATUS TÉCNICO (/api/v1/status) ---');
    const statusRes = await makeRequest({
      hostname: testHost,
      port: testPort,
      path: '/api/v1/status',
      method: 'GET',
    });
    assert(statusRes.statusCode === 200, 'GET /api/v1/status responde com status 200 OK');
    assert(statusRes.body?.status === 'operational', 'GET /api/v1/status retorna status "operational"');
    assert(statusRes.body?.version === 'v1', 'GET /api/v1/status retorna version "v1"');

    // --- TESTE 5: MIDDLEWARE REQUEST ID ---
    console.log('\n--- TESTE 5: REQUEST ID MIDDLEWARE ---');
    assert(Boolean(healthRes.headers['x-request-id']), 'Header X-Request-Id retornado na resposta');
    const customReqId = 'custom_req_fase56_valid_123';
    const customIdRes = await makeRequest({
      hostname: testHost,
      port: testPort,
      path: '/api/v1/health',
      method: 'GET',
      headers: {
        'x-request-id': customReqId,
      },
    });
    assert(customIdRes.headers['x-request-id'] === customReqId, 'X-Request-Id válido enviado pelo cliente foi preservado');

    // --- TESTE 6: ROTA INEXISTENTE (404 COM ENVELOPE CANÔNICO) ---
    console.log('\n--- TESTE 6: TRATAMENTO DE ROTA 404 COM ENVELOPE CANÔNICO ---');
    const notFoundRes = await makeRequest({
      hostname: testHost,
      port: testPort,
      path: '/api/v1/rota-totalmente-inexistente',
      method: 'GET',
    });
    assert(notFoundRes.statusCode === 404, 'Rota inexistente retorna status HTTP 404');
    assert(notFoundRes.body?.success === false, 'Resposta de erro retorna success: false');
    assert(notFoundRes.body?.error?.code === 'NOT_FOUND', 'Código de erro padronizado code: "NOT_FOUND"');
    assert(Boolean(notFoundRes.body?.error?.requestId), 'Envelope de erro inclui requestId');
    assert(Boolean(notFoundRes.body?.error?.timestamp), 'Envelope de erro inclui timestamp');

    // --- TESTE 7: TRATAMENTO DE ERROS TIPADOS E NÃO TRATADOS ---
    console.log('\n--- TESTE 7: TRATAMENTO DE ERROS TIPADOS E EXCEÇÕES (500) ---');
    const apiErrorRes = await makeRequest({
      hostname: testHost,
      port: testPort,
      path: '/api/v1/test-api-error',
      method: 'GET',
    });
    assert(apiErrorRes.statusCode === 400, 'ApiError tipado retorna statusCode configurado (400)');
    assert(apiErrorRes.body?.error?.code === 'INVALID_PARAM', 'ApiError propaga código customizado');
    assert(apiErrorRes.body?.error?.details?.field === 'test', 'ApiError propaga detalhes estruturados');

    const internalErrorRes = await makeRequest({
      hostname: testHost,
      port: testPort,
      path: '/api/v1/test-error',
      method: 'GET',
    });
    assert(internalErrorRes.statusCode === 500, 'Exceção não tratada retorna status HTTP 500');
    assert(internalErrorRes.body?.error?.code === 'INTERNAL_SERVER_ERROR', 'Exceção não tratada retorna code: "INTERNAL_SERVER_ERROR"');
    assert(Boolean(internalErrorRes.body?.error?.requestId), 'Erro 500 contém requestId para auditoria');

    // --- TESTE 8: HEADERS DE SEGURANÇA ---
    console.log('\n--- TESTE 8: HEADERS DE SEGURANÇA BÁSICOS ---');
    assert(healthRes.headers['x-content-type-options'] === 'nosniff', 'Header X-Content-Type-Options: nosniff presente');
    assert(healthRes.headers['x-frame-options'] === 'SAMEORIGIN', 'Header X-Frame-Options: SAMEORIGIN presente');
    assert(!healthRes.headers['x-powered-by'], 'Header X-Powered-By devidamente removido por segurança');

    // --- TESTE 9: ISOLAMENTO ARQUITETURAL DO BACKEND ---
    console.log('\n--- TESTE 9: AUDITORIA DE ISOLAMENTO ARQUITETURAL ---');
    function scanDirectoryForTerms(dir: string, terms: string[]): { file: string; term: string }[] {
      const violations: { file: string; term: string }[] = [];
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const full = path.join(dir, item);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          violations.push(...scanDirectoryForTerms(full, terms));
        } else if (full.endsWith('.ts')) {
          const content = fs.readFileSync(full, 'utf-8');
          for (const term of terms) {
            if (content.includes(term)) {
              violations.push({ file: full, term });
            }
          }
        }
      }
      return violations;
    }

    const backendStorageViolations = scanDirectoryForTerms(path.resolve(process.cwd(), 'server'), [
      'localStorage',
      'sessionStorage',
      'IndexedDB',
      'window.',
    ]);
    assert(backendStorageViolations.length === 0, `Zero dependências de armazenamento de navegador em server/ (Encontrados: ${backendStorageViolations.length})`);

    const frontendServerImports = scanDirectoryForTerms(path.resolve(process.cwd(), 'src/components'), [
      '../server',
      '../../server',
      '@/server',
    ]);
    assert(frontendServerImports.length === 0, `Zero importações de server/ em src/components/ (Encontrados: ${frontendServerImports.length})`);

    // --- TESTE 10: ENCERRAMENTO GRACIOSO DO SERVIDOR ---
    console.log('\n--- TESTE 10: ENCERRAMENTO GRACIOSO DO SERVIDOR ---');
    await new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    assert(!server.listening, 'Servidor HTTP encerrado graciosamente sem travas');

  } catch (error) {
    console.error('Falha inesperada durante execução dos testes:', error);
    failed++;
  } finally {
    if (server.listening) {
      server.close();
    }
  }

  console.log('\n=============================================================');
  console.log(`RESULTADO DA FASE 56: ${passed}/${passed + failed} ASSERÇÕES APROVADAS!`);
  if (failed > 0) {
    console.error(`FORAM DETECTADAS ${failed} FALHAS!`);
    process.exit(1);
  } else {
    console.log('FUNDAÇÃO DO SERVIDOR E BACKEND VALIDADA COM 100% DE SUCESSO!');
    console.log('=============================================================\n');
  }
}

runPhase56Verification().catch((err) => {
  console.error('Erro fatal:', err);
  process.exit(1);
});
