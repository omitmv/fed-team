import React, { useState } from 'react';
import { LoginCredentials } from '../types';
import { api } from '../../../services/api';
import { usePlugin } from '../../../hooks/usePlugin';

const LoginWithPlugin: React.FC = () => {
  const [formData, setFormData] = useState<LoginCredentials>({
    login: '',
    senha: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hook do plugin para conectar após login
  const { connect: connectPlugin, isConnected: pluginConnected } = usePlugin();

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
      console.log('Enviando dados de login:', JSON.stringify(formData));
      const response = await api.post('/v1/usuario/login', {
        login: formData.login,
        senha: formData.senha
      });
      
      const { token } = response.data;
      localStorage.setItem('token', token);
      
      // ✅ NOVA FUNCIONALIDADE: Conectar ao plugin após login bem-sucedido
      try {
        console.log('🔌 Tentando conectar ao plugin...');
        await connectPlugin();
        console.log('✅ Plugin conectado com sucesso!');
        
        alert(`Login realizado com sucesso!\nPlugin: ${pluginConnected ? 'Conectado' : 'Desconectado'}`);
      } catch (pluginError) {
        console.warn('⚠️ Erro ao conectar plugin (login ainda foi bem-sucedido):', pluginError);
        alert('Login realizado com sucesso!\nAviso: Plugin não pôde ser conectado.');
      }
      
    } catch (err: any) {
      console.error('Erro na chamada de login:', err);
      
      if (err.response) {
        // Erro com resposta do servidor
        console.error('Dados do erro:', JSON.stringify(err.response.data));
        console.error('Status do erro:', JSON.stringify(err.response.status));
        console.error('Headers do erro:', JSON.stringify(err.response.headers));

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
          {/* Indicador de status do plugin */}
          <div className="flex items-center gap-sm mb-md p-sm bg-surface border border-border rounded">
            <span className={`status-dot ${pluginConnected ? 'status-connected' : 'status-disconnected'}`}></span>
            <span className="text-sm text-secondary font-medium">
              Plugin: {pluginConnected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-md">
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
                className="form-control"
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
                className="form-control"
                required
                autoComplete="current-password"
                placeholder="Digite sua senha"
              />
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-primary hover:underline text-sm"
              >
                Recuperar senha
              </button>
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-full ${loading ? 'btn-loading' : ''}`}
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

export default LoginWithPlugin;
