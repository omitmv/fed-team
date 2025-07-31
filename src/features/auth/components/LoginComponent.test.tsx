import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Login from './Login';
import { AppProvider } from '../../../context';

// Mock do useAppNavigation
jest.mock('../../../hooks/useAppNavigation', () => ({
  useAppNavigation: () => ({
    navigateTo: jest.fn(),
    goBack: jest.fn(),
    goForward: jest.fn(),
    getCurrentPath: jest.fn(() => '/auth'),
    isCurrentPath: jest.fn(() => true),
    location: { pathname: '/auth' }
  })
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <AppProvider>
      {component}
    </AppProvider>
  );
};

describe('Login Component', () => {
  test('deve renderizar sem erro', () => {
    renderWithProviders(<Login />);
    expect(screen.getByRole('textbox', { name: /login/i })).toBeInTheDocument();
  });

  test('deve habilitar botão quando campos preenchidos', async () => {
    renderWithProviders(<Login />);
    
    const loginInput = screen.getByRole('textbox', { name: /login/i });
    const senhaInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    expect(submitButton).toBeDisabled();

    await userEvent.type(loginInput, 'usuario123');
    await userEvent.type(senhaInput, 'senha123');

    expect(submitButton).not.toBeDisabled();
  });
});
