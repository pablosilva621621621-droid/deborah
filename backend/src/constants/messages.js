/**
 * ══════════════════════════════════════════════════════════
 * MESSAGES CONSTANTS
 * ══════════════════════════════════════════════════════════
 * Mensagens padronizadas da aplicação
 */

export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: 'Login realizado com sucesso',
  LOGIN_FAILED: 'Senha incorreta',
  TOKEN_INVALID: 'Token inválido ou expirado',
  TOKEN_MISSING: 'Token de autenticação não fornecido',
  TOKEN_VALID: 'Token válido',
  UNAUTHORIZED: 'Não autorizado'
};

export const GUEST_MESSAGES = {
  CREATED: 'Confirmação registrada com sucesso',
  UPDATED: 'Convidado atualizado com sucesso',
  DELETED: 'Convidado removido com sucesso',
  NOT_FOUND: 'Convidado não encontrado',
  LIST_SUCCESS: 'Convidados recuperados com sucesso',
  STATS_SUCCESS: 'Estatísticas recuperadas com sucesso',
  INVALID_DATA: 'Dados inválidos',
  NAMES_REQUIRED: 'É necessário informar pelo menos um nome',
  ATTENDANCE_REQUIRED: 'Status de presença é obrigatório',
  ATTENDANCE_INVALID: 'Status de presença inválido'
};

export const ERROR_MESSAGES = {
  INTERNAL_SERVER: 'Erro interno do servidor',
  NOT_FOUND: 'Recurso não encontrado',
  BAD_REQUEST: 'Requisição inválida',
  VALIDATION_FAILED: 'Falha na validação dos dados'
};

export default {
  AUTH_MESSAGES,
  GUEST_MESSAGES,
  ERROR_MESSAGES
};
