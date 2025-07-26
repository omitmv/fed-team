import React, { useState } from 'react';
import { LoginCredentials } from '../types';

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
      // Aqui você pode implementar a lógica de autenticação
      console.log('Dados de login:', formData);
      
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Implementar autenticação real
      alert('Login realizado com sucesso!');
    } catch (err) {
      setError('Erro ao realizar login. Verifique suas credenciais.');
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
      <div className="card">
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
