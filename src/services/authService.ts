/**
 * Serviço de gerenciamento de autenticação
 * Responsável por gerenciar tokens, login, logout e estado de autenticação
 */

import { pluginApi } from './pluginApi';

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

export interface AuthUser {
  id: string;
  nome: string;
  login: string;
  email?: string;
  perfil?: string;
  cdTpAcesso: number;
}

const USER_KEY = 'fed_team_user';
const REFRESH_TOKEN_KEY = 'fed_team_refresh_token';

class AuthService {
  /**
   * Salva o token de acesso usando o pluginApi
   */
  setAccessToken(token: string): void {
    pluginApi.saveBearerToken(token);
  }

  /**
   * Recupera o token de acesso usando o pluginApi
   */
  getAccessToken(): string | null {
    return pluginApi.getBearerToken();
  }

  /**
   * Salva o refresh token no localStorage
   */
  setRefreshToken(refreshToken: string): void {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  /**
   * Recupera o refresh token do localStorage
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  /**
   * Salva os dados do usuário no localStorage
   */
  setUser(user: AuthUser): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  /**
   * Recupera os dados do usuário do localStorage
   */
  getUser(): AuthUser | null {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Erro ao parsear dados do usuário:', error);
        this.clearUser();
        return null;
      }
    }
    return null;
  }

  /**
   * Salva o login completo (token + usuário)
   */
  setAuthData(token: string, user: AuthUser, refreshToken?: string): void {
    this.setAccessToken(token);
    this.setUser(user);
    if (refreshToken) {
      this.setRefreshToken(refreshToken);
    }
  }

  /**
   * Verifica se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    const user = this.getUser();
    return !!(token && user);
  }

  /**
   * Limpa apenas o token de acesso
   */
  clearToken(): void {
    pluginApi.clearBearerToken();
  }

  /**
   * Limpa apenas os dados do usuário
   */
  clearUser(): void {
    localStorage.removeItem(USER_KEY);
  }

  /**
   * Limpa apenas o refresh token
   */
  clearRefreshToken(): void {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  /**
   * Limpa todos os dados de autenticação
   */
  clearAuth(): void {
    this.clearToken();
    this.clearUser();
    this.clearRefreshToken();
  }

  /**
   * Realiza logout completo
   */
  logout(): void {
    this.clearAuth();
    // Opcional: Redirecionar para página de login
    // window.location.href = '/auth';
  }

  /**
   * Verifica se uma URL precisa de autenticação
   */
  needsAuthentication(url: string): boolean {
    // Lista de endpoints que NÃO precisam de autenticação
    const publicEndpoints = [
      '/v1/usuario/login',
    ];

    // Verifica se a URL está na lista de endpoints públicos
    return !publicEndpoints.some(endpoint => url.includes(endpoint));
  }

  /**
   * Formata o token para o header Authorization
   */
  getBearerToken(): string | null {
    const token = this.getAccessToken();
    return token ? `Bearer ${token}` : null;
  }

  /**
   * Verifica se o token está expirado (se houver informação de expiração)
   */
  isTokenExpired(): boolean {
    // Implementação básica - pode ser expandida se você tiver informações de expiração
    const token = this.getAccessToken();
    if (!token) return true;

    try {
      // Se o token for JWT, você pode decodificar e verificar a expiração
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      if (tokenPayload.exp) {
        return Date.now() >= tokenPayload.exp * 1000;
      }
    } catch (error) {
      // Se não for possível decodificar, assumir que não está expirado
      console.warn('Não foi possível verificar expiração do token:', error);
    }

    return false;
  }

  /**
   * Valida se o token atual ainda é válido
   */
  isTokenValid(): boolean {
    return this.getAccessToken() !== null && !this.isTokenExpired();
  }
}

// Instância singleton do serviço de autenticação
export const authService = new AuthService();

export default authService;
