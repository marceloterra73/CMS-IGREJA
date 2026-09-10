/**
 * BACKUP E PRESERVAÇÃO DE DADOS LOCAIS — FASE 60
 * CMS Visual para Igrejas
 *
 * Gera pacote imutável e verificável de backup com checksums SHA-256
 * em diretório dedicado sem sobrescrita.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  InventoryReport,
  StorageDataSource,
  BackupManifest,
  BackupPackage,
} from './types.js';

export interface CreateBackupOptions {
  baseBackupDir?: string;
  backupId?: string;
}

/**
 * Cria um backup fiel e imutável a partir do inventário e da fonte de dados.
 */
export function createStorageBackup(
  inventory: InventoryReport,
  source: StorageDataSource,
  options?: CreateBackupOptions
): BackupPackage {
  const timestamp = new Date().toISOString();
  const backupId = options?.backupId || `backup_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  const baseDir = options?.baseBackupDir || path.resolve('migration-backup/fase60');
  const backupDir = path.join(baseDir, backupId);

  // Garante que o diretório único do backup existe
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const dataPayload: BackupPackage['data'] = {};
  const checksumsPayload: Record<string, string> = {};

  let totalBytes = 0;

  for (const item of inventory.items) {
    const rawValue = source.getItem(item.rawKey);
    const sizeBytes = rawValue ? Buffer.byteLength(rawValue, 'utf8') : 0;
    totalBytes += sizeBytes;

    dataPayload[item.rawKey] = {
      rawKey: item.rawKey,
      tenantId: item.tenantId,
      resource: item.resource,
      value: item.parsedData,
      sizeBytes,
      checksumSha256: item.checksumSha256,
      timestamp,
    };

    checksumsPayload[item.rawKey] = item.checksumSha256;
  }

  // Serializa data.json e calcula seu hash
  const dataJsonContent = JSON.stringify(dataPayload, null, 2);
  const dataJsonHash = crypto.createHash('sha256').update(dataJsonContent).digest('hex');
  checksumsPayload['data.json'] = dataJsonHash;

  // Monta o manifesto do backup
  const manifestPayload: BackupManifest = {
    backupId,
    timestamp,
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    totalTenants: inventory.tenantsFound.length,
    totalKeys: inventory.totalKeys,
    totalBytes,
    checksumDataJson: dataJsonHash,
    checksumManifestJson: '',
    storageFormat: 'json',
  };

  const manifestJsonContentPre = JSON.stringify(manifestPayload, null, 2);
  const manifestHash = crypto.createHash('sha256').update(manifestJsonContentPre).digest('hex');
  manifestPayload.checksumManifestJson = manifestHash;
  checksumsPayload['manifest.json'] = manifestHash;

  const finalManifestContent = JSON.stringify(manifestPayload, null, 2);
  const finalChecksumsContent = JSON.stringify(checksumsPayload, null, 2);

  // Escreve os 3 arquivos canônicos
  fs.writeFileSync(path.join(backupDir, 'data.json'), dataJsonContent, 'utf-8');
  fs.writeFileSync(path.join(backupDir, 'manifest.json'), finalManifestContent, 'utf-8');
  fs.writeFileSync(path.join(backupDir, 'checksums.json'), finalChecksumsContent, 'utf-8');

  return {
    manifest: manifestPayload,
    data: dataPayload,
    checksums: checksumsPayload,
    backupDirectory: backupDir,
  };
}

/**
 * Lê e valida a integridade de um backup existente no disco.
 */
export function verifyBackupIntegrity(backupDir: string): {
  isValid: boolean;
  manifest?: BackupManifest;
  errors: string[];
} {
  const errors: string[] = [];

  const manifestPath = path.join(backupDir, 'manifest.json');
  const dataPath = path.join(backupDir, 'data.json');
  const checksumsPath = path.join(backupDir, 'checksums.json');

  if (!fs.existsSync(manifestPath)) errors.push('manifest.json ausente no backup.');
  if (!fs.existsSync(dataPath)) errors.push('data.json ausente no backup.');
  if (!fs.existsSync(checksumsPath)) errors.push('checksums.json ausente no backup.');

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  try {
    const manifest: BackupManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    const dataContent = fs.readFileSync(dataPath, 'utf-8');
    const checksums: Record<string, string> = JSON.parse(fs.readFileSync(checksumsPath, 'utf-8'));

    // Verifica hash de data.json
    const calculatedDataHash = crypto.createHash('sha256').update(dataContent).digest('hex');
    if (calculatedDataHash !== manifest.checksumDataJson) {
      errors.push(`Hash de data.json divergente: esperado ${manifest.checksumDataJson}, obtido ${calculatedDataHash}`);
    }
    if (checksums['data.json'] && checksums['data.json'] !== calculatedDataHash) {
      errors.push(`Hash de data.json em checksums.json divergente.`);
    }

    return {
      isValid: errors.length === 0,
      manifest,
      errors,
    };
  } catch (err: any) {
    errors.push(`Falha ao ler arquivos do backup: ${err?.message || String(err)}`);
    return { isValid: false, errors };
  }
}
