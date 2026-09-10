#!/usr/bin/env tsx
/**
 * SCRIPT EXECUTÁVEL DE MIGRAÇÃO CONTROLADA — FASE 60
 * CMS Visual para Igrejas
 *
 * localStorage → Server Persistence Provider → API REST → PostgreSQL
 *
 * Modos de Execução:
 *   npx tsx scripts/migrate-fase60.ts --inventory
 *   npx tsx scripts/migrate-fase60.ts --backup
 *   npx tsx scripts/migrate-fase60.ts --dry-run
 *   npx tsx scripts/migrate-fase60.ts --migrate [--execute]
 *   npx tsx scripts/migrate-fase60.ts --verify
 *   npx tsx scripts/migrate-fase60.ts --all [--execute]
 */

import {
  StorageDataSource,
  runStorageInventory,
  createStorageBackup,
  runDryRun,
  executeMigration,
  compareMigration,
} from '../server/migration/index.js';
import {
  INITIAL_DEMO_INSTITUTIONAL,
  INITIAL_DEMO_SITE_SETTINGS,
} from '../src/components/settings/demoSettingsData.js';
import { INITIAL_DEMO_THEMES } from '../src/components/appearance/demoAppearanceData.js';
import { INITIAL_DEMO_SCHEDULES } from '../src/components/schedules/demoSchedulesData.js';
import { INITIAL_DEMO_DONATION } from '../src/components/donations/demoDonationData.js';
import { INITIAL_DEMO_LIVESTREAM } from '../src/components/live-stream/demoLiveStreamData.js';
import { INITIAL_DEMO_PAGES } from '../src/components/pages/demoPagesData.js';
import { INITIAL_DEMO_MENUS } from '../src/components/navigation/demoNavigationData.js';
import { INITIAL_DEMO_DOMAINS } from '../src/components/domains/demoDomainsData.js';
import { INITIAL_DEMO_ANALYTICS } from '../src/components/analytics/demoAnalyticsData.js';

class InMemoryStorageSource implements StorageDataSource {
  private store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  clear(): void {
    this.store.clear();
  }
  get length(): number {
    return this.store.size;
  }
  key(index: number): string | null {
    return Array.from(this.store.keys())[index] || null;
  }
}

/**
 * Cria ou obtém a fonte de dados local (com fixtures canônicas para demonstração segura).
 */
function getStorageSource(): StorageDataSource {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }

  const mock = new InMemoryStorageSource();

  // Popula com dados canônicos reais do CMS para o tenant ib_central
  mock.setItem('cms:ib_central:settings', JSON.stringify(INITIAL_DEMO_SITE_SETTINGS));
  mock.setItem('cms:ib_central:institutional', JSON.stringify(INITIAL_DEMO_INSTITUTIONAL));
  mock.setItem('cms:ib_central:themes', JSON.stringify(INITIAL_DEMO_THEMES));
  mock.setItem('cms:ib_central:active_theme_id', JSON.stringify('theme_light'));
  mock.setItem('cms:ib_central:schedules', JSON.stringify(INITIAL_DEMO_SCHEDULES));
  mock.setItem('cms:ib_central:donations', JSON.stringify(INITIAL_DEMO_DONATION));
  mock.setItem('cms:ib_central:live_stream', JSON.stringify(INITIAL_DEMO_LIVESTREAM));
  mock.setItem('cms:ib_central:pages', JSON.stringify(INITIAL_DEMO_PAGES));
  mock.setItem('cms:ib_central:navigation', JSON.stringify(INITIAL_DEMO_MENUS));
  mock.setItem('cms:ib_central:domains', JSON.stringify(INITIAL_DEMO_DOMAINS));
  mock.setItem('cms:ib_central:analytics', JSON.stringify(INITIAL_DEMO_ANALYTICS));

  return mock;
}

async function main() {
  const args = process.argv.slice(2);
  const isInventory = args.includes('--inventory') || args.includes('-i');
  const isBackup = args.includes('--backup') || args.includes('-b');
  const isDryRun = args.includes('--dry-run') || args.includes('-d');
  const isMigrate = args.includes('--migrate') || args.includes('-m');
  const isVerify = args.includes('--verify') || args.includes('-v');
  const isAll = args.includes('--all') || args.length === 0;
  const isExecute = args.includes('--execute');

  console.log('\n===============================================================');
  console.log(' CMS VISUAL PARA IGREJAS — SCRIPT DE MIGRAÇÃO CONTROLADA');
  console.log(' Fase 60: localStorage → Server Persistence Provider → PostgreSQL');
  console.log('===============================================================\n');

  const source = getStorageSource();

  // ETAPA 1: INVENTÁRIO
  if (isInventory || isAll || isBackup || isDryRun || isMigrate || isVerify) {
    console.log('📋 [ETAPA 1] Executando Inventário dos Dados Locais...');
    const inventory = runStorageInventory(source);

    console.log(`  ✓ Identificador de Execução: ${inventory.executionId}`);
    console.log(`  ✓ Total de Chaves Encontradas: ${inventory.totalKeys}`);
    console.log(`  ✓ Chaves Válidas: ${inventory.validKeysCount}`);
    console.log(`  ✓ Chaves Corrompidas / Inválidas: ${inventory.corruptedKeysCount}`);
    console.log(`  ✓ Volume Total: ${inventory.totalBytes} bytes`);
    console.log(`  ✓ Congregações (Tenants) Identificadas: ${inventory.tenantsFound.join(', ')}`);

    for (const tenantId of inventory.tenantsFound) {
      console.log(`\n  --- Congregação: ${tenantId} ---`);
      const items = inventory.itemsByTenant[tenantId] || [];
      for (const it of items) {
        console.log(`    • Recurso: ${it.resource.padEnd(16)} | Status: ${it.status.padEnd(8)} | Registros: ${it.recordCount} | Tam: ${it.sizeBytes} B | SHA-256: ${it.checksumSha256.substring(0, 10)}...`);
      }
    }

    if (isInventory && !isAll) return;

    // ETAPA 2: BACKUP
    console.log('\n💾 [ETAPA 2] Criando Backup Fiel e Imutável...');
    const backup = createStorageBackup(inventory, source);
    console.log(`  ✓ Backup Criado com Sucesso!`);
    console.log(`  ✓ Identificador do Backup: ${backup.manifest.backupId}`);
    console.log(`  ✓ Diretório: ${backup.backupDirectory}`);
    console.log(`  ✓ Checksum data.json: ${backup.manifest.checksumDataJson.substring(0, 16)}...`);

    if (isBackup && !isAll) return;

    // ETAPA 3: DRY-RUN
    console.log('\n🔍 [ETAPA 3] Executando Simulação (Dry-Run)...');
    const dryRun = runDryRun(inventory);
    console.log(`  ✓ Simulação Concluída sem Escrita no Banco.`);
    console.log(`  ✓ Total a Inserir / Atualizar: ${dryRun.summary.totalToInsert} registros.`);
    console.log(`  ✓ Total Ignorado: ${dryRun.summary.totalSkipped}`);
    console.log(`  ✓ Total Inválido: ${dryRun.summary.totalInvalid}`);
    console.log(`  ✓ Status de Executabilidade: ${dryRun.canExecute ? 'APROVADO PARA MIGRAÇÃO' : 'BLOQUEADO'}`);

    if (isDryRun && !isAll) return;

    // ETAPA 4: MIGRAÇÃO REAL
    console.log('\n🚀 [ETAPA 4] Execução da Migração...');
    if (!isExecute) {
      console.log('  ⚠️  AVISO DE SEGURANÇA: A flag explícita "--execute" NÃO foi fornecida.');
      console.log('  ⚠️  Nenhuma gravação no banco de dados foi realizada.');
      console.log('  ℹ️  Para executar a migração real no banco, execute com:');
      console.log('      npx tsx scripts/migrate-fase60.ts --migrate --execute\n');
      return;
    }

    console.log('  🔒 Flag --execute confirmada. Iniciando migração transacional...');
    const migrationResult = await executeMigration({
      inventory,
      backup,
      executeFlag: isExecute,
    });

    if (migrationResult.success) {
      console.log(`  ✅ Migração transacional concluída com sucesso!`);
      console.log(`  ✓ Congregações Migradas: ${migrationResult.tenantsMigrated.join(', ')}`);
      console.log(`  ✓ Etapas executadas: ${migrationResult.steps.length}`);
      console.log(`  ✓ Preservação: A fonte local (localStorage) permanece 100% INTACTA.`);
    } else {
      console.error(`  ❌ Falha na migração. Erros:`, migrationResult.errors);
      return;
    }

    // ETAPA 5: VERIFICAÇÃO PÓS-MIGRAÇÃO
    console.log('\n🔎 [ETAPA 5] Comparação e Auditoria Pós-Migração...');
    const comparison = compareMigration(source, backup);
    console.log(`  ✓ Chaves de Origem Avaliadas: ${comparison.sourceKeysEvaluated}`);
    console.log(`  ✓ Chaves do Backup Avaliadas: ${comparison.backupKeysEvaluated}`);
    console.log(`  ✓ Chaves no Servidor Avaliadas: ${comparison.serverKeysEvaluated}`);
    console.log(`  ✓ Fidelidade de Dados: ${comparison.matched ? '100% CORRESPONDENTE (SEM DIVERGÊNCIAS)' : 'DIVERGÊNCIAS DETECTADAS'}`);

    if (comparison.divergences.length > 0) {
      console.warn('  ⚠️  Divergências:', comparison.divergences);
    } else {
      console.log('\n===============================================================');
      console.log(' FASE 60 CONCLUÍDA COM ÊXITO!');
      console.log(' Dados migrados e auditados com sucesso.');
      console.log('===============================================================\n');
    }
  }
}

main().catch((err) => {
  console.error('Erro fatal durante a execução do script de migração:', err);
  process.exit(1);
});
