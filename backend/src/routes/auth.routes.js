/**
 * ══════════════════════════════════════════════════════════
 * AUTH ROUTES
 * ══════════════════════════════════════════════════════════
 */

import express from 'express';
import { login, verifyToken, logout } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// POST /api/auth/login - Login com senha
router.post('/login', login);

// GET /api/auth/verify - Verifica se o token é válido
router.get('/verify', authenticateToken, verifyToken);

// POST /api/auth/logout - Logout e invalida token
router.post('/logout', authenticateToken, logout);

export default router;
