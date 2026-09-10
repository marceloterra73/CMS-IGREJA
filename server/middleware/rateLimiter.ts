import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors/apiError.js';
import { config } from '../config/index.js';

interface AttemptRecord {
  count: number;
  resetAt: number;
}

const attempts = new Map<string, AttemptRecord>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutos
const MAX_ATTEMPTS = 10; // Máximo de tentativas no intervalo

export function recordFailedAttempt(key: string): void {
  const now = Date.now();

  // Limpeza proativa de registros expirados para evitar vazamento de memória (Fase 62)
  if (attempts.size > 1000) {
    for (const [k, rec] of attempts.entries()) {
      if (now > rec.resetAt) {
        attempts.delete(k);
      }
    }
  }

  const existing = attempts.get(key);

  if (!existing || now > existing.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    existing.count += 1;
  }
}

export function clearAttempts(key: string): void {
  attempts.delete(key);
}

export function resetAllRateLimits(): void {
  attempts.clear();
}

export function loginRateLimiterMiddleware(req: Request, _res: Response, next: NextFunction): void {
  // Em ambiente de teste unitário estrito, permite desvio se configurado
  if (config.isTest && req.headers['x-skip-rate-limit'] === 'true') {
    return next();
  }

  // Extração robusta e segura de IP (Fase 62)
  const forwarded = req.headers['x-forwarded-for'];
  const clientIp =
    typeof forwarded === 'string'
      ? forwarded.split(',')[0].trim()
      : req.socket.remoteAddress || 'unknown';

  const email = typeof req.body?.email === 'string' ? req.body.email.toLowerCase().trim() : '';
  const key = `${clientIp}:${email}`;

  const record = attempts.get(key);
  const now = Date.now();

  if (record) {
    if (now > record.resetAt) {
      attempts.delete(key);
    } else if (record.count >= MAX_ATTEMPTS) {
      const remainingSeconds = Math.ceil((record.resetAt - now) / 1000);
      return next(
        ApiError.tooManyRequests(
          `Muitas tentativas inválidas de acesso. Por favor, aguarde ${remainingSeconds} segundos antes de tentar novamente.`
        )
      );
    }
  }

  return next();
}
