// Tipos e interfaces globais da aplicação

/**
 * Interface para resposta padrão da API
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

/**
 * Interface para erro da API
 */
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

/**
 * Interface para estado de loading
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

/**
 * Tipos para configurações da API
 */
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  retries?: number;
}

/**
 * Interface para resultado de hooks de API
 */
export interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
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

/**
 * Interface para configuração de formulários
 */
export interface FormConfig {
  autoFocus?: boolean;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
}

/**
 * Interface para validação de campos
 */
export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: any) => string | null;
}

/**
 * Type para temas da aplicação
 */
export type Theme = 'light' | 'dark' | 'auto';

/**
 * Interface para configurações da aplicação
 */
export interface AppConfig {
  theme: Theme;
  language: string;
  apiBaseUrl: string;
  timeout: number;
}

const types = {};
export default types;
