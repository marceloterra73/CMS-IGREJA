import type { Request, Response, NextFunction } from 'express';
import { config } from '../config/index.js';

/**
 * Middleware de logging estruturado
 * Registra o ciclo de vida HTTP com método, caminho, status, duração e request ID.
 */
export function loggerMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Em ambiente de teste, não poluir a saída do terminal
  if (config.isTest) {
    return next();
  }

  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const reqId = req.id || '-';
    const status = res.statusCode;
    const method = req.method;
    const url = req.originalUrl || req.url;

    // Formato conciso e legível
    const logLine = `[API] [${reqId}] ${method} ${url} ${status} - ${duration}ms`;

    if (status >= 500) {
      console.error(logLine);
    } else if (status >= 400) {
      console.warn(logLine);
    } else {
      console.log(logLine);
    }
  });

  next();
}
