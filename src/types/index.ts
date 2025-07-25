// Tipos e interfaces da aplicação

/**
 * Interface para o usuário do sistema
 */
export interface Usuario {
  cdUsuario: number;           // Chave única, chave primária, auto-incrementável
  login: string;               // Chave única, não pode ser nulo, máximo 250 caracteres
  senha: string;               // Senha criptografada retornada pela API (base64 + md5)
  nome: string;                // Não pode ser nulo, máximo 250 caracteres
  email: string;               // Chave única, não pode ser nulo, máximo 250 caracteres
  dataCadastro: string;        // DateTime, valor padrão: data e hora atual
  flAtivo: boolean;            // Valor padrão: true
  dtExpiracao?: string;        // DateTime, opcional
}

/**
 * Interface para criação de usuário (sem cdUsuario e dataCadastro)
 * IMPORTANTE: senha deve ser enviada em texto plano - API fará a criptografia
 */
export interface UsuarioCreate {
  login: string;
  senha: string;               // Senha em texto plano - será criptografada pela API
  nome: string;
  email: string;
  flAtivo?: boolean;
  dtExpiracao?: string;
}

/**
 * Interface para atualização de usuário (todos os campos opcionais exceto cdUsuario)
 * IMPORTANTE: senha, se fornecida, deve ser em texto plano - API fará a criptografia
 */
export interface UsuarioUpdate {
  login?: string;
  senha?: string;              // Nova senha em texto plano - será criptografada pela API
  nome?: string;
  email?: string;
  flAtivo?: boolean;
  dtExpiracao?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Tipos para configurações da API
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  retries?: number;
}

// Tipos para hooks personalizados
export interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Interface para resposta de autenticação
 */
export interface AuthResponse {
  usuario: Usuario;
  token?: string;
  message: string;
}

/**
 * Interface para formulário de login
 */
export interface LoginForm {
  login: string;
  senha: string;
}

/**
 * Enum para status do usuário
 */
export enum StatusUsuario {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
  EXPIRADO = 'EXPIRADO'
}

/**
 * Type para operações CRUD
 */
export type CrudOperation = 'create' | 'read' | 'update' | 'delete';

/**
 * Interface para paginação
 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Interface para resposta paginada
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

const types = {};
export default types;
