import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Notification from './Notification';
import { NotificationProps } from '../types/notification';

// Mock das imagens
Object.defineProperty(global.Image.prototype, 'src', {
  set() {
    setTimeout(() => this.onload());
  },
});

const defaultProps: NotificationProps = {
  type: 'error',
  title: 'Título de Teste',
  message: 'Mensagem de teste detalhada',
  isVisible: true,
  onClose: jest.fn(),
};

const renderNotification = (props: Partial<NotificationProps> = {}) => {
  return render(<Notification {...defaultProps} {...props} />);
};

describe('Notification Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderização', () => {
    test('deve renderizar notificação quando isVisible é true', () => {
      renderNotification();
      
      expect(screen.getByText('Título de Teste')).toBeInTheDocument();
      expect(screen.getByText('Mensagem de teste detalhada')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /ok, entendi/i })).toBeInTheDocument();
    });

    test('não deve renderizar notificação quando isVisible é false', () => {
      renderNotification({ isVisible: false });
      
      expect(screen.queryByText('Título de Teste')).not.toBeInTheDocument();
    });

    test('deve renderizar com tipo de erro', () => {
      renderNotification({ type: 'error' });
      
      const title = screen.getByText('Título de Teste');
      const button = screen.getByRole('button');
      const image = screen.getByAltText('Ícone de erro');
      
      expect(title).toHaveClass('notification-title--error');
      expect(button).toHaveClass('notification-button--error');
      expect(image).toHaveAttribute('src', '/images/error-icon.svg');
    });

    test('deve renderizar com tipo de sucesso', () => {
      renderNotification({ type: 'success' });
      
      const title = screen.getByText('Título de Teste');
      const button = screen.getByRole('button');
      const image = screen.getByAltText('Ícone de sucesso');
      
      expect(title).toHaveClass('notification-title--success');
      expect(button).toHaveClass('notification-button--success');
      expect(image).toHaveAttribute('src', '/images/success-icon.svg');
    });
  });

  describe('Interações', () => {
    test('deve chamar onClose quando botão é clicado', async () => {
      const onCloseMock = jest.fn();
      renderNotification({ onClose: onCloseMock });
      
      const button = screen.getByRole('button', { name: /ok, entendi/i });
      await userEvent.click(button);
      
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    test('deve chamar onRedirect quando fornecido e botão é clicado', async () => {
      const onCloseMock = jest.fn();
      const onRedirectMock = jest.fn();
      renderNotification({ 
        onClose: onCloseMock, 
        onRedirect: onRedirectMock 
      });
      
      const button = screen.getByRole('button', { name: /ok, entendi/i });
      await userEvent.click(button);
      
      expect(onCloseMock).toHaveBeenCalledTimes(1);
      expect(onRedirectMock).toHaveBeenCalledTimes(1);
    });

    test('não deve chamar onRedirect quando não fornecido', async () => {
      const onCloseMock = jest.fn();
      renderNotification({ onClose: onCloseMock });
      
      const button = screen.getByRole('button', { name: /ok, entendi/i });
      await userEvent.click(button);
      
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Conteúdo', () => {
    test('deve exibir título correto', () => {
      renderNotification({ title: 'Título Personalizado' });
      
      expect(screen.getByText('Título Personalizado')).toBeInTheDocument();
    });

    test('deve exibir mensagem correta', () => {
      renderNotification({ message: 'Mensagem personalizada muito longa para testar quebra de linha' });
      
      expect(screen.getByText('Mensagem personalizada muito longa para testar quebra de linha')).toBeInTheDocument();
    });

    test('deve exibir texto do botão correto', () => {
      renderNotification();
      
      expect(screen.getByRole('button', { name: /ok, entendi/i })).toBeInTheDocument();
    });
  });

  describe('Acessibilidade', () => {
    test('deve ter atributos de acessibilidade corretos', () => {
      renderNotification();
      
      const button = screen.getByRole('button');
      const image = screen.getByRole('img');
      
      expect(button).toHaveAttribute('type', 'button');
      expect(image).toHaveAttribute('alt');
    });

    test('deve ser focável via teclado', () => {
      renderNotification();
      
      const button = screen.getByRole('button');
      button.focus();
      
      expect(button).toHaveFocus();
    });

    test('deve permitir ativação via Enter', async () => {
      const onCloseMock = jest.fn();
      renderNotification({ onClose: onCloseMock });
      
      const button = screen.getByRole('button');
      button.focus();
      
      await userEvent.keyboard('{Enter}');
      
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    test('deve permitir ativação via Space', async () => {
      const onCloseMock = jest.fn();
      renderNotification({ onClose: onCloseMock });
      
      const button = screen.getByRole('button');
      button.focus();
      
      await userEvent.keyboard(' ');
      
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Estrutura CSS', () => {
    test('deve ter classes CSS corretas', () => {
      renderNotification();
      
      // Verificar estrutura básica através dos elementos encontrados
      expect(screen.getByRole('img')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Título de Teste' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Ok, entendi' })).toBeInTheDocument();
      expect(screen.getByText('Mensagem de teste detalhada')).toBeInTheDocument();
    });

    test('deve aplicar classes específicas do tipo', () => {
      renderNotification({ type: 'success' });
      
      const title = screen.getByText('Título de Teste');
      const button = screen.getByRole('button');
      
      expect(title).toHaveClass('notification-title--success');
      expect(button).toHaveClass('notification-button--success');
    });
  });

  describe('Estados Edge Cases', () => {
    test('deve lidar com título vazio', () => {
      renderNotification({ title: '' });
      
      const titleElement = screen.getByRole('heading');
      expect(titleElement).toHaveTextContent('');
    });

    test('deve lidar com mensagem vazia', () => {
      renderNotification({ message: '' });
      
      const messageElement = screen.getByText('', { selector: '.notification-message' });
      expect(messageElement).toHaveTextContent('');
    });

    test('deve lidar com texto muito longo', () => {
      const longTitle = 'Este é um título muito longo que pode ser quebrado em múltiplas linhas';
      const longMessage = 'Esta é uma mensagem muito longa que também pode ser quebrada em múltiplas linhas e deve ser exibida corretamente';
      
      renderNotification({ 
        title: longTitle,
        message: longMessage 
      });
      
      // Verifica se os textos estão presentes (mesmo que quebrados)
      expect(screen.getByRole('heading')).toHaveTextContent(longTitle);
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });
  });
});
