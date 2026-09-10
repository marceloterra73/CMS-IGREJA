/**
 * CMS VERIFICATION SCRIPT — FASE 51
 * Validação rigorosa e automatizada da camada canônica de persistência local.
 */

import {
  CmsCanonicalRepository,
  StorageEngine,
  getCmsStorageKey,
  getCmsTenantPrefix,
} from '../src/core/persistence';
import { SiteSettings, ChurchSchedule, VisualTheme } from '../src/types';

// Mock in-memory do localStorage para execução no ambiente Node
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

// Injeta o mock global no Node
const mockStorage = new MockLocalStorage();
(global as any).window = {
  localStorage: mockStorage,
};

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ [FAIL] ${testName}`);
    throw new Error(`Falha no teste: ${testName}`);
  }
}

console.log('\n--- INICIANDO SUÍTE DE TESTES: FASE 51 (PERSISTÊNCIA LOCAL CANÔNICA) ---\n');

// 1. TESTE DE CONVENÇÃO DE CHAVES E ISOLAMENTO MULTI-TENANT
console.log('1. Convenção de Chaves Canônicas:');
const key1 = getCmsStorageKey('settings', 'ib_central');
assert(key1 === 'cms:ib_central:settings', 'Chave canônica correta para tenant ib_central');

const key2 = getCmsStorageKey('settings', 'outra_igreja');
assert(key2 === 'cms:outra_igreja:settings', 'Chave canônica isolada para tenant outra_igreja');
assert(key1 !== key2, 'Isolamento estrito de chaves entre diferentes tenants');

const prefix = getCmsTenantPrefix('ib_central');
assert(prefix === 'cms:ib_central:', 'Prefixo canônico de tenant gerado corretamente');

// 2. TESTE DO MOTOR DE ARMAZENAMENTO E TRATAMENTO DE FALHAS
console.log('\n2. Motor Técnico de Persistência (StorageEngine):');
const repo = new CmsCanonicalRepository();

// Leitura inicial com fallback canônico
const initialSettings = repo.loadSettings('ib_central');
assert(Boolean(initialSettings && initialSettings.tenantId === 'ib_central'), 'Fallback inicial canônico carregado para Settings');

// Gravação de alteração e releitura (Simulação do ciclo Salvar -> Recarregar)
const modifiedSettings: SiteSettings = {
  ...initialSettings,
  siteName: 'Igreja Batista Central Renovada',
  language: 'pt-BR',
};
repo.saveSettings(modifiedSettings, 'ib_central');

const loadedSettings = repo.loadSettings('ib_central');
assert(loadedSettings.siteName === 'Igreja Batista Central Renovada', 'Persistência bem-sucedida: Dados salvos recuperados fielmente');
assert(loadedSettings.language === 'pt-BR', 'Idioma persistido recuperado com integridade');

// 3. TESTE DE ISOLAMENTO MULTI-TENANT NA PRÁTICA
console.log('\n3. Isolamento Multi-Tenant em Operação:');
const tenantB = 'comunidade_esperanca';
const tenantBSettings = repo.loadSettings(tenantB);
// O tenant B não deve ter recebido as alterações do tenant A
assert(tenantBSettings.siteName !== 'Igreja Batista Central Renovada', 'Tenant B não recebe alterações do Tenant A');

// 4. TESTE DE RECUPERAÇÃO CONTRA CORRUPÇÃO DE DADOS (JSON INVÁLIDO)
console.log('\n4. Tolerância a Falhas e Recuperação de Corrupção:');
mockStorage.setItem('cms:ib_central:settings', '{ json_corrompido: invalid syntax');
const fallbackAfterCorruption = repo.loadSettings('ib_central');
assert(Boolean(fallbackAfterCorruption && fallbackAfterCorruption.tenantId === 'ib_central'), 'Tolerância ativa: JSON corrompido retorna fallback canônico sem quebrar a aplicação');

// 5. TESTE DE AGENDA DE CULTOS (LISTA CANÔNICA)
console.log('\n5. Persistência de Arrays / Grade de Cultos:');
const initialSchedules = repo.loadSchedules('ib_central');
assert(Array.isArray(initialSchedules) && initialSchedules.length > 0, 'Carregamento inicial da grade de cultos');

const newSchedule: ChurchSchedule = {
  id: 'sch_test_fase51',
  tenantId: 'ib_central',
  title: 'Culto de Oração da Madrugada',
  dayOfWeek: 'tuesday',
  time: '06:00',
  location: 'Templo Principal',
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

repo.saveSchedules([...initialSchedules, newSchedule], 'ib_central');
const reloadedSchedules = repo.loadSchedules('ib_central');
assert(reloadedSchedules.some((s) => s.id === 'sch_test_fase51'), 'Novo culto adicionado e persistido com sucesso na lista');

// 6. TESTE DE TEMAS VISUAIS
console.log('\n6. Persistência de Temas Visuais:');
const activeTheme = repo.loadActiveTheme('ib_central');
assert(Boolean(activeTheme && activeTheme.id), 'Tema ativo canônico carregado');

const customTheme: VisualTheme = {
  ...activeTheme,
  name: 'Tema Personalizado Fase 51',
};
repo.saveActiveTheme(customTheme, 'ib_central');
const reloadedTheme = repo.loadActiveTheme('ib_central');
assert(reloadedTheme.name === 'Tema Personalizado Fase 51', 'Tema visual personalizado gravado e recuperado');

// 7. TESTE DE PÁGINAS DO CMS
console.log('\n7. Persistência de Páginas do CMS:');
const pages = repo.loadPages('ib_central');
assert(Array.isArray(pages) && pages.length > 0, 'Páginas canônicas carregadas');

// 8. TESTE DE DOAÇÕES & PIX
console.log('\n8. Persistência de Doações & PIX:');
const donation = repo.loadDonations('ib_central');
assert(Boolean(donation && donation.pixKey), 'Doações canônicas carregadas');

// 9. TESTE DE TRANSMISSÃO AO VIVO
console.log('\n9. Persistência de Transmissão ao Vivo:');
const live = repo.loadLiveStream('ib_central');
assert(Boolean(live && live.title), 'Transmissão ao vivo canônica carregada');

console.log(`\n==============================================`);
console.log(`TODOS OS ${passedTests}/${totalTests} TESTES DA FASE 51 FORAM APROVADOS COM SUCESSO!`);
console.log(`==============================================\n`);
