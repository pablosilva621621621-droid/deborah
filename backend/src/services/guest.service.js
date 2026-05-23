/**
 * ══════════════════════════════════════════════════════════
 * GUEST SERVICE
 * ══════════════════════════════════════════════════════════
 * Camada de serviço para lógica de negócio dos convidados
 */

import database from '../config/database.js';

/**
 * Busca todos os convidados
 */
export const findAllGuests = () => {
  return database.getAllGuests();
};

/**
 * Busca convidado por ID
 */
export const findGuestById = (id) => {
  return database.getGuestById(id);
};

/**
 * Cria novo convidado
 */
export const createGuest = (guestData) => {
  // Limpa nomes vazios
  const cleanNames = guestData.names
    .map(name => name.trim())
    .filter(name => name !== '');

  const guest = {
    names: cleanNames,
    attendance: guestData.attendance
  };

  return database.addGuest(guest);
};

/**
 * Atualiza convidado
 */
export const updateGuest = (id, updates) => {
  // Se houver nomes, limpa-os
  if (updates.names) {
    updates.names = updates.names
      .map(name => name.trim())
      .filter(name => name !== '');
  }

  return database.updateGuest(id, updates);
};

/**
 * Remove convidado
 */
export const deleteGuest = (id) => {
  return database.deleteGuest(id);
};

/**
 * Calcula estatísticas dos convidados
 */
export const calculateStats = () => {
  const guests = database.getAllGuests();

  const going = guests.filter(g => g.attendance === 'going');
  const notGoing = guests.filter(g => g.attendance === 'not-going');

  const totalPeople = guests.reduce((sum, guest) => {
    return sum + (guest.names ? guest.names.length : 0);
  }, 0);

  const goingPeople = going.reduce((sum, guest) => {
    return sum + (guest.names ? guest.names.length : 0);
  }, 0);

  const notGoingPeople = notGoing.reduce((sum, guest) => {
    return sum + (guest.names ? guest.names.length : 0);
  }, 0);

  return {
    confirmations: {
      total: guests.length,
      going: going.length,
      notGoing: notGoing.length
    },
    people: {
      total: totalPeople,
      going: goingPeople,
      notGoing: notGoingPeople
    },
    percentage: {
      going: guests.length > 0 ? Math.round((going.length / guests.length) * 100) : 0,
      notGoing: guests.length > 0 ? Math.round((notGoing.length / guests.length) * 100) : 0
    }
  };
};

/**
 * Busca convidados por status de presença
 */
export const findGuestsByAttendance = (attendance) => {
  const guests = database.getAllGuests();
  return guests.filter(g => g.attendance === attendance);
};

export default {
  findAllGuests,
  findGuestById,
  createGuest,
  updateGuest,
  deleteGuest,
  calculateStats,
  findGuestsByAttendance
};
