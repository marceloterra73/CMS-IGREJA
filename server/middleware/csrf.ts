import type { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { ACCESS_COOKIE_NAME } from '../auth/cookies.js';
import { ApiError } from '../errors/apiError.js';
import { config } from '../config/index.js';

/**
 * Middleware de Proteção CSRF (Fase 58)
 *
 * MECANISMO ESCOLHIDO:
 * Double Submit Token & Custom Header Pattern (Recomendação OWASP).
 *
 * REGRAS DE ATUAÇÃO:
 * 1. Métodos idempotentes / de leitura (GET, HEAD, OPTIONS) são isentos de verificação CSRF.
 * 2. Requisições autenticadas via header "Authorization: Bearer ..." são inerentemente
 *    imunes a ataques de CSRF em navegadores (pois o navegador não injeta headers customizados
 *    em requisições cross-site de formulários ou tags HTML).
 * 3. Requisições públicas (como login inicial POST /api/v1/auth/login) são isentas.
 * 4. Requisições autenticadas por Cookies de Sessão executando mutações de estado
 *    (POST, PUT, PATCH, DELETE) DEVEM enviar o header "X-CSRF-Token" (correspondente
 *    ao cookie legível "cms_csrf_token") ou o header padrão "X-Requested-With".
 */

export const CSRF_COOKIE_NAME = 'cms_csrf_token';
export const CSRF_HEADER_NAME = 'x-csrf-token';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const PUBLIC_AUTH_PATHS = new Set([
  '/api/v1/auth/login',
  '/api/v1/health',
  '/api/v1/status',
]);

export function generateCsrfToken(): string {
  return crypto.randomBytes(24).toString('hex');
}

export function setCsrfCookie(res: Response, token?: string): string {
  const csrfToken = token || generateCsrfToken();
  res.cookie(CSRF_COOKIE_NAME, csrfToken, {
    httpOnly: false, // O JavaScript do frontend precisa ler este valor para enviar no header X-CSRF-Token
    secure: config.isProduction,
    sameSite: 'strict',
    path: '/',
  });
  return csrfToken;
}

export function csrfProtectionMiddleware(req: Request, _res: Response, next: NextFunction): void {
  // Métodos seguros não realizam mutação
  if (SAFE_METHODS.has(req.method)) {
    return next();
  }

  // Rotas públicas que não utilizam sessão prévia
  const path = req.baseUrl ? `${req.baseUrl}${req.path}` : req.path;
  if (PUBLIC_AUTH_PATHS.has(path) || path.endsWith('/auth/login') || path.endsWith('/health') || path.endsWith('/status')) {
    return next();
  }

  // Se a requisição autentica explicitamente por Bearer Token no header, não é vulnerável a CSRF por cookie
  const authHeader = req.headers.authorization;
  if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    return next();
  }

  // Se não há cookie de autenticação, não há sessão de cookie para sofrer ataque CSRF
  const cookies = req.cookies as Record<string, string> | undefined;
  if (!cookies || !cookies[ACCESS_COOKIE_NAME]) {
    return next();
  }

  // Requisição autenticada por cookie realizando mutação: valida header CSRF
  const headerToken = (req.headers[CSRF_HEADER_NAME] as string | undefined) ||
    (req.headers['x-requested-with'] as string | undefined);

  if (!headerToken) {
    return next(
      ApiError.forbidden(
        'Falha de validação CSRF: requisição de mutação autenticada por cookie requer o header "X-CSRF-Token" ou "X-Requested-With".'
      )
    );
  }

  const cookieCsrf = cookies[CSRF_COOKIE_NAME];
  if (cookieCsrf && headerToken !== cookieCsrf && headerToken !== 'XMLHttpRequest') {
    return next(ApiError.forbidden('Falha de validação CSRF: token CSRF não corresponde ao cookie emitido.'));
  }

  return next();
}
