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
  connectionTimeoutMillis: 15000, // Aumentado para 15 segundos
  query_timeout: 15000, // Timeout de query
  statement_timeout: 15000, // Timeout de statement
  // Força IPv4 para evitar problemas com IPv6
  family: 4,
  // Configurações adicionais para Railway
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
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
export const testConnection = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      if (i > 0) {
        console.log(`🔄 Tentativa ${i + 1} de ${retries}...`);
      }
      const client = await pool.connect();
      const result = await client.query('SELECT NOW()');
      client.release();
      console.log('✅ Conexão com banco de dados estabelecida');
      return true;
    } catch (error) {
      console.error(`❌ Tentativa ${i + 1} falhou:`, error.message);
      
      if (i === retries - 1) {
        console.error('\n❌ Não foi possível conectar ao banco de dados após múltiplas tentativas');
        console.error('📋 Detalhes do erro:', error.message);
        console.error('\n🔍 Verifique:');
        console.error('   1. DATABASE_URL está configurado corretamente');
        console.error('   2. Banco de dados está acessível');
        console.error('   3. Credenciais estão corretas');
        console.error('   4. Firewall/rede permite conexão');
        return false;
      }
      
      // Aguarda progressivamente mais tempo entre tentativas (2s, 4s, 6s, 8s)
      const waitTime = (i + 1) * 2000;
      console.log(`⏳ Aguardando ${waitTime/1000}s antes da próxima tentativa...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
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
