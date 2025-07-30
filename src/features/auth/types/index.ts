// Tipos relacionados à autenticação

export interface LoginCredentials {
  login: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    login: string;
    nome: string;
    email: string;
  };
  expiresIn: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: LoginResponse['user'] | null;
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
