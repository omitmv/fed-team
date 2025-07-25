# Exemplos de Uso da API

Este arquivo contém exemplos práticos de como usar a API configurada no projeto.

## 📋 Estrutura dos Dados

### Usuário (User)
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}
```

## 🔧 Usando os Hooks Customizados

### 1. Listagem de Usuários (GET)

```typescript
import React from 'react';
import { useApi } from '../hooks/useApi';
import { User } from '../types';

const UsersList: React.FC = () => {
  const { data: users, loading, error, refetch } = useApi<User[]>('/users');

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <button onClick={refetch}>Atualizar</button>
      {users?.map(user => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
};
```

### 2. Criação de Usuário (POST)

```typescript
import React from 'react';
import { useApiCreate } from '../hooks/useApi';
import { User } from '../types';

const CreateUser: React.FC = () => {
  const { create, loading, error } = useApiCreate<User, Omit<User, 'id'>>();

  const handleCreate = async () => {
    const newUser = await create('/users', {
      name: 'João Silva',
      email: 'joao@exemplo.com'
    });
    
    if (newUser) {
      console.log('Usuário criado:', newUser);
    }
  };

  return (
    <div>
      <button onClick={handleCreate} disabled={loading}>
        {loading ? 'Criando...' : 'Criar Usuário'}
      </button>
      {error && <p>Erro: {error}</p>}
    </div>
  );
};
```

### 3. Atualização de Usuário (PUT)

```typescript
import React from 'react';
import { useApiUpdate } from '../hooks/useApi';
import { User } from '../types';

const UpdateUser: React.FC<{ userId: number }> = ({ userId }) => {
  const { update, loading, error } = useApiUpdate<User, Partial<User>>();

  const handleUpdate = async () => {
    const updatedUser = await update(`/users/${userId}`, {
      name: 'João Silva Atualizado'
    });
    
    if (updatedUser) {
      console.log('Usuário atualizado:', updatedUser);
    }
  };

  return (
    <div>
      <button onClick={handleUpdate} disabled={loading}>
        {loading ? 'Atualizando...' : 'Atualizar Usuário'}
      </button>
      {error && <p>Erro: {error}</p>}
    </div>
  );
};
```

### 4. Exclusão de Usuário (DELETE)

```typescript
import React from 'react';
import { useApiDelete } from '../hooks/useApi';

const DeleteUser: React.FC<{ userId: number }> = ({ userId }) => {
  const { deleteResource, loading, error } = useApiDelete();

  const handleDelete = async () => {
    const success = await deleteResource(`/users/${userId}`);
    
    if (success) {
      console.log('Usuário deletado com sucesso');
    }
  };

  return (
    <div>
      <button onClick={handleDelete} disabled={loading}>
        {loading ? 'Deletando...' : 'Deletar Usuário'}
      </button>
      {error && <p>Erro: {error}</p>}
    </div>
  );
};
```

## 🔄 Usando a API Diretamente

### Requisições Simples

```typescript
import { api } from '../services/api';
import { User } from '../types';

// GET - Buscar todos os usuários
const getUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get<User[]>('/users');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw error;
  }
};

// GET - Buscar usuário por ID
const getUserById = async (id: number): Promise<User> => {
  try {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    throw error;
  }
};

// POST - Criar usuário
const createUser = async (userData: Omit<User, 'id'>): Promise<User> => {
  try {
    const response = await api.post<User>('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
};

// PUT - Atualizar usuário
const updateUser = async (id: number, userData: Partial<User>): Promise<User> => {
  try {
    const response = await api.put<User>(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw error;
  }
};

// DELETE - Deletar usuário
const deleteUser = async (id: number): Promise<void> => {
  try {
    await api.delete(`/users/${id}`);
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    throw error;
  }
};
```

## 📊 Tratamento de Estados de Loading

```typescript
import React, { useState } from 'react';
import { api } from '../services/api';
import { User } from '../types';

const ManualApiCall: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get<User[]>('/users');
      setUsers(response.data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchUsers} disabled={loading}>
        {loading ? 'Carregando...' : 'Buscar Usuários'}
      </button>
      
      {error && <div className="error">{error}</div>}
      
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
};
```

## 🔐 Exemplo com Autenticação

```typescript
// Configurando token de autenticação
const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
  // O interceptor da API automaticamente adicionará o token às requisições
};

// Removendo token (logout)
const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

// Login
const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { token } = response.data;
    setAuthToken(token);
    return response.data;
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
};
```

## 🔄 Retry Automático

```typescript
import { retryOperation } from '../utils/errorHandler';

const fetchWithRetry = async () => {
  try {
    const result = await retryOperation(
      () => api.get('/users'),
      3, // máximo de 3 tentativas
      1000 // delay de 1 segundo entre tentativas
    );
    return result.data;
  } catch (error) {
    console.error('Falha após múltiplas tentativas:', error);
    throw error;
  }
};
```

## 🎯 Dicas Importantes

1. **Sempre use try/catch** ao fazer chamadas diretas à API
2. **Use os hooks customizados** para operações simples
3. **Configure interceptors** para adicionar tokens automaticamente
4. **Trate erros de forma consistente** usando o ApiErrorHandler
5. **Use TypeScript** para ter tipagem forte nas responses
6. **Configure timeouts apropriados** para sua aplicação
7. **Implemente retry logic** para operações críticas
8. **Use loading states** para melhor UX
