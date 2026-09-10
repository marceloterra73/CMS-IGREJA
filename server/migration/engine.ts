/**
 * MOTOR DE MIGRAÇÃO CONTROLADA — FASE 60
 * CMS Visual para Igrejas
 *
 * Coordena os ciclos:
 * 1. Dry-Run (Simulação sem escrita)
 * 2. Migração Transacional (com flag obrigatória --execute)
 * 3. Comparação de integridade (Origem vs Backup vs Servidor)
 *
 * REGRAS FUNDAMENTAIS:
 * - A origem (armazenamento local) NUNCA é apagada.
 * - Falhas críticas realizam ROLLBACK da transação.
 * - O isolamento multi-tenant e o contexto RLS são aplicados a cada congregação.
 * - IDs canônicos são preservados.
 */

import crypto from 'crypto';
import {
  InventoryReport,
  BackupPackage,
  DryRunPlan,
  MigrationResult,
  MigrationStepResult,
  PostMigrationComparisonResult,
  StorageDataSource,
  TenantDryRunPlan,
  PlannedAction,
} from './types.js';
import { RESOURCE_MAPPINGS, getOrderedMigrationResources } from './mapper.js';
import { getDb } from '../db/index.js';
import { setTenantContext } from '../db/rls.js';
import * as schema from '../db/schema/index.js';
import { serverResourceStore } from '../routes/v1/resources.js';

/**
 * Executa simulação completa (Dry-Run) sem gravar no banco de dados.
 */
export function runDryRun(inventory: InventoryReport): DryRunPlan {
  const executionId = `dryrun_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  const timestamp = new Date().toISOString();

  let totalToInsert = 0;
  let totalToUpdate = 0;
  let totalSkipped = 0;
  let totalInvalid = 0;
  const blockers: string[] = [];

  const tenantPlans: TenantDryRunPlan[] = [];

  for (const tenantId of inventory.tenantsFound) {
    const tenantItems = inventory.itemsByTenant[tenantId] || [];
    const orderedResources = getOrderedMigrationResources();
    const plannedActions: PlannedAction[] = [];
    let tenantHasErrors = false;

    for (const mapping of orderedResources) {
      const item = tenantItems.find((it) => it.resource === mapping.localResource);

      if (!item) {
        totalSkipped++;
        continue;
      }

      if (item.status === 'CORRUPTED' || item.status === 'INVALID_SHAPE') {
        totalInvalid++;
        tenantHasErrors = true;
        blockers.push(
          `Tenant "${tenantId}": recurso "${item.resource}" inválido ou corrompido: ${item.errorMessage}`
        );
        plannedActions.push({
          resource: item.resource,
          action: 'INVALID',
          targetTable: mapping.targetTable,
          recordCount: 0,
          idPreservation: true,
          errors: [item.errorMessage || 'Dados inválidos'],
        });
        continue;
      }

      const count = item.recordCount || 1;
      totalToInsert += count;

      plannedActions.push({
        resource: item.resource,
        action: 'INSERT',
        targetTable: mapping.targetTable,
        recordCount: count,
        idPreservation: true,
        errors: [],
      });
    }

    // Verifica itens anômalos ou corrompidos não mapeados no conjunto canônico
    for (const item of tenantItems) {
      if (item.status === 'CORRUPTED' || item.status === 'INVALID_SHAPE') {
        if (!plannedActions.some((pa) => pa.resource === item.resource)) {
          totalInvalid++;
          tenantHasErrors = true;
          blockers.push(
            `Tenant "${tenantId}": recurso "${item.resource}" inválido ou corrompido: ${item.errorMessage}`
          );
          plannedActions.push({
            resource: item.resource,
            action: 'INVALID',
            targetTable: 'unmapped',
            recordCount: 0,
            idPreservation: false,
            errors: [item.errorMessage || 'Dados inválidos'],
          });
        }
      }
    }

    tenantPlans.push({
      tenantId,
      dependencies: ['tenants', 'visual_themes', 'site_settings', 'pages'],
      actions: plannedActions,
      hasErrors: tenantHasErrors,
    });
  }

  // Verifica chaves anômalas não associadas a tenants válidos
  for (const item of inventory.items) {
    if (item.status === 'CORRUPTED' || item.status === 'INVALID_SHAPE' || !item.isCanonical) {
      const msg = `Chave fora do padrão identificada: "${item.rawKey}" (${item.errorMessage || item.status})`;
      if (!blockers.includes(msg)) {
        blockers.push(msg);
      }
    }
  }

  return {
    executionId,
    timestamp,
    tenants: tenantPlans,
    summary: {
      totalToInsert,
      totalToUpdate,
      totalSkipped,
      totalInvalid,
    },
    canExecute: blockers.length === 0,
    blockers,
  };
}

export interface ExecuteMigrationOptions {
  inventory: InventoryReport;
  backup: BackupPackage;
  executeFlag: boolean;
  dbOverride?: any;
}

/**
 * Executa a migração transacional e controlada dos dados locais para o servidor.
 * Protegido: Exige flag executeFlag === true para persistência real.
 */
export async function executeMigration(
  options: ExecuteMigrationOptions
): Promise<MigrationResult> {
  const executionId = `mig_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  const timestamp = new Date().toISOString();

  // 1. Verificação de segurança: proteção contra execução inadvertida
  if (!options.executeFlag) {
    return {
      executionId,
      timestamp,
      success: false,
      mode: 'dry-run',
      tenantsMigrated: [],
      steps: [],
      recordsMigrated: {},
      rollbackTriggered: false,
      errors: [
        'Execução bloqueada por segurança: O parâmetro executeFlag (--execute) não foi fornecido.',
      ],
      backupId: options.backup.manifest.backupId,
    };
  }

  const db = options.dbOverride || getDb();
  const tenantsMigrated: string[] = [];
  const steps: MigrationStepResult[] = [];
  const recordsMigrated: Record<string, number> = {};
  const errors: string[] = [];
  let rollbackTriggered = false;

  const orderedResources = getOrderedMigrationResources();

  for (const tenantId of options.inventory.tenantsFound) {
    const tenantItems = options.inventory.itemsByTenant[tenantId] || [];

    try {
      // 2. Se o banco PostgreSQL estiver ativo, executa em transação com RLS
      if (db) {
        // Transação explícita
        await db.transaction(async (tx: any) => {
          // Define contexto de RLS na conexão
          if (tx.execute) {
            await setTenantContext(tx, tenantId);
          }

          // Inserção da congregação raiz
          await tx
            .insert(schema.tenants)
            .values({
              id: tenantId,
              name: `Congregação ${tenantId}`,
              slug: tenantId,
              status: 'active',
              contactEmail: `admin@${tenantId}.org`,
            })
            .onConflictDoNothing();

          // Migração dos recursos na ordem topológica
          for (const mapping of orderedResources) {
            const item = tenantItems.find((it) => it.resource === mapping.localResource);
            if (!item || !item.parsedData) continue;

            const resource = mapping.localResource;
            const data = item.parsedData;
            const targetTable = mapping.targetTable;

            switch (resource) {
              case 'settings': {
                await tx
                  .insert(schema.siteSettings)
                  .values({
                    id: `settings_${tenantId}`,
                    tenantId,
                    siteName: data.siteName || '',
                    language: data.language || 'pt-BR',
                    locale: data.locale || 'pt-BR',
                    timezone: data.timezone || 'America/Sao_Paulo',
                    dateFormat: data.dateFormat || 'DD/MM/YYYY',
                    timeFormat: data.timeFormat || 'HH:mm',
                    faviconUrl: data.faviconUrl || '',
                    updatedAt: new Date(),
                  })
                  .onConflictDoUpdate({
                    target: schema.siteSettings.tenantId,
                    set: {
                      siteName: data.siteName || '',
                      language: data.language || 'pt-BR',
                      timezone: data.timezone || 'America/Sao_Paulo',
                      faviconUrl: data.faviconUrl || '',
                      updatedAt: new Date(),
                    },
                  });
                steps.push({
                  tenantId,
                  resource,
                  targetTable,
                  action: 'INSERT',
                  success: true,
                  recordsAffected: 1,
                });
                break;
              }

              case 'institutional': {
                await tx
                  .insert(schema.institutionalContents)
                  .values({
                    id: `inst_${tenantId}`,
                    tenantId,
                    profile: data.profile || {},
                    address: data.address || {},
                    contact: data.contact || {},
                    socialLinks: data.socialLinks || {},
                    updatedAt: new Date(),
                  })
                  .onConflictDoUpdate({
                    target: schema.institutionalContents.tenantId,
                    set: {
                      profile: data.profile || {},
                      address: data.address || {},
                      contact: data.contact || {},
                      socialLinks: data.socialLinks || {},
                      updatedAt: new Date(),
                    },
                  });
                steps.push({
                  tenantId,
                  resource,
                  targetTable,
                  action: 'INSERT',
                  success: true,
                  recordsAffected: 1,
                });
                break;
              }

              case 'themes': {
                if (Array.isArray(data)) {
                  let themesCount = 0;
                  for (const theme of data) {
                    if (!theme || !theme.id) continue;
                    await tx
                      .insert(schema.visualThemes)
                      .values({
                        id: theme.id,
                        tenantId,
                        name: theme.name || 'Tema',
                        description: theme.description || '',
                        version: theme.version || '1.0.0',
                        isDefault: Boolean(theme.isDefault),
                        status: theme.status || 'active',
                        tokens: theme.tokens || {},
                        updatedAt: new Date(),
                      })
                      .onConflictDoUpdate({
                        target: schema.visualThemes.id,
                        set: {
                          name: theme.name || 'Tema',
                          description: theme.description || '',
                          isDefault: Boolean(theme.isDefault),
                          tokens: theme.tokens || {},
                          updatedAt: new Date(),
                        },
                      });
                    themesCount++;
                  }
                  steps.push({
                    tenantId,
                    resource,
                    targetTable,
                    action: 'INSERT',
                    success: true,
                    recordsAffected: themesCount,
                  });
                }
                break;
              }

              case 'schedules': {
                if (Array.isArray(data)) {
                  let schedulesCount = 0;
                  for (const schedule of data) {
                    if (!schedule || !schedule.id) continue;
                    await tx
                      .insert(schema.churchSchedules)
                      .values({
                        id: schedule.id,
                        tenantId,
                        title: schedule.title || 'Culto',
                        dayOfWeek: schedule.dayOfWeek,
                        time: schedule.time || '19:00',
                        description: schedule.description,
                        location: schedule.location,
                        status: schedule.status || 'active',
                        updatedAt: new Date(),
                      })
                      .onConflictDoUpdate({
                        target: schema.churchSchedules.id,
                        set: {
                          title: schedule.title || 'Culto',
                          time: schedule.time || '19:00',
                          location: schedule.location,
                          status: schedule.status || 'active',
                          updatedAt: new Date(),
                        },
                      });
                    schedulesCount++;
                  }
                  steps.push({
                    tenantId,
                    resource,
                    targetTable,
                    action: 'INSERT',
                    success: true,
                    recordsAffected: schedulesCount,
                  });
                }
                break;
              }

              case 'donations': {
                await tx
                  .insert(schema.churchDonations)
                  .values({
                    id: data.id || `donation_${tenantId}`,
                    tenantId,
                    title: data.title || 'Contribuições e Dízimos',
                    description: data.description,
                    bankAccountInfo: data.bankAccountInfo,
                    pixKey: data.pixKey,
                    instructions: data.instructions,
                    status: data.status || 'active',
                    updatedAt: new Date(),
                  })
                  .onConflictDoUpdate({
                    target: schema.churchDonations.id,
                    set: {
                      title: data.title || 'Contribuições e Dízimos',
                      pixKey: data.pixKey,
                      updatedAt: new Date(),
                    },
                  });
                steps.push({
                  tenantId,
                  resource,
                  targetTable,
                  action: 'INSERT',
                  success: true,
                  recordsAffected: 1,
                });
                break;
              }

              case 'live_stream': {
                await tx
                  .insert(schema.churchLiveStreams)
                  .values({
                    id: `livestream_${tenantId}`,
                    tenantId,
                    title: data.title || 'Transmissão',
                    description: data.description,
                    streamUrl: data.streamUrl,
                    status: data.status || 'offline',
                    updatedAt: new Date(),
                  })
                  .onConflictDoUpdate({
                    target: schema.churchLiveStreams.id,
                    set: {
                      title: data.title || 'Transmissão',
                      streamUrl: data.streamUrl,
                      status: data.status || 'offline',
                      updatedAt: new Date(),
                    },
                  });
                steps.push({
                  tenantId,
                  resource,
                  targetTable,
                  action: 'INSERT',
                  success: true,
                  recordsAffected: 1,
                });
                break;
              }

              case 'navigation': {
                if (Array.isArray(data)) {
                  let menuCount = 0;
                  for (const menu of data) {
                    if (!menu || !menu.id) continue;
                    await tx
                      .insert(schema.navigationMenus)
                      .values({
                        id: menu.id,
                        tenantId,
                        name: menu.name || 'Menu',
                        location: menu.location || 'header',
                        status: menu.status || 'active',
                        items: menu.items || [],
                        updatedAt: new Date(),
                      })
                      .onConflictDoUpdate({
                        target: schema.navigationMenus.id,
                        set: {
                          name: menu.name || 'Menu',
                          items: menu.items || [],
                          updatedAt: new Date(),
                        },
                      });
                    menuCount++;
                  }
                  steps.push({
                    tenantId,
                    resource,
                    targetTable,
                    action: 'INSERT',
                    success: true,
                    recordsAffected: menuCount,
                  });
                }
                break;
              }

              case 'pages': {
                if (Array.isArray(data)) {
                  let pageCount = 0;
                  for (const page of data) {
                    if (!page || !page.id) continue;
                    // 1. Inserir página
                    await tx
                      .insert(schema.pages)
                      .values({
                        id: page.id,
                        tenantId,
                        title: page.title || 'Página',
                        slug: page.slug || 'pagina',
                        status: page.status || 'draft',
                        order: page.order || 0,
                        isHome: Boolean(page.isHome),
                        seo: page.seo || { metaTitle: '', metaDescription: '' },
                        updatedAt: new Date(),
                      })
                      .onConflictDoUpdate({
                        target: schema.pages.id,
                        set: {
                          title: page.title || 'Página',
                          slug: page.slug || 'pagina',
                          status: page.status || 'draft',
                          isHome: Boolean(page.isHome),
                          seo: page.seo || {},
                          updatedAt: new Date(),
                        },
                      });

                    // 2. Inserir seções da página
                    if (Array.isArray(page.sections)) {
                      for (const section of page.sections) {
                        if (!section || !section.id) continue;
                        await tx
                          .insert(schema.pageSections)
                          .values({
                            id: section.id,
                            pageId: page.id,
                            tenantId,
                            title: section.title || '',
                            order: section.order || 0,
                            isVisible: section.isVisible !== false,
                            backgroundColor: section.backgroundColor,
                            config: section.config,
                            updatedAt: new Date(),
                          })
                          .onConflictDoNothing();

                        // 3. Inserir blocos da seção
                        if (Array.isArray(section.blocks)) {
                          for (const block of section.blocks) {
                            if (!block || !block.id) continue;
                            await tx
                              .insert(schema.pageBlocks)
                              .values({
                                id: block.id,
                                sectionId: section.id,
                                tenantId,
                                type: block.type || 'text',
                                order: block.order || 0,
                                isVisible: block.isVisible !== false,
                                config: block.config || {},
                                data: block.data || {},
                                updatedAt: new Date(),
                              })
                              .onConflictDoNothing();
                          }
                        }
                      }
                    }
                    pageCount++;
                  }
                  steps.push({
                    tenantId,
                    resource,
                    targetTable,
                    action: 'INSERT',
                    success: true,
                    recordsAffected: pageCount,
                  });
                }
                break;
              }
            }
          }
        });
      }

      // 3. Atualiza também o store em memória do servidor para disponibilidade imediata via API
      for (const item of tenantItems) {
        if (item.parsedData !== null && item.parsedData !== undefined) {
          const storeKey = `cms:${tenantId}:${item.resource}`;
          serverResourceStore.set(storeKey, item.parsedData);
          recordsMigrated[storeKey] = item.recordCount || 1;
        }
      }

      tenantsMigrated.push(tenantId);
    } catch (err: any) {
      rollbackTriggered = true;
      errors.push(`Erro na transação de migração do tenant "${tenantId}": ${err?.message || String(err)}`);
    }
  }

  return {
    executionId,
    timestamp,
    success: errors.length === 0,
    mode: 'execute',
    tenantsMigrated,
    steps,
    recordsMigrated,
    rollbackTriggered,
    errors,
    backupId: options.backup.manifest.backupId,
  };
}

/**
 * Realiza a comparação pós-migração entre a Origem (armazenamento local), o Backup e o Servidor.
 */
export function compareMigration(
  source: StorageDataSource,
  backup: BackupPackage,
  serverStore: Map<string, any> = serverResourceStore
): PostMigrationComparisonResult {
  const divergences: string[] = [];
  const detailsByTenant: PostMigrationComparisonResult['detailsByTenant'] = {};

  let sourceKeysEvaluated = 0;
  let backupKeysEvaluated = 0;
  let serverKeysEvaluated = 0;

  for (const rawKey of Object.keys(backup.data)) {
    backupKeysEvaluated++;
    const backupItem = backup.data[rawKey];
    const tenantId = backupItem.tenantId;

    if (!detailsByTenant[tenantId]) {
      detailsByTenant[tenantId] = [];
    }

    // 1. Verifica presença na origem
    const sourceValue = source.getItem(rawKey);
    if (sourceValue === null) {
      divergences.push(`Chave "${rawKey}" existe no backup mas não foi encontrada na origem.`);
      continue;
    }
    sourceKeysEvaluated++;

    // 2. Verifica hash de origem vs backup
    const calculatedSourceHash = crypto
      .createHash('sha256')
      .update(sourceValue)
      .digest('hex');

    if (calculatedSourceHash !== backupItem.checksumSha256) {
      divergences.push(
        `Divergência de hash na chave "${rawKey}": Origem ${calculatedSourceHash} vs Backup ${backupItem.checksumSha256}`
      );
    }

    // 3. Verifica presença no servidor
    if (!serverStore.has(rawKey)) {
      divergences.push(`Chave "${rawKey}" não foi persistida no servidor.`);
      detailsByTenant[tenantId].push({
        resource: backupItem.resource,
        status: 'MISSING_IN_SERVER',
        details: `Recurso "${backupItem.resource}" ausente no servidor.`,
      });
    } else {
      serverKeysEvaluated++;
      const serverData = serverStore.get(rawKey);

      // Compara igualdade estrutural
      const serverJson = JSON.stringify(serverData);
      const backupJson = JSON.stringify(backupItem.value);

      if (serverJson !== backupJson) {
        divergences.push(`Divergência de conteúdo na chave "${rawKey}" entre servidor e backup.`);
        detailsByTenant[tenantId].push({
          resource: backupItem.resource,
          status: 'DIVERGENT',
          details: 'Conteúdo do servidor difere do backup.',
        });
      } else {
        detailsByTenant[tenantId].push({
          resource: backupItem.resource,
          status: 'MATCH',
        });
      }
    }
  }

  return {
    matched: divergences.length === 0,
    sourceKeysEvaluated,
    backupKeysEvaluated,
    serverKeysEvaluated,
    divergences,
    detailsByTenant,
  };
}
