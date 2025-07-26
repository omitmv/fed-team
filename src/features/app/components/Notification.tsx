import React from 'react';
import { NotificationProps } from '../types/notification';
import './Notification.css';

const Notification: React.FC<NotificationProps> = ({
  type,
  title,
  message,
  isVisible,
  onClose,
  onRedirect
}) => {
  if (!isVisible) return null;

  const handleButtonClick = () => {
    onClose();
    if (onRedirect) {
      onRedirect();
    }
  };

  const getImageSrc = () => {
    return type === 'success' 
      ? '/images/success-icon.svg' 
      : '/images/error-icon.svg';
  };

  const getImageAlt = () => {
    return type === 'success' 
      ? 'Ícone de sucesso' 
      : 'Ícone de erro';
  };

  return (
    <div className="notification-overlay" role="dialog" aria-modal="true">
      <div className="notification-container">
        <div className="notification-content" data-testid="notification-content">
          {/* Imagem centralizada */}
          <div className="notification-image">
            <img 
              src={getImageSrc()} 
              alt={getImageAlt()}
              className={`notification-icon notification-icon--${type}`}
            />
          </div>

          {/* Título */}
          <h2 className={`notification-title notification-title--${type}`}>
            {title}
          </h2>

          {/* Mensagem detalhada */}
          <p className="notification-message">
            {message}
          </p>

          {/* Botão */}
          <div className="notification-actions">
            <button 
              type="button"
              className={`btn btn-full notification-button notification-button--${type}`}
              onClick={handleButtonClick}
            >
              Ok, entendi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
