import React, { useState } from 'react';
import { LoginCredentials } from '../types';
import { api } from '../../../services/api';
import { Notification, useNotification } from '../../app';

const LoginWithNotification: React.FC = () => {
  const [formData, setFormData] = useState<LoginCredentials>({
    login: '',
    senha: '',
  });

  const [loading, setLoading] = useState(false);
  const { notification, showError, showSuccess, hideNotification } = useNotification();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: LoginCredentials) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Enviando dados de login:', formData);
      
      const response = await api.post('/v1/usuario/login', {
        login: formData.login,
        senha: formData.senha
      });
      
      console.log('Resposta do servidor:', response?.data || 'Sem dados na resposta');
      
      // Exibir notificação de sucesso
      showSuccess(
        'Login realizado!',
        'Bem-vindo de volta! Você será redirecionado em instantes.'
      );
      
    } catch (err: any) {
      console.error('Erro na chamada de login:', err);
      
      let errorTitle = 'Erro no login';
      let errorMessage = 'Ocorreu um erro inesperado. Tente novamente.';
      
      if (err.response) {
        const status = err.response.status;
        
        switch (status) {
          case 401:
            errorTitle = 'Credenciais inválidas';
            errorMessage = 'Login ou senha incorretos. Verifique seus dados e tente novamente.';
            break;
          case 404:
            errorTitle = 'Usuário não encontrado';
            errorMessage = 'O usuário informado não existe em nossa base de dados.';
            break;
          case 500:
            errorTitle = 'Erro do servidor';
            errorMessage = 'Nossos servidores estão temporariamente indisponíveis. Tente novamente em alguns minutos.';
            break;
          case 503:
            errorTitle = 'Serviço indisponível';
            errorMessage = 'O sistema está em manutenção. Tente novamente mais tarde.';
            break;
          default:
            errorTitle = 'Erro na conexão';
            errorMessage = `Erro ${status}: ${err.response.data?.message || 'Falha na comunicação com o servidor.'}`;
        }
      } else if (err.request) {
        errorTitle = 'Sem conexão';
        errorMessage = 'Verifique sua conexão com a internet e tente novamente.';
      }
      
      // Exibir notificação de erro
      showError(errorTitle, errorMessage);
      
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClose = () => {
    hideNotification();
    
    // Se foi um sucesso, redirecionar para a home
    if (notification.type === 'success') {
      // Aqui você pode implementar a navegação
      // Por exemplo: navigate('/home') se estiver usando React Router
      console.log('Redirecionando para a home...');
    }
  };

  const isFormValid = formData.login.trim() !== '' && formData.senha.trim() !== '';

  return (
    <>
      <div className="container-center">
        <div className="card login-card">
          <div className="card-body">
            <form className="form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="login" className="form-label">
                  Login
                </label>
                <input
                  type="text"
                  id="login"
                  name="login"
                  value={formData.login}
                  onChange={handleInputChange}
                  placeholder="Digite seu login"
                  className="form-input"
                  required
                  autoComplete="username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="senha" className="form-label">
                  Senha
                </label>
                <input
                  type="password"
                  id="senha"
                  name="senha"
                  value={formData.senha}
                  onChange={handleInputChange}
                  placeholder="Digite sua senha"
                  className="form-input"
                  required
                  autoComplete="current-password"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="link-secondary"
                  onClick={() => showError(
                    'Funcionalidade em desenvolvimento',
                    'A recuperação de senha ainda não está disponível. Entre em contato com o suporte.'
                  )}
                >
                  Recuperar senha
                </button>
              </div>

              <button
                type="submit"
                className={`btn btn-primary btn-full ${loading ? 'btn-loading' : ''}`}
                disabled={!isFormValid || loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Componente de Notificação */}
      <Notification
        type={notification.type}
        title={notification.title}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={handleNotificationClose}
      />
    </>
  );
};

export default LoginWithNotification;
