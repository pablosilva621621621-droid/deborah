/**
 * ══════════════════════════════════════════════════════════
 * DATABASE INITIALIZATION
 * ══════════════════════════════════════════════════════════
 * Cria as tabelas necessárias no PostgreSQL
 */

import { pool, query } from './postgres.js';

export const initDatabase = async () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 Inicializando banco de dados...');
  }

  try {
    // Tabela de convidados
    await query(`
      CREATE TABLE IF NOT EXISTS guests (
        id SERIAL PRIMARY KEY,
        names TEXT[] NOT NULL,
        attendance VARCHAR(20) NOT NULL CHECK (attendance IN ('going', 'not-going')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabela de sessões (para controle de tokens)
    await query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        token TEXT NOT NULL UNIQUE,
        user_role VARCHAR(50) NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        is_active BOOLEAN DEFAULT TRUE
      );
    `);

    // Tabela de logs de acesso (segurança)
    await query(`
      CREATE TABLE IF NOT EXISTS access_logs (
        id SERIAL PRIMARY KEY,
        action VARCHAR(100) NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        success BOOLEAN NOT NULL,
        error_message TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Índices para performance
    await query(`
      CREATE INDEX IF NOT EXISTS idx_guests_attendance ON guests(attendance);
    `);

    await query(`
      CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
    `);

    await query(`
      CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
    `);

    // Trigger para atualizar updated_at automaticamente
    await query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    await query(`
      DROP TRIGGER IF EXISTS update_guests_updated_at ON guests;
      CREATE TRIGGER update_guests_updated_at
        BEFORE UPDATE ON guests
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Banco de dados inicializado com sucesso!');
    }
    return true;
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error.message);
    return false;
  }
};

// Função para limpar sessões expiradas
export const cleanExpiredSessions = async () => {
  try {
    const result = await query(`
      DELETE FROM sessions 
      WHERE expires_at < CURRENT_TIMESTAMP OR is_active = FALSE
    `);
    if (process.env.NODE_ENV === 'development' && result.rowCount > 0) {
      console.log(`🧹 ${result.rowCount} sessões expiradas removidas`);
    }
  } catch (error) {
    // Silencioso em produção
  }
};

export default initDatabase;
