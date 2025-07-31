import React from 'react';
import { NotificationProps } from '../types/notification';

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
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-content text-center">
          {/* Imagem centralizada */}
          <div className="flex justify-center mb-md">
            <img 
              src={getImageSrc()} 
              alt={getImageAlt()}
              className={`w-20 h-20 object-contain ${type === 'success' ? 'icon-enhanced' : 'icon-enhanced'}`}
            />
          </div>

          {/* Título */}
          <h2 className={`text-xl font-semibold mb-md ${type === 'success' ? 'text-success' : 'text-error'}`}>
            {title}
          </h2>

          {/* Mensagem detalhada */}
          <p className="text-secondary mb-lg">
            {message}
          </p>

          {/* Botão */}
          <div className="w-full">
            <button 
              type="button"
              className={`btn w-full ${type === 'success' ? 'btn-success' : 'btn-error'}`}
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
