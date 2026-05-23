/**
 * ══════════════════════════════════════════════════════════
 * GUEST ROUTES
 * ══════════════════════════════════════════════════════════
 */

import express from 'express';
import {
  getAllGuests,
  getGuestById,
  createGuest,
  updateGuest,
  deleteGuest,
  getGuestStats
} from '../controllers/guest.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Rotas públicas (não requerem autenticação)
router.post('/', createGuest); // Criar confirmação de presença

// Rotas protegidas (requerem autenticação)
router.get('/', authenticateToken, getAllGuests); // Listar todos os convidados
router.get('/stats', authenticateToken, getGuestStats); // Estatísticas
router.get('/:id', authenticateToken, getGuestById); // Buscar convidado específico
router.put('/:id', authenticateToken, updateGuest); // Atualizar convidado
router.delete('/:id', authenticateToken, deleteGuest); // Deletar convidado

export default router;
