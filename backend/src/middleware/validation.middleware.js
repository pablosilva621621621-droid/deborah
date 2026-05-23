/**
 * ══════════════════════════════════════════════════════════
 * VALIDATION MIDDLEWARE
 * ══════════════════════════════════════════════════════════
 */

import { validateGuestData, validateLoginData } from '../utils/validation.util.js';
import { badRequestResponse } from '../utils/response.util.js';

/**
 * Middleware para validar dados de convidado
 */
export const validateGuest = (req, res, next) => {
  const { isValid, errors } = validateGuestData(req.body);

  if (!isValid) {
    return badRequestResponse(res, 'Dados inválidos', errors);
  }

  next();
};

/**
 * Middleware para validar dados de login
 */
export const validateLogin = (req, res, next) => {
  const { isValid, errors } = validateLoginData(req.body);

  if (!isValid) {
    return badRequestResponse(res, 'Dados inválidos', errors);
  }

  next();
};

export default {
  validateGuest,
  validateLogin
};
