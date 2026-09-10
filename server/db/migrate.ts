/**
 * Script Seguro de Execução de Migrations (PostgreSQL / Drizzle ORM)
 * CMS Visual para Igrejas — Fundação da Persistência de Dados (Fase 57)
 */

import path from 'path';
import fs from 'fs';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { getDb, getPool, isDatabaseConfigured, closeDatabase } from './index.js';

export async function runMigrations(): Promise<{ success: boolean; message: string }> {
  if (!isDatabaseConfigured()) {
    console.log('⚠️ Banco de dados não configurado (DATABASE_URL ausente). Migrations ignoradas.');
    return {
      success: true,
      message: 'Banco de dados não configurado. Migração ignorada.',
    };
  }

  const db = getDb();
  const pool = getPool();

  if (!db || !pool) {
    console.error('❌ Falha ao conectar ao banco para aplicar migrations.');
    return {
      success: false,
      message: 'Falha ao conectar com o pool do PostgreSQL.',
    };
  }

  try {
    console.log('🚀 Iniciando execução das migrations Drizzle...');
    const migrationsFolder = path.resolve(process.cwd(), 'server/db/migrations');

    await migrate(db, { migrationsFolder });
    console.log('✅ Migrations Drizzle aplicadas com sucesso.');

    // Aplicar script de RLS complementar se existir
    const rlsScriptPath = path.join(migrationsFolder, '0001_rls_policies.sql');
    if (fs.existsSync(rlsScriptPath)) {
      console.log('🔒 Aplicando políticas de Row-Level Security (RLS)...');
      const rlsSql = fs.readFileSync(rlsScriptPath, 'utf-8');
      const client = await pool.connect();
      try {
        await client.query(rlsSql);
        console.log('✅ Políticas de Row-Level Security aplicadas com sucesso.');
      } finally {
        client.release();
      }
    }

    return {
      success: true,
      message: 'Todas as migrations foram aplicadas com sucesso.',
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('❌ Erro ao executar migrations:', errorMsg);
    return {
      success: false,
      message: errorMsg,
    };
  } finally {
    await closeDatabase();
  }
}

// Execução direta via CLI se chamado diretamente
if (process.argv[1]?.endsWith('migrate.ts') || process.argv[1]?.endsWith('migrate.js')) {
  runMigrations()
    .then((result) => {
      if (!result.success) {
        process.exit(1);
      }
      process.exit(0);
    })
    .catch((err) => {
      console.error('Falha fatal na migração:', err);
      process.exit(1);
    });
}
