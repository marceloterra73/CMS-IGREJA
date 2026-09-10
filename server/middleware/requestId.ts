import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

declare global {
  namespace Express {
    interface Request {
      id?: string;
    }
  }
}

/**
 * Middleware para identificação e rastreamento de requisições
 * Adiciona um identificador único (X-Request-Id) ao ciclo de vida da requisição.
 */
export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const incomingHeader = req.header('x-request-id');

  // Validação do request ID fornecido pelo cliente (alfanumérico, hífens, max 64 caracteres)
  let requestId: string;
  if (incomingHeader && /^[a-zA-Z0-9_-]{1,64}$/.test(incomingHeader)) {
    requestId = incomingHeader;
  } else {
    try {
      requestId = `req_${randomUUID()}`;
    } catch {
      requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }
  }

  req.id = requestId;
  res.setHeader('X-Request-Id', requestId);

  next();
}
