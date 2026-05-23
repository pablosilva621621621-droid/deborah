/**
 * ══════════════════════════════════════════════════════════
 * ENVIRONMENT CONFIGURATION
 * ══════════════════════════════════════════════════════════
 * Centraliza todas as variáveis de ambiente
 */

import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Security
  jwtSecret: process.env.JWT_SECRET || 'default_secret_change_in_production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  adminPassword: process.env.ADMIN_PASSWORD || 'deborah2024',
  
  // CORS
  allowedOrigins: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  
  // Database (futuro)
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'deborah_party',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || ''
  }
};

// Validação de variáveis críticas
export const validateEnv = () => {
  const requiredVars = ['JWT_SECRET', 'ADMIN_PASSWORD'];
  const missing = [];

  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });

  if (missing.length > 0 && config.nodeEnv === 'production') {
    console.warn(`⚠️  Variáveis de ambiente faltando: ${missing.join(', ')}`);
    console.warn('⚠️  Usando valores padrão. Configure o .env para produção!');
  }
};

export default config;
