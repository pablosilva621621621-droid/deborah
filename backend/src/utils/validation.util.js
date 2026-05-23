/**
 * ══════════════════════════════════════════════════════════
 * VALIDATION UTILITIES
 * ══════════════════════════════════════════════════════════
 * Funções auxiliares para validação de dados
 */

/**
 * Valida se um campo é obrigatório
 */
export const isRequired = (value) => {
  return value !== undefined && value !== null && value !== '';
};

/**
 * Valida se é um array não vazio
 */
export const isNonEmptyArray = (value) => {
  return Array.isArray(value) && value.length > 0;
};

/**
 * Valida se é um email válido
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida se é um número válido
 */
export const isValidNumber = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

/**
 * Valida se está dentro de um conjunto de valores permitidos
 */
export const isInEnum = (value, allowedValues) => {
  return allowedValues.includes(value);
};

/**
 * Valida dados de convidado
 */
export const validateGuestData = (data) => {
  const errors = [];

  if (!isRequired(data.names)) {
    errors.push('O campo "names" é obrigatório');
  } else if (!isNonEmptyArray(data.names)) {
    errors.push('O campo "names" deve ser um array não vazio');
  } else {
    const validNames = data.names.filter(name => name && name.trim() !== '');
    if (validNames.length === 0) {
      errors.push('É necessário informar pelo menos um nome válido');
    }
  }

  if (!isRequired(data.attendance)) {
    errors.push('O campo "attendance" é obrigatório');
  } else if (!isInEnum(data.attendance, ['going', 'not-going'])) {
    errors.push('O campo "attendance" deve ser "going" ou "not-going"');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Valida dados de login
 */
export const validateLoginData = (data) => {
  const errors = [];

  if (!isRequired(data.password)) {
    errors.push('O campo "password" é obrigatório');
  } else if (data.password.length < 3) {
    errors.push('A senha deve ter pelo menos 3 caracteres');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export default {
  isRequired,
  isNonEmptyArray,
  isValidEmail,
  isValidNumber,
  isInEnum,
  validateGuestData,
  validateLoginData
};
