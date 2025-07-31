import React, { useState } from 'react';
import { useApi, useApiCreate, useApiUpdate, useApiDelete } from '../../../hooks/useApi';
import { Usuario, UsuarioCreate, UsuarioUpdate } from '../types';
import { ENDPOINTS } from '../../../constants';
import { UserDataFormatter } from '../../../utils/crypto';

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
    cdTpAcesso: 6, // Tipo de acesso padrão
  });

  // Função para mapear status para classes do tema
  const getUserStatusClass = (flAtivo: boolean, dtExpiracao?: string): string => {
    const status = UserDataFormatter.getUserStatus(flAtivo, dtExpiracao).toLowerCase();
    switch (status) {
      case 'ativo':
        return 'badge-success';
      case 'inativo':
        return 'badge-error';
      case 'expirado':
        return 'badge-warning';
      default:
        return 'badge-secondary';
    }
  };

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
      if (formData.cdTpAcesso !== editingUser.cdTpAcesso) {
        updateData.cdTpAcesso = formData.cdTpAcesso;
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
    return <div className="text-center p-xl text-muted">Carregando usuários...</div>;
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <p>Erro: {error}</p>
        <button onClick={refetch} className="btn btn-error">Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className="feature-card">
      <h2 className="text-primary mb-lg">Lista de Usuários</h2>

      <div className="flex p-md mb-lg flex-wrap flex-center">
        <button
          onClick={refetch}
          className="btn btn-secondary"
          disabled={isOperationLoading}
        >
          {isOperationLoading ? 'Processando...' : 'Atualizar Lista'}
        </button>
        
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn btn-success"
          disabled={isOperationLoading}
        >
          {showForm ? 'Cancelar' : 'Novo Usuário'}
        </button>
      </div>

      {operationError && (
        <div className="alert alert-error mb-lg">
          <p>Erro na operação: {operationError}</p>
        </div>
      )}

      {/* Formulário de criação/edição */}
      {showForm && (
        <div className="flex p-md mb-log flex-wrap">
          <div className="feature-card bg-surface mb-lg">
            <h3 className="text-primary mb-md">{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</h3>
            <form onSubmit={handleSubmit} className="grid gap-md">
              <div className="form-group">
                <label htmlFor="login" className="form-label">Login:</label>
                <input
                  type="text"
                  id="login"
                  value={formData.login}
                  onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                  maxLength={250}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="senha" className="form-label">Senha:</label>
                <input
                  type="password"
                  id="senha"
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                  placeholder={editingUser ? 'Deixe vazio para manter a atual' : ''}
                  required={!editingUser}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="nome" className="form-label">Nome:</label>
                <input
                  type="text"
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  maxLength={250}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">E-mail:</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  maxLength={250}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="flAtivo" className="form-label flex items-center gap-sm">
                  <input
                    type="checkbox"
                    id="flAtivo"
                    checked={formData.flAtivo}
                    onChange={(e) => setFormData({ ...formData, flAtivo: e.target.checked })}
                    className="form-checkbox"
                  />
                  Usuário Ativo
                </label>
              </div>

              <div className="form-group">
                <label htmlFor="dtExpiracao" className="form-label">Data de Expiração:</label>
                <input
                  type="date"
                  id="dtExpiracao"
                  value={formData.dtExpiracao}
                  onChange={(e) => setFormData({ ...formData, dtExpiracao: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="cdTpAcesso" className="form-label">Tipo de Acesso:</label>
                <select
                  id="cdTpAcesso"
                  value={formData.cdTpAcesso}
                  onChange={(e) => setFormData({ ...formData, cdTpAcesso: Number(e.target.value) })}
                  className="form-control"
                >
                  <option value="">Selecione um tipo de acesso</option>
                  <option value="1">Administrador</option>
                  <option value="2">Profissional</option>
                  <option value="3">Atleta</option>
                  <option value="4">Visitante</option>
                  <option value="5">Convidado</option>
                  <option value="6">Padrão</option>
                </select>
              </div>

              <div className="flex gap-md justify-end mt-lg">
                <button type="submit" disabled={isOperationLoading} className="btn btn-primary">
                  {editingUser ? 'Atualizar' : 'Criar'}
                </button>
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de usuários */}
      {!usuarios || usuarios.length === 0 ? (
        <p className="text-muted text-center">Nenhum usuário encontrado.</p>
      ) : (
        <div className="flex p-md mb-lg flex-wrap bg-surface">
          <div className="feature-grid grid-cols-auto gap-lg">
            {usuarios.map(usuario => (
              <div key={usuario.cdUsuario} className="feature-card hover-shadow">
                <div className="mb-md">
                  <h4 className="text-primary mb-sm">{usuario.nome}</h4>
                  <p className="text-sm mb-xs"><strong>Login:</strong> {usuario.login}</p>
                  <p className="text-sm mb-xs"><strong>E-mail:</strong> {usuario.email}</p>
                  <p className="text-sm mb-xs"><strong>Cadastro:</strong> {UserDataFormatter.formatDataCadastro(usuario.dataCadastro)}</p>
                  <p className="text-sm mb-xs"><strong>Expiração:</strong> {UserDataFormatter.formatDataExpiracao(usuario.dtExpiracao)}</p>
                  <p className="text-sm">
                    <strong>Status:</strong> 
                    <span className={`badge ml-sm ${getUserStatusClass(usuario.flAtivo, usuario.dtExpiracao)}`}>
                      {UserDataFormatter.getUserStatus(usuario.flAtivo, usuario.dtExpiracao)}
                    </span>
                  </p>
                </div>
                
                <div className="flex gap-sm justify-end">
                  <button 
                    onClick={() => startEdit(usuario)}
                    className="btn btn-warning btn-sm"
                    disabled={isOperationLoading}
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDeleteUser(usuario.cdUsuario)}
                    className="btn btn-error btn-sm"
                    disabled={isOperationLoading}
                  >
                    Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuarioList;
