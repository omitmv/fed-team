import React, { useState } from 'react';
import { LoginCredentials } from '../types';
import { api } from '../../../services/api';

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginCredentials>({
    login: '',
    senha: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setError(null);

    try {
      // Chamada para o endpoint de login
      console.log('Enviando dados de login:', formData);
      
      const response = await api.post('/v1/usuarios/login', {
        login: formData.login,
        senha: formData.senha
      });
      
      console.log('Resposta do servidor:', response?.data || 'Sem dados na resposta');
      console.log('Status da resposta:', response?.status || 'Status indefinido');
      console.log('Headers da resposta:', response?.headers || 'Headers indefinidos');
      
      // TODO: Implementar tratamento da resposta (salvar token, redirecionar, etc.)
      alert('Login realizado com sucesso!');
    } catch (err: any) {
      console.error('Erro na chamada de login:', err);
      
      if (err.response) {
        // Erro com resposta do servidor
        console.error('Dados do erro:', err.response.data);
        console.error('Status do erro:', err.response.status);
        console.error('Headers do erro:', err.response.headers);
        
        // Personalizar mensagem baseada no status
        if (err.response.status === 401) {
          setError('Credenciais inválidas. Verifique seu login e senha.');
        } else if (err.response.status === 404) {
          setError('Serviço de login não encontrado.');
        } else if (err.response.status >= 500) {
          setError('Erro interno do servidor. Tente novamente mais tarde.');
        } else {
          setError('Erro ao realizar login. Verifique suas credenciais.');
        }
      } else if (err.request) {
        // Erro de conexão
        console.error('Erro de conexão:', err.request);
        setError('Erro de conexão. Verifique sua internet.');
      } else {
        // Erro de configuração
        console.error('Erro de configuração:', err.message);
        setError('Erro ao realizar login. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // TODO: Implementar lógica de recuperação de senha
    alert('Funcionalidade de recuperação de senha em desenvolvimento');
  };

  return (
    <div className="container-center">
      <div className="card login-card">
        <div className="card-body">
          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="form">
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
                className="form-input"
                required
                autoComplete="username"
                placeholder="Digite seu login"
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
                className="form-input"
                required
                autoComplete="current-password"
                placeholder="Digite sua senha"
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="link-secondary"
              >
                Recuperar senha
              </button>
            </div>

            <button
              type="submit"
              className={`btn btn-primary btn-full ${loading ? 'btn-loading' : ''}`}
              disabled={loading || !formData.login || !formData.senha}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
