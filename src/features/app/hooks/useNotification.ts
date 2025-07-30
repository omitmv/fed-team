import { useState, useCallback } from 'react';
import { NotificationState, NotificationType } from '../types/notification';

export const useNotification = () => {
  const [notification, setNotification] = useState<NotificationState>({
    type: 'error',
    title: '',
    message: '',
    isVisible: false,
  });

  const showNotification = useCallback((
    type: NotificationType,
    title: string,
    message: string
  ) => {
    setNotification({
      type,
      title,
      message,
      isVisible: true,
    });
  }, []);

  const showError = useCallback((title: string, message: string) => {
    showNotification('error', title, message);
  }, [showNotification]);

  const showSuccess = useCallback((title: string, message: string) => {
    showNotification('success', title, message);
  }, [showNotification]);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({
      ...prev,
      isVisible: false,
    }));
  }, []);

  return {
    notification,
    showNotification,
    showError,
    showSuccess,
    hideNotification,
  };
};
