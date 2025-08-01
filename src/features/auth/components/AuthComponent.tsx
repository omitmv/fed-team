import React, { useState } from 'react';
import { LoginCredentials, LoginResponse } from '../types';
import { useAppContext } from '../../../context';
import { useAppNavigation } from '../../../hooks/useAppNavigation';
import MaterialIcon from '../../../components/MaterialIcon';
import CardStaffTeam from '../../../components/CardStaffTeam';
import ButtonStaffTeam from '../../../components/ButtonStaffTeam';
import PageStaffTeam from '../../../components/PageStaffTeam';
import { useApiAuth } from '../../../hooks/useApi';
import { ENDPOINTS } from '../../../constants';

const AuthComponent: React.FC = () => {
  const { login, addNotification } = useAppContext();
  const { navigateTo } = useAppNavigation();
  
  const [formData, setFormData] = useState<LoginCredentials>({
    login: '',
    senha: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { auth, loading: apiLoading, error: apiError } = useApiAuth<LoginResponse, LoginCredentials>();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: LoginCredentials) => ({
      ...prev,
      [name]: value
    }));
  };

  const clearError = () => {
    setError(null);
  };

  const resetForm = () => {
    setFormData({
      login: '',
      senha: '',
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Chamada para o endpoint de login
      console.log('Enviando dados de login:', JSON.stringify(formData));
      const isAuthenticated = await auth(ENDPOINTS.LOGIN, formData);
      if (isAuthenticated === null) {
        throw new Error('Erro ao autenticar. Verifique suas credenciais.');
      }
      // Desestruturar os dados do usuário autenticado
      const { token, cdUsuario, login: userLogin, nome, email, cdTpAcesso, expiresIn } = isAuthenticated;
      // Usar o sistema de autenticação integrado
      login(token, {
        id: cdUsuario.toString(),
        nome: nome,
        login: userLogin,
        email: email,
        cdTpAcesso: cdTpAcesso
      }, expiresIn.toString());
      // Adicionar notificação de sucesso
      addNotification(`Bem-vindo, ${nome}!`);
      // Navegação após login bem-sucedido
      navigateTo('/');
    } catch (error: any) {
      console.error('Erro no login:', error);
      const errorMessage = error?.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.';
      setError(errorMessage);
      addNotification(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // TODO: Implementar lógica de recuperação de senha
    alert('Funcionalidade de recuperação de senha em desenvolvimento');
  };

  return (
    <PageStaffTeam>
      <div className="auth-page">
        <div className="auth-container">
          <CardStaffTeam className="auth-card max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-lg">
              <div className="mb-md">
                <MaterialIcon name="login" color="primary" size="large" />
              </div>
              <h1 className="text-xl color-text-primary mb-xs">
                Fed Team
              </h1>
              <p className="color-text-secondary">
                Faça login para acessar o sistema
              </p>
            </div>
            {/* Error Message */}
            {error && (
              <div className="flex flex-col alert alert-error mb-md">
                <MaterialIcon name="error" color="error" size="small" />
                <span>{error}</span>
                <ButtonStaffTeam
                  onClick={clearError}
                  className="btn-sm btn-ghost ml-auto"
                  text='Fechar erro' />
              </div>
            )}
            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-md">
              <div className="form-group">
                <label htmlFor="login" className="form-label">
                  <MaterialIcon name="person" size="small" className="mr-xs" />
                  Login
                </label>
                <input
                  id="login"
                  name="login"
                  type="text"
                  value={formData.login}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Digite seu login"
                  required
                  disabled={loading}
                  autoComplete="username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="senha" className="form-label">
                  <MaterialIcon name="lock" size="small" className="mr-xs" />
                  Senha
                </label>
                <input
                  id="senha"
                  name="senha"
                  type="password"
                  value={formData.senha}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Digite sua senha"
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>

              <div className="form-group">
                <ButtonStaffTeam
                  typeButton='button'
                  onClick={handleForgotPassword}
                  className="btn-link"
                  text='Recuperar senha' />
              </div>
              {/* Actions */}
              <div className="flex-align-end">
                <ButtonStaffTeam
                  typeButton='button'
                  onClick={resetForm}
                  className="btn-secondary"
                  disabled={loading}
                  icon={<MaterialIcon name="refresh" size="small" className="mr-xs" />}
                  text='Limpar' />
                <ButtonStaffTeam
                  typeButton='submit'
                  className="btn-primary"
                  disabled={loading || !formData.login || !formData.senha}
                  icon={loading ? <MaterialIcon name="hourglass_empty" size="small" className="mr-xs animate-spin" /> : <MaterialIcon name="login" size="small" className="mr-xs" />}
                  text={loading ? 'Entrando...' : 'Entrar'} />
              </div>
            </form>
          </CardStaffTeam>
        </div>
      </div>
    </PageStaffTeam>
  );
};

export default AuthComponent;
