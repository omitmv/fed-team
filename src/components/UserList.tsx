import React from 'react';
import { useApi, useApiCreate, useApiUpdate, useApiDelete } from '../hooks/useApi';
import { User } from '../types';

const UserList: React.FC = () => {
  // Usando hooks customizados para operações da API
  const { data: users, loading, error, refetch } = useApi<User[]>('/users');
  const { create, loading: createLoading, error: createError } = useApiCreate<User, Omit<User, 'id'>>();
  const { update, loading: updateLoading, error: updateError } = useApiUpdate<User, Partial<User>>();
  const { deleteResource, loading: deleteLoading, error: deleteError } = useApiDelete();

  // Função para criar um novo usuário
  const handleCreateUser = async () => {
    const userData = { 
      name: 'Novo Usuário', 
      email: 'novo@exemplo.com' 
    };
    
    const newUser = await create('/users', userData);
    if (newUser) {
      refetch(); // Recarrega a lista após criar
    }
  };

  // Função para atualizar um usuário
  const handleUpdateUser = async (id: number, name: string) => {
    const updatedUser = await update(`/users/${id}`, { name: name + ' (Atualizado)' });
    if (updatedUser) {
      refetch(); // Recarrega a lista após atualizar
    }
  };

  // Função para deletar um usuário
  const handleDeleteUser = async (id: number) => {
    const success = await deleteResource(`/users/${id}`);
    if (success) {
      refetch(); // Recarrega a lista após deletar
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
      
      <button 
        onClick={refetch} 
        className="refresh-btn"
        disabled={isOperationLoading}
      >
        {isOperationLoading ? 'Processando...' : 'Atualizar Lista'}
      </button>

      {operationError && (
        <div className="error">
          <p>Erro na operação: {operationError}</p>
        </div>
      )}

      {!users || users.length === 0 ? (
        <p>Nenhum usuário encontrado.</p>
      ) : (
        <ul>
          {users.map(user => (
            <li key={user.id} className="user-item">
              <div>
                <strong>{user.name}</strong>
                <br />
                <span>{user.email}</span>
              </div>
              <div className="user-actions">
                <button 
                  onClick={() => handleUpdateUser(user.id, user.name)}
                  className="update-btn"
                  disabled={isOperationLoading}
                >
                  {updateLoading ? 'Atualizando...' : 'Atualizar'}
                </button>
                <button 
                  onClick={() => handleDeleteUser(user.id)}
                  className="delete-btn"
                  disabled={isOperationLoading}
                >
                  {deleteLoading ? 'Deletando...' : 'Deletar'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="add-user">
        <h3>Adicionar Novo Usuário</h3>
        <button 
          onClick={handleCreateUser}
          className="add-btn"
          disabled={isOperationLoading}
        >
          {createLoading ? 'Criando...' : 'Adicionar Usuário de Exemplo'}
        </button>
      </div>
    </div>
  );
};

export default UserList;
