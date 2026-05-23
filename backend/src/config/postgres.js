/**
 * ══════════════════════════════════════════════════════════
 * POSTGRESQL DATABASE CONFIGURATION
 * ══════════════════════════════════════════════════════════
 */

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Configuração do pool de conexões com timeout aumentado
// Suporta tanto DATABASE_URL quanto variáveis individuais (PG*)
const poolConfig = {
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false // Necessário para Supabase e Railway
  } : false,
  max: 20, // Máximo de conexões no pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Aumentado para 10 segundos
  query_timeout: 10000, // Timeout de query
  statement_timeout: 10000, // Timeout de statement
};

// Prioriza DATABASE_URL se existir, senão usa variáveis individuais
if (process.env.DATABASE_URL) {
  poolConfig.connectionString = process.env.DATABASE_URL;
} else {
  poolConfig.host = process.env.PGHOST;
  poolConfig.port = process.env.PGPORT || 5432;
  poolConfig.user = process.env.PGUSER;
  poolConfig.password = process.env.PGPASSWORD;
  poolConfig.database = process.env.PGDATABASE;
}

export const pool = new Pool(poolConfig);

// Testa a conexão
pool.on('connect', () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('✅ Conectado ao PostgreSQL (Supabase)');
  }
});

pool.on('error', (err) => {
  console.error('❌ Erro inesperado no PostgreSQL:', err);
});

// Função para testar conexão com retry
export const testConnection = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      if (process.env.NODE_ENV === 'development' && i > 0) {
        console.log(`Tentativa ${i + 1} de ${retries}...`);
      }
      const client = await pool.connect();
      const result = await client.query('SELECT NOW()');
      client.release();
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Conexão com banco de dados testada');
      }
      return true;
    } catch (error) {
      if (i === retries - 1) {
        console.error('❌ Não foi possível conectar ao banco de dados');
        console.error('Erro:', error.message);
        return false;
      }
      // Aguarda 2 segundos antes de tentar novamente
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  return false;
};

// Função para executar queries
export const query = async (text, params) => {
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (error) {
    console.error('❌ Erro na query:', error.message);
    throw error;
  }
};

export default pool;
