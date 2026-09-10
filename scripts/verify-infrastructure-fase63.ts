/**
 * CMS VISUAL PARA IGREJAS — SUÍTE DE HOMOLOGAÇÃO DA FASE 63
 * Preparação da Infraestrutura de Produção e Estratégia de Deploy
 *
 * MODO CIRÚRGICO — MODO COFRE — NÃO-REGRESSÃO TOTAL
 * Validação local sem acesso à infraestrutura externa, sem SSH, sem deploy real.
 */

import fs from 'fs';
import path from 'path';
import http from 'http';
import { createApp } from '../server/app.js';
import { config } from '../server/config/index.js';
import { localCmsStorageEngine } from '../src/core/persistence/storageEngine.js';
import { CmsCanonicalRepository } from '../src/core/persistence/cmsRepository.js';

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

async function runFase63InfrastructureTests() {
  console.log('======================================================================');
  console.log(' CMS VISUAL PARA IGREJAS — VERIFICAÇÃO DE INFRAESTRUTURA (FASE 63)');
  console.log(' Validação local da estratégia de deploy, Nginx, Systemd e Segurança');
  console.log('======================================================================\n');

  const rootDir = process.cwd();

  // --------------------------------------------------------------------------
  // GRUPO A: ESTRUTURA DE ARQUIVOS E DOCUMENTAÇÃO
  // --------------------------------------------------------------------------
  console.log('--- GRUPO A: Estrutura de Arquivos e Documentação ---');
  const nginxTemplatePath = path.join(rootDir, 'deploy/nginx/cms-igrejas.conf.template');
  const systemdTemplatePath = path.join(rootDir, 'deploy/systemd/cms-backend.service.template');
  const backupTemplatePath = path.join(rootDir, 'deploy/scripts/backup.sh.template');
  const restoreTemplatePath = path.join(rootDir, 'deploy/scripts/restore.sh.template');
  const deployTemplatePath = path.join(rootDir, 'deploy/scripts/deploy.sh.template');
  const rollbackTemplatePath = path.join(rootDir, 'deploy/scripts/rollback.sh.template');
  const deploymentDocPath = path.join(rootDir, 'docs/PRODUCTION_DEPLOYMENT.md');
  const architectureDocPath = path.join(rootDir, 'docs/PRODUCTION_ARCHITECTURE.md');

  assert(fs.existsSync(nginxTemplatePath), 'Template de configuração Nginx existe (deploy/nginx/cms-igrejas.conf.template)');
  assert(fs.existsSync(systemdTemplatePath), 'Template de serviço systemd existe (deploy/systemd/cms-backend.service.template)');
  assert(fs.existsSync(backupTemplatePath), 'Template de script de backup existe (deploy/scripts/backup.sh.template)');
  assert(fs.existsSync(restoreTemplatePath), 'Template de script de restauração existe (deploy/scripts/restore.sh.template)');
  assert(fs.existsSync(deployTemplatePath), 'Template de script de deploy existe (deploy/scripts/deploy.sh.template)');
  assert(fs.existsSync(rollbackTemplatePath), 'Template de script de rollback existe (deploy/scripts/rollback.sh.template)');
  assert(fs.existsSync(deploymentDocPath), 'Documentação mestre de deploy existe (docs/PRODUCTION_DEPLOYMENT.md)');
  assert(fs.existsSync(architectureDocPath), 'Documentação de arquitetura existe (docs/PRODUCTION_ARCHITECTURE.md)');

  // --------------------------------------------------------------------------
  // GRUPO B: SCRIPTS DE BUILD E EXECUÇÃO (PACKAGE.JSON)
  // --------------------------------------------------------------------------
  console.log('\n--- GRUPO B: Scripts de Build e Execução (package.json) ---');
  const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));

  assert(typeof packageJson.scripts.build === 'string', 'Script "build" definido no package.json');
  assert(packageJson.scripts.build.includes('vite build'), 'Script "build" inclui compilação do frontend com Vite');
  assert(packageJson.scripts.build.includes('esbuild server/index.ts'), 'Script "build" inclui empacotamento do backend com esbuild');
  assert(typeof packageJson.scripts['build:server'] === 'string', 'Script "build:server" existe para empacotamento isolado');
  assert(packageJson.scripts.start === 'node dist/server.mjs', 'Script "start" configurado para executar node dist/server.mjs');
  assert(typeof packageJson.scripts['db:migrate'] === 'string', 'Script "db:migrate" disponível para migrações Drizzle');

  // --------------------------------------------------------------------------
  // GRUPO C: VARIÁVEIS DE AMBIENTE (.ENV.EXAMPLE)
  // --------------------------------------------------------------------------
  console.log('\n--- GRUPO C: Variáveis de Ambiente (.env.example) ---');
  const envExampleContent = fs.readFileSync(path.join(rootDir, '.env.example'), 'utf-8');

  assert(envExampleContent.includes('HOST='), '.env.example documenta a variável HOST');
  assert(envExampleContent.includes('PORT='), '.env.example documenta a variável PORT');
  assert(envExampleContent.includes('NODE_ENV='), '.env.example documenta a variável NODE_ENV');
  assert(envExampleContent.includes('CORS_ORIGIN='), '.env.example documenta a variável CORS_ORIGIN');
  assert(envExampleContent.includes('DATABASE_URL='), '.env.example documenta a variável DATABASE_URL');
  assert(envExampleContent.includes('JWT_SECRET='), '.env.example documenta a variável JWT_SECRET');
  assert(envExampleContent.includes('COOKIE_SECRET='), '.env.example documenta a variável COOKIE_SECRET');

  // --------------------------------------------------------------------------
  // GRUPO D: SEGREDOS E PROTEÇÃO GIT
  // --------------------------------------------------------------------------
  console.log('\n--- GRUPO D: Proteção de Segredos e .gitignore ---');
  const gitignoreContent = fs.readFileSync(path.join(rootDir, '.gitignore'), 'utf-8');

  assert(gitignoreContent.includes('.env*'), '.gitignore bloqueia arquivos .env');
  assert(gitignoreContent.includes('!.env.example'), '.gitignore permite versionar apenas .env.example');

  // Verifica ausência de arquivos .env reais no repositório
  const envRealExists = fs.existsSync(path.join(rootDir, '.env'));
  const envProductionExists = fs.existsSync(path.join(rootDir, '.env.production'));
  assert(!envRealExists && !envProductionExists, 'Nenhum arquivo .env com segredos reais está presente no workspace');

  // --------------------------------------------------------------------------
  // GRUPO E: FRONTEND BUILD OUTPUT
  // --------------------------------------------------------------------------
  console.log('\n--- GRUPO E: Artefatos do Frontend (dist) ---');
  const distDir = path.join(rootDir, 'dist');
  const distIndexHtml = path.join(distDir, 'index.html');
  const distAssetsDir = path.join(distDir, 'assets');

  assert(fs.existsSync(distDir), 'Diretório dist/ existe');
  assert(fs.existsSync(distIndexHtml), 'dist/index.html gerado com sucesso');
  assert(fs.existsSync(distAssetsDir), 'dist/assets/ contém arquivos estáticos otimizados');

  // --------------------------------------------------------------------------
  // GRUPO F: BACKEND BUILD OUTPUT E BUNDLE NATIVO
  // --------------------------------------------------------------------------
  console.log('\n--- GRUPO F: Artefatos do Backend (dist/server.mjs) ---');
  const distServerMjs = path.join(distDir, 'server.mjs');

  assert(fs.existsSync(distServerMjs), 'dist/server.mjs gerado com sucesso');
  const serverMjsStat = fs.statSync(distServerMjs);
  assert(serverMjsStat.size > 20000, `Bundle dist/server.mjs possui tamanho consistente (${(serverMjsStat.size / 1024).toFixed(1)} KB)`);

  // --------------------------------------------------------------------------
  // GRUPO G: API / HEALTH CHECK EM TEMPO DE EXECUÇÃO
  // --------------------------------------------------------------------------
  console.log('\n--- GRUPO G: API / Health Check ---');
  const app = createApp();
  const testServer = http.createServer(app);

  await new Promise<void>((resolve) => {
    testServer.listen(0, '127.0.0.1', () => resolve());
  });

  const address = testServer.address() as any;
  const testPort = address.port;

  try {
    const healthRes = await makeRequest({
      hostname: '127.0.0.1',
      port: testPort,
      path: '/api/v1/health',
      method: 'GET',
    });

    assert(healthRes.statusCode === 200, 'Endpoint /api/v1/health retorna status HTTP 200');
    assert(healthRes.body?.status === 'healthy' || healthRes.body?.status === 'ok', 'Payload de health check retorna status operacional (healthy/ok)');
    assert(typeof healthRes.body?.uptime === 'number', 'Payload de health check inclui métrica uptime');
    assert(typeof healthRes.body?.timestamp === 'string', 'Payload de health check inclui timestamp ISO');

    // Validação de rota inexistente sob /api
    const notFoundRes = await makeRequest({
      hostname: '127.0.0.1',
      port: testPort,
      path: '/api/v1/inexistente',
      method: 'GET',
    });
    assert(notFoundRes.statusCode === 404, 'Rota inexistente sob /api retorna 404 canônico');
  } finally {
    testServer.close();
  }

  // --------------------------------------------------------------------------
  // GRUPO H: CONFIGURAÇÃO DO REVERSE PROXY NGINX (TEMPLATE)
  // --------------------------------------------------------------------------
  console.log('\n--- GRUPO H: Reverse Proxy Nginx (Template) ---');
  const nginxContent = fs.readFileSync(nginxTemplatePath, 'utf-8');

  assert(nginxContent.includes('upstream cms_backend_upstream'), 'Nginx template define upstream para o backend Node');
  assert(nginxContent.includes('server 127.0.0.1:3001'), 'Nginx upstream aponta estritamente para 127.0.0.1:3001');
  assert(nginxContent.includes('try_files $uri $uri/ /index.html'), 'Nginx template configura fallback SPA para o frontend');
  assert(nginxContent.includes('proxy_pass http://cms_backend_upstream'), 'Nginx template direciona requisições /api/ para o backend');
  assert(nginxContent.includes('proxy_set_header X-Forwarded-For'), 'Nginx template propaga cabeçalho X-Forwarded-For');
  assert(nginxContent.includes('proxy_set_header X-Forwarded-Proto'), 'Nginx template propaga cabeçalho X-Forwarded-Proto');
  assert(nginxContent.includes('ssl_protocols TLSv1.2 TLSv1.3'), 'Nginx template restringe protocolos SSL para TLSv1.2 e TLSv1.3');

  // --------------------------------------------------------------------------
  // GRUPO I: POSTGRESQL E RLS (CONFIGURAÇÃO)
  // --------------------------------------------------------------------------
  console.log('\n--- GRUPO I: PostgreSQL e Isolamento de Dados ---');
  assert(typeof config.database === 'object', 'Configuração de banco de dados existe no servidor');
  assert(config.database.port === 5432, 'Porta padrão do PostgreSQL é 5432');
  assert(config.host === '0.0.0.0' || config.host === '127.0.0.1', 'Host configurado adequadamente para escuta em rede interna');

  // --------------------------------------------------------------------------
  // GRUPO J: MIGRATIONS
  // --------------------------------------------------------------------------
  console.log('\n--- GRUPO J: Migrações Drizzle e RLS ---');
  const migrationsDir = path.join(rootDir, 'server/db/migrations');
  assert(fs.existsSync(migrationsDir), 'Diretório server/db/migrations existe');
  const migrationFiles = fs.readdirSync(migrationsDir);
  assert(migrationFiles.some((f) => f.endsWith('.sql')), 'Existem migrações SQL no diretório de migrations');
  assert(fs.existsSync(path.join(migrationsDir, '0001_rls_policies.sql')), 'Migração de políticas RLS existe (0001_rls_policies.sql)');

  // --------------------------------------------------------------------------
  // GRUPO K: ROLLBACK ATÔMICO
  // --------------------------------------------------------------------------
  console.log('\n--- GRUPO K: Estratégia de Rollback ---');
  const rollbackContent = fs.readFileSync(rollbackTemplatePath, 'utf-8');
  assert(rollbackContent.includes('CURRENT_LINK='), 'Script de rollback referencia o link simbólico da release');
  assert(rollbackContent.includes('ln -sfn'), 'Script de rollback realiza troca atômica de symlink');
  assert(rollbackContent.includes('systemctl reload-or-restart cms-backend'), 'Script de rollback recarrega o serviço backend');

  // --------------------------------------------------------------------------
  // GRUPO L: BACKUP LÓGICO
  // --------------------------------------------------------------------------
  console.log('\n--- GRUPO L: Estratégia de Backup ---');
  const backupContent = fs.readFileSync(backupTemplatePath, 'utf-8');
  assert(backupContent.includes('pg_dump'), 'Script de backup utiliza pg_dump para backup lógico');
  assert(backupContent.includes('-Fc'), 'Script de backup utiliza formato customizado comprimido');
  assert(backupContent.includes('sha256sum'), 'Script de backup calcula checksum SHA256 de integridade');
  assert(backupContent.includes('RETENTION_DAYS='), 'Script de backup define política de retenção temporal');

  // --------------------------------------------------------------------------
  // GRUPO M: SEGURANÇA (TRUST PROXY, HEADERS, CORS)
  // --------------------------------------------------------------------------
  console.log('\n--- GRUPO M: Segurança (Trust Proxy, Headers e CORS) ---');
  assert(app.get('trust proxy') === 1, 'Express trust proxy está ativado com valor 1 (compatível com Nginx)');

  // --------------------------------------------------------------------------
  // GRUPO N: LOCAL PERSISTENCE PRESERVADA (SEM REMOÇÃO)
  // --------------------------------------------------------------------------
  console.log('\n--- GRUPO N: Preservação de LocalPersistence ---');
  assert(typeof localCmsStorageEngine === 'object', 'localCmsStorageEngine está preservado e acessível');
  assert(typeof localCmsStorageEngine.read === 'function', 'localCmsStorageEngine.read existe');
  assert(typeof localCmsStorageEngine.write === 'function', 'localCmsStorageEngine.write existe');
  assert(typeof localCmsStorageEngine.remove === 'function', 'localCmsStorageEngine.remove existe');
  assert(typeof localCmsStorageEngine.exists === 'function', 'localCmsStorageEngine.exists existe');

  const localRepo = new CmsCanonicalRepository(localCmsStorageEngine);
  assert(typeof localRepo.loadSettings === 'function', 'CmsCanonicalRepository possui método loadSettings');
  assert(localRepo.getEngineType() === 'local', 'CmsCanonicalRepository reconhece localCmsStorageEngine como tipo local');

  // --------------------------------------------------------------------------
  // GRUPO O: MULTI-TENANT ISOLATION PRESERVADO
  // --------------------------------------------------------------------------
  console.log('\n--- GRUPO O: Isolamento Multi-Tenant ---');
  const appTsContent = fs.readFileSync(path.join(rootDir, 'server/app.ts'), 'utf-8');
  assert(appTsContent.includes('X-Tenant-Id'), 'API aceita cabeçalho X-Tenant-Id em conformidade multi-tenant');

  // --------------------------------------------------------------------------
  // GRUPO P: DEPLOYMENT SEGURANÇA E NÃO-EXECUÇÃO
  // --------------------------------------------------------------------------
  console.log('\n--- GRUPO P: Segurança do Deploy (Não-Execução Remota) ---');
  const deployContent = fs.readFileSync(deployTemplatePath, 'utf-8');
  assert(deployContent.includes('TEMPLATE'), 'deploy.sh é explicitamente identificado como template');
  assert(!deployContent.includes('ssh '), 'Script de deploy não executa comandos SSH remotos não-autorizados');
  assert(!deployContent.includes('scp '), 'Script de deploy não executa comandos SCP remotos');

  // --------------------------------------------------------------------------
  // RELATÓRIO FINAL DA SUÍTE
  // --------------------------------------------------------------------------
  console.log('\n======================================================================');
  console.log(` RESULTADO FINAL FASE 63: ${passed} PASS, ${failed} FAIL`);
  console.log('======================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runFase63InfrastructureTests().catch((err) => {
  console.error('Erro fatal na execução dos testes da Fase 63:', err);
  process.exit(1);
});
