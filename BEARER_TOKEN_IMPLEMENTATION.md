# Sistema de Autenticação com Bearer Token - Fed Team

## 🔐 Visão Geral

Foi implementado um sistema completo de autenticação com Bearer Token para o projeto Fed Team. O sistema automaticamente adiciona o Bearer Token em todas as chamadas de API, **exceto** para o endpoint `/v1/usuario/login`.

## ✅ Funcionalidades Implementadas

### 1. **Serviço de Autenticação** (`authService.ts`)

- ✅ Gerenciamento de tokens de acesso e refresh
- ✅ Armazenamento seguro no localStorage
- ✅ Gerenciamento de dados do usuário
- ✅ Verificação de autenticação
- ✅ Detecção de expiração de token
- ✅ Logout automático

### 2. **Interceptador de API** (atualizado em `api.ts`)

- ✅ Adição automática do Bearer Token em requests
- ✅ Exclusão do token para `/v1/usuario/login`
- ✅ Logout automático em caso de token inválido (401)
- ✅ Redirecionamento para login quando necessário
- ✅ Logs detalhados de requisições

### 3. **Sistema de Contexto** (atualizado em `AppContext.tsx`)

- ✅ Estado global de autenticação
- ✅ Funções de login e logout integradas
- ✅ Verificação automática de status na inicialização
- ✅ Sincronização com authService

### 4. **Rotas Protegidas** (`ProtectedRoute.tsx`)

- ✅ Componente para rotas que requerem autenticação
- ✅ Componente para rotas públicas (apenas não autenticados)
- ✅ Redirecionamento automático
- ✅ Loading state durante verificação

### 5. **Integração com Componentes**

- ✅ Login component atualizado para usar novo sistema
- ✅ Navigation com logout funcional
- ✅ Estado de usuário logado na interface

## 🔧 Como Funciona

### Fluxo de Autenticação

```mermaid
graph TD
    A[Usuário acessa aplicação] --> B[Verificar token no localStorage]
    B --> C{Token existe?}
    C -->|Não| D[Usuário não autenticado]
    C -->|Sim| E[Verificar validade do token]
    E --> F{Token válido?}
    F -->|Não| G[Logout automático]
    F -->|Sim| H[Usuário autenticado]

    I[Login bem-sucedido] --> J[Salvar token + dados do usuário]
    J --> K[Atualizar estado da aplicação]
    K --> L[Redirecionar para página inicial]

    M[API Request] --> N{Endpoint requer auth?}
    N -->|Não| O[Enviar sem token]
    N -->|Sim| P[Adicionar Bearer Token]
    P --> Q[Enviar requisição]
    Q --> R{Resposta 401?}
    R -->|Sim| S[Logout automático + Redirect]
    R -->|Não| T[Continuar normalmente]
```

### Endpoints e Autenticação

| Endpoint                  | Bearer Token | Observações                      |
| ------------------------- | ------------ | -------------------------------- |
| `/v1/usuario/login`       | ❌ **NÃO**   | Endpoint público para login      |
| `/v1/usuario/*` (outros)  | ✅ **SIM**   | Endpoints de usuário protegidos  |
| Todos os outros endpoints | ✅ **SIM**   | Por padrão, todos requerem token |

### Estrutura do Token

O sistema suporta:

- **Access Token**: Token principal para autenticação
- **Refresh Token**: Para renovação (opcional)
- **Dados do Usuário**: Informações completas do usuário logado

## 🚀 Como Usar

### 1. **Login**

```tsx
import { useAppContext } from '../context'

const LoginComponent = () => {
  const { login } = useAppContext()

  const handleLogin = async credentials => {
    const response = await api.post('/v1/usuario/login', credentials)
    const { token, usuario, refreshToken } = response.data

    // Sistema automaticamente salva e configura tudo
    login(token, usuario, refreshToken)
  }
}
```

### 2. **Verificar Autenticação**

```tsx
import { useAppContext } from '../context'

const MyComponent = () => {
  const { state } = useAppContext()

  if (state.isAuthenticated) {
    return <div>Usuário logado: {state.currentUser.nome}</div>
  }

  return <div>Usuário não autenticado</div>
}
```

### 3. **Proteger Rotas**

```tsx
import { ProtectedRoute } from '../components';

// Rota que requer autenticação
<Route path="/admin" element={
  <ProtectedRoute>
    <AdminPage />
  </ProtectedRoute>
} />

// Rota pública (ex: login)
<Route path="/login" element={
  <PublicRoute>
    <LoginPage />
  </PublicRoute>
} />
```

### 4. **Logout**

```tsx
import { useAppContext } from '../context'

const NavComponent = () => {
  const { logout } = useAppContext()

  const handleLogout = () => {
    logout() // Limpa tudo automaticamente
  }
}
```

### 5. **Fazer Requisições Autenticadas**

```tsx
import { api } from '../services'

// O Bearer Token é automaticamente adicionado
const getUsers = async () => {
  const response = await api.get('/v1/usuarios')
  return response.data
}

const createUser = async userData => {
  const response = await api.post('/v1/usuarios', userData)
  return response.data
}
```

## 🔒 Segurança

### Recursos de Segurança Implementados

1. **Logout Automático**

   - Token inválido (401) → Logout + Redirect para login
   - Token expirado → Logout automático

2. **Proteção de Rotas**

   - Rotas protegidas redirecionam para login se não autenticado
   - Rotas de login redirecionam para home se já autenticado

3. **Verificação de Token**

   - Validação automática na inicialização
   - Decodificação JWT para verificar expiração (se aplicável)

4. **Armazenamento Seguro**
   - localStorage com chaves específicas
   - Limpeza automática em caso de erro

### Headers de Requisição

```http
# Requisições autenticadas
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
Accept: application/json

# Requisições públicas (login)
Content-Type: application/json
Accept: application/json
```

## 📁 Arquivos Criados/Modificados

### Novos Arquivos

```
src/
├── services/
│   └── authService.ts          # Serviço de autenticação completo
└── components/
    └── ProtectedRoute.tsx      # Componentes de proteção de rotas
```

### Arquivos Modificados

```
src/
├── services/
│   ├── api.ts                  # Interceptadores atualizados
│   └── index.ts               # Exports do authService
├── context/
│   └── AppContext.tsx         # Integração com authService
├── components/
│   ├── Navigation.tsx         # Logout funcional
│   └── index.ts              # Exports de ProtectedRoute
├── router/
│   └── AppRouter.tsx          # Rotas protegidas
├── features/auth/components/
│   └── Login.tsx              # Sistema de login integrado
└── styles/
    └── layout.css            # Estilos para loading
```

## 🎯 Benefícios Alcançados

1. ✅ **Segurança Automática**: Bearer Token adicionado automaticamente
2. ✅ **Exceção para Login**: `/v1/usuario/login` sem token conforme solicitado
3. ✅ **Logout Inteligente**: Detecção automática de token inválido
4. ✅ **Proteção de Rotas**: Sistema robusto de proteção
5. ✅ **UX Melhorada**: Loading states e redirecionamentos suaves
6. ✅ **Manutenibilidade**: Código organizado e reutilizável
7. ✅ **Logs Detalhados**: Sistema de logging para debugging

## 🔍 Debugging

### Logs no Console

O sistema fornece logs detalhados:

```
🚀 Fazendo requisição: POST /v1/usuario/login
🔓 Requisição pública (sem token): /v1/usuario/login
✅ Resposta recebida: 200 /v1/usuario/login

🚀 Fazendo requisição: GET /v1/usuarios
🔐 Token adicionado para: /v1/usuarios
✅ Resposta recebida: 200 /v1/usuarios

❌ Erro 401: Token inválido
🚫 Token inválido ou expirado - realizando logout automático
```

### Verificar Estado de Autenticação

```jsx
// No console do navegador
localStorage.getItem('fed_team_token')
localStorage.getItem('fed_team_user')

// Ou usando React DevTools
// Verificar AppContext state
```

## 🎉 Status: IMPLEMENTAÇÃO CONCLUÍDA!

O sistema de Bearer Token está **totalmente funcional** e atende aos requisitos:

- ✅ Bearer Token obrigatório para todos endpoints
- ✅ **Exceção para `/v1/usuario/login`** (sem token)
- ✅ Logout automático em caso de token inválido
- ✅ Interface integrada com estado de autenticação
- ✅ Proteção de rotas implementada
