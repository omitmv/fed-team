import React from 'react';
import { usePlugin } from '../../../hooks/usePlugin';

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
    <div className="card max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-lg pb-md border-b">
        <h2 className="text-primary text-xl font-semibold">Gerenciador de Plugin</h2>
        <div className="flex items-center gap-sm">
          <span className={`status-dot ${status} ${isConnected ? 'status-connected' : 'status-disconnected'}`}></span>
          <span className="text-sm text-secondary font-medium">
            {isConnected ? 'Conectado' : 'Desconectado'} - {status}
          </span>
        </div>
      </div>

      {error && (
        <div className="alert alert-error mb-lg flex justify-between items-center">
          <span>❌ {error}</span>
          <button onClick={clearError} className="btn btn-sm btn-error">×</button>
        </div>
      )}

      <div className="grid gap-lg">
        <div className="card bg-surface">
          <h3 className="text-primary mb-md">Conexão</h3>
          <div className="flex gap-sm flex-wrap">
            <button className='btn btn-secondary' onClick={() => NativeBridge.getUUID()}>Recuperar UUID</button>
            <button className='btn btn-secondary' onClick={() => NativeBridge.abrirCamera()}>Abrir Câmera</button>
            <button className='btn btn-secondary' onClick={() => NativeBridge.mostrarToast('Olá, mundo!')}>Mostrar Toast</button>
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

        <div className="card bg-surface">
          <h3 className="text-primary mb-md">Sistema</h3>
          <div className="flex gap-sm flex-wrap">
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
        <div className="grid gap-lg mt-lg">
          <div className="card bg-surface">
            <h3 className="text-primary mb-md">Configuração</h3>
            {config ? (
              <div className="space-y-sm">
                <p><strong>Habilitado:</strong> {config.enabled ? 'Sim' : 'Não'}</p>
                <p><strong>Endpoints:</strong> {config.endpoints?.length || 0}</p>
                <div className="flex gap-sm mt-md">
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
                <p className="text-secondary mb-md">Configuração não carregada</p>
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

          <div className="card bg-surface">
            <h3 className="text-primary mb-md">Dispositivos ({devices.length})</h3>
            <div className="mb-md">
              <button 
                onClick={scanDevices} 
                disabled={loading}
                className="btn btn-sm btn-primary"
              >
                Escanear Dispositivos
              </button>
            </div>
            <div className="space-y-sm">
              {devices.length > 0 ? (
                devices.map((device, index) => (
                  <div key={device.id || index} className="flex justify-between items-center p-md bg-background border border-border rounded">
                    <div className="space-y-xs">
                      <strong className="text-primary">{device.name || `Dispositivo ${index + 1}`}</strong>
                      <div className="text-sm text-secondary">ID: {device.id || 'N/A'}</div>
                      <span className={`badge ${device.connected ? 'badge-success' : 'badge-error'}`}>
                        {device.connected ? 'Conectado' : 'Desconectado'}
                      </span>
                    </div>
                    <div className="flex gap-sm">
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
                <p className="text-center text-secondary p-lg">Nenhum dispositivo encontrado</p>
              )}
            </div>
          </div>

          <div className="card bg-surface">
            <h3 className="text-primary mb-md">Logs ({logs.length})</h3>
            <div className="bg-background border border-border rounded p-md max-h-64 overflow-y-auto">
              {logs.length > 0 ? (
                <div className="space-y-xs">
                  {logs.slice(0, 10).map((log, index) => (
                    <div key={index} className="text-sm font-mono text-secondary border-b border-border pb-xs">
                      {log}
                    </div>
                  ))}
                  {logs.length > 10 && (
                    <div className="text-sm font-mono text-muted text-center pt-xs">
                      ... e mais {logs.length - 10} entradas
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-center text-secondary">Nenhum log disponível</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PluginManager;
