/**
 * ══════════════════════════════════════════════════════════
 * AUTH SERVICE
 * ══════════════════════════════════════════════════════════
 * Camada de serviço para lógica de autenticação
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config/env.js';

/**
 * Verifica se a senha está correta
 */
export const verifyPassword = async (password) => {
  // Por enquanto, comparação simples
  // Futuramente, pode usar bcrypt para senhas hasheadas
  return password === config.adminPassword;
};

/**
 * Gera um token JWT
 */
export const generateToken = (payload) => {
  return jwt.sign(
    {
      ...payload,
      timestamp: Date.now()
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
};

/**
 * Verifica e decodifica um token JWT
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    return null;
  }
};

/**
 * Gera hash de senha (para uso futuro)
 */
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compara senha com hash (para uso futuro)
 */
export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

export default {
  verifyPassword,
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword
};
