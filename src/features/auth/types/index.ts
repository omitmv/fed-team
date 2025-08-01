// Tipos relacionados à autenticação

export interface LoginCredentials {
  login: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  cdUsuario: number;
  login: string;
  nome: string;
  email: string;
  expiresIn: number;
  cdTpAcesso: number;
  tipoAcesso: string;
}

export interface User {
  id: string;
  login: string;
  nome: string;
  email: string;
  cdTpAcesso: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}
