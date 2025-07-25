// Tipos globais da aplicação

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
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

export default {};
