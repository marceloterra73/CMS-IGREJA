/**
 * Modelo padronizado de erro da API
 * CMS Visual para Igrejas — Fase 55 & Fase 56
 *
 * Formato canônico definido na especificação arquitetural:
 * {
 *   "success": false,
 *   "error": {
 *     "code": string,
 *     "message": string,
 *     "details"?: unknown,
 *     "requestId": string,
 *     "timestamp": string
 *   }
 * }
 */

export interface CanonicalErrorPayload {
  code: string;
  message: string;
  details?: unknown;
  requestId: string;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  error: CanonicalErrorPayload;
}

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(statusCode: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    // Preserva o stack trace nativo
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  static badRequest(message: string, code: string = 'BAD_REQUEST', details?: unknown): ApiError {
    return new ApiError(400, code, message, details);
  }

  static unauthorized(message: string = 'Não autenticado', code: string = 'UNAUTHENTICATED'): ApiError {
    return new ApiError(401, code, message);
  }

  static forbidden(message: string = 'Acesso negado', code: string = 'FORBIDDEN'): ApiError {
    return new ApiError(403, code, message);
  }

  static notFound(message: string = 'Recurso não encontrado', code: string = 'NOT_FOUND'): ApiError {
    return new ApiError(404, code, message);
  }

  static conflict(message: string, code: string = 'CONFLICT'): ApiError {
    return new ApiError(409, code, message);
  }

  static unprocessableEntity(message: string, details?: unknown, code: string = 'VALIDATION_FAILED'): ApiError {
    return new ApiError(422, code, message, details);
  }

  static tooManyRequests(message: string = 'Muitas requisições', code: string = 'TOO_MANY_REQUESTS'): ApiError {
    return new ApiError(429, code, message);
  }

  static internal(message: string = 'Erro interno do servidor', code: string = 'INTERNAL_SERVER_ERROR'): ApiError {
    return new ApiError(500, code, message);
  }
}
