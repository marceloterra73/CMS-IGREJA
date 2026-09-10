/**
 * CMS CORE — PERSISTÊNCIA LOCAL TÉCNICA (FASE 51)
 * Motor técnico puro para operações de persistência local no navegador.
 *
 * Responsabilidade Arquitetural:
 * - Operações atômicas de leitura, escrita, remoção e existência no armazenamento local.
 * - Tratamento seguro de JSON inválido/corrompido com retorno garantido de fallback canônico.
 * - Suporte transparente a ambientes sem localStorage (SSR, sandbox restrita).
 * - Sem dependências visuais, sem React, sem regras de negócio de telas.
 */

export interface StorageEngine {
  read<T>(key: string, fallback: T): T;
  write<T>(key: string, data: T): boolean;
  remove(key: string): boolean;
  exists(key: string): boolean;
  clearByPrefix(prefix: string): boolean;
}

/**
 * Verifica com segurança se a Web Storage API está acessível no ambiente atual
 */
function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    const testKey = '__cms_storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Motor padrão de persistência baseado no localStorage com tolerância a falhas
 */
export const localCmsStorageEngine: StorageEngine = {
  read<T>(key: string, fallback: T): T {
    if (!isLocalStorageAvailable()) {
      return fallback;
    }

    try {
      const rawValue = window.localStorage.getItem(key);
      if (rawValue === null || rawValue === undefined) {
        return fallback;
      }

      const parsed = JSON.parse(rawValue);

      // Verificação de integridade estrutural para evitar tipos corrompidos
      if (parsed === null || parsed === undefined) {
        return fallback;
      }

      // Se o fallback for um array e o parsed não for, usar o fallback
      if (Array.isArray(fallback) && !Array.isArray(parsed)) {
        console.warn(`[CMS Storage] Registro corrompido para chave "${key}" (esperava array). Usando fallback.`);
        return fallback;
      }

      // Se o fallback for um objeto e o parsed for primitivo
      if (
        typeof fallback === 'object' &&
        fallback !== null &&
        !Array.isArray(fallback) &&
        (typeof parsed !== 'object' || Array.isArray(parsed))
      ) {
        console.warn(`[CMS Storage] Registro corrompido para chave "${key}" (esperava objeto). Usando fallback.`);
        return fallback;
      }

      return parsed as T;
    } catch (err) {
      console.warn(`[CMS Storage] Falha ao analisar dados na chave "${key}". Usando fallback canônico.`, err);
      return fallback;
    }
  },

  write<T>(key: string, data: T): boolean {
    if (!isLocalStorageAvailable()) {
      return false;
    }

    try {
      const serialized = JSON.stringify(data);
      window.localStorage.setItem(key, serialized);
      return true;
    } catch (err) {
      console.error(`[CMS Storage] Erro ao gravar chave "${key}".`, err);
      return false;
    }
  },

  remove(key: string): boolean {
    if (!isLocalStorageAvailable()) {
      return false;
    }

    try {
      window.localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },

  exists(key: string): boolean {
    if (!isLocalStorageAvailable()) {
      return false;
    }

    try {
      return window.localStorage.getItem(key) !== null;
    } catch {
      return false;
    }
  },

  clearByPrefix(prefix: string): boolean {
    if (!isLocalStorageAvailable()) {
      return false;
    }

    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => window.localStorage.removeItem(k));
      return true;
    } catch {
      return false;
    }
  },
};

/**
 * Modos suportados de persistência na arquitetura do CMS (Fase 59)
 */
export type PersistenceMode = 'local' | 'server';

export interface StorageEngineFactoryOptions {
  mode?: PersistenceMode;
  serverEngine?: StorageEngine;
}

/**
 * Fábrica controlada de instâncias StorageEngine.
 * Por padrão estrito, retorna o motor local mantendo 100% de compatibilidade e zero regressões.
 */
export function createStorageEngine(options: StorageEngineFactoryOptions = {}): StorageEngine {
  const mode = options.mode || 'local';
  if (mode === 'server' && options.serverEngine) {
    return options.serverEngine;
  }
  return localCmsStorageEngine;
}

