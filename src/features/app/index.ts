// Exportação principal da feature App
export { default as App } from './components/App';

// Exportação do componente de notificação
export { default as Notification } from './components/Notification';

// Exportação do hook de notificação
export { useNotification } from './hooks/useNotification';

// Exportação dos tipos
export type { NotificationProps, NotificationState, NotificationType } from './types/notification';
