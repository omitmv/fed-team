import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '../constants';
import { ErrorLogger } from '../utils/errorHandler';
import { authService } from './authService';

// Configuração da instância do Axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para requisições
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Log da requisição
    console.log(`🚀 Fazendo requisição: ${config.method?.toUpperCase()} ${config.url}`);
    
    // Adicionar Bearer Token para endpoints que precisam de autenticação
    if (config.url && authService.needsAuthentication(config.url)) {
      const bearerToken = authService.getBearerToken();
      
      if (bearerToken) {
        config.headers.Authorization = bearerToken;
        console.log(`🔐 Token adicionado para: ${config.url}`);
      } else {
        console.warn(`⚠️  Token não encontrado para requisição autenticada: ${config.url}`);
      }
    } else {
      console.log(`🔓 Requisição pública (sem token): ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    ErrorLogger.log(error, 'Request Interceptor');
    return Promise.reject(error);
  }
);

// Interceptor para respostas
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Tratamento de resposta bem-sucedida
    console.log(`✅ Resposta recebida: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    // Tratamento de erros com logging detalhado
    ErrorLogger.log(error, 'API Response Error');
    
    // Tratamento específico para diferentes tipos de erro
    if (error.response) {
      // O servidor respondeu com um status de erro
      const { status, data, config } = error.response;
      console.error(`❌ Erro ${status}:`, data);
      
      // Tratamentos específicos por status
      switch (status) {
        case 401:
          // Token inválido/expirado - fazer logout automático
          console.warn('🚫 Token inválido ou expirado - realizando logout automático');
          authService.logout();
          
          // Redirecionar para página de autenticação (somente se não for a própria página de login)
          if (!config.url?.includes('/v1/usuario/login')) {
            window.location.href = '/auth';
          }
          break;
        case 403:
          console.warn('🔒 Acesso negado - permissões insuficientes');
          break;
        case 404:
          console.warn('🔍 Recurso não encontrado');
          break;
        case 500:
          console.error('🔥 Erro interno do servidor');
          break;
      }
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error('🔌 Erro de conexão - sem resposta do servidor');
    } else {
      // Algo aconteceu na configuração da requisição
      console.error('⚙️ Erro na configuração da requisição:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Funções auxiliares para diferentes tipos de requisição
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.get(url, config),
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.post(url, data, config),
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.put(url, data, config),
  
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.patch(url, data, config),
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.delete(url, config),
};

export default apiClient;
