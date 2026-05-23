/**
 * ══════════════════════════════════════════════════════════
 * GUEST CONTROLLER - POSTGRESQL
 * ══════════════════════════════════════════════════════════
 */

import database from '../config/database.js';

/**
 * GET /api/guests
 * Lista todos os convidados
 */
export const getAllGuests = async (req, res) => {
  try {
    const guests = await database.getAllGuests();
    
    res.json({
      success: true,
      message: 'Convidados recuperados com sucesso',
      data: {
        guests,
        total: guests.length
      }
    });
  } catch (error) {
    console.error('Erro ao buscar convidados:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar convidados'
    });
  }
};

/**
 * GET /api/guests/stats
 * Retorna estatísticas dos convidados
 */
export const getGuestStats = async (req, res) => {
  try {
    const stats = await database.getStats();
    
    const response = {
      total: parseInt(stats.total),
      going: parseInt(stats.going),
      notGoing: parseInt(stats.not_going),
      totalPeople: parseInt(stats.total_people),
      goingPeople: parseInt(stats.going_people),
      notGoingPeople: parseInt(stats.not_going_people),
      percentage: {
        going: stats.total > 0 ? Math.round((stats.going / stats.total) * 100) : 0,
        notGoing: stats.total > 0 ? Math.round((stats.not_going / stats.total) * 100) : 0
      }
    };

    res.json({
      success: true,
      message: 'Estatísticas recuperadas com sucesso',
      data: response
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar estatísticas'
    });
  }
};

/**
 * GET /api/guests/:id
 * Busca um convidado específico
 */
export const getGuestById = async (req, res) => {
  try {
    const { id } = req.params;
    const guest = await database.getGuestById(id);

    if (!guest) {
      return res.status(404).json({
        success: false,
        message: 'Convidado não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Convidado encontrado',
      data: guest
    });
  } catch (error) {
    console.error('Erro ao buscar convidado:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar convidado'
    });
  }
};

/**
 * POST /api/guests
 * Cria uma nova confirmação de presença
 */
export const createGuest = async (req, res) => {
  try {
    const { names, attendance } = req.body;

    // Validação
    if (!names || !Array.isArray(names) || names.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'É necessário informar pelo menos um nome'
      });
    }

    if (!attendance || !['going', 'not-going'].includes(attendance)) {
      return res.status(400).json({
        success: false,
        message: 'Status de presença inválido'
      });
    }

    // Limpa nomes vazios
    const cleanNames = names.map(n => n.trim()).filter(n => n !== '');

    if (cleanNames.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'É necessário informar pelo menos um nome válido'
      });
    }

    // Cria o convidado
    const newGuest = await database.addGuest({
      names: cleanNames,
      attendance
    });

    res.status(201).json({
      success: true,
      message: 'Confirmação registrada com sucesso',
      data: newGuest
    });
  } catch (error) {
    console.error('Erro ao criar convidado:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao registrar confirmação'
    });
  }
};

/**
 * PUT /api/guests/:id
 * Atualiza um convidado
 */
export const updateGuest = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Limpa nomes se fornecidos
    if (updates.names && Array.isArray(updates.names)) {
      updates.names = updates.names.map(n => n.trim()).filter(n => n !== '');
    }

    const updatedGuest = await database.updateGuest(id, updates);

    if (!updatedGuest) {
      return res.status(404).json({
        success: false,
        message: 'Convidado não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Convidado atualizado com sucesso',
      data: updatedGuest
    });
  } catch (error) {
    console.error('Erro ao atualizar convidado:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar convidado'
    });
  }
};

/**
 * DELETE /api/guests/:id
 * Remove um convidado
 */
export const deleteGuest = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await database.deleteGuest(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Convidado não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Convidado removido com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar convidado:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar convidado'
    });
  }
};
