import { useState, useEffect, useCallback } from 'react';
import { pluginApi, isPluginAvailable, PluginConfig } from '../services/pluginApi';
import { PLUGIN_STATUS_CODES, PluginStatusCode } from '../constants/pluginConstants';

// Interface para o estado do plugin
interface PluginState {
  isConnected: boolean;
  status: PluginStatusCode;
  config: PluginConfig | null;
  devices: any[];
  logs: string[];
  loading: boolean;
  error: string | null;
}

// Interface para o retorno do hook
interface UsePluginReturn extends PluginState {
  // Métodos de conexão
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  checkConnection: () => Promise<boolean>;
  
  // Métodos de configuração
  getConfig: () => Promise<void>;
  updateConfig: (config: Partial<PluginConfig>) => Promise<void>;
  restart: () => Promise<void>;
  
  // Métodos de dispositivos
  scanDevices: () => Promise<void>;
  connectDevice: (deviceId: string) => Promise<void>;
  disconnectDevice: (deviceId: string) => Promise<void>;
  sendToDevice: (deviceId: string, data: any) => Promise<void>;
  
  // Métodos de logs e monitoramento
  getLogs: (limit?: number) => Promise<void>;
  executeCommand: (command: string, params?: Record<string, any>) => Promise<any>;
  
  // Métodos utilitários
  clearError: () => void;
  refresh: () => Promise<void>;
}

// Estado inicial
const initialState: PluginState = {
  isConnected: false,
  status: PLUGIN_STATUS_CODES.OFFLINE,
  config: null,
  devices: [],
  logs: [],
  loading: false,
  error: null,
};

export const usePlugin = (): UsePluginReturn => {
  const [state, setState] = useState<PluginState>(initialState);

  // Função auxiliar para atualizar o estado
  const updateState = useCallback((updates: Partial<PluginState>) => {
    setState(prevState => ({ ...prevState, ...updates }));
  }, []);

  // Função auxiliar para lidar com erros
  const handleError = useCallback((error: any, context: string) => {
    console.error(`Plugin Error (${context}):`, error);
    const errorMessage = error.response?.data?.error || error.message || 'Erro desconhecido';
    updateState({ 
      error: errorMessage, 
      loading: false,
      status: PLUGIN_STATUS_CODES.ERROR 
    });
  }, [updateState]);

  // Verificar conexão com o plugin
  const checkConnection = useCallback(async (): Promise<boolean> => {
    try {
      const available = await isPluginAvailable();
      updateState({ 
        isConnected: available,
        status: available ? PLUGIN_STATUS_CODES.ONLINE : PLUGIN_STATUS_CODES.OFFLINE
      });
      return available;
    } catch (error) {
      updateState({ 
        isConnected: false,
        status: PLUGIN_STATUS_CODES.OFFLINE 
      });
      return false;
    }
  }, [updateState]);

  // Conectar ao plugin
  const connect = useCallback(async (): Promise<void> => {
    updateState({ loading: true, error: null });
    try {
      const response = await pluginApi.getStatus();
      if (response.data.success) {
        updateState({
          isConnected: true,
          status: PLUGIN_STATUS_CODES.ONLINE,
          loading: false
        });
      }
    } catch (error) {
      handleError(error, 'connect');
    }
  }, [updateState, handleError]);

  // Desconectar do plugin
  const disconnect = useCallback(async (): Promise<void> => {
    updateState({
      isConnected: false,
      status: PLUGIN_STATUS_CODES.OFFLINE,
      config: null,
      devices: [],
      logs: []
    });
  }, [updateState]);

  // Obter configuração do plugin
  const getConfig = useCallback(async (): Promise<void> => {
    updateState({ loading: true, error: null });
    try {
      const response = await pluginApi.getConfig();
      if (response.data.success && response.data.data) {
        updateState({
          config: response.data.data,
          loading: false
        });
      }
    } catch (error) {
      handleError(error, 'getConfig');
    }
  }, [updateState, handleError]);

  // Atualizar configuração do plugin
  const updateConfig = useCallback(async (config: Partial<PluginConfig>): Promise<void> => {
    updateState({ loading: true, error: null });
    try {
      const response = await pluginApi.updateConfig(config);
      if (response.data.success && response.data.data) {
        updateState({
          config: response.data.data,
          loading: false
        });
      }
    } catch (error) {
      handleError(error, 'updateConfig');
    }
  }, [updateState, handleError]);

  // Reiniciar plugin
  const restart = useCallback(async (): Promise<void> => {
    updateState({ loading: true, error: null });
    try {
      await pluginApi.restart();
      updateState({
        status: PLUGIN_STATUS_CODES.CONNECTING,
        loading: false
      });
      
      // Aguardar um pouco e tentar reconectar
      setTimeout(async () => {
        await checkConnection();
      }, 3000);
    } catch (error) {
      handleError(error, 'restart');
    }
  }, [updateState, handleError, checkConnection]);

  // Escanear dispositivos
  const scanDevices = useCallback(async (): Promise<void> => {
    updateState({ loading: true, error: null });
    try {
      const response = await pluginApi.getDevices();
      if (response.data.success && response.data.data) {
        updateState({
          devices: response.data.data,
          loading: false
        });
      }
    } catch (error) {
      handleError(error, 'scanDevices');
    }
  }, [updateState, handleError]);

  // Conectar dispositivo
  const connectDevice = useCallback(async (deviceId: string): Promise<void> => {
    updateState({ loading: true, error: null });
    try {
      const response = await pluginApi.connectDevice(deviceId);
      if (response.data.success) {
        // Atualizar lista de dispositivos
        await scanDevices();
      }
    } catch (error) {
      handleError(error, 'connectDevice');
    }
  }, [updateState, handleError, scanDevices]);

  // Desconectar dispositivo
  const disconnectDevice = useCallback(async (deviceId: string): Promise<void> => {
    updateState({ loading: true, error: null });
    try {
      const response = await pluginApi.disconnectDevice(deviceId);
      if (response.data.success) {
        // Atualizar lista de dispositivos
        await scanDevices();
      }
    } catch (error) {
      handleError(error, 'disconnectDevice');
    }
  }, [updateState, handleError, scanDevices]);

  // Enviar dados para dispositivo
  const sendToDevice = useCallback(async (deviceId: string, data: any): Promise<void> => {
    updateState({ loading: true, error: null });
    try {
      const response = await pluginApi.sendToDevice(deviceId, data);
      if (response.data.success) {
        updateState({ loading: false });
      }
    } catch (error) {
      handleError(error, 'sendToDevice');
    }
  }, [updateState, handleError]);

  // Obter logs
  const getLogs = useCallback(async (limit: number = 100): Promise<void> => {
    updateState({ loading: true, error: null });
    try {
      const response = await pluginApi.getLogs(limit);
      if (response.data.success && response.data.data) {
        updateState({
          logs: response.data.data,
          loading: false
        });
      }
    } catch (error) {
      handleError(error, 'getLogs');
    }
  }, [updateState, handleError]);

  // Executar comando
  const executeCommand = useCallback(async (command: string, params?: Record<string, any>): Promise<any> => {
    updateState({ loading: true, error: null });
    try {
      const response = await pluginApi.executeCommand(command, params);
      updateState({ loading: false });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Comando falhou');
      }
    } catch (error) {
      handleError(error, 'executeCommand');
      throw error;
    }
  }, [updateState, handleError]);

  // Limpar erro
  const clearError = useCallback((): void => {
    updateState({ error: null });
  }, [updateState]);

  // Atualizar todos os dados
  const refresh = useCallback(async (): Promise<void> => {
    if (state.isConnected) {
      await Promise.all([
        getConfig(),
        scanDevices(),
        getLogs(50)
      ]);
    }
  }, [state.isConnected, getConfig, scanDevices, getLogs]);

  // Verificar conexão automaticamente ao montar o componente
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  // Polling periódico para verificar status (opcional)
  useEffect(() => {
    const interval = setInterval(() => {
      if (state.isConnected) {
        checkConnection();
      }
    }, 30000); // Verificar a cada 30 segundos

    return () => clearInterval(interval);
  }, [state.isConnected, checkConnection]);

  return {
    // Estado
    ...state,
    
    // Métodos
    connect,
    disconnect,
    checkConnection,
    getConfig,
    updateConfig,
    restart,
    scanDevices,
    connectDevice,
    disconnectDevice,
    sendToDevice,
    getLogs,
    executeCommand,
    clearError,
    refresh,
  };
};
