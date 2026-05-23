/**
 * ══════════════════════════════════════════════════════════
 * POSTGRESQL DATABASE CONFIGURATION
 * ══════════════════════════════════════════════════════════
 */

import pg from 'pg';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

const { Pool } = pg;

// Força DNS resolver para IPv4 apenas
dns.setDefaultResultOrder('ipv4first');

// Verifica se DATABASE_URL está configurado
if (!process.env.DATABASE_URL) {
  console.error('❌ ERRO: DATABASE_URL não está configurado!');
  console.error('Configure a variável DATABASE_URL no Railway');
  process.exit(1);
}

// Configuração do pool - APENAS DATABASE_URL
const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 20000,
  query_timeout: 20000,
  statement_timeout: 20000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
};

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
