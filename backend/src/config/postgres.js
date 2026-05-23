/**
 * ══════════════════════════════════════════════════════════
 * POSTGRESQL DATABASE CONFIGURATION
 * ══════════════════════════════════════════════════════════
 */

import pg from 'pg';
import dotenv from 'dotenv';
import { URL } from 'url';

dotenv.config();

const { Pool } = pg;

// Verifica se DATABASE_URL está configurado
if (!process.env.DATABASE_URL) {
  console.error('❌ ERRO: DATABASE_URL não está configurado!');
  console.error('Configure a variável DATABASE_URL no Railway');
  process.exit(1);
}

// Parse DATABASE_URL e força configuração manual para evitar IPv6
let poolConfig;

try {
  const dbUrl = new URL(process.env.DATABASE_URL);
  
  poolConfig = {
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port) || 5432,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.slice(1), // Remove a barra inicial
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
  
  console.log(`🔗 Conectando ao banco: ${dbUrl.hostname}:${dbUrl.port}`);
} catch (error) {
  console.error('❌ ERRO: DATABASE_URL inválido!');
  console.error('Formato esperado: postgresql://user:password@host:5432/database');
  process.exit(1);
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
