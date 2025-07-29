// Constantes de configuração da aplicação

export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://192.168.50.174:8080',
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
  // Endpoints para usuários seguindo a especificação da API
  USUARIOS: '/v1/usuarios',
  USUARIO_BY_ID: (id: number) => `/v1/usuarios/${id}`,
  
  // Endpoints legados (manter para compatibilidade se necessário)
  USERS: '/users',
  USER_BY_ID: (id: number) => `/users/${id}`,
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
  
  // Mensagens específicas para usuários
  USUARIO_NOT_FOUND: 'Usuário não encontrado.',
  LOGIN_ALREADY_EXISTS: 'Login já existe no sistema.',
  EMAIL_ALREADY_EXISTS: 'E-mail já existe no sistema.',
  INVALID_CREDENTIALS: 'Login ou senha inválidos.',
  USER_EXPIRED: 'Usuário expirado.',
  USER_INACTIVE: 'Usuário inativo.',
} as const;

export const VALIDATION_RULES = {
  LOGIN_MAX_LENGTH: 250,
  NOME_MAX_LENGTH: 250,
  EMAIL_MAX_LENGTH: 250,
  PASSWORD_MIN_LENGTH: 6,
} as const;
