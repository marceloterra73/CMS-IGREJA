/**
 * Configuração centralizada do servidor HTTP
 * CMS Visual para Igrejas — Fases 56 e 57
 *
 * NOTA DE SEGURANÇA:
 * Não contém segredos, chaves JWT fixas ou senhas no código.
 * As variáveis de ambiente de persistência são lidas via process.env.
 */

export interface DatabaseConfig {
  url?: string;
  host?: string;
  port: number;
  user?: string;
  password?: string;
  database?: string;
  ssl: boolean;
  poolMin: number;
  poolMax: number;
}

export interface AuthConfig {
  jwtSecret: string;
  jwtRefreshSecret: string;
  jwtExpiresIn: string;
  jwtRefreshExpiresIn: string;
  cookieSecret: string;
  bcryptRounds: number;
}

export interface ServerConfig {
  port: number;
  host: string;
  nodeEnv: string;
  isProduction: boolean;
  isTest: boolean;
  apiVersion: string;
  database: DatabaseConfig;
  auth: AuthConfig;
}

export const config: ServerConfig = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3001,
  host: process.env.HOST || '0.0.0.0',
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  apiVersion: 'v1',
  database: {
    url: process.env.DATABASE_URL,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl: process.env.DATABASE_SSL === 'true',
    poolMin: process.env.DATABASE_POOL_MIN ? parseInt(process.env.DATABASE_POOL_MIN, 10) : 2,
    poolMax: process.env.DATABASE_POOL_MAX ? parseInt(process.env.DATABASE_POOL_MAX, 10) : 10,
  },
  auth: {
    jwtSecret:
      process.env.JWT_SECRET ||
      (process.env.NODE_ENV === 'production'
        ? ''
        : 'cms-igrejas-dev-jwt-secret-min-32-chars-long-secure!'),
    jwtRefreshSecret:
      process.env.JWT_REFRESH_SECRET ||
      (process.env.NODE_ENV === 'production'
        ? ''
        : 'cms-igrejas-dev-refresh-secret-min-32-chars-long-secure!'),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    cookieSecret:
      process.env.COOKIE_SECRET ||
      (process.env.NODE_ENV === 'production' ? '' : 'cms-igrejas-dev-cookie-secret'),
    bcryptRounds: 10,
  },
};

/**
 * Valida os requisitos mínimos de segurança para execução em ambiente de produção (Fase 62 - Hardening).
 * Retorna lista de problemas encontrados para auditoria proativa.
 */
export function validateProductionConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (config.isProduction) {
    if (!config.auth.jwtSecret || config.auth.jwtSecret.length < 32) {
      errors.push('JWT_SECRET ausente ou possui menos de 32 caracteres em ambiente de produção.');
    }
    if (!config.auth.jwtRefreshSecret || config.auth.jwtRefreshSecret.length < 32) {
      errors.push('JWT_REFRESH_SECRET ausente ou possui menos de 32 caracteres em ambiente de produção.');
    }
    if (!config.auth.cookieSecret || config.auth.cookieSecret.length < 32) {
      errors.push('COOKIE_SECRET ausente ou possui menos de 32 caracteres em ambiente de produção.');
    }
    if (!config.database.url && !config.database.host) {
      errors.push('Configuração de conexão PostgreSQL (DATABASE_URL) não definida para produção.');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
