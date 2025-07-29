# 🔌 API do Plugin - Documentação

## Visão Geral

O serviço de API do Plugin foi criado para conectar o aplicação React com um plugin/serviço externo rodando em `http://localhost:8080`. Este serviço oferece uma interface completa para gerenciar dispositivos, executar comandos e monitorar o status do plugin.

## 📁 Arquivos Criados

### Serviços

- `src/services/pluginApi.ts` - Cliente API principal do plugin
- `src/services/index.ts` - Exportações centralizadas dos serviços

### Hooks

- `src/hooks/usePlugin.ts` - Hook React para gerenciar estado do plugin

### Componentes

- `src/features/app/components/PluginManager.tsx` - Interface de gerenciamento
- `src/features/app/components/PluginManager.css` - Estilos do componente

### Constantes

- `src/constants/pluginConstants.ts` - Endpoints e constantes do plugin

## 🚀 Como Usar

### 1. Uso Básico com Hook

```typescript
import { usePlugin } from '../hooks/usePlugin'

function MeuComponente() {
  const {
    isConnected,
    status,
    devices,
    loading,
    error,
    connect,
    scanDevices,
    connectDevice
  } = usePlugin()

  useEffect(() => {
    // Conectar automaticamente ao carregar
    connect()
  }, [connect])

  return (
    <div>
      <p>Status: {isConnected ? 'Conectado' : 'Desconectado'}</p>
      <button onClick={scanDevices}>Escanear Dispositivos</button>

      {devices.map(device => (
        <div key={device.id}>
          <span>{device.name}</span>
          <button onClick={() => connectDevice(device.id)}>Conectar</button>
        </div>
      ))}
    </div>
  )
}
```

### 2. Uso Direto da API

```typescript
import { pluginApi, isPluginAvailable } from '../services/pluginApi'

async function exemploUsoDirecto() {
  // Verificar se plugin está disponível
  const available = await isPluginAvailable()
  if (!available) {
    console.log('Plugin não está acessível')
    return
  }

  try {
    // Obter status do plugin
    const statusResponse = await pluginApi.getStatus()
    console.log('Status:', statusResponse.data)

    // Listar dispositivos
    const devicesResponse = await pluginApi.getDevices()
    console.log('Dispositivos:', devicesResponse.data)

    // Executar comando customizado
    const commandResponse = await pluginApi.executeCommand('system.info')
    console.log('Info do sistema:', commandResponse.data)
  } catch (error) {
    console.error('Erro ao comunicar com plugin:', error)
  }
}
```

### 3. Gerenciamento com Componente Pronto

```typescript
import PluginManager from '../features/app/components/PluginManager'

function App() {
  return (
    <div>
      <h1>Minha Aplicação</h1>
      <PluginManager />
    </div>
  )
}
```

## 🔧 API Reference

### Métodos Principais

#### Status e Configuração

```typescript
// Verificar status do plugin
await pluginApi.getStatus()

// Obter configuração
await pluginApi.getConfig()

// Atualizar configuração
await pluginApi.updateConfig({ enabled: true })

// Reiniciar plugin
await pluginApi.restart()

// Ping para verificar conectividade
await pluginApi.ping()
```

#### Dispositivos

```typescript
// Listar dispositivos
await pluginApi.getDevices()

// Conectar dispositivo
await pluginApi.connectDevice('device-id')

// Desconectar dispositivo
await pluginApi.disconnectDevice('device-id')

// Enviar dados para dispositivo
await pluginApi.sendToDevice('device-id', { message: 'hello' })
```

#### Comandos e Logs

```typescript
// Executar comando
await pluginApi.executeCommand('system.info', { detailed: true })

// Obter logs
await pluginApi.getLogs(100) // últimas 100 entradas
```

### Constantes Disponíveis

```typescript
import {
  PLUGIN_ENDPOINTS,
  PLUGIN_COMMANDS,
  PLUGIN_STATUS_CODES,
  PLUGIN_DEVICE_TYPES
} from '../constants/pluginConstants'

// Exemplos de uso
const statusEndpoint = PLUGIN_ENDPOINTS.STATUS // '/status'
const infoCommand = PLUGIN_COMMANDS.SYSTEM_INFO // 'system.info'
const onlineStatus = PLUGIN_STATUS_CODES.ONLINE // 'online'
```

## 🎯 Hook usePlugin - Métodos Disponíveis

### Estado

- `isConnected: boolean` - Se está conectado ao plugin
- `status: PluginStatusCode` - Status atual (online/offline/connecting/error)
- `config: PluginConfig | null` - Configuração atual
- `devices: any[]` - Lista de dispositivos
- `logs: string[]` - Logs do plugin
- `loading: boolean` - Se alguma operação está em andamento
- `error: string | null` - Último erro ocorrido

### Métodos de Conexão

- `connect()` - Conectar ao plugin
- `disconnect()` - Desconectar do plugin
- `checkConnection()` - Verificar status da conexão

### Métodos de Configuração

- `getConfig()` - Obter configuração atual
- `updateConfig(config)` - Atualizar configuração
- `restart()` - Reiniciar plugin

### Métodos de Dispositivos

- `scanDevices()` - Escanear dispositivos disponíveis
- `connectDevice(deviceId)` - Conectar dispositivo específico
- `disconnectDevice(deviceId)` - Desconectar dispositivo
- `sendToDevice(deviceId, data)` - Enviar dados para dispositivo

### Métodos Utilitários

- `getLogs(limit?)` - Obter logs do plugin
- `executeCommand(command, params?)` - Executar comando customizado
- `clearError()` - Limpar erro atual
- `refresh()` - Atualizar todos os dados

## 🔧 Configuração

### Timeout Personalizado

```typescript
import { setPluginTimeout } from '../services/pluginApi'

// Aumentar timeout para 15 segundos
setPluginTimeout(15000)
```

### Host Personalizado

Por padrão, a API conecta em `http://localhost:8080`. Para alterar:

```typescript
// Em pluginApi.ts, altere:
export const PLUGIN_API_CONFIG = {
  BASE_URL: 'http://seu-host:porta',
  TIMEOUT: 10000
  // ...
}
```

## 📡 Endpoints Suportados

### Sistema

- `GET /status` - Status do plugin
- `GET /config` - Configuração atual
- `PUT /config` - Atualizar configuração
- `POST /restart` - Reiniciar plugin
- `GET /ping` - Verificar conectividade
- `GET /logs` - Obter logs

### Dispositivos

- `GET /devices` - Listar dispositivos
- `POST /devices/{id}/connect` - Conectar dispositivo
- `POST /devices/{id}/disconnect` - Desconectar dispositivo
- `POST /devices/{id}/send` - Enviar dados

### Comandos

- `POST /execute` - Executar comando customizado

## 🎨 Personalização Visual

O componente `PluginManager` usa variáveis CSS que podem ser personalizadas:

```css
:root {
  --primary-color: #007bff;
  --success-color: #28a745;
  --error-color: #dc3545;
  --warning-color: #ffc107;
  /* ... outras variáveis */
}
```

## ⚠️ Tratamento de Erros

A API inclui tratamento robusto de erros:

```typescript
try {
  await pluginApi.getStatus()
} catch (error) {
  if (error.response) {
    // Erro com resposta do servidor
    console.log('Status:', error.response.status)
    console.log('Dados:', error.response.data)
  } else if (error.request) {
    // Erro de conexão
    console.log('Plugin não está respondendo')
  } else {
    // Erro de configuração
    console.log('Erro:', error.message)
  }
}
```

## 🔄 Monitoramento Automático

O hook `usePlugin` inclui verificação automática de status:

- Verifica conexão ao montar o componente
- Polling a cada 30 segundos quando conectado
- Reconexão automática após restart

## 📱 Responsividade

O componente `PluginManager` é totalmente responsivo:

- Layout adaptativo para mobile/tablet/desktop
- Botões otimizados para touch
- Navegação simplificada em telas pequenas

## 🧪 Exemplo de Integração com Login

Para integrar com o sistema de autenticação existente:

```typescript
// No componente Login.tsx
import { usePlugin } from '../../../hooks/usePlugin'

const Login: React.FC = () => {
  const { connect: connectPlugin } = usePlugin()

  const handleSubmit = async (e: React.FormEvent) => {
    // ... lógica de login existente ...

    try {
      const response = await api.post('/v1/usuarios/login', {
        login: formData.login,
        senha: formData.senha
      })

      const { token } = response.data
      localStorage.setItem('token', token)

      // Conectar ao plugin após login bem-sucedido
      await connectPlugin()

      // ... resto da lógica ...
    } catch (error) {
      // ... tratamento de erro ...
    }
  }
}
```

---

## 🎉 Status: Pronto para Uso!

A API do Plugin está 100% funcional e pronta para integração:

- ✅ Cliente API completo (`pluginApi.ts`)
- ✅ Hook React para gerenciamento (`usePlugin.ts`)
- ✅ Componente de interface (`PluginManager.tsx`)
- ✅ Constantes organizadas (`pluginConstants.ts`)
- ✅ Estilos responsivos (`PluginManager.css`)
- ✅ Tratamento robusto de erros
- ✅ Documentação completa
- ✅ TypeScript com tipagem forte

**Desenvolvido para o projeto Fed-Team - Plugin API Service**
