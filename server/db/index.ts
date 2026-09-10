/**
 * Ponto central de conexão e persistência com PostgreSQL (Drizzle ORM)
 * CMS Visual para Igrejas — Fundação da Persistência de Dados (Fase 57)
 *
 * NOTA DE SEGURANÇA E RESILIÊNCIA:
 * - Implementa inicialização sob demanda (Lazy Initialization).
 * - O boot do servidor HTTP NÃO quebra caso DATABASE_URL não esteja configurado
 *   ou o banco de dados esteja indisponível.
 */

import pg from 'pg';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { config } from '../config/index.js';
import * as schema from './schema/index.js';

const { Pool } = pg;

export type AppDatabase = NodePgDatabase<typeof schema>;

let poolInstance: pg.Pool | null = null;
let dbInstance: AppDatabase | null = null;
let isInitializing = false;

/**
 * Verifica se os parâmetros mínimos de conexão com PostgreSQL estão definidos.
 */
export function isDatabaseConfigured(): boolean {
  return Boolean(
    config.database.url ||
      (config.database.host && config.database.database && config.database.user)
  );
}

/**
 * Cria ou retorna o pool de conexões do PostgreSQL (Lazy Initialization).
 */
export function getPool(): pg.Pool | null {
  if (poolInstance) {
    return poolInstance;
  }

  if (!isDatabaseConfigured()) {
    return null;
  }

  if (isInitializing) {
    return null;
  }

  try {
    isInitializing = true;
    const poolConfig: pg.PoolConfig = config.database.url
      ? {
          connectionString: config.database.url,
          min: config.database.poolMin,
          max: config.database.poolMax,
          ssl: config.database.ssl ? { rejectUnauthorized: false } : false,
        }
      : {
          host: config.database.host,
          port: config.database.port,
          user: config.database.user,
          password: config.database.password,
          database: config.database.database,
          min: config.database.poolMin,
          max: config.database.poolMax,
          ssl: config.database.ssl ? { rejectUnauthorized: false } : false,
        };

    poolInstance = new Pool(poolConfig);

    poolInstance.on('error', (err) => {
      console.error('Erro inesperado no pool de conexões do PostgreSQL:', err.message);
    });

    return poolInstance;
  } catch (error) {
    console.warn('Não foi possível inicializar o pool do PostgreSQL:', error);
    return null;
  } finally {
    isInitializing = false;
  }
}

/**
 * Retorna a instância tipada do Drizzle ORM conectada ao pool.
 */
export function getDb(): AppDatabase | null {
  if (dbInstance) {
    return dbInstance;
  }

  const pool = getPool();
  if (!pool) {
    return null;
  }

  try {
    dbInstance = drizzle(pool, { schema });
    return dbInstance;
  } catch (error) {
    console.warn('Não foi possível inicializar a instância do Drizzle ORM:', error);
    return null;
  }
}

export interface DatabaseHealthResult {
  status: 'connected' | 'unconfigured' | 'error';
  latencyMs?: number;
  message?: string;
}

/**
 * Realiza verificação ativa da saúde da conexão com o banco de dados.
 */
export async function checkDatabaseHealth(): Promise<DatabaseHealthResult> {
  if (!isDatabaseConfigured()) {
    return {
      status: 'unconfigured',
      message: 'Variável DATABASE_URL não configurada no ambiente.',
    };
  }

  const pool = getPool();
  if (!pool) {
    return {
      status: 'error',
      message: 'Falha ao instanciar o pool de conexões.',
    };
  }

  const start = Date.now();
  try {
    const client = await pool.connect();
    try {
      await client.query('SELECT 1 as health_check;');
      const latencyMs = Date.now() - start;
      return {
        status: 'connected',
        latencyMs,
      };
    } finally {
      client.release();
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      status: 'error',
      message: `Erro na verificação de conectividade do banco: ${message}`,
    };
  }
}

/**
 * Encerra o pool de conexões com o PostgreSQL (Graceful Shutdown).
 */
export async function closeDatabase(): Promise<void> {
  if (poolInstance) {
    try {
      await poolInstance.end();
      poolInstance = null;
      dbInstance = null;
    } catch (err) {
      console.error('Erro ao fechar pool do PostgreSQL:', err);
    }
  }
}

export * from './schema/index.js';
export * from './rls.js';
