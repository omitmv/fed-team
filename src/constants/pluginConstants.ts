// Constantes específicas para a API do Plugin

export const PLUGIN_ENDPOINTS = {
  // Endpoints de status e configuração
  STATUS: '/status',
  CONFIG: '/config',
  LOGS: '/logs',
  PING: '/ping',
  RESTART: '/restart',
  
  // Endpoints de comando
  EXECUTE: '/execute',
  
  // Endpoints de dispositivos
  DEVICES: '/devices',
  DEVICE_CONNECT: (deviceId: string) => `/devices/${deviceId}/connect`,
  DEVICE_DISCONNECT: (deviceId: string) => `/devices/${deviceId}/disconnect`,
  DEVICE_SEND: (deviceId: string) => `/devices/${deviceId}/send`,
  DEVICE_STATUS: (deviceId: string) => `/devices/${deviceId}/status`,
  
  // Endpoints de dados
  DATA: '/data',
  DATA_STREAM: '/data/stream',
  DATA_HISTORY: '/data/history',
  
  // Endpoints de configuração avançada
  SETTINGS: '/settings',
  SETTINGS_BACKUP: '/settings/backup',
  SETTINGS_RESTORE: '/settings/restore',
} as const;

export const PLUGIN_COMMANDS = {
  // Comandos de sistema
  SYSTEM_INFO: 'system.info',
  SYSTEM_REBOOT: 'system.reboot',
  SYSTEM_SHUTDOWN: 'system.shutdown',
  
  // Comandos de dispositivo
  DEVICE_SCAN: 'device.scan',
  DEVICE_LIST: 'device.list',
  DEVICE_RESET: 'device.reset',
  
  // Comandos de rede
  NETWORK_STATUS: 'network.status',
  NETWORK_RECONNECT: 'network.reconnect',
  
  // Comandos de dados
  DATA_EXPORT: 'data.export',
  DATA_IMPORT: 'data.import',
  DATA_CLEAR: 'data.clear',
} as const;

export const PLUGIN_STATUS_CODES = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  CONNECTING: 'connecting',
  ERROR: 'error',
  MAINTENANCE: 'maintenance',
} as const;

export const PLUGIN_DEVICE_TYPES = {
  SENSOR: 'sensor',
  ACTUATOR: 'actuator',
  CONTROLLER: 'controller',
  GATEWAY: 'gateway',
  UNKNOWN: 'unknown',
} as const;

export const PLUGIN_CONNECTION_TYPES = {
  USB: 'usb',
  SERIAL: 'serial',
  ETHERNET: 'ethernet',
  WIFI: 'wifi',
  BLUETOOTH: 'bluetooth',
  ZIGBEE: 'zigbee',
} as const;

export const PLUGIN_ERROR_CODES = {
  CONNECTION_FAILED: 'CONNECTION_FAILED',
  DEVICE_NOT_FOUND: 'DEVICE_NOT_FOUND',
  INVALID_COMMAND: 'INVALID_COMMAND',
  TIMEOUT: 'TIMEOUT',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  INVALID_DATA: 'INVALID_DATA',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;

export type PluginEndpoint = typeof PLUGIN_ENDPOINTS[keyof typeof PLUGIN_ENDPOINTS];
export type PluginCommand = typeof PLUGIN_COMMANDS[keyof typeof PLUGIN_COMMANDS];
export type PluginStatusCode = typeof PLUGIN_STATUS_CODES[keyof typeof PLUGIN_STATUS_CODES];
export type PluginDeviceType = typeof PLUGIN_DEVICE_TYPES[keyof typeof PLUGIN_DEVICE_TYPES];
export type PluginConnectionType = typeof PLUGIN_CONNECTION_TYPES[keyof typeof PLUGIN_CONNECTION_TYPES];
export type PluginErrorCode = typeof PLUGIN_ERROR_CODES[keyof typeof PLUGIN_ERROR_CODES];
