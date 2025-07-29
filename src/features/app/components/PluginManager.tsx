import React from 'react';
import { usePlugin } from '../../../hooks/usePlugin';
import './PluginManager.css';

declare global {
  interface Window {
    AndroidBridge?: {
      mostrarToast: (msg: string) => void;
      abrirCamera: () => Promise<void>;
      getUUID: () => Promise<string | undefined>;
    };
  }
}

const PluginManager: React.FC = () => {
  const {
    isConnected,
    status,
    config,
    devices,
    logs,
    loading,
    error,
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
  } = usePlugin();

  const handleConnect = async () => {
    await connect();
    if (isConnected) {
      await refresh();
    }
  };

  const handleTestCommand = async () => {
    try {
      const result = await executeCommand('system.info');
      console.log('Comando executado:', result);
    } catch (error) {
      console.error('Erro ao executar comando:', error);
    }
  };

  const handleDeviceAction = async (deviceId: string, action: 'connect' | 'disconnect') => {
    if (action === 'connect') {
      await connectDevice(deviceId);
    } else {
      await disconnectDevice(deviceId);
    }
  };

  const handleSendData = async (deviceId: string) => {
    const data = { message: 'Hello from React!', timestamp: Date.now() };
    await sendToDevice(deviceId, data);
  };

  const NativeBridge = {
    mostrarToast: (message: string) => {
      if (window.AndroidBridge && typeof window.AndroidBridge.mostrarToast === 'function') {
        window.AndroidBridge.mostrarToast(message);
      }
    },
    abrirCamera: async () => {
      if (window.AndroidBridge && typeof window.AndroidBridge.abrirCamera === 'function') {
        const ret = await window.AndroidBridge.abrirCamera();
        console.log('Câmera aberta:', ret);
      }
    },
    getUUID: async () => {
      if (window.AndroidBridge && typeof window.AndroidBridge.getUUID === 'function') {
        const uuid = await window.AndroidBridge.getUUID();
        console.log('UUID recuperado:', uuid);
        return uuid;
      }
    }
  };

  return (
    <div className="plugin-manager">
      <div className="plugin-header">
        <h2>Gerenciador de Plugin</h2>
        <div className="plugin-status">
          <span className={`status-indicator ${status}`}></span>
          <span className="status-text">
            {isConnected ? 'Conectado' : 'Desconectado'} - {status}
          </span>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <span>❌ {error}</span>
          <button onClick={clearError} className="btn-close">×</button>
        </div>
      )}

      <div className="plugin-controls">
        <div className="control-group">
          <h3>Conexão</h3>
          <div className="button-group">
            <button className='btn' onClick={() => NativeBridge.getUUID()}>Recuperar UUID</button>
            <button className='btn' onClick={() => NativeBridge.abrirCamera()}>Abrir Câmera</button>
            <button className='btn' onClick={() => NativeBridge.mostrarToast('Olá, mundo!')}>Mostrar Toast</button>
            <button 
              onClick={handleConnect} 
              disabled={loading || isConnected}
              className="btn btn-success"
            >
              {loading ? 'Conectando...' : 'Conectar'}
            </button>
            <button 
              onClick={disconnect} 
              disabled={loading || !isConnected}
              className="btn btn-secondary"
            >
              Desconectar
            </button>
            <button 
              onClick={checkConnection} 
              disabled={loading}
              className="btn btn-primary"
            >
              Verificar Status
            </button>
            <button 
              onClick={refresh} 
              disabled={loading || !isConnected}
              className="btn btn-primary"
            >
              Atualizar
            </button>
          </div>
        </div>

        <div className="control-group">
          <h3>Sistema</h3>
          <div className="button-group">
            <button 
              onClick={restart} 
              disabled={loading || !isConnected}
              className="btn btn-warning"
            >
              Reiniciar Plugin
            </button>
            <button 
              onClick={handleTestCommand} 
              disabled={loading || !isConnected}
              className="btn btn-info"
            >
              Testar Comando
            </button>
            <button 
              onClick={() => getLogs(50)} 
              disabled={loading || !isConnected}
              className="btn btn-info"
            >
              Carregar Logs
            </button>
          </div>
        </div>
      </div>

      {isConnected && (
        <div className="plugin-content">
          <div className="content-section">
            <h3>Configuração</h3>
            {config ? (
              <div className="config-display">
                <p><strong>Habilitado:</strong> {config.enabled ? 'Sim' : 'Não'}</p>
                <p><strong>Endpoints:</strong> {config.endpoints?.length || 0}</p>
                <div className="config-actions">
                  <button 
                    onClick={getConfig} 
                    disabled={loading}
                    className="btn btn-sm btn-secondary"
                  >
                    Recarregar Config
                  </button>
                  <button 
                    onClick={() => updateConfig({ enabled: !config.enabled })} 
                    disabled={loading}
                    className="btn btn-sm btn-primary"
                  >
                    Toggle Habilitado
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p>Configuração não carregada</p>
                <button 
                  onClick={getConfig} 
                  disabled={loading}
                  className="btn btn-sm btn-primary"
                >
                  Carregar Configuração
                </button>
              </div>
            )}
          </div>

          <div className="content-section">
            <h3>Dispositivos ({devices.length})</h3>
            <div className="devices-actions">
              <button 
                onClick={scanDevices} 
                disabled={loading}
                className="btn btn-sm btn-primary"
              >
                Escanear Dispositivos
              </button>
            </div>
            <div className="devices-list">
              {devices.length > 0 ? (
                devices.map((device, index) => (
                  <div key={device.id || index} className="device-item">
                    <div className="device-info">
                      <strong>{device.name || `Dispositivo ${index + 1}`}</strong>
                      <span className="device-id">ID: {device.id || 'N/A'}</span>
                      <span className={`device-status ${device.connected ? 'connected' : 'disconnected'}`}>
                        {device.connected ? 'Conectado' : 'Desconectado'}
                      </span>
                    </div>
                    <div className="device-actions">
                      <button 
                        onClick={() => handleDeviceAction(device.id, device.connected ? 'disconnect' : 'connect')}
                        disabled={loading}
                        className={`btn btn-sm ${device.connected ? 'btn-warning' : 'btn-success'}`}
                      >
                        {device.connected ? 'Desconectar' : 'Conectar'}
                      </button>
                      <button 
                        onClick={() => handleSendData(device.id)}
                        disabled={loading || !device.connected}
                        className="btn btn-sm btn-info"
                      >
                        Enviar Dados
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-devices">Nenhum dispositivo encontrado</p>
              )}
            </div>
          </div>

          <div className="content-section">
            <h3>Logs ({logs.length})</h3>
            <div className="logs-container">
              {logs.length > 0 ? (
                <div className="logs-list">
                  {logs.slice(0, 10).map((log, index) => (
                    <div key={index} className="log-item">
                      {log}
                    </div>
                  ))}
                  {logs.length > 10 && (
                    <div className="log-item more">
                      ... e mais {logs.length - 10} entradas
                    </div>
                  )}
                </div>
              ) : (
                <p className="no-logs">Nenhum log disponível</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PluginManager;
