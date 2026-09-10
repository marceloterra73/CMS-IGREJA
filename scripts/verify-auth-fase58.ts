/**
 * SUÍTE DE TESTES E VERIFICAÇÃO AUTOMATIZADA — FASE 58
 * CMS Visual para Igrejas — Autenticação, Autorização e Identidade Multi-tenant
 *
 * Cobertura Completa dos Cenários A a J:
 * - Cenário A: Registro e Fixtures de Usuários
 * - Cenário B: Criptografia e Hashing Seguro de Senhas (bcrypt)
 * - Cenário C: Endpoint POST /api/v1/auth/login
 * - Cenário D: Validação e Segurança de Sessão / Tokens JWT
 * - Cenário E: Endpoint GET /api/v1/auth/me
 * - Cenário F: Endpoint POST /api/v1/auth/logout
 * - Cenário G: Autorização RBAC e Permissões Canônicas
 * - Cenário H: Isolamento Multi-tenant e Prevenção de IDOR
 * - Cenário I: Ciclo de Vida do Contexto de Tenant e RLS
 * - Cenário J: Segurança, Robustez, CSRF e Rate Limiting
 */

import http from 'http';
import jwt from 'jsonwebtoken';
import { createApp } from '../server/app.js';
import { hashPassword, verifyPassword } from '../server/auth/password.js';
import {
  createUser,
  authenticate,
  findUserByEmail,
  clearInMemoryAuthStore,
} from '../server/auth/service.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  type AuthenticatedUser,
} from '../server/auth/tokens.js';
import {
  ROLE_PERMISSIONS,
  ALL_CANONICAL_PERMISSIONS,
  hasRole,
  hasPermission,
  getUserEffectivePermissions,
  isValidRole,
} from '../server/auth/rbac.js';
import {
  requireRole,
  requirePermission,
  requireTenantContext,
} from '../server/middleware/rbac.js';
import { authenticateMiddleware } from '../server/middleware/authenticate.js';
import {
  recordFailedAttempt,
  clearAttempts,
  resetAllRateLimits,
} from '../server/middleware/rateLimiter.js';
import {
  setTenantContext,
  clearTenantContext,
} from '../server/db/rls.js';
import { config } from '../server/config/index.js';
import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME, generateCsrfToken } from '../server/middleware/csrf.js';

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

// Utilitário para chamadas HTTP locais
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
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ statusCode: res.statusCode || 0, headers: res.headers, body: parsed, rawBody: data });
        } catch {
          resolve({ statusCode: res.statusCode || 0, headers: res.headers, body: null, rawBody: data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (bodyData) {
      req.write(bodyData);
    }
    req.end();
  });
}

function parseCookies(headers: http.IncomingHttpHeaders): Record<string, string> {
  const cookieHeaders = headers['set-cookie'] || [];
  const result: Record<string, string> = {};

  for (const str of cookieHeaders) {
    const parts = str.split(';')[0].split('=');
    if (parts.length >= 2) {
      result[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
  }

  return result;
}

async function runAuthTests() {
  console.log('\n===============================================================');
  console.log(' INICIANDO SUÍTE DE TESTES E VERIFICAÇÃO — FASE 58');
  console.log(' Autenticação, Autorização e Identidade Multi-tenant');
  console.log('===============================================================\n');

  clearInMemoryAuthStore();
  resetAllRateLimits();

  // Cria app com rotas auxiliares para testes de autorização
  const app = createApp({
    configureRoutes: (expressApp) => {
      // Rota protegida por papel
      expressApp.get(
        '/api/v1/test/admin-only',
        authenticateMiddleware,
        requireRole('tenant_admin'),
        (_req, res) => res.json({ success: true, message: 'admin access' })
      );

      // Rota protegida por permissão
      expressApp.get(
        '/api/v1/test/publish-pages',
        authenticateMiddleware,
        requirePermission('publish:pages'),
        (_req, res) => res.json({ success: true, message: 'publish allowed' })
      );

      // Rota protegida por permissão de sermões
      expressApp.get(
        '/api/v1/test/manage-sermons',
        authenticateMiddleware,
        requirePermission('manage:sermons'),
        (_req, res) => res.json({ success: true, message: 'sermons allowed' })
      );

      // Rota com isolamento de tenant
      expressApp.get(
        '/api/v1/test/tenant-data',
        authenticateMiddleware,
        requireTenantContext,
        (req, res) => res.json({ success: true, tenantId: req.tenantId })
      );

      // Rota mutativa para validação de CSRF
      expressApp.post(
        '/api/v1/test/csrf-protected-mutation',
        authenticateMiddleware,
        (_req, res) => res.json({ success: true, message: 'mutation success' })
      );
    },
  });

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  const port = (server.address() as any).port;

  // -------------------------------------------------------------
  // CENÁRIO A: REGISTRO / FIXTURES DE USUÁRIO
  // -------------------------------------------------------------
  console.log('👤 [CENÁRIO A] Validação de Registro e Fixtures de Usuários...');

  const userPastor = await createUser({
    id: 'user-pastor-1',
    tenantId: 'tenant-igreja-central',
    name: 'Pastor João Batista',
    email: 'pastor.joao@igreja.org.br',
    password: 'Password@123',
    role: 'pastor',
    status: 'active',
  });

  assert(userPastor.id === 'user-pastor-1', 'Usuário criado com identificador canônico correto');
  assert(userPastor.tenantId === 'tenant-igreja-central', 'Usuário regular vinculado obrigatoriamente a um tenant');
  assert(userPastor.role === 'pastor', 'Papel eclesial definido corretamente como "pastor"');
  assert(isValidRole(userPastor.role), 'Papel do usuário validado contra a matriz canônica de papéis');
  assert(!isValidRole('hacker_role'), 'Papel arbitrário ou inválido é rejeitado pela validação');

  const superAdmin = await createUser({
    id: 'user-superadmin-1',
    tenantId: null, // Superadmin global da plataforma
    name: 'Administrador da Plataforma',
    email: 'superadmin@plataforma.com',
    password: 'MasterPassword#2026',
    role: 'superadmin',
    status: 'active',
  });

  assert(superAdmin.role === 'superadmin', 'Superadmin criado com regra explícita');
  assert(superAdmin.tenantId === null, 'Superadmin de plataforma opera com tenantId nulo (escopo global)');

  const userEditor = await createUser({
    id: 'user-editor-1',
    tenantId: 'tenant-igreja-central',
    name: 'Lucas Editor',
    email: 'lucas.editor@igreja.org.br',
    password: 'Password@123',
    role: 'editor',
    status: 'active',
  });

  const userVolunteer = await createUser({
    id: 'user-volunteer-1',
    tenantId: 'tenant-igreja-central',
    name: 'Mariana Voluntária Mídia',
    email: 'mariana.midia@igreja.org.br',
    password: 'Password@123',
    role: 'media_volunteer',
    status: 'active',
  });

  const userTenantAdmin = await createUser({
    id: 'user-admin-1',
    tenantId: 'tenant-igreja-central',
    name: 'Carlos Administrador Local',
    email: 'carlos.admin@igreja.org.br',
    password: 'Password@123',
    role: 'tenant_admin',
    status: 'active',
  });

  const userOtherTenant = await createUser({
    id: 'user-other-tenant-1',
    tenantId: 'tenant-outra-igreja',
    name: 'Pedro Outra Congregação',
    email: 'pedro@outraigreja.org.br',
    password: 'Password@123',
    role: 'tenant_admin',
    status: 'active',
  });

  const userInactive = await createUser({
    id: 'user-inactive-1',
    tenantId: 'tenant-igreja-central',
    name: 'Membro Inativo',
    email: 'inativo@igreja.org.br',
    password: 'Password@123',
    role: 'editor',
    status: 'inactive',
  });

  const userSuspended = await createUser({
    id: 'user-suspended-1',
    tenantId: 'tenant-igreja-central',
    name: 'Membro Suspenso',
    email: 'suspenso@igreja.org.br',
    password: 'Password@123',
    role: 'editor',
    status: 'suspended',
  });

  assert(userEditor.tenantId === 'tenant-igreja-central', 'Editor vinculado ao tenant');
  assert(userOtherTenant.tenantId === 'tenant-outra-igreja', 'Usuário do tenant B criado para testes de isolamento');

  // -------------------------------------------------------------
  // CENÁRIO B: HASHING DE SENHA
  // -------------------------------------------------------------
  console.log('\n🔒 [CENÁRIO B] Criptografia e Hashing Seguro de Senhas (bcrypt)...');

  const rawPassword = 'MySecretPassword#99';
  const hash1 = await hashPassword(rawPassword);
  const hash2 = await hashPassword(rawPassword);

  assert(hash1 !== rawPassword, 'Senha em texto puro nunca é mantida (hash gerado)');
  assert(hash1.startsWith('$2'), 'Algoritmo de hashing bcrypt utilizado com prefixo seguro ($2a/$2b)');
  assert(hash1 !== hash2, 'Duas senhas idênticas produzem hashes distintos devido ao salteamento (salt)');

  const passwordValid = await verifyPassword(rawPassword, hash1);
  const passwordInvalid = await verifyPassword('WrongPassword#99', hash1);
  assert(passwordValid === true, 'Verificação de senha com valor correto é aprovada');
  assert(passwordInvalid === false, 'Tentativa de login com senha incorreta é rejeitada');

  let emptyPasswordFailed = false;
  try {
    await hashPassword('');
  } catch {
    emptyPasswordFailed = true;
  }
  assert(emptyPasswordFailed, 'Tentativa de hashing de senha vazia é sumariamente rejeitada');

  let shortPasswordFailed = false;
  try {
    await hashPassword('123');
  } catch {
    shortPasswordFailed = true;
  }
  assert(shortPasswordFailed, 'Tentativa de senha menor que 6 caracteres é rejeitada');

  // -------------------------------------------------------------
  // CENÁRIO C: LOGIN (POST /api/v1/auth/login)
  // -------------------------------------------------------------
  console.log('\n🔑 [CENÁRIO C] Endpoint POST /api/v1/auth/login...');

  // 1. Login com sucesso
  const loginRes = await makeRequest(
    {
      hostname: '127.0.0.1',
      port,
      path: '/api/v1/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    JSON.stringify({
      email: 'pastor.joao@igreja.org.br',
      password: 'Password@123',
    })
  );

  assert(loginRes.statusCode === 200, 'POST /api/v1/auth/login retorna HTTP 200 com credenciais válidas');
  assert(loginRes.body.success === true, 'Resposta contém flag success: true');
  assert(typeof loginRes.body.accessToken === 'string', 'Token de acesso JWT emitido na resposta');
  assert(typeof loginRes.body.refreshToken === 'string', 'Refresh token emitido na resposta');
  assert(loginRes.body.user.email === 'pastor.joao@igreja.org.br', 'Identidade do usuário retornada corretamente');
  assert(loginRes.body.user.role === 'pastor', 'Papel retornado confere com o cadastro');
  assert(loginRes.body.user.passwordHash === undefined, 'Segurança: password_hash NUNCA é vazado na resposta');

  // Validação dos cookies emitidos
  const cookies = parseCookies(loginRes.headers);
  assert(Boolean(cookies['cms_access_token']), 'Cookie cms_access_token emitido no cabeçalho Set-Cookie');
  assert(Boolean(cookies['cms_refresh_token']), 'Cookie cms_refresh_token emitido no cabeçalho Set-Cookie');
  assert(Boolean(cookies[CSRF_COOKIE_NAME]), 'Cookie anti-CSRF emitido para proteção do frontend');

  // 2. Erro com credenciais inválidas (mensagem genérica)
  const invalidLoginRes = await makeRequest(
    {
      hostname: '127.0.0.1',
      port,
      path: '/api/v1/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    JSON.stringify({
      email: 'pastor.joao@igreja.org.br',
      password: 'WrongPassword!',
    })
  );

  assert(invalidLoginRes.statusCode === 401, 'Credenciais incorretas retornam HTTP 401 Unauthorized');
  assert(
    invalidLoginRes.body.error?.message === 'Credenciais inválidas.',
    'Mensagem de erro genérica retornada para prevenir enumeração de credenciais'
  );

  // 3. E-mail inexistente (deve retornar exatamente a mesma mensagem genérica)
  const nonExistentLoginRes = await makeRequest(
    {
      hostname: '127.0.0.1',
      port,
      path: '/api/v1/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    JSON.stringify({
      email: 'naoexiste@igreja.org.br',
      password: 'Password@123',
    })
  );

  assert(nonExistentLoginRes.statusCode === 401, 'Usuário inexistente retorna HTTP 401');
  assert(
    nonExistentLoginRes.body.error?.message === 'Credenciais inválidas.',
    'Prevenção contra enumeração: usuário inexistente retorna a mesma mensagem genérica'
  );

  // 4. Usuário inativo não autentica
  const inactiveLoginRes = await makeRequest(
    {
      hostname: '127.0.0.1',
      port,
      path: '/api/v1/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    JSON.stringify({
      email: 'inativo@igreja.org.br',
      password: 'Password@123',
    })
  );

  assert(inactiveLoginRes.statusCode === 403, 'Usuário inativo é rejeitado com HTTP 403 Forbidden');

  // 5. Usuário suspenso não autentica
  const suspendedLoginRes = await makeRequest(
    {
      hostname: '127.0.0.1',
      port,
      path: '/api/v1/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    JSON.stringify({
      email: 'suspenso@igreja.org.br',
      password: 'Password@123',
    })
  );

  assert(suspendedLoginRes.statusCode === 403, 'Usuário suspenso é rejeitado com HTTP 403 Forbidden');

  // -------------------------------------------------------------
  // CENÁRIO D: SESSÃO / TOKEN JWT
  // -------------------------------------------------------------
  console.log('\n🛡️ [CENÁRIO D] Validação e Segurança de Tokens JWT...');

  const validToken = loginRes.body.accessToken;
  const decoded = verifyAccessToken(validToken);

  assert(decoded.sub === 'user-pastor-1', 'Token decodificado contém identificador sub correto');
  assert(decoded.tenantId === 'tenant-igreja-central', 'Token contém tenantId correto do pastor');
  assert(decoded.role === 'pastor', 'Token contém role correta');
  assert(decoded.type === 'access', 'Token contém claim de tipo estrito: "access"');
  assert(Array.isArray(decoded.permissions), 'Token transporta lista de permissões canônicas');

  // Rejeição de token adulterado/forjado
  let tamperedFailed = false;
  try {
    const tampered = validToken.slice(0, -5) + 'ABCDE';
    verifyAccessToken(tampered);
  } catch {
    tamperedFailed = true;
  }
  assert(tamperedFailed, 'Token com assinatura forjada/adulterada é sumariamente rejeitado');

  // Rejeição de token do tipo refresh passado como access
  let wrongTypeFailed = false;
  try {
    verifyAccessToken(loginRes.body.refreshToken);
  } catch {
    wrongTypeFailed = true;
  }
  assert(wrongTypeFailed, 'Refresh token utilizado como access token é sumariamente rejeitado');

  // Rejeição de algoritmo 'none'
  let noneAlgFailed = false;
  try {
    const forgedHeader = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
    const forgedPayload = Buffer.from(JSON.stringify({ sub: 'user-pastor-1', type: 'access' })).toString('base64url');
    const noneToken = `${forgedHeader}.${forgedPayload}.`;
    verifyAccessToken(noneToken);
  } catch {
    noneAlgFailed = true;
  }
  assert(noneAlgFailed, 'Vulnerabilidade de token com algoritmo "none" é completamente prevenida');

  // -------------------------------------------------------------
  // CENÁRIO E: ME (/api/v1/auth/me)
  // -------------------------------------------------------------
  console.log('\n📋 [CENÁRIO E] Endpoint GET /api/v1/auth/me...');

  // 1. Requisição autenticada via Header Bearer
  const meBearerRes = await makeRequest({
    hostname: '127.0.0.1',
    port,
    path: '/api/v1/auth/me',
    method: 'GET',
    headers: {
      Authorization: `Bearer ${validToken}`,
    },
  });

  assert(meBearerRes.statusCode === 200, 'GET /api/v1/auth/me autenticado via Bearer retorna HTTP 200');
  assert(meBearerRes.body.user.id === 'user-pastor-1', 'Identidade do usuário confere');
  assert(meBearerRes.body.user.tenantId === 'tenant-igreja-central', 'Tenant do usuário retornado');
  assert(meBearerRes.body.user.role === 'pastor', 'Papel pastoral retornado');
  assert(meBearerRes.body.user.passwordHash === undefined, 'Segurança: passwordHash nunca incluído no /me');

  // 2. Requisição autenticada via Cookie HttpOnly
  const meCookieRes = await makeRequest({
    hostname: '127.0.0.1',
    port,
    path: '/api/v1/auth/me',
    method: 'GET',
    headers: {
      Cookie: `cms_access_token=${validToken}`,
    },
  });

  assert(meCookieRes.statusCode === 200, 'GET /api/v1/auth/me autenticado via Cookie HttpOnly retorna HTTP 200');
  assert(meCookieRes.body.user.email === 'pastor.joao@igreja.org.br', 'Email do usuário confirmado');

  // 3. Requisição não autenticada
  const meUnauthRes = await makeRequest({
    hostname: '127.0.0.1',
    port,
    path: '/api/v1/auth/me',
    method: 'GET',
  });

  assert(meUnauthRes.statusCode === 401, 'Requisição não autenticada a /me retorna HTTP 401 Unauthorized');

  // -------------------------------------------------------------
  // CENÁRIO F: LOGOUT (POST /api/v1/auth/logout)
  // -------------------------------------------------------------
  console.log('\n🚪 [CENÁRIO F] Endpoint POST /api/v1/auth/logout...');

  const logoutRes = await makeRequest({
    hostname: '127.0.0.1',
    port,
    path: '/api/v1/auth/logout',
    method: 'POST',
    headers: {
      Cookie: `cms_access_token=${validToken}; cms_refresh_token=${loginRes.body.refreshToken}`,
      Authorization: `Bearer ${validToken}`,
    },
  });

  assert(logoutRes.statusCode === 200, 'POST /api/v1/auth/logout retorna HTTP 200');
  assert(logoutRes.body.success === true, 'Logout bem-sucedido confirmado');

  // Verificação de limpeza de cookies
  const logoutCookies = logoutRes.headers['set-cookie'] || [];
  const clearsAccessToken = logoutCookies.some(
    (c) => c.includes('cms_access_token=;') || c.includes('Max-Age=0') || c.includes('expires=')
  );
  assert(clearsAccessToken, 'Set-Cookie de logout instrui o navegador a remover cms_access_token');

  // Tentativa de refresh após logout deve ser rejeitada
  const refreshAfterLogoutRes = await makeRequest(
    {
      hostname: '127.0.0.1',
      port,
      path: '/api/v1/auth/refresh',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    JSON.stringify({ refreshToken: loginRes.body.refreshToken })
  );

  assert(
    refreshAfterLogoutRes.statusCode === 401,
    'Sessão revogada no logout rejeita renovação posterior com HTTP 401'
  );

  // -------------------------------------------------------------
  // CENÁRIO G: AUTORIZAÇÃO / RBAC (PAPÉIS E PERMISSÕES)
  // -------------------------------------------------------------
  console.log('\n⚖️ [CENÁRIO G] Autorização RBAC e Permissões Canônicas...');

  // Token de Pastor
  const pastorAuth = await authenticate({
    email: 'pastor.joao@igreja.org.br',
    password: 'Password@123',
  });

  // Token de Editor
  const editorAuth = await authenticate({
    email: 'lucas.editor@igreja.org.br',
    password: 'Password@123',
  });

  // Token de Voluntária de Mídia
  const volunteerAuth = await authenticate({
    email: 'mariana.midia@igreja.org.br',
    password: 'Password@123',
  });

  // Token de Tenant Admin
  const adminAuth = await authenticate({
    email: 'carlos.admin@igreja.org.br',
    password: 'Password@123',
  });

  // Token de Superadmin
  const superAdminAuth = await authenticate({
    email: 'superadmin@plataforma.com',
    password: 'MasterPassword#2026',
  });

  // 1. Rota de Tenant Admin:
  // - Tenant Admin: permitido (200)
  const adminAccessRes = await makeRequest({
    hostname: '127.0.0.1',
    port,
    path: '/api/v1/test/admin-only',
    method: 'GET',
    headers: { Authorization: `Bearer ${adminAuth.accessToken}` },
  });
  assert(adminAccessRes.statusCode === 200, 'Tenant Admin acessa rota restrita de administração');

  // - Superadmin: permitido (universal)
  const superAdminAccessRes = await makeRequest({
    hostname: '127.0.0.1',
    port,
    path: '/api/v1/test/admin-only',
    method: 'GET',
    headers: { Authorization: `Bearer ${superAdminAuth.accessToken}` },
  });
  assert(superAdminAccessRes.statusCode === 200, 'Superadmin possui bypass de acesso administrativo');

  // - Editor: rejeitado (403)
  const editorAdminDeniedRes = await makeRequest({
    hostname: '127.0.0.1',
    port,
    path: '/api/v1/test/admin-only',
    method: 'GET',
    headers: { Authorization: `Bearer ${editorAuth.accessToken}` },
  });
  assert(editorAdminDeniedRes.statusCode === 403, 'Editor é proibido de acessar recurso restrito a admin (403)');

  // 2. Rota de Permissão "publish:pages":
  // - Pastor possui publish:pages (200)
  const pastorPublishRes = await makeRequest({
    hostname: '127.0.0.1',
    port,
    path: '/api/v1/test/publish-pages',
    method: 'GET',
    headers: { Authorization: `Bearer ${pastorAuth.accessToken}` },
  });
  assert(pastorPublishRes.statusCode === 200, 'Pastor possui permissão canônica "publish:pages"');

  // - Voluntário de mídia NÃO possui publish:pages (403)
  const volunteerPublishRes = await makeRequest({
    hostname: '127.0.0.1',
    port,
    path: '/api/v1/test/publish-pages',
    method: 'GET',
    headers: { Authorization: `Bearer ${volunteerAuth.accessToken}` },
  });
  assert(volunteerPublishRes.statusCode === 403, 'Voluntário de mídia é proibido de publicar páginas (403)');

  // - Validação da matriz canônica completa de papéis e permissões
  assert(ROLE_PERMISSIONS.superadmin.length === 13, 'Superadmin possui todas as 13 permissões canônicas');
  assert(ROLE_PERMISSIONS.tenant_admin.length === 13, 'Tenant Admin possui todas as 13 permissões canônicas');
  assert(hasPermission('pastor', null, 'manage:sermons') === true, 'Pastor possui permissão manage:sermons');
  assert(hasPermission('editor', null, 'manage:users') === false, 'Editor NÃO possui permissão manage:users');
  assert(hasPermission('media_volunteer', null, 'manage:media') === true, 'Voluntário possui manage:media');
  assert(hasPermission('media_volunteer', null, 'manage:themes') === false, 'Voluntário NÃO possui manage:themes');

  // -------------------------------------------------------------
  // CENÁRIO H: ISOLAMENTO MULTI-TENANT E PREVENÇÃO DE IDOR
  // -------------------------------------------------------------
  console.log('\n🏢 [CENÁRIO H] Isolamento Multi-tenant e Prevenção de IDOR...');

  // 1. Usuário do Tenant A acessa normalmente seu tenant
  const tenantADataRes = await makeRequest({
    hostname: '127.0.0.1',
    port,
    path: '/api/v1/test/tenant-data',
    method: 'GET',
    headers: { Authorization: `Bearer ${adminAuth.accessToken}` },
  });
  assert(tenantADataRes.statusCode === 200, 'Usuário do tenant A consulta recursos do seu próprio tenant');
  assert(tenantADataRes.body.tenantId === 'tenant-igreja-central', 'Contexto do tenant configurado como tenant A');

  // 2. Tentativa de usurpação de tenant (IDOR via X-Tenant-ID header)
  const idorAttemptRes = await makeRequest({
    hostname: '127.0.0.1',
    port,
    path: '/api/v1/test/tenant-data',
    method: 'GET',
    headers: {
      Authorization: `Bearer ${adminAuth.accessToken}`,
      'X-Tenant-ID': 'tenant-outra-igreja', // Forçando tenant de outra igreja!
    },
  });

  assert(
    idorAttemptRes.statusCode === 403,
    'Tentativa de acessar outro tenant via header X-Tenant-ID é sumariamente rejeitada com HTTP 403'
  );

  // 3. Superadmin PODE alternar tenant via X-Tenant-ID
  const superAdminSwitchRes = await makeRequest({
    hostname: '127.0.0.1',
    port,
    path: '/api/v1/test/tenant-data',
    method: 'GET',
    headers: {
      Authorization: `Bearer ${superAdminAuth.accessToken}`,
      'X-Tenant-ID': 'tenant-outra-igreja',
    },
  });

  assert(superAdminSwitchRes.statusCode === 200, 'Superadmin tem autorização para alternar de tenant com header explícito');
  assert(
    superAdminSwitchRes.body.tenantId === 'tenant-outra-igreja',
    'Contexto do tenant refletiu o tenant informado pelo superadmin'
  );

  // -------------------------------------------------------------
  // CENÁRIO I: INTEGRAÇÃO COM CONTEXTO DE RLS
  // -------------------------------------------------------------
  console.log('\n🗄️ [CENÁRIO I] Integração com Contexto de RLS e Limpeza de Conexão...');

  // Mock de cliente PostgreSQL para auditoria de comandos RLS
  const executedSqls: string[] = [];
  const mockClient = {
    query: async (sql: string) => {
      executedSqls.push(sql);
      return { rows: [] };
    },
  };

  await setTenantContext(mockClient as any, 'tenant-igreja-central');
  assert(
    executedSqls.some((q) => q.includes("SET LOCAL app.current_tenant_id = 'tenant-igreja-central'")),
    'setTenantContext aplica "SET LOCAL app.current_tenant_id" para isolamento a nível de linha'
  );

  await clearTenantContext(mockClient as any);
  assert(
    executedSqls.some((q) => q.includes('RESET app.current_tenant_id')),
    'clearTenantContext executa "RESET app.current_tenant_id" prevenindo contaminação do pool'
  );

  let emptyTenantRlsFailed = false;
  try {
    await setTenantContext(mockClient as any, '');
  } catch {
    emptyTenantRlsFailed = true;
  }
  assert(emptyTenantRlsFailed, 'Definição de tenantContext com valor vazio é impedida');

  // -------------------------------------------------------------
  // CENÁRIO J: SEGURANÇA, ROBUSTEZ, CSRF E RATE LIMITING
  // -------------------------------------------------------------
  console.log('\n🛡️ [CENÁRIO J] Segurança, Robustez, CSRF e Rate Limiting...');

  // 1. Proteção CSRF em requisições mutativas autenticadas por cookie:
  // - Sem header CSRF -> 403 Forbidden
  const csrfBlockedRes = await makeRequest({
    hostname: '127.0.0.1',
    port,
    path: '/api/v1/test/csrf-protected-mutation',
    method: 'POST',
    headers: {
      Cookie: `cms_access_token=${validToken}; ${CSRF_COOKIE_NAME}=csrf-token-123456`,
      'Content-Type': 'application/json',
    },
  });

  assert(csrfBlockedRes.statusCode === 403, 'Requisição mutativa com cookie sem header CSRF é bloqueada com 403');

  // - Com header CSRF correto -> 200 OK
  const csrfAllowedRes = await makeRequest({
    hostname: '127.0.0.1',
    port,
    path: '/api/v1/test/csrf-protected-mutation',
    method: 'POST',
    headers: {
      Cookie: `cms_access_token=${validToken}; ${CSRF_COOKIE_NAME}=csrf-token-123456`,
      [CSRF_HEADER_NAME]: 'csrf-token-123456',
      'Content-Type': 'application/json',
    },
  });

  assert(csrfAllowedRes.statusCode === 200, 'Requisição com header CSRF correspondente ao cookie é autorizada');

  // - Requisição mutativa com Bearer Token (não requer CSRF token) -> 200 OK
  const bearerMutationRes = await makeRequest({
    hostname: '127.0.0.1',
    port,
    path: '/api/v1/test/csrf-protected-mutation',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${validToken}`,
      'Content-Type': 'application/json',
    },
  });

  assert(bearerMutationRes.statusCode === 200, 'Autenticação via Bearer token é imune a CSRF e permitida');

  // 2. Teste de Rate Limiting
  resetAllRateLimits();
  const testKey = '127.0.0.1:bruteforce@igreja.org.br';

  for (let i = 0; i < 10; i++) {
    recordFailedAttempt(testKey);
  }

  // 11ª tentativa deve ser bloqueada
  const rateLimitReq = await makeRequest(
    {
      hostname: '127.0.0.1',
      port,
      path: '/api/v1/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': '127.0.0.1',
      },
    },
    JSON.stringify({
      email: 'bruteforce@igreja.org.br',
      password: 'WrongPassword!',
    })
  );

  assert(rateLimitReq.statusCode === 429, 'Ataque de força bruta excede limite e retorna HTTP 429 Too Many Requests');
  assert(
    rateLimitReq.body.error?.code === 'TOO_MANY_REQUESTS',
    'Código de erro canônico TOO_MANY_REQUESTS retornado'
  );

  resetAllRateLimits();

  // Encerramento
  await new Promise<void>((resolve) => server.close(() => resolve()));

  console.log('\n===============================================================');
  console.log(` RESULTADO FINAL DA VALIDAÇÃO — FASE 58`);
  console.log(` Total de Asserções: ${passed + failed}`);
  console.log(` Sucessos: ${passed}`);
  console.log(` Falhas:   ${failed}`);
  console.log('===============================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runAuthTests().catch((err) => {
  console.error('Erro fatal na execução da suíte de testes da Fase 58:', err);
  process.exit(1);
});
