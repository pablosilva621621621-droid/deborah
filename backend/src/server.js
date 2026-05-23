/**
 * ══════════════════════════════════════════════════════════
 * DEBORAH BIRTHDAY PARTY - SERVER
 * ══════════════════════════════════════════════════════════
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.routes.js';
import guestRoutes from './routes/guest.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import { requestLogger } from './middleware/logger.middleware.js';
import { testConnection } from './config/postgres.js';
import { initDatabase, cleanExpiredSessions } from './config/init-database.js';

// Carrega variáveis de ambiente
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares ──────────────────────────────────────────
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger apenas em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  app.use(requestLogger);
}

// ── Rotas da API (ANTES dos arquivos estáticos) ──────────
app.get('/api', (req, res) => {
  res.json({
    message: '🌸 Deborah Birthday Party API',
    version: '2.0.0',
    status: 'online',
    database: 'PostgreSQL (Supabase)',
    security: 'Ultra Secure',
    endpoints: {
      auth: '/api/auth',
      guests: '/api/guests'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/guests', guestRoutes);

// ── Servir arquivos estáticos do frontend ────────────────
const frontendPath = path.join(__dirname, '../../frontend');

// Servir arquivos estáticos (CSS, JS, imagens)
app.use('/imagens', express.static(path.join(frontendPath, 'imagens')));
app.use('/lista', express.static(path.join(frontendPath, 'lista')));
app.use('/auth', express.static(path.join(frontendPath, 'auth')));
app.use('/dashboard', express.static(path.join(frontendPath, 'dashboard')));

// ── Rotas do Frontend (HTML pages) ───────────────────────
app.get('/login', (req, res) => {
  res.sendFile(path.join(frontendPath, 'auth', 'index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(frontendPath, 'dashboard', 'index.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'lista', 'index.html'));
});

// ── Error Handler ────────────────────────────────────────
app.use(errorHandler);

// ── 404 Handler ──────────────────────────────────────────
app.use('*', (req, res) => {
  // Se for uma rota de API, retorna JSON
  if (req.originalUrl.startsWith('/api')) {
    res.status(404).json({
      success: false,
      message: 'Endpoint não encontrado'
    });
  } else {
    // Caso contrário, redireciona para home
    res.redirect('/');
  }
});

// ── Inicia o servidor ────────────────────────────────────
const startServer = async () => {
  try {
    // Testa conexão com banco
    const connected = await testConnection();
    
    if (!connected) {
      process.exit(1);
    }

    // Inicializa tabelas
    await initDatabase();

    // Limpa sessões expiradas
    await cleanExpiredSessions();

    // Agenda limpeza de sessões a cada hora
    setInterval(cleanExpiredSessions, 60 * 60 * 1000);

    // Inicia servidor
    app.listen(PORT, () => {
      console.log(`\n🌸 ════════════════════════════════════════════════`);
      console.log(`   Deborah Birthday Party - Sistema Completo`);
      console.log(`   Servidor rodando em: http://localhost:${PORT}`);
      console.log(`   Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   Banco: PostgreSQL (Supabase) ✅`);
      console.log(`   Segurança: Ultra Secure 🔒`);
      console.log(`════════════════════════════════════════════════ 🌸`);
      console.log(``);
      console.log(`📍 Acesse:`);
      console.log(`   Formulário RSVP: http://localhost:${PORT}/`);
      console.log(`   Login:           http://localhost:${PORT}/login`);
      console.log(`   Dashboard:       http://localhost:${PORT}/dashboard`);
      console.log(``);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();

export default app;
