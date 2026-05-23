/**
 * ══════════════════════════════════════════════════════════
 * AUTH CONTROLLER - ULTRA SECURE
 * ══════════════════════════════════════════════════════════
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import database from '../config/database.js';

/**
 * POST /api/auth/login
 * Autentica o usuário com senha
 */
export const login = async (req, res) => {
  const ipAddress = req.ip || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'];

  try {
    const { password } = req.body;

    // Validação
    if (!password) {
      await database.logAccess('LOGIN_ATTEMPT', ipAddress, userAgent, false, 'Senha não fornecida');
      return res.status(400).json({
        success: false,
        message: 'Senha é obrigatória'
      });
    }

    // Verifica a senha
    const adminPassword = process.env.ADMIN_PASSWORD || 'deborah2026';
    
    if (password !== adminPassword) {
      await database.logAccess('LOGIN_ATTEMPT', ipAddress, userAgent, false, 'Senha incorreta');
      return res.status(401).json({
        success: false,
        message: 'Senha incorreta'
      });
    }

    // Gera o token JWT
    const token = jwt.sign(
      { 
        role: 'admin',
        timestamp: Date.now(),
        ip: ipAddress
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Calcula data de expiração
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Salva a sessão no banco
    await database.createSession(token, 'admin', ipAddress, userAgent, expiresAt);

    // Log de sucesso
    await database.logAccess('LOGIN_SUCCESS', ipAddress, userAgent, true);

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        token,
        expiresIn: '24h',
        expiresAt: expiresAt.toISOString()
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    await database.logAccess('LOGIN_ERROR', ipAddress, userAgent, false, error.message);
    res.status(500).json({
      success: false,
      message: 'Erro ao realizar login'
    });
  }
};

/**
 * GET /api/auth/verify
 * Verifica se o token é válido
 */
export const verifyToken = async (req, res) => {
  try {
    // Verifica se a sessão está ativa no banco
    const token = req.headers['authorization']?.split(' ')[1];
    const session = await database.getSession(token);

    if (!session) {
      return res.status(401).json({
        success: false,
        message: 'Sessão inválida ou expirada'
      });
    }

    res.json({
      success: true,
      message: 'Token válido',
      data: {
        user: req.user,
        session: {
          createdAt: session.created_at,
          expiresAt: session.expires_at
        }
      }
    });
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar token'
    });
  }
};

/**
 * POST /api/auth/logout
 * Faz logout e invalida o token
 */
export const logout = async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (token) {
      await database.invalidateSession(token);
    }

    res.json({
      success: true,
      message: 'Logout realizado com sucesso'
    });
  } catch (error) {
    console.error('Erro no logout:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao realizar logout'
    });
  }
};
