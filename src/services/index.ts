// Exportações dos serviços

// API principal
export { api, default as apiClient } from './api';

// API do Plugin
export { 
  pluginApi, 
  isPluginAvailable, 
  setPluginTimeout,
  PLUGIN_API_CONFIG,
  default as pluginApiClient 
} from './pluginApi';

// Types das APIs
export type { 
  PluginApiResponse, 
  PluginStatus, 
  PluginConfig 
} from './pluginApi';
