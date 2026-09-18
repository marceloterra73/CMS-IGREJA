/**
 * Modelo padronizado de erro da API
 * CMS Visual para Igrejas — Fase 55 & Fase 56
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
    if (Error.captureStackTrace) Error.captureStackTrace(this, ApiError);
  }

  static badRequest(message: string, code = 'BAD_REQUEST', details?: unknown) { return new ApiError(400, code, message, details); }
  static unauthorized(message = 'Não autenticado', code = 'UNAUTHENTICATED') { return new ApiError(401, code, message); }
  static forbidden(message = 'Acesso negado', code = 'FORBIDDEN') { return new ApiError(403, code, message); }
  static notFound(message = 'Recurso não encontrado', code = 'NOT_FOUND') { return new ApiError(404, code, message); }
  static conflict(message: string, code = 'CONFLICT') { return new ApiError(409, code, message); }
  static unprocessableEntity(message: string, details?: unknown, code = 'VALIDATION_FAILED') { return new ApiError(422, code, message, details); }
  static tooManyRequests(message = 'Muitas requisições', code = 'TOO_MANY_REQUESTS') { return new ApiError(429, code, message); }
  static internal(message = 'Erro interno do servidor', code = 'INTERNAL_SERVER_ERROR') { return new ApiError(500, code, message); }
  static serviceUnavailable(message = 'Serviço indisponível', code = 'SERVICE_UNAVAILABLE') { return new ApiError(503, code, message); }
}
