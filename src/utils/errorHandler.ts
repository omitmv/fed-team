import { AxiosError } from 'axios';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants';

/**
 * Utilitário para tratamento de erros da API
 */
export class ApiErrorHandler {
  /**
   * Trata erros de requisições Axios e retorna uma mensagem amigável
   * @param error - Erro capturado
   * @returns Mensagem de erro formatada
   */
  static handleError(error: unknown): string {
    if (error instanceof AxiosError) {
      // Erro de resposta do servidor
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message;

        switch (status) {
          case HTTP_STATUS.BAD_REQUEST:
            return message || 'Dados inválidos enviados.';
          case HTTP_STATUS.UNAUTHORIZED:
            return ERROR_MESSAGES.UNAUTHORIZED;
          case HTTP_STATUS.FORBIDDEN:
            return 'Acesso negado.';
          case HTTP_STATUS.NOT_FOUND:
            return ERROR_MESSAGES.NOT_FOUND;
          case HTTP_STATUS.INTERNAL_SERVER_ERROR:
            return ERROR_MESSAGES.SERVER_ERROR;
          default:
            return message || `Erro ${status}: ${error.response.statusText}`;
        }
      }

      // Erro de requisição (sem resposta do servidor)
      if (error.request) {
        return ERROR_MESSAGES.NETWORK_ERROR;
      }

      // Erro de configuração
      return error.message || ERROR_MESSAGES.GENERIC_ERROR;
    }

    // Erro genérico
    if (error instanceof Error) {
      return error.message;
    }

    return ERROR_MESSAGES.GENERIC_ERROR;
  }

  /**
   * Verifica se o erro é de rede
   * @param error - Erro capturado
   * @returns true se for erro de rede
   */
  static isNetworkError(error: unknown): boolean {
    return error instanceof AxiosError && !error.response;
  }

  /**
   * Verifica se o erro é de servidor (5xx)
   * @param error - Erro capturado
   * @returns true se for erro de servidor
   */
  static isServerError(error: unknown): boolean {
    if (error instanceof AxiosError && error.response) {
      return error.response.status >= 500;
    }
    return false;
  }

  /**
   * Verifica se o erro é de cliente (4xx)
   * @param error - Erro capturado
   * @returns true se for erro de cliente
   */
  static isClientError(error: unknown): boolean {
    if (error instanceof AxiosError && error.response) {
      const status = error.response.status;
      return status >= 400 && status < 500;
    }
    return false;
  }
}

/**
 * Utilitário para logging de erros
 */
export class ErrorLogger {
  /**
   * Registra erro no console com informações detalhadas
   * @param error - Erro capturado
   * @param context - Contexto adicional
   */
  static log(error: unknown, context?: string): void {
    const timestamp = new Date().toISOString();
    const prefix = context ? `[${context}]` : '[Error]';
    
    console.group(`${prefix} ${timestamp}`);
    
    if (error instanceof AxiosError) {
      console.error('Axios Error:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
        },
      });
    } else if (error instanceof Error) {
      console.error('Generic Error:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    } else {
      console.error('Unknown Error:', error);
    }
    
    console.groupEnd();
  }
}

/**
 * Função utilitária para retry de operações
 * @param fn - Função a ser executada
 * @param maxAttempts - Número máximo de tentativas
 * @param delay - Delay entre tentativas em ms
 * @returns Promise com o resultado
 */
export async function retryOperation<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      ErrorLogger.log(error, `Retry attempt ${attempt}/${maxAttempts}`);
      
      if (attempt === maxAttempts) {
        throw error;
      }

      // Aguarda antes da próxima tentativa
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError;
}
