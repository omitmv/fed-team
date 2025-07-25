// Constantes de configuração da aplicação

export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',
  TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT || '5000'),
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

export const APP_CONFIG = {
  NAME: 'Fed Team',
  VERSION: '1.0.0',
  ENVIRONMENT: process.env.NODE_ENV || 'development',
} as const;

export const ENDPOINTS = {
  USERS: '/users',
  USER_BY_ID: (id: number) => `/users/${id}`,
  // Adicione outros endpoints aqui conforme necessário
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  SERVER_ERROR: 'Erro interno do servidor. Tente novamente.',
  NOT_FOUND: 'Recurso não encontrado.',
  UNAUTHORIZED: 'Não autorizado. Faça login novamente.',
  GENERIC_ERROR: 'Ocorreu um erro inesperado.',
} as const;
