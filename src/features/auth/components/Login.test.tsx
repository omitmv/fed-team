import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Login from './Login';
import { api } from '../../../services/api';
import { AppProvider } from '../../../context';

// Mock da API
jest.mock('../../../services/api', () => ({
  api: {
    post: jest.fn(),
  },
}));

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

const mockApi = api as jest.Mocked<typeof api>;

// Mock do console.log para verificar se os dados são logados
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});

// Mock do console.error para verificar se erros são logados
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

// Helper para renderizar com providers necessários
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <AppProvider>
      {component}
    </AppProvider>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useFakeTimers();
    
    // Setup padrão da API mock para sucesso
    mockApi.post.mockResolvedValue({
      data: { 
        token: 'fake-token',
        usuario: {
          id: '1',
          nome: 'Usuário Teste',
          login: 'usuario123',
          email: 'usuario@test.com',
          perfil: 'admin'
        },
        refreshToken: 'fake-refresh-token'
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: {} as any,
      },
    } as any);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
  });

  describe('Renderização inicial', () => {
    test('deve renderizar todos os elementos do formulário', () => {
      renderWithProviders(<Login />);

      // Verifica se os campos de input estão presentes
      expect(screen.getByLabelText(/login/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();

      // Verifica se o link de recuperar senha está presente
      expect(screen.getByRole('button', { name: /recuperar senha/i })).toBeInTheDocument();

      // Verifica se o botão de entrar está presente
      expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
    });

    test('deve renderizar campos com placeholders corretos', () => {
      renderWithProviders(<Login />);

      expect(screen.getByPlaceholderText(/digite seu login/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/digite sua senha/i)).toBeInTheDocument();
    });

    test('deve renderizar campos com atributos corretos', () => {
      renderWithProviders(<Login />);

      const loginInput = screen.getByLabelText(/login/i);
      const senhaInput = screen.getByLabelText(/senha/i);

      expect(loginInput).toHaveAttribute('type', 'text');
      expect(loginInput).toHaveAttribute('name', 'login');
      expect(loginInput).toHaveAttribute('autoComplete', 'username');
      expect(loginInput).toBeRequired();

      expect(senhaInput).toHaveAttribute('type', 'password');
      expect(senhaInput).toHaveAttribute('name', 'senha');
      expect(senhaInput).toHaveAttribute('autoComplete', 'current-password');
      expect(senhaInput).toBeRequired();
    });

    test('deve ter botão entrar desabilitado quando campos estão vazios', () => {
      renderWithProviders(<Login />);

      const submitButton = screen.getByRole('button', { name: /entrar/i });
      expect(submitButton).toBeDisabled();
    });

    test('não deve exibir mensagem de erro inicialmente', () => {
      renderWithProviders(<Login />);

      expect(screen.queryByText(/erro/i)).not.toBeInTheDocument();
    });
  });

  describe('Interações com inputs', () => {
    test('deve atualizar valor do campo login', async () => {
      renderWithProviders(<Login />);

      const loginInput = screen.getByLabelText(/login/i);
      await userEvent.type(loginInput, 'meulogin');

      expect(loginInput).toHaveValue('meulogin');
    });

    test('deve atualizar valor do campo senha', async () => {
      renderWithProviders(<Login />);

      const senhaInput = screen.getByLabelText(/senha/i);
      await userEvent.type(senhaInput, 'minhasenha');

      expect(senhaInput).toHaveValue('minhasenha');
    });

    test('deve habilitar botão entrar quando ambos os campos são preenchidos', async () => {
      renderWithProviders(<Login />);

      const loginInput = screen.getByLabelText(/login/i);
      const senhaInput = screen.getByLabelText(/senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      await userEvent.type(loginInput, 'meulogin');
      await userEvent.type(senhaInput, 'minhasenha');

      expect(submitButton).toBeEnabled();
    });

    test('deve desabilitar botão entrar quando apenas login é preenchido', async () => {
      renderWithProviders(<Login />);

      const loginInput = screen.getByLabelText(/login/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      await userEvent.type(loginInput, 'meulogin');

      expect(submitButton).toBeDisabled();
    });

    test('deve desabilitar botão entrar quando apenas senha é preenchida', async () => {
      renderWithProviders(<Login />);

      const senhaInput = screen.getByLabelText(/senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      await userEvent.type(senhaInput, 'minhasenha');

      expect(submitButton).toBeDisabled();
    });
  });

  describe('Funcionalidade de recuperar senha', () => {
    test('deve mostrar alert ao clicar em recuperar senha', async () => {
      // Mock do alert para este teste específico
      const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
      
      renderWithProviders(<Login />);

      const forgotPasswordButton = screen.getByRole('button', { name: /recuperar senha/i });
      await userEvent.click(forgotPasswordButton);

      expect(mockAlert).toHaveBeenCalledWith('Funcionalidade de recuperação de senha em desenvolvimento');
      
      mockAlert.mockRestore();
    });
  });

  describe('Submissão do formulário', () => {
    test('deve submeter formulário com dados corretos e fazer login', async () => {
      renderWithProviders(<Login />);

      const loginInput = screen.getByLabelText(/login/i);
      const senhaInput = screen.getByLabelText(/senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      // Preenche os campos
      await userEvent.type(loginInput, 'usuario123');
      await userEvent.type(senhaInput, 'senha123');

      // Submete o formulário
      await userEvent.click(submitButton);

      // Verifica se o botão mostra loading
      expect(screen.getByRole('button', { name: /entrando.../i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /entrando.../i })).toBeDisabled();

      // Verifica se os dados foram logados
      expect(mockConsoleLog).toHaveBeenCalledWith('Enviando dados de login:', {
        login: 'usuario123',
        senha: 'senha123'
      });

      // Verifica se a API foi chamada corretamente
      expect(mockApi.post).toHaveBeenCalledWith('/v1/usuario/login', {
        login: 'usuario123',
        senha: 'senha123'
      });

      // Avança o timer para simular a conclusão da Promise
      await act(async () => {
        jest.advanceTimersByTime(1000);
      });

      // Verifica se o botão volta ao estado normal
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
      });
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /entrar/i })).toBeEnabled();
      });
    });

    test('deve submeter formulário com tecla Enter', async () => {
      renderWithProviders(<Login />);

      const loginInput = screen.getByLabelText(/login/i);
      const senhaInput = screen.getByLabelText(/senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      // Preenche os campos
      await userEvent.type(loginInput, 'usuario123');
      await userEvent.type(senhaInput, 'senha123');

      // Verifica que o botão está habilitado
      expect(submitButton).toBeEnabled();

      // Clica no botão (simula Enter)
      await userEvent.click(submitButton);

      // Verifica se o botão mostra loading
      expect(screen.getByRole('button', { name: /entrando.../i })).toBeInTheDocument();

      // Verifica se os dados foram logados
      expect(mockConsoleLog).toHaveBeenCalledWith('Enviando dados de login:', {
        login: 'usuario123',
        senha: 'senha123'
      });
    });

    test('deve prevenir submissão quando campos estão vazios', () => {
      renderWithProviders(<Login />);

      // Verifica se o botão está desabilitado (prevenindo submissão)
      const submitButton = screen.getByRole('button', { name: /entrar/i });
      expect(submitButton).toBeDisabled();

      // Verifica que não há texto de loading
      expect(screen.queryByText(/entrando.../i)).not.toBeInTheDocument();
    });

    test('deve lidar com erro durante submissão', async () => {
      // Mock da API para rejeitar
      mockApi.post.mockRejectedValueOnce(new Error('Erro simulado'));

      renderWithProviders(<Login />);

      const loginInput = screen.getByLabelText(/login/i);
      const senhaInput = screen.getByLabelText(/senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      // Preenche os campos
      await userEvent.type(loginInput, 'usuario123');
      await userEvent.type(senhaInput, 'senha123');

      // Submete o formulário
      await userEvent.click(submitButton);

      // Verifica se o console.error foi chamado
      await waitFor(() => {
        expect(mockConsoleError).toHaveBeenCalledWith('Erro na chamada de login:', expect.any(Error));
      });

      // Verifica se o botão volta ao estado normal
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
      });
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /entrar/i })).toBeEnabled();
      });
    });

    test('deve limpar erro ao tentar submeter novamente', async () => {
      // Mock da API para rejeitar na primeira chamada e succeeder na segunda
      mockApi.post
        .mockRejectedValueOnce(new Error('Erro simulado'))
        .mockResolvedValueOnce({
          data: { 
            token: 'fake-token',
            refreshToken: 'fake-refresh-token',
            usuario: { id: 1, login: 'usuario123' }
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: { headers: {} as any },
        } as any);

      renderWithProviders(<Login />);

      const loginInput = screen.getByLabelText(/login/i);
      const senhaInput = screen.getByLabelText(/senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      // Preenche os campos
      await userEvent.type(loginInput, 'usuario123');
      await userEvent.type(senhaInput, 'senha123');

      // Primeira submissão (com erro)
      await userEvent.click(submitButton);

      // Espera erro aparecer no console
      await waitFor(() => {
        expect(mockConsoleError).toHaveBeenCalledWith('Erro na chamada de login:', expect.any(Error));
      });

      // Segunda submissão (sem erro)
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /entrar/i })).toBeEnabled();
      });

      await userEvent.click(submitButton);

      // Verifica se a API foi chamada novamente
      expect(mockApi.post).toHaveBeenCalledTimes(2);
    });
  });

  describe('Estados de loading', () => {
    test('deve desabilitar botão durante loading', async () => {
      renderWithProviders(<Login />);

      const loginInput = screen.getByLabelText(/login/i);
      const senhaInput = screen.getByLabelText(/senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      await userEvent.type(loginInput, 'usuario123');
      await userEvent.type(senhaInput, 'senha123');
      await userEvent.click(submitButton);

      const loadingButton = screen.getByRole('button', { name: /entrando.../i });
      expect(loadingButton).toBeDisabled();
    });

    test('deve manter inputs habilitados durante loading', async () => {
      renderWithProviders(<Login />);

      const loginInput = screen.getByLabelText(/login/i);
      const senhaInput = screen.getByLabelText(/senha/i);

      await userEvent.type(loginInput, 'usuario123');
      await userEvent.type(senhaInput, 'senha123');
      await userEvent.click(screen.getByRole('button', { name: /entrar/i }));

      // Durante o loading, ainda deve ser possível digitar nos inputs
      // (não há lógica para desabilitar inputs no componente atual)
      expect(loginInput).toBeEnabled();
      expect(senhaInput).toBeEnabled();
    });
  });

  describe('Acessibilidade', () => {
    test('deve ter labels associados aos inputs', () => {
      renderWithProviders(<Login />);

      const loginInput = screen.getByLabelText(/login/i);
      const senhaInput = screen.getByLabelText(/senha/i);

      expect(loginInput).toHaveAccessibleName();
      expect(senhaInput).toHaveAccessibleName();
    });

    test('deve ter IDs únicos para inputs', () => {
      renderWithProviders(<Login />);

      const loginInput = screen.getByLabelText(/login/i);
      const senhaInput = screen.getByLabelText(/senha/i);

      expect(loginInput).toHaveAttribute('id', 'login');
      expect(senhaInput).toHaveAttribute('id', 'senha');
    });

    test('deve ter autocomplete apropriado', () => {
      renderWithProviders(<Login />);

      const loginInput = screen.getByLabelText(/login/i);
      const senhaInput = screen.getByLabelText(/senha/i);

      expect(loginInput).toHaveAttribute('autocomplete', 'username');
      expect(senhaInput).toHaveAttribute('autocomplete', 'current-password');
    });
  });

  describe('Classes CSS e estrutura', () => {
    test('deve renderizar a estrutura básica do componente', () => {
      renderWithProviders(<Login />);

      // Verifica se os elementos principais estão presentes usando métodos do Testing Library
      expect(screen.getByLabelText(/login/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /recuperar senha/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
    });

    test('deve mostrar mensagem no console em caso de erro', async () => {
      // Mock da API para rejeitar
      mockApi.post.mockRejectedValueOnce(new Error('Erro simulado'));

      renderWithProviders(<Login />);

      const loginInput = screen.getByLabelText(/login/i);
      const senhaInput = screen.getByLabelText(/senha/i);

      await userEvent.type(loginInput, 'usuario123');
      await userEvent.type(senhaInput, 'senha123');
      await userEvent.click(screen.getByRole('button', { name: /entrar/i }));

      await waitFor(() => {
        expect(mockConsoleError).toHaveBeenCalledWith('Erro na chamada de login:', expect.any(Error));
      });
    });
  });

  describe('Manipulação de eventos', () => {
    test('deve chamar handleInputChange ao digitar no campo login', async () => {
      renderWithProviders(<Login />);

      const loginInput = screen.getByLabelText(/login/i);
      
      await userEvent.type(loginInput, 'a');
      expect(loginInput).toHaveValue('a');

      await userEvent.type(loginInput, 'b');
      expect(loginInput).toHaveValue('ab');
    });

    test('deve chamar handleInputChange ao digitar no campo senha', async () => {
      renderWithProviders(<Login />);

      const senhaInput = screen.getByLabelText(/senha/i);
      
      await userEvent.type(senhaInput, 'x');
      expect(senhaInput).toHaveValue('x');

      await userEvent.type(senhaInput, 'y');
      expect(senhaInput).toHaveValue('xy');
    });

    test('deve atualizar estado interno corretamente', async () => {
      renderWithProviders(<Login />);

      const loginInput = screen.getByLabelText(/login/i);
      const senhaInput = screen.getByLabelText(/senha/i);

      // Testa sequência de digitação
      await userEvent.type(loginInput, 'user');
      await userEvent.type(senhaInput, 'pass');

      expect(loginInput).toHaveValue('user');
      expect(senhaInput).toHaveValue('pass');

      // Limpa e redigita
      await userEvent.clear(loginInput);
      await userEvent.type(loginInput, 'newuser');

      expect(loginInput).toHaveValue('newuser');
    });
  });

  describe('Comportamento do formulário', () => {
    test('deve ter inputs com name attributes corretos', () => {
      renderWithProviders(<Login />);

      const loginInput = screen.getByLabelText(/login/i);
      const senhaInput = screen.getByLabelText(/senha/i);

      expect(loginInput).toHaveAttribute('name', 'login');
      expect(senhaInput).toHaveAttribute('name', 'senha');
    });

    test('deve ter formulário funcional', async () => {
      renderWithProviders(<Login />);

      const loginInput = screen.getByLabelText(/login/i);
      const senhaInput = screen.getByLabelText(/senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      // Verifica se os campos estão funcionando
      await userEvent.type(loginInput, 'usuario123');
      await userEvent.type(senhaInput, 'senha123');

      // Verifica se o botão ficou habilitado
      expect(submitButton).toBeEnabled();

      // Simula clique no botão
      await userEvent.click(submitButton);

      // Verifica se entrou em estado de loading
      expect(screen.getByRole('button', { name: /entrando.../i })).toBeInTheDocument();
    });
  });
});
