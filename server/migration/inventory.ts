/**
 * INVENTÁRIO DOS DADOS LOCAIS — FASE 60
 * CMS Visual para Igrejas
 *
 * Escaneia o armazenamento de origem sem alterar nenhum dado (somente leitura).
 * Identifica tenants, recursos, integridade, hashes SHA-256, tamanhos em bytes
 * e contratos canônicos.
 */

import crypto from 'crypto';
import {
  StorageDataSource,
  InventoryItem,
  InventoryReport,
} from './types.js';
import { validateResourceData } from './validator.js';

export const CANONICAL_RESOURCES = [
  'settings',
  'institutional',
  'themes',
  'active_theme_id',
  'seo_site',
  'domains',
  'analytics',
  'schedules',
  'donations',
  'live_stream',
  'pages',
  'navigation',
] as const;

export type CanonicalResource = (typeof CANONICAL_RESOURCES)[number];

/**
 * Realiza o inventário completo do armazenamento local informado.
 */
export function runStorageInventory(source: StorageDataSource): InventoryReport {
  const executionId = `inv_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  const timestamp = new Date().toISOString();

  const items: InventoryItem[] = [];
  const tenantsSet = new Set<string>();
  let totalBytes = 0;
  let validKeysCount = 0;
  let corruptedKeysCount = 0;

  const totalLength = source.length;

  for (let i = 0; i < totalLength; i++) {
    const rawKey = source.key(i);
    if (!rawKey) continue;

    const rawValue = source.getItem(rawKey);
    if (rawValue === null || rawValue === undefined) continue;

    const sizeBytes = Buffer.byteLength(rawValue, 'utf8');
    totalBytes += sizeBytes;

    const checksumSha256 = crypto.createHash('sha256').update(rawValue).digest('hex');

    // Analisa padrão cms:<tenantId>:<resource>
    const match = rawKey.match(/^cms:([a-zA-Z0-9_-]+):([a-zA-Z0-9_]+)$/);

    if (!match) {
      // Chave fora do padrão canônico
      corruptedKeysCount++;
      items.push({
        rawKey,
        tenantId: 'unknown',
        resource: rawKey,
        isCanonical: false,
        status: 'INVALID_SHAPE',
        typeExpected: 'cms:<tenantId>:<resource>',
        sizeBytes,
        recordCount: 0,
        checksumSha256,
        parsedData: null,
        errorMessage: 'Chave não segue a convenção canônica cms:<tenantId>:<resource>',
      });
      continue;
    }

    const tenantId = match[1];
    const resource = match[2];
    tenantsSet.add(tenantId);

    const isCanonical = (CANONICAL_RESOURCES as readonly string[]).includes(resource);

    let parsedData: any = null;
    let isCorrupted = false;
    let parseErrorMsg: string | undefined;

    try {
      parsedData = JSON.parse(rawValue);
    } catch (err: any) {
      isCorrupted = true;
      parseErrorMsg = `JSON inválido ou corrompido: ${err?.message || String(err)}`;
    }

    if (isCorrupted) {
      corruptedKeysCount++;
      items.push({
        rawKey,
        tenantId,
        resource,
        isCanonical,
        status: 'CORRUPTED',
        typeExpected: resource,
        sizeBytes,
        recordCount: 0,
        checksumSha256,
        parsedData: null,
        errorMessage: parseErrorMsg,
      });
      continue;
    }

    // Valida estrutura do dado
    const validation = validateResourceData(resource, parsedData);

    if (validation.isValid) {
      validKeysCount++;
    } else {
      corruptedKeysCount++;
    }

    items.push({
      rawKey,
      tenantId,
      resource,
      isCanonical,
      status: validation.status,
      typeExpected: validation.typeExpected,
      sizeBytes,
      recordCount: validation.recordCount,
      checksumSha256,
      parsedData,
      errorMessage: validation.errorMessage,
    });
  }

  // Agrupa itens por tenant
  const itemsByTenant: Record<string, InventoryItem[]> = {};
  const tenantsFound = Array.from(tenantsSet).sort();

  for (const tenantId of tenantsFound) {
    itemsByTenant[tenantId] = items.filter((item) => item.tenantId === tenantId);
  }

  // Identifica chaves canônicas ausentes por tenant
  const missingCanonicalKeys: Array<{ tenantId: string; resource: string }> = [];
  for (const tenantId of tenantsFound) {
    const presentResources = new Set(
      (itemsByTenant[tenantId] || []).map((it) => it.resource)
    );
    for (const canonical of CANONICAL_RESOURCES) {
      if (!presentResources.has(canonical)) {
        missingCanonicalKeys.push({ tenantId, resource: canonical });
      }
    }
  }

  return {
    executionId,
    timestamp,
    totalKeys: items.length,
    tenantsFound,
    items,
    itemsByTenant,
    totalBytes,
    validKeysCount,
    corruptedKeysCount,
    missingCanonicalKeys,
  };
}
