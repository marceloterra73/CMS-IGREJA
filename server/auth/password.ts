import bcrypt from 'bcryptjs';
import { config } from '../config/index.js';

/**
 * Módulo de Hashing Criptográfico de Senhas (Fase 58)
 *
 * DECISÃO ARQUITETURAL:
 * Adotado bcrypt (via bcryptjs) com salt rounds configurável (padrão 10).
 * Garante segurança robusta com resistência a ataques de força bruta / rainbow tables,
 * tempo constante de verificação e 100% de compatibilidade com Node.js 22
 * sem necessidade de compilação de binários nativos C++ no container.
 *
 * REGRAS DE SEGURANÇA:
 * - Proibido armazenar senhas em texto puro.
 * - Rejeição sumária de senhas vazias ou inválidas.
 */

const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 128;

export async function hashPassword(password: string): Promise<string> {
  if (!password || typeof password !== 'string') {
    throw new Error('Senha deve ser uma string não-vazia.');
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`Senha deve possuir no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`);
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    throw new Error(`Senha não pode exceder ${MAX_PASSWORD_LENGTH} caracteres.`);
  }

  const salt = await bcrypt.genSalt(config.auth.bcryptRounds);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (!password || !hash || typeof password !== 'string' || typeof hash !== 'string') {
    return false;
  }

  try {
    return await bcrypt.compare(password, hash);
  } catch {
    return false;
  }
}
