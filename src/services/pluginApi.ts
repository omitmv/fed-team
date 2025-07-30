import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ErrorLogger } from '../utils/errorHandler';

// Configuração específica para a API do plugin
export const PLUGIN_API_CONFIG = {
  BASE_URL: 'http://localhost:8080',
  TIMEOUT: 10000, // 10 segundos para operações de plugin
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// Configuração da instância do Axios para o plugin
const pluginApiClient: AxiosInstance = axios.create({
  baseURL: PLUGIN_API_CONFIG.BASE_URL,
  timeout: PLUGIN_API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Funções auxiliares para gerenciamento de token
const getStoredBearerToken = (): string | null => {
  try {
    return (window as any).pluginStorage?.bearerToken || null;
  } catch (error) {
    console.error('Erro ao recuperar token do plugin:', error);
    return null;
  }
};

// Interceptor para requisições do plugin
pluginApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log(`🔌 Plugin API: ${config.method?.toUpperCase()} ${config.url}`);
    
    // Adicionar token de autenticação se necessário
    const token = getStoredBearerToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    ErrorLogger.log(error, 'Plugin API Request Interceptor');
    return Promise.reject(error);
  }
);

// Interceptor para respostas do plugin
pluginApiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ Plugin API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    // Logging específico para erros do plugin
    ErrorLogger.log(error, 'Plugin API Response Error');
    
    if (error.response) {
      const { status, data } = error.response;
      console.error(`❌ Plugin API Error ${status}:`, data);
      
      // Tratamentos específicos para erros do plugin
      switch (status) {
        case 401:
          console.warn('Plugin API: Token inválido ou expirado');
          break;
        case 403:
          console.warn('Plugin API: Acesso negado ao plugin');
          break;
        case 404:
          console.warn('Plugin API: Endpoint não encontrado');
          break;
        case 500:
          console.error('Plugin API: Erro interno do plugin');
          break;
        case 503:
          console.error('Plugin API: Serviço indisponível');
          break;
      }
    } else if (error.request) {
      console.error('🔌 Plugin API: Erro de conexão - plugin não está respondendo');
    } else {
      console.error('⚙️ Plugin API: Erro na configuração da requisição:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Interface para respostas padronizadas do plugin
export interface PluginApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp?: string;
}

// Interface para status do plugin
export interface PluginStatus {
  online: boolean;
  version: string;
  uptime: number;
  lastUpdate: string;
}

// Interface para configurações do plugin
export interface PluginConfig {
  enabled: boolean;
  settings: Record<string, any>;
  endpoints: string[];
}

// Funções específicas para a API do plugin
export const pluginApi = {
  // Métodos HTTP básicos
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<PluginApiResponse<T>>> =>
    pluginApiClient.get(url, config),
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<PluginApiResponse<T>>> =>
    pluginApiClient.post(url, data, config),
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<PluginApiResponse<T>>> =>
    pluginApiClient.put(url, data, config),
  
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<PluginApiResponse<T>>> =>
    pluginApiClient.patch(url, data, config),
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<PluginApiResponse<T>>> =>
    pluginApiClient.delete(url, config),

  // Métodos específicos do plugin
  
  /**
   * Verifica o status do plugin
   */
  getStatus: (): Promise<AxiosResponse<PluginApiResponse<PluginStatus>>> =>
    pluginApiClient.get('/status'),

  /**
   * Obtém a configuração atual do plugin
   */
  getConfig: (): Promise<AxiosResponse<PluginApiResponse<PluginConfig>>> =>
    pluginApiClient.get('/config'),

  /**
   * Atualiza a configuração do plugin
   */
  updateConfig: (config: Partial<PluginConfig>): Promise<AxiosResponse<PluginApiResponse<PluginConfig>>> =>
    pluginApiClient.put('/config', config),

  /**
   * Reinicia o plugin
   */
  restart: (): Promise<AxiosResponse<PluginApiResponse<{ message: string }>>> =>
    pluginApiClient.post('/restart'),

  /**
   * Obtém logs do plugin
   */
  getLogs: (limit?: number): Promise<AxiosResponse<PluginApiResponse<string[]>>> =>
    pluginApiClient.get('/logs', { params: { limit } }),

  /**
   * Executa um comando específico no plugin
   */
  executeCommand: (command: string, params?: Record<string, any>): Promise<AxiosResponse<PluginApiResponse<any>>> =>
    pluginApiClient.post('/execute', { command, params }),

  /**
   * Obtém informações sobre dispositivos conectados
   */
  getDevices: (): Promise<AxiosResponse<PluginApiResponse<any[]>>> =>
    pluginApiClient.get('/devices'),

  /**
   * Conecta a um dispositivo específico
   */
  connectDevice: (deviceId: string): Promise<AxiosResponse<PluginApiResponse<{ connected: boolean }>>> =>
    pluginApiClient.post(`/devices/${deviceId}/connect`),

  /**
   * Desconecta de um dispositivo específico
   */
  disconnectDevice: (deviceId: string): Promise<AxiosResponse<PluginApiResponse<{ disconnected: boolean }>>> =>
    pluginApiClient.post(`/devices/${deviceId}/disconnect`),

  /**
   * Envia dados para um dispositivo
   */
  sendToDevice: (deviceId: string, data: any): Promise<AxiosResponse<PluginApiResponse<any>>> =>
    pluginApiClient.post(`/devices/${deviceId}/send`, data),

  /**
   * Verifica se o plugin está online/acessível
   */
  ping: (): Promise<AxiosResponse<PluginApiResponse<{ pong: boolean }>>> =>
    pluginApiClient.get('/ping'),

  // Métodos de gerenciamento de token Bearer

  /**
   * Salva o token Bearer no armazenamento do plugin
   */
  saveBearerToken: (token: string): void => {
    try {
      // Armazena o token no contexto do plugin
      (window as any).pluginStorage = (window as any).pluginStorage || {};
      (window as any).pluginStorage.bearerToken = token;
      console.log('🔐 Token Bearer salvo no plugin');
    } catch (error) {
      console.error('Erro ao salvar token no plugin:', error);
    }
  },

  /**
   * Recupera o token Bearer do armazenamento do plugin
   */
  getBearerToken: (): string | null => {
    return getStoredBearerToken();
  },

  /**
   * Limpa o token Bearer do armazenamento do plugin
   */
  clearBearerToken: (): void => {
    try {
      if ((window as any).pluginStorage) {
        delete (window as any).pluginStorage.bearerToken;
        console.log('🔐 Token Bearer removido do plugin');
      }
    } catch (error) {
      console.error('Erro ao limpar token do plugin:', error);
    }
  },
};

// Função utilitária para verificar se o plugin está disponível
export const isPluginAvailable = async (): Promise<boolean> => {
  try {
    await pluginApi.ping();
    return true;
  } catch (error) {
    console.warn('Plugin não está disponível:', error);
    return false;
  }
};

// Função para configurar timeouts personalizados
export const setPluginTimeout = (timeout: number) => {
  pluginApiClient.defaults.timeout = timeout;
};

export default pluginApiClient;
