/**
 * TIPOS E CONTRATOS DO MOTOR DE MIGRAÇÃO — FASE 60
 * Migração Controlada: Armazenamento Local → Server Persistence Provider → API REST → PostgreSQL
 *
 * CMS Visual para Igrejas
 */

export type ResourceValidationStatus = 'FOUND' | 'EMPTY' | 'CORRUPTED' | 'INVALID_SHAPE';

export type MigrationActionType = 'INSERT' | 'UPDATE' | 'SKIP' | 'INVALID';

export interface StorageDataSource {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
  readonly length: number;
  key(index: number): string | null;
}

export interface InventoryItem {
  rawKey: string;
  tenantId: string;
  resource: string;
  isCanonical: boolean;
  status: ResourceValidationStatus;
  typeExpected: string;
  sizeBytes: number;
  recordCount: number;
  checksumSha256: string;
  parsedData: any;
  errorMessage?: string;
}

export interface InventoryReport {
  executionId: string;
  timestamp: string;
  totalKeys: number;
  tenantsFound: string[];
  items: InventoryItem[];
  itemsByTenant: Record<string, InventoryItem[]>;
  totalBytes: number;
  validKeysCount: number;
  corruptedKeysCount: number;
  missingCanonicalKeys: Array<{ tenantId: string; resource: string }>;
}

export interface BackupManifest {
  backupId: string;
  timestamp: string;
  version: string;
  environment: string;
  totalTenants: number;
  totalKeys: number;
  totalBytes: number;
  checksumDataJson: string;
  checksumManifestJson: string;
  storageFormat: 'json';
}

export interface BackupPackage {
  manifest: BackupManifest;
  data: Record<
    string,
    {
      rawKey: string;
      tenantId: string;
      resource: string;
      value: any;
      sizeBytes: number;
      checksumSha256: string;
      timestamp: string;
    }
  >;
  checksums: Record<string, string>;
  backupDirectory: string;
}

export interface PlannedAction {
  resource: string;
  action: MigrationActionType;
  targetTable: string;
  recordCount: number;
  idPreservation: boolean;
  errors: string[];
}

export interface TenantDryRunPlan {
  tenantId: string;
  dependencies: string[];
  actions: PlannedAction[];
  hasErrors: boolean;
}

export interface DryRunPlan {
  executionId: string;
  timestamp: string;
  tenants: TenantDryRunPlan[];
  summary: {
    totalToInsert: number;
    totalToUpdate: number;
    totalSkipped: number;
    totalInvalid: number;
  };
  canExecute: boolean;
  blockers: string[];
}

export interface MigrationStepResult {
  tenantId: string;
  resource: string;
  targetTable: string;
  action: MigrationActionType;
  success: boolean;
  recordsAffected: number;
  error?: string;
}

export interface MigrationResult {
  executionId: string;
  timestamp: string;
  success: boolean;
  mode: 'dry-run' | 'execute';
  tenantsMigrated: string[];
  steps: MigrationStepResult[];
  recordsMigrated: Record<string, number>;
  rollbackTriggered: boolean;
  errors: string[];
  backupId?: string;
  postMigrationComparison?: PostMigrationComparisonResult;
}

export interface PostMigrationComparisonResult {
  matched: boolean;
  sourceKeysEvaluated: number;
  backupKeysEvaluated: number;
  serverKeysEvaluated: number;
  divergences: string[];
  detailsByTenant: Record<
    string,
    {
      resource: string;
      status: 'MATCH' | 'DIVERGENT' | 'MISSING_IN_SERVER';
      details?: string;
    }[]
  >;
}
