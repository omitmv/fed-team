import React, { useState } from 'react';
import { useApi, useApiCreate, useApiUpdate, useApiDelete } from '../../../hooks/useApi';
import { Usuario, UsuarioCreate, UsuarioUpdate } from '../types';
import { ENDPOINTS } from '../../../constants';
import { UserDataFormatter } from '../../../utils/crypto';
import '../styles/UsuarioList.css';

const UsuarioList: React.FC = () => {
  // Estados para o formulário
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState<UsuarioCreate>({
    login: '',
    senha: '',
    nome: '',
    email: '',
    flAtivo: true,
    dtExpiracao: '',
  });

  // Usando hooks customizados para operações da API
  const { data: usuarios, loading, error, refetch } = useApi<Usuario[]>(ENDPOINTS.USUARIOS);
  const { create, loading: createLoading, error: createError } = useApiCreate<Usuario, UsuarioCreate>();
  const { update, loading: updateLoading, error: updateError } = useApiUpdate<Usuario, UsuarioUpdate>();
  const { deleteResource, loading: deleteLoading, error: deleteError } = useApiDelete();

  // Função para criar um novo usuário
  const handleCreateUser = async (userData: UsuarioCreate) => {
    // Enviar senha em texto plano - criptografia será feita no backend
    const newUser = await create(ENDPOINTS.USUARIOS, userData);
    if (newUser) {
      refetch(); // Recarrega a lista após criar
      setShowForm(false);
      resetForm();
    }
  };

  // Função para atualizar um usuário
  const handleUpdateUser = async (cdUsuario: number, userData: UsuarioUpdate) => {
    // Enviar senha em texto plano - criptografia será feita no backend
    const updatedUser = await update(ENDPOINTS.USUARIO_BY_ID(cdUsuario), userData);
    if (updatedUser) {
      refetch(); // Recarrega a lista após atualizar
      setEditingUser(null);
      resetForm();
    }
  };

  // Função para deletar um usuário
  const handleDeleteUser = async (cdUsuario: number) => {
    if (window.confirm('Tem certeza que deseja deletar este usuário?')) {
      const success = await deleteResource(ENDPOINTS.USUARIO_BY_ID(cdUsuario));
      if (success) {
        refetch(); // Recarrega a lista após deletar
      }
    }
  };

  // Função para resetar o formulário
  const resetForm = () => {
    setFormData({
      login: '',
      senha: '',
      nome: '',
      email: '',
      flAtivo: true,
      dtExpiracao: '',
    });
    setEditingUser(null);
    setShowForm(false);
  };

  // Função para iniciar edição
  const startEdit = (usuario: Usuario) => {
    setEditingUser(usuario);
    setFormData({
      login: usuario.login,
      senha: '', // Não mostrar senha atual
      nome: usuario.nome,
      email: usuario.email,
      flAtivo: usuario.flAtivo,
      dtExpiracao: usuario.dtExpiracao || '',
    });
    setShowForm(true);
  };

  // Função para submeter o formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      // Atualização - não enviar campos vazios
      const updateData: UsuarioUpdate = {};
      if (formData.login !== editingUser.login) updateData.login = formData.login;
      if (formData.senha) updateData.senha = formData.senha;
      if (formData.nome !== editingUser.nome) updateData.nome = formData.nome;
      if (formData.email !== editingUser.email) updateData.email = formData.email;
      if (formData.flAtivo !== editingUser.flAtivo) updateData.flAtivo = formData.flAtivo;
      if (formData.dtExpiracao !== (editingUser.dtExpiracao || '')) {
        updateData.dtExpiracao = formData.dtExpiracao || undefined;
      }
      
      handleUpdateUser(editingUser.cdUsuario, updateData);
    } else {
      // Criação
      handleCreateUser(formData);
    }
  };

  // Estados de loading combinados
  const isOperationLoading = createLoading || updateLoading || deleteLoading;

  // Erros combinados
  const operationError = createError || updateError || deleteError;

  if (loading) {
    return <div className="loading">Carregando usuários...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>Erro: {error}</p>
        <button onClick={refetch}>Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className="user-list">
      <h2>Lista de Usuários</h2>
      
      <div className="actions">
        <button 
          onClick={refetch} 
          className="refresh-btn"
          disabled={isOperationLoading}
        >
          {isOperationLoading ? 'Processando...' : 'Atualizar Lista'}
        </button>
        
        <button 
          onClick={() => setShowForm(!showForm)}
          className="add-btn"
          disabled={isOperationLoading}
        >
          {showForm ? 'Cancelar' : 'Novo Usuário'}
        </button>
      </div>

      {operationError && (
        <div className="error">
          <p>Erro na operação: {operationError}</p>
        </div>
      )}

      {/* Formulário de criação/edição */}
      {showForm && (
        <div className="user-form">
          <h3>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="login">Login:</label>
              <input
                type="text"
                id="login"
                value={formData.login}
                onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                maxLength={250}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="senha">Senha:</label>
              <input
                type="password"
                id="senha"
                value={formData.senha}
                onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                placeholder={editingUser ? 'Deixe vazio para manter a atual' : ''}
                required={!editingUser}
              />
            </div>

            <div className="form-group">
              <label htmlFor="nome">Nome:</label>
              <input
                type="text"
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                maxLength={250}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">E-mail:</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                maxLength={250}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="flAtivo">
                <input
                  type="checkbox"
                  id="flAtivo"
                  checked={formData.flAtivo}
                  onChange={(e) => setFormData({ ...formData, flAtivo: e.target.checked })}
                />
                Usuário Ativo
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="dtExpiracao">Data de Expiração:</label>
              <input
                type="date"
                id="dtExpiracao"
                value={formData.dtExpiracao}
                onChange={(e) => setFormData({ ...formData, dtExpiracao: e.target.value })}
              />
            </div>

            <div className="form-actions">
              <button type="submit" disabled={isOperationLoading}>
                {editingUser ? 'Atualizar' : 'Criar'}
              </button>
              <button type="button" onClick={resetForm}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de usuários */}
      {!usuarios || usuarios.length === 0 ? (
        <p>Nenhum usuário encontrado.</p>
      ) : (
        <div className="users-grid">
          {usuarios.map(usuario => (
            <div key={usuario.cdUsuario} className="user-card">
              <div className="user-info">
                <h4>{usuario.nome}</h4>
                <p><strong>Login:</strong> {usuario.login}</p>
                <p><strong>E-mail:</strong> {usuario.email}</p>
                <p><strong>Cadastro:</strong> {UserDataFormatter.formatDataCadastro(usuario.dataCadastro)}</p>
                <p><strong>Expiração:</strong> {UserDataFormatter.formatDataExpiracao(usuario.dtExpiracao)}</p>
                <p>
                  <strong>Status:</strong> 
                  <span className={`status ${UserDataFormatter.getUserStatus(usuario.flAtivo, usuario.dtExpiracao).toLowerCase()}`}>
                    {UserDataFormatter.getUserStatus(usuario.flAtivo, usuario.dtExpiracao)}
                  </span>
                </p>
              </div>
              
              <div className="user-actions">
                <button 
                  onClick={() => startEdit(usuario)}
                  className="update-btn"
                  disabled={isOperationLoading}
                >
                  Editar
                </button>
                <button 
                  onClick={() => handleDeleteUser(usuario.cdUsuario)}
                  className="delete-btn"
                  disabled={isOperationLoading}
                >
                  Deletar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsuarioList;
