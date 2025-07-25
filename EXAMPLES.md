# Exemplos de Uso da API - Fed Team

Este arquivo contém exemplos práticos de como usar o sistema de gerenciamento de usuários.

## 🔐 Criptografia de Senhas

**IMPORTANTE**: A criptografia de senhas é realizada no **backend/API**, não no frontend. O frontend envia as senhas em texto plano através de HTTPS.

### Exemplo de Validação de Senha (Frontend)

```typescript
import { PasswordCrypto } from './src/utils/crypto';

// Validar força da senha no frontend (antes de enviar)
const validacao = PasswordCrypto.validatePasswordStrength("MinhaSenh@123");
console.log(validacao.isValid); // true
console.log(validacao.errors); // []

// Gerar senha aleatória
const senhaAleatoria = PasswordCrypto.generateRandomPassword(16);
console.log(senhaAleatoria); // Ex: "Kj8#mN2pQ@xR9wE!"

// NOTA: A criptografia (Base64 + MD5) é feita automaticamente pela API
```

## 📊 Formatação de Dados

### Exemplo de Formatação

```typescript
import { UserDataFormatter } from './src/utils/crypto';

// Formatar data de cadastro
const dataCadastro = "2024-01-15T10:30:00Z";
const dataFormatada = UserDataFormatter.formatDataCadastro(dataCadastro);
console.log(dataFormatada); // "15/01/2024, 10:30"

// Formatar data de expiração
const dtExpiracao = "2024-12-31";
const expiracao = UserDataFormatter.formatDataExpiracao(dtExpiracao);
console.log(expiracao); // "31/12/2024"

// Verificar status do usuário
const status = UserDataFormatter.getUserStatus(true, dtExpiracao);
console.log(status); // "ATIVO" | "INATIVO" | "EXPIRADO"

// Mascarar login
const loginMascarado = UserDataFormatter.maskLogin("joao.silva123");
console.log(loginMascarado); // "jo*******23"
```

## 🔌 Hooks da API

### Exemplo de Uso dos Hooks

```typescript
import React from 'react';
import { useApi, useApiCreate, useApiUpdate, useApiDelete } from './src/hooks/useApi';
import { Usuario, UsuarioCreate } from './src/types';
import { ENDPOINTS } from './src/constants';

function ExemploComponente() {
  // Hook para listar usuários
  const { data: usuarios, loading, error, refetch } = useApi<Usuario[]>(ENDPOINTS.USUARIOS);
  
  // Hook para criar usuário
  const { create, loading: createLoading } = useApiCreate<Usuario, UsuarioCreate>();
  
  // Hook para atualizar usuário
  const { update, loading: updateLoading } = useApiUpdate<Usuario, Partial<Usuario>>();
  
  // Hook para deletar usuário
  const { deleteResource, loading: deleteLoading } = useApiDelete();

  // Função para criar usuário
  const criarUsuario = async () => {
    const novoUsuario: UsuarioCreate = {
      login: "novo.usuario",
      senha: "SenhaForte123!", // Senha em texto plano - será criptografada pela API
      nome: "Novo Usuário",
      email: "novo@exemplo.com",
      flAtivo: true,
      dtExpiracao: "2024-12-31"
    };

    const usuario = await create(ENDPOINTS.USUARIOS, novoUsuario);
    if (usuario) {
      refetch(); // Recarrega a lista
    }
  };

  // Função para atualizar usuário
  const atualizarUsuario = async (id: number) => {
    const dadosAtualizacao = {
      nome: "Nome Atualizado",
      email: "email_atualizado@exemplo.com"
    };

    const usuario = await update(ENDPOINTS.USUARIO_BY_ID(id), dadosAtualizacao);
    if (usuario) {
      refetch();
    }
  };

  // Função para deletar usuário
  const deletarUsuario = async (id: number) => {
    const sucesso = await deleteResource(ENDPOINTS.USUARIO_BY_ID(id));
    if (sucesso) {
      refetch();
    }
  };

  return (
    <div>
      {loading && <p>Carregando...</p>}
      {error && <p>Erro: {error}</p>}
      
      {usuarios?.map(usuario => (
        <div key={usuario.cdUsuario}>
          <h3>{usuario.nome}</h3>
          <p>{usuario.email}</p>
          <button onClick={() => atualizarUsuario(usuario.cdUsuario)}>
            Atualizar
          </button>
          <button onClick={() => deletarUsuario(usuario.cdUsuario)}>
            Deletar
          </button>
        </div>
      ))}
      
      <button onClick={criarUsuario}>Criar Usuário</button>
    </div>
  );
}
```

## 🌐 Requisições HTTP Diretas

### Exemplo usando o Serviço da API

```typescript
import { api } from './src/services/api';
import { Usuario, UsuarioCreate } from './src/types';

// GET - Listar todos os usuários
const listarUsuarios = async () => {
  try {
    const response = await api.get<Usuario[]>('/v1/usuarios');
    console.log(response.data);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
  }
};

// GET - Buscar usuário por ID
const buscarUsuario = async (id: number) => {
  try {
    const response = await api.get<Usuario>(`/v1/usuarios/${id}`);
    console.log(response.data);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
  }
};

// POST - Criar novo usuário
const criarUsuario = async () => {
  try {
    const novoUsuario: UsuarioCreate = {
      login: "exemplo.usuario",
      senha: "SenhaSegura123!", // Senha em texto plano - API fará a criptografia
      nome: "Usuário de Exemplo",
      email: "exemplo@teste.com",
      flAtivo: true,
      dtExpiracao: "2024-12-31"
    };

    const response = await api.post<Usuario>('/v1/usuarios', novoUsuario);
    console.log('Usuário criado:', response.data);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
  }
};

// PUT - Atualizar usuário
const atualizarUsuario = async (id: number) => {
  try {
    const dadosAtualizacao = {
      nome: "Nome Atualizado",
      email: "novo_email@exemplo.com",
      senha: "NovaSenha123!" // Senha em texto plano - API fará a criptografia
    };

    const response = await api.put<Usuario>(`/v1/usuarios/${id}`, dadosAtualizacao);
    console.log('Usuário atualizado:', response.data);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
  }
};

// DELETE - Remover usuário
const removerUsuario = async (id: number) => {
  try {
    await api.delete(`/v1/usuarios/${id}`);
    console.log('Usuário removido com sucesso');
  } catch (error) {
    console.error('Erro ao remover usuário:', error);
  }
};
```

## 🎯 Casos de Uso Comuns

### 1. Login de Usuário

```typescript
import { api } from './src/services/api';

const fazerLogin = async (login: string, senha: string) => {
  try {
    // Enviar credenciais para endpoint de login da API
    // A API fará a validação da senha criptografada
    const response = await api.post('/v1/auth/login', {
      login,
      senha // Senha em texto plano - API fará a validação
    });

    const usuario = response.data;

    console.log('Login realizado com sucesso:', usuario);
    return usuario;

  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
};
```

### 2. Alteração de Senha

```typescript
const alterarSenha = async (usuarioId: number, senhaAtual: string, novaSenha: string) => {
  try {
    // Validar força da nova senha no frontend
    const validacao = PasswordCrypto.validatePasswordStrength(novaSenha);
    
    if (!validacao.isValid) {
      throw new Error(`Senha fraca: ${validacao.errors.join(', ')}`);
    }

    // Enviar para API - ela validará a senha atual e criptografará a nova
    const response = await api.put(`/v1/usuarios/${usuarioId}/senha`, {
      senhaAtual, // Texto plano
      novaSenha   // Texto plano - API fará a criptografia
    });

    console.log('Senha alterada com sucesso');
    return response.data;

  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    throw error;
  }
};
```

### 3. Recuperação de Senha

```typescript
const recuperarSenha = async (email: string) => {
  try {
    // Solicitar recuperação de senha via API
    // A API gerará nova senha, criptografará e enviará por email
    const response = await api.post('/v1/auth/recuperar-senha', {
      email
    });

    console.log('Email de recuperação enviado para:', email);
    return response.data;

  } catch (error) {
    console.error('Erro na recuperação de senha:', error);
    throw error;
  }
};
```

## 🔄 Tratamento de Erros

### Exemplo de Tratamento Global

```typescript
import { handleApiError } from './src/utils/errorHandler';

const exemploComTratamentoDeErros = async () => {
  try {
    const response = await api.get('/v1/usuarios');
    return response.data;
  } catch (error) {
    const mensagemAmigavel = handleApiError(error);
    console.error('Erro tratado:', mensagemAmigavel);
    
    // Mostrar mensagem para o usuário
    alert(mensagemAmigavel);
  }
};
```

## 📈 Monitoramento e Logs

### Exemplo de Log de Operações

```typescript
const logOperacao = (operacao: string, dados: any) => {
  console.log(`[${new Date().toISOString()}] ${operacao}:`, dados);
};

const criarUsuarioComLog = async (dadosUsuario: UsuarioCreate) => {
  logOperacao('CRIAR_USUARIO_INICIO', dadosUsuario);
  
  try {
    const usuario = await api.post('/v1/usuarios', dadosUsuario);
    logOperacao('CRIAR_USUARIO_SUCESSO', usuario.data);
    return usuario.data;
  } catch (error) {
    logOperacao('CRIAR_USUARIO_ERRO', error);
    throw error;
  }
};
```

---

## 📝 Notas Importantes

1. **Segurança**: 
   - Senhas são enviadas em texto plano através de HTTPS
   - Criptografia é responsabilidade do backend/API
   - Nunca exponha senhas em logs ou console no frontend
2. **Performance**: Use os hooks para cache automático
3. **Errors**: Sempre trate erros adequadamente
4. **Types**: Aproveite o TypeScript para type safety
5. **Testing**: Teste todas as operações CRUD
6. **Validação**: Valide a força da senha no frontend antes de enviar

Para mais exemplos, consulte os testes unitários no diretório `/src/__tests__/`.
