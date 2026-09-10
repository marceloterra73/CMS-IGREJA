import type { Request, Response, NextFunction } from 'express';
import { ApiError, type ApiErrorResponse } from '../errors/apiError.js';
import { config } from '../config/index.js';

/**
 * Middleware de tratamento global de erros da API
 * Garante que 100% dos erros retornem o envelope canônico definido na Fase 55.
 */
export function errorHandlerMiddleware(
  err: Error | ApiError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  const requestId = req.id || `req_${Date.now()}`;
  const timestamp = new Date().toISOString();

  if (err instanceof ApiError) {
    const errorResponse: ApiErrorResponse = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
        requestId,
        timestamp,
      },
    };

    res.status(err.statusCode).json(errorResponse);
    return;
  }

  // Erro não tratado (500 Internal Server Error)
  if (!config.isTest) {
    console.error(`[API Error] [${requestId}]`, err);
  }

  const internalErrorResponse: ApiErrorResponse = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: config.isProduction
        ? 'Ocorreu um erro interno no servidor.'
        : err.message || 'Erro interno no servidor.',
      requestId,
      timestamp,
    },
  };

  res.status(500).json(internalErrorResponse);
}
