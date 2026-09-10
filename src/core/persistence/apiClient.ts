/**
 * CMS CORE — API CLIENT HTTP (FASE 59)
 * Cliente HTTP leve, isolado e seguro para comunicação com a API REST (/api/v1).
 *
 * Responsabilidade Arquitetural:
 * - Comunicação HTTP via Fetch API nativa e AbortController para cancelamento/timeout.
 * - Tratamento estrito de respostas HTTP 2xx, 4xx e 5xx.
 * - Preservação fiel do envelope canônico de erro da API (code, message, details, requestId, timestamp).
 * - Suporte automático a cookies HttpOnly (credentials: 'include').
 * - Proteção anti-CSRF com envio automático do cabeçalho x-csrf-token para métodos mutativos.
 * - Higienização estrita de logs: NUNCA expor tokens, senhas ou segredos.
 * - Sem qualquer dependência de React ou UI.
 */

export interface CanonicalErrorPayload {
  code: string;
  message: string;
  details?: unknown;
  requestId?: string;
  timestamp?: string;
}

export interface ApiRawResponse<T = unknown> {
  success?: boolean;
  data?: T;
  error?: CanonicalErrorPayload;
  [key: string]: unknown;
}

export class ApiClientError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: unknown;
  public readonly requestId?: string;
  public readonly timestamp?: string;

  constructor(
    status: number,
    code: string,
    message: string,
    details?: unknown,
    requestId?: string,
    timestamp?: string
  ) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.requestId = requestId;
    this.timestamp = timestamp || new Date().toISOString();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiClientError);
    }
  }

  /**
   * Representação em string segura que não vaza informações confidenciais
   */
  public override toString(): string {
    const reqInfo = this.requestId ? ` [Req: ${this.requestId}]` : '';
    return `ApiClientError(${this.status} ${this.code})${reqInfo}: ${this.message}`;
  }
}

export interface ApiClientConfig {
  baseUrl?: string;
  defaultTimeoutMs?: number;
  csrfCookieName?: string;
  csrfHeaderName?: string;
  csrfToken?: string;
  authToken?: string;
  defaultHeaders?: Record<string, string>;
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD';
  headers?: Record<string, string>;
  body?: unknown;
  timeoutMs?: number;
  signal?: AbortSignal;
  authToken?: string;
  csrfToken?: string;
  tenantId?: string;
}

export interface ApiResponse<T> {
  status: number;
  headers: Headers;
  data: T;
  requestId?: string;
}

/**
 * Lê com segurança o valor de um cookie específico no ambiente do navegador
 */
function getCookieValue(name: string): string | null {
  try {
    if (typeof document === 'undefined' || !document.cookie) {
      return null;
    }
    const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

export class ApiClient {
  private readonly baseUrl: string;
  private readonly defaultTimeoutMs: number;
  private readonly csrfCookieName: string;
  private readonly csrfHeaderName: string;
  private csrfTokenOverride?: string;
  private authTokenOverride?: string;
  private readonly defaultHeaders: Record<string, string>;

  constructor(config: ApiClientConfig = {}) {
    this.baseUrl = (config.baseUrl || '/api/v1').replace(/\/+$/, '');
    this.defaultTimeoutMs = config.defaultTimeoutMs || 10000;
    this.csrfCookieName = config.csrfCookieName || 'cms_csrf_token';
    this.csrfHeaderName = config.csrfHeaderName || 'x-csrf-token';
    this.csrfTokenOverride = config.csrfToken;
    this.authTokenOverride = config.authToken;
    this.defaultHeaders = config.defaultHeaders || {};
  }

  public setAuthToken(token: string | undefined): void {
    this.authTokenOverride = token;
  }

  public setCsrfToken(token: string | undefined): void {
    this.csrfTokenOverride = token;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Executa uma requisição HTTP genérica com timeout, tratamento de erros e envelope canônico
   */
  public async request<T = unknown>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const url = `${this.baseUrl}${cleanPath}`;
    const method = options.method || 'GET';
    const isMutative = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase());

    // Configuração do AbortController para timeout
    const timeoutMs = options.timeoutMs || this.defaultTimeoutMs;
    const controller = new AbortController();
    let timeoutId: any = null;

    if (options.signal) {
      options.signal.addEventListener('abort', () => controller.abort());
    }

    if (timeoutMs > 0) {
      timeoutId = setTimeout(() => {
        controller.abort();
      }, timeoutMs);
    }

    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...this.defaultHeaders,
      ...options.headers,
    };

    // Autenticação via Bearer token se configurado
    const token = options.authToken || this.authTokenOverride;
    if (token && !headers['Authorization'] && !headers['authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Contexto de tenant se fornecido
    if (options.tenantId && !headers['X-Tenant-ID'] && !headers['x-tenant-id']) {
      headers['X-Tenant-ID'] = options.tenantId;
    }

    // Proteção CSRF para requisições mutativas
    if (isMutative) {
      const csrfToken = options.csrfToken || this.csrfTokenOverride || getCookieValue(this.csrfCookieName);
      if (csrfToken && !headers[this.csrfHeaderName]) {
        headers[this.csrfHeaderName] = csrfToken;
      }
    }

    let body: string | undefined = undefined;
    if (options.body !== undefined && options.body !== null) {
      if (typeof options.body === 'string') {
        try {
          JSON.parse(options.body);
          body = options.body;
        } catch {
          body = JSON.stringify(options.body);
        }
      } else {
        body = JSON.stringify(options.body);
      }
      if (!headers['Content-Type'] && !headers['content-type']) {
        headers['Content-Type'] = 'application/json';
      }
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        body,
        signal: controller.signal,
        credentials: 'include', // Transmite cookies HttpOnly automaticamente
      });

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const requestId = response.headers.get('x-request-id') || undefined;

      // Tratamento de resposta sem corpo (ex: 204 No Content ou HEAD)
      if (response.status === 204 || method === 'HEAD') {
        return {
          status: response.status,
          headers: response.headers,
          data: null as unknown as T,
          requestId,
        };
      }

      const text = await response.text();
      let parsedData: any = null;

      if (text) {
        try {
          parsedData = JSON.parse(text);
        } catch {
          parsedData = text;
        }
      }

      // Verificação de sucesso HTTP (2xx)
      if (response.ok) {
        // Se a resposta utiliza envelope { success: true, data: ... }, expõe data se disponível
        let finalData = parsedData;
        if (parsedData && typeof parsedData === 'object' && 'success' in parsedData) {
          if (parsedData.success === false && parsedData.error) {
            throw new ApiClientError(
              response.status,
              parsedData.error.code || 'API_ERROR',
              parsedData.error.message || 'Erro reportado pela API.',
              parsedData.error.details,
              parsedData.error.requestId || requestId,
              parsedData.error.timestamp
            );
          }
          if ('data' in parsedData) {
            finalData = parsedData.data;
          }
        }

        return {
          status: response.status,
          headers: response.headers,
          data: finalData as T,
          requestId,
        };
      }

      // Tratamento de falha HTTP (4xx / 5xx)
      let errorCode = `HTTP_${response.status}`;
      let errorMessage = `Erro HTTP ${response.status} na rota ${cleanPath}`;
      let errorDetails: unknown = undefined;
      let errorTimestamp: string | undefined = undefined;
      let errorRequestId = requestId;

      if (parsedData && typeof parsedData === 'object' && parsedData.error) {
        const errObj = parsedData.error;
        errorCode = errObj.code || errorCode;
        errorMessage = errObj.message || errorMessage;
        errorDetails = errObj.details;
        errorTimestamp = errObj.timestamp;
        errorRequestId = errObj.requestId || requestId;
      } else if (parsedData && typeof parsedData === 'object' && parsedData.message) {
        errorMessage = String(parsedData.message);
      }

      throw new ApiClientError(
        response.status,
        errorCode,
        errorMessage,
        errorDetails,
        errorRequestId,
        errorTimestamp
      );
    } catch (err: any) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (err instanceof ApiClientError) {
        throw err;
      }

      if (err.name === 'AbortError' || err.code === 'ABORT_ERR') {
        throw new ApiClientError(
          408,
          'REQUEST_TIMEOUT',
          `A requisição para ${cleanPath} excedeu o limite de tempo (${timeoutMs}ms).`,
          undefined,
          undefined,
          new Date().toISOString()
        );
      }

      throw new ApiClientError(
        0,
        'NETWORK_ERROR',
        `Falha de rede ao conectar-se a ${cleanPath}: ${err.message || 'Conexão indisponível'}.`,
        undefined,
        undefined,
        new Date().toISOString()
      );
    }
  }

  public async get<T>(path: string, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  public async post<T>(path: string, body?: unknown, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...options, method: 'POST', body });
  }

  public async put<T>(path: string, body?: unknown, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...options, method: 'PUT', body });
  }

  public async delete<T>(path: string, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }

  public async head(path: string, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<ApiResponse<null>> {
    return this.request<null>(path, { ...options, method: 'HEAD' });
  }
}
