import type { Request, Response, CookieOptions } from 'express';
import { config } from '../config/index.js';

export const ACCESS_COOKIE_NAME = 'cms_access_token';
export const REFRESH_COOKIE_NAME = 'cms_refresh_token';

const BASE_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: config.isProduction,
  sameSite: 'strict',
  path: '/',
};

export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken?: string
): void {
  // 15 minutos em ms
  res.cookie(ACCESS_COOKIE_NAME, accessToken, {
    ...BASE_COOKIE_OPTIONS,
    maxAge: 15 * 60 * 1000,
  });

  if (refreshToken) {
    // 7 dias em ms
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      ...BASE_COOKIE_OPTIONS,
      path: '/api/v1/auth', // Limita o refresh token ao escopo de autenticação
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}

export function clearAuthCookies(res: Response): void {
  res.clearCookie(ACCESS_COOKIE_NAME, {
    ...BASE_COOKIE_OPTIONS,
  });
  res.clearCookie(REFRESH_COOKIE_NAME, {
    ...BASE_COOKIE_OPTIONS,
    path: '/api/v1/auth',
  });
}

export function extractAccessToken(req: Request): string | null {
  // 1. Header Authorization: Bearer <token>
  const authHeader = req.headers.authorization;
  if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    if (token) return token;
  }

  // 2. Cookie HTTP-Only
  const cookies = req.cookies as Record<string, string> | undefined;
  if (cookies && cookies[ACCESS_COOKIE_NAME]) {
    return cookies[ACCESS_COOKIE_NAME];
  }

  return null;
}

export function extractRefreshToken(req: Request): string | null {
  // 1. Body explícito (opcional para clientes sem cookie)
  if (req.body && typeof req.body.refreshToken === 'string') {
    return req.body.refreshToken;
  }

  // 2. Cookie HTTP-Only
  const cookies = req.cookies as Record<string, string> | undefined;
  if (cookies && cookies[REFRESH_COOKIE_NAME]) {
    return cookies[REFRESH_COOKIE_NAME];
  }

  return null;
}
