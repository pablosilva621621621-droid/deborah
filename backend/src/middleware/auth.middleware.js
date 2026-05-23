/**
 * ══════════════════════════════════════════════════════════
 * AUTH MIDDLEWARE - ULTRA SECURE
 * ══════════════════════════════════════════════════════════
 */

import jwt from 'jsonwebtoken';
import database from '../config/database.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token de autenticação não fornecido'
    });
  }

  try {
    // Verifica o JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verifica se a sessão está ativa no banco
    const session = await database.getSession(token);
    
    if (!session) {
      return res.status(403).json({
        success: false,
        message: 'Sessão inválida ou expirada'
      });
    }

    // Verifica se o IP é o mesmo (segurança extra)
    const currentIp = req.ip || req.connection.remoteAddress;
    if (session.ip_address && session.ip_address !== currentIp) {
      console.warn(`⚠️  IP diferente detectado! Sessão: ${session.ip_address}, Atual: ${currentIp}`);
      // Opcional: invalidar sessão se IP mudou
      // await database.invalidateSession(token);
      // return res.status(403).json({ success: false, message: 'IP não autorizado' });
    }

    req.user = decoded;
    req.session = session;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({
        success: false,
        message: 'Token expirado'
      });
    }
    
    return res.status(403).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

export default authenticateToken;
