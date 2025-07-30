export type NotificationType = 'error' | 'success';

export interface NotificationProps {
  type: NotificationType;
  title: string;
  message: string;
  isVisible: boolean;
  onClose: () => void;
  onRedirect?: () => void;
}

export interface NotificationState {
  type: NotificationType;
  title: string;
  message: string;
  isVisible: boolean;
}
