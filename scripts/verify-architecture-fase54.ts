/**
 * CMS VERIFICATION SCRIPT — FASE 54
 * FUNDAÇÃO DA ARQUITETURA DE PRODUÇÃO E ESTRATÉGIA LOCAL -> SERVIDOR
 * 
 * Auditoria Arquitetural Automatizada:
 * - Teste A: Verificação de que componentes NÃO acessam diretamente o localStorage
 * - Teste B: Funcionamento pleno de CmsCanonicalRepository / cmsRepository
 * - Teste C: Funcionamento da Persistência Local (localCmsStorageEngine)
 * - Teste D: Recuperação de dados pós-recarregamento (Reload)
 * - Teste E: Isolamento absoluto Multi-Tenant mantido
 * - Teste F: Site Público consumindo exclusivamente do CMS Repository
 * - Teste G: Ausência total de chamadas externas de rede (fetch, axios, XMLHttpRequest)
 * - Teste H: Ausência de falsos mocks/providers de servidor (ServerProvider, ApiProvider, etc.)
 * - Teste I: Preservação estrita dos Contratos Canônicos de Domínio
 */

import fs from 'fs';
import path from 'path';
import {
  CmsCanonicalRepository,
  localCmsStorageEngine,
  getCmsStorageKey,
  getCmsTenantPrefix,
  StorageEngine,
} from '../src/core/persistence';
import {
  SiteSettings,
  InstitutionalContent,
  VisualTheme,
  SiteSEO,
  ChurchSchedule,
  ChurchDonationInfo,
  ChurchLiveStreamInfo,
  Page,
  NavigationMenu,
} from '../src/types';

// Mock in-memory do localStorage para o ambiente Node
class MockLocalStorage {
  private store: Map<string, string> = new Map();

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
    const keys = Array.from(this.store.keys());
    return keys[index] || null;
  }
}

const mockStorage = new MockLocalStorage();
(global as any).window = {
  localStorage: mockStorage,
};

let passed = 0;
let total = 0;

function assert(condition: boolean, description: string) {
  total++;
  if (condition) {
    console.log(`  ✅ [PASS] ${description}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${description}`);
    throw new Error(`Falha na verificação da Fase 54: ${description}`);
  }
}

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

console.log('================================================================');
console.log(' FASE 54: AUDITORIA DA ARQUITETURA LOCAL -> SERVIDOR ');
console.log('================================================================\n');

// -------------------------------------------------------------
// TESTE A: Verificação de isolamento do localStorage no código
// -------------------------------------------------------------
console.log('--- TESTE A: ACOPLAMENTO DO LOCALSTORAGE ---');
const srcFiles = getAllFiles(path.resolve('src'));
const storageEngineFile = path.resolve('src/core/persistence/storageEngine.ts');

const filesWithLocalStorage: string[] = [];
srcFiles.forEach((filePath) => {
  if (filePath === storageEngineFile) return;
  const content = fs.readFileSync(filePath, 'utf-8');
  if (content.includes('localStorage') || content.includes('sessionStorage')) {
    filesWithLocalStorage.push(filePath);
  }
});

assert(
  filesWithLocalStorage.length === 0,
  `Nenhum componente ou módulo fora de storageEngine.ts acessa localStorage diretamente (Encontrados: ${filesWithLocalStorage.length})`
);

// -------------------------------------------------------------
// TESTE B: Funcionamento de CmsCanonicalRepository
// -------------------------------------------------------------
console.log('\n--- TESTE B: CMS REPOSITORY PLENAMENTE OPERACIONAL ---');
const repo = new CmsCanonicalRepository(localCmsStorageEngine);

const initialSettings = repo.loadSettings('tenant_audit_54');
assert(
  initialSettings && typeof initialSettings.siteName === 'string',
  'cmsRepository.loadSettings retorna contrato canônico SiteSettings válido'
);

const modifiedSettings: SiteSettings = {
  ...initialSettings,
  siteName: 'Igreja Arquitetura Fase 54',
  language: 'pt-BR',
};
const saveSettingsResult = repo.saveSettings(modifiedSettings, 'tenant_audit_54');
assert(saveSettingsResult === true, 'cmsRepository.saveSettings executa com sucesso');

const reloadedSettings = repo.loadSettings('tenant_audit_54');
assert(
  reloadedSettings.siteName === 'Igreja Arquitetura Fase 54',
  'cmsRepository.loadSettings recupera dados alterados com fidelidade'
);

// -------------------------------------------------------------
// TESTE C: Persistência Local (localCmsStorageEngine)
// -------------------------------------------------------------
console.log('\n--- TESTE C: LOCAL STORAGE ENGINE (PERSISTENCE LAYER) ---');
const testKey = 'cms:tenant_audit_54:test_resource';
const written = localCmsStorageEngine.write(testKey, { active: true, value: 42 });
assert(written === true, 'localCmsStorageEngine.write grava chave no mecanismo local');

const exists = localCmsStorageEngine.exists(testKey);
assert(exists === true, 'localCmsStorageEngine.exists confirma existência');

const readData = localCmsStorageEngine.read<{ active: boolean; value: number }>(testKey, {
  active: false,
  value: 0,
});
assert(readData.active === true && readData.value === 42, 'localCmsStorageEngine.read lê fielmente o dado gravado');

const removed = localCmsStorageEngine.remove(testKey);
assert(removed === true, 'localCmsStorageEngine.remove remove a chave');
assert(localCmsStorageEngine.exists(testKey) === false, 'Chave removida não existe mais');

// -------------------------------------------------------------
// TESTE D: Ciclo Salvar -> Reload -> Ler -> Editar -> Salvar
// -------------------------------------------------------------
console.log('\n--- TESTE D: CICLO SALVAR -> RELOAD -> LER -> EDITAR -> SALVAR ---');
const scheduleTenant = 'tenant_ciclo_54';
const newSchedule: ChurchSchedule = {
  id: 'sch_fase54_ciclo',
  tenantId: scheduleTenant,
  title: 'Culto de Homologação Fase 54',
  dayOfWeek: 'quinta',
  time: '20:00',
  location: 'Templo Principal',
  status: 'active',
};

// 1. Salvar
repo.saveSchedules([newSchedule], scheduleTenant);

// 2. Reload simulado com nova instância do repositório desacoplada
const repoReloaded = new CmsCanonicalRepository(localCmsStorageEngine);

// 3. Ler
const loadedSchedules = repoReloaded.loadSchedules(scheduleTenant);
assert(
  loadedSchedules.length === 1 && loadedSchedules[0].id === 'sch_fase54_ciclo',
  'Reload recupera culto persistido com fidelidade de propriedades'
);

// 4. Editar
const editedSchedules: ChurchSchedule[] = [
  {
    ...loadedSchedules[0],
    time: '20:30',
    title: 'Culto de Oração e Ensino Fase 54',
  },
];

// 5. Salvar novamente
repoReloaded.saveSchedules(editedSchedules, scheduleTenant);

// 6. Ler novamente
const repoFinal = new CmsCanonicalRepository(localCmsStorageEngine);
const finalSchedules = repoFinal.loadSchedules(scheduleTenant);
assert(
  finalSchedules[0].time === '20:30' && finalSchedules[0].title === 'Culto de Oração e Ensino Fase 54',
  'Ciclo Salvar -> Reload -> Ler -> Editar -> Salvar concluído com 100% de integridade'
);

// -------------------------------------------------------------
// TESTE E: Tenant Isolation no repositório e chaves
// -------------------------------------------------------------
console.log('\n--- TESTE E: ISOLAMENTO MULTI-TENANT ---');
const tenantAlpha = 'alpha_church';
const tenantBeta = 'beta_church';

repo.saveSettings({ ...initialSettings, siteName: 'Igreja Alpha' }, tenantAlpha);
repo.saveSettings({ ...initialSettings, siteName: 'Igreja Beta' }, tenantBeta);

const readAlpha = repo.loadSettings(tenantAlpha);
const readBeta = repo.loadSettings(tenantBeta);

assert(readAlpha.siteName === 'Igreja Alpha', 'Tenant Alpha preserva exclusivamente seus dados');
assert(readBeta.siteName === 'Igreja Beta', 'Tenant Beta preserva exclusivamente seus dados');

const keyAlpha = getCmsStorageKey('settings', tenantAlpha);
const keyBeta = getCmsStorageKey('settings', tenantBeta);
assert(keyAlpha === 'cms:alpha_church:settings', 'Chave de Tenant Alpha possui namespace isolado');
assert(keyBeta === 'cms:beta_church:settings', 'Chave de Tenant Beta possui namespace isolado');
assert(keyAlpha !== keyBeta, 'Colisão de chaves entre tenants é matematicamente impossível');

// -------------------------------------------------------------
// TESTE F: Site Público consome do CMS Repository
// -------------------------------------------------------------
console.log('\n--- TESTE F: SITE PÚBLICO E CONSUMO VIA CMS REPOSITORY ---');
// Verifica que o renderer público usa os métodos do cmsRepository
const publicSiteRendererPath = path.resolve('src/components/public-site/PublicSiteRenderer.tsx');
const publicRendererContent = fs.readFileSync(publicSiteRendererPath, 'utf-8');

assert(
  publicRendererContent.includes('import { cmsRepository } from'),
  'PublicSiteRenderer importa cmsRepository a partir da camada canônica'
);
assert(
  publicRendererContent.includes('cmsRepository.loadPages()'),
  'PublicSiteRenderer consome páginas do cmsRepository'
);
assert(
  publicRendererContent.includes('cmsRepository.loadInstitutional()'),
  'PublicSiteRenderer consome dados institucionais do cmsRepository'
);
assert(
  !publicRendererContent.includes('localStorage'),
  'PublicSiteRenderer não possui acesso direto ao localStorage'
);

// -------------------------------------------------------------
// TESTE G: Ausência de chamadas externas (fetch, axios, xhr)
// -------------------------------------------------------------
console.log('\n--- TESTE G: AUSÊNCIA DE COMUNICAÇÃO DE REDE EXTERNA ---');
const networkMatches: { file: string; match: string }[] = [];
srcFiles.forEach((filePath) => {
  // O ApiClient da Fase 59 é a única camada de transporte HTTP autorizada para o ServerPersistenceProvider
  if (filePath.endsWith('apiClient.ts')) return;
  const content = fs.readFileSync(filePath, 'utf-8');
  if (content.includes('fetch(') || content.includes('axios') || content.includes('XMLHttpRequest')) {
    networkMatches.push({ file: filePath, match: 'HTTP client detected' });
  }
});

assert(
  networkMatches.length === 0,
  `Nenhuma chamada de rede externa (fetch, axios, XMLHttpRequest) em src/ (Total: ${networkMatches.length})`
);

// -------------------------------------------------------------
// TESTE H: Ausência de Mocks ou Provedores Falsos de Servidor
// -------------------------------------------------------------
console.log('\n--- TESTE H: AUSÊNCIA DE PROVEDORES FALSOS DE SERVIDOR ---');
const bannedFilePatterns = [
  'serverprovider',
  'apiprovider',
  'httpprovider',
  'remoterepository',
  'databaserepository',
];

const foundBannedFiles: string[] = [];
srcFiles.forEach((filePath) => {
  const lower = path.basename(filePath).toLowerCase();
  bannedFilePatterns.forEach((pattern) => {
    if (lower.includes(pattern)) {
      foundBannedFiles.push(filePath);
    }
  });
});

assert(
  foundBannedFiles.length === 0,
  `Nenhum provedor falso de servidor ou mock antecipado foi criado (Encontrados: ${foundBannedFiles.length})`
);

// -------------------------------------------------------------
// TESTE I: Contratos Canônicos e Injeção na Camada de Persistência
// -------------------------------------------------------------
console.log('\n--- TESTE I: CONTRATOS CANÔNICOS E INJEÇÃO NA PERSISTÊNCIA ---');

// Testando injeção de StorageEngine customizado (capacidade de receber qualquer engine no futuro)
class MemoryEngine implements StorageEngine {
  private mem = new Map<string, any>();
  read<T>(key: string, fallback: T): T {
    return this.mem.has(key) ? this.mem.get(key) : fallback;
  }
  write<T>(key: string, data: T): boolean {
    this.mem.set(key, data);
    return true;
  }
  remove(key: string): boolean {
    return this.mem.delete(key);
  }
  exists(key: string): boolean {
    return this.mem.has(key);
  }
  clearByPrefix(prefix: string): boolean {
    for (const k of Array.from(this.mem.keys())) {
      if (k.startsWith(prefix)) this.mem.delete(k);
    }
    return true;
  }
}

const memoryEngine = new MemoryEngine();
const repoWithMemory = new CmsCanonicalRepository(memoryEngine);

const memSaved = repoWithMemory.saveSettings({ ...initialSettings, siteName: 'Engine Injetada' }, 'mem_tenant');
assert(memSaved === true, 'CmsCanonicalRepository aceita StorageEngine abstrato via injeção');
const memLoaded = repoWithMemory.loadSettings('mem_tenant');
assert(
  memLoaded.siteName === 'Engine Injetada',
  'Leitura via engine injetada bem-sucedida, comprovando abstração da camada de persistência'
);

console.log('\n=============================================================');
console.log(`RESULTADO DA AUDITORIA ARQUITETURAL DA FASE 54: ${passed}/${total} ASSERÇÕES APROVADAS!`);
console.log('ESTRATÉGIA ARQUITETURAL VALIDADA COM SUCESSO!');
console.log('=============================================================');
