/**
 * ══════════════════════════════════════════════════════════
 * RESPONSE UTILITIES
 * ══════════════════════════════════════════════════════════
 * Funções auxiliares para padronizar respostas da API
 */

export const successResponse = (res, data, message = 'Sucesso', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const errorResponse = (res, message = 'Erro', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

export const notFoundResponse = (res, message = 'Recurso não encontrado') => {
  return errorResponse(res, message, 404);
};

export const unauthorizedResponse = (res, message = 'Não autorizado') => {
  return errorResponse(res, message, 401);
};

export const badRequestResponse = (res, message = 'Requisição inválida', errors = null) => {
  return errorResponse(res, message, 400, errors);
};

export default {
  successResponse,
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
  badRequestResponse
};
