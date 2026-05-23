/**
 * ══════════════════════════════════════════════════════════
 * DATABASE OPERATIONS - POSTGRESQL
 * ══════════════════════════════════════════════════════════
 */

import { query } from './postgres.js';

export const database = {
  // Busca todos os convidados
  getAllGuests: async () => {
    const result = await query('SELECT * FROM guests ORDER BY created_at DESC');
    return result.rows;
  },

  // Busca convidado por ID
  getGuestById: async (id) => {
    const result = await query('SELECT * FROM guests WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  // Adiciona novo convidado
  addGuest: async (guest) => {
    const result = await query(
      'INSERT INTO guests (names, attendance) VALUES ($1, $2) RETURNING *',
      [guest.names, guest.attendance]
    );
    return result.rows[0];
  },

  // Atualiza convidado
  updateGuest: async (id, updates) => {
    const { names, attendance } = updates;
    const result = await query(
      'UPDATE guests SET names = COALESCE($1, names), attendance = COALESCE($2, attendance) WHERE id = $3 RETURNING *',
      [names, attendance, id]
    );
    return result.rows[0] || null;
  },

  // Remove convidado
  deleteGuest: async (id) => {
    const result = await query('DELETE FROM guests WHERE id = $1', [id]);
    return result.rowCount > 0;
  },

  // Limpa todos os dados (útil para testes)
  clearAll: async () => {
    await query('DELETE FROM guests');
    return true;
  },

  // Estatísticas
  getStats: async () => {
    const result = await query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE attendance = 'going') as going,
        COUNT(*) FILTER (WHERE attendance = 'not-going') as not_going,
        COALESCE(SUM(array_length(names, 1)), 0) as total_people,
        COALESCE(SUM(array_length(names, 1)) FILTER (WHERE attendance = 'going'), 0) as going_people,
        COALESCE(SUM(array_length(names, 1)) FILTER (WHERE attendance = 'not-going'), 0) as not_going_people
      FROM guests
    `);
    return result.rows[0];
  },

  // Sessões - Criar
  createSession: async (token, userRole, ipAddress, userAgent, expiresAt) => {
    const result = await query(
      'INSERT INTO sessions (token, user_role, ip_address, user_agent, expires_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [token, userRole, ipAddress, userAgent, expiresAt]
    );
    return result.rows[0];
  },

  // Sessões - Verificar
  getSession: async (token) => {
    const result = await query(
      'SELECT * FROM sessions WHERE token = $1 AND is_active = TRUE AND expires_at > CURRENT_TIMESTAMP',
      [token]
    );
    return result.rows[0] || null;
  },

  // Sessões - Invalidar
  invalidateSession: async (token) => {
    await query('UPDATE sessions SET is_active = FALSE WHERE token = $1', [token]);
    return true;
  },

  // Logs de acesso
  logAccess: async (action, ipAddress, userAgent, success, errorMessage = null) => {
    await query(
      'INSERT INTO access_logs (action, ip_address, user_agent, success, error_message) VALUES ($1, $2, $3, $4, $5)',
      [action, ipAddress, userAgent, success, errorMessage]
    );
  }
};

export default database;
