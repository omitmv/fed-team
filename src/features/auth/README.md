# Feature de Autenticação

Esta feature contém componentes relacionados à autenticação de usuários no sistema.

## Componentes

### Login

Componente responsável pela tela de login do sistema.

#### Características:

- 📱 **Responsivo**: Adapta-se a diferentes tamanhos de tela
- 🎨 **Visual atrativo**: Design moderno com gradiente e sombras
- ✅ **Validação**: Validação básica de campos obrigatórios
- 🔒 **Segurança**: Inputs apropriados para login e senha
- ♿ **Acessibilidade**: Labels associados aos inputs e autocomplete

#### Funcionalidades:

- Dois inputs centralizados: **Login** e **Senha**
- Link para **"Recuperar senha"**
- Botão **"Entrar"** com estado de loading
- Mensagens de erro
- Validação de campos obrigatórios

#### Como usar:

```tsx
import { Login } from '../features/auth'

function App() {
  return <Login />
}
```

#### Personalização:

O componente pode ser personalizado através do arquivo CSS em `src/features/auth/styles/Login.css`.

#### Próximos passos:

- [ ] Integrar com API de autenticação
- [ ] Implementar funcionalidade de recuperar senha
- [ ] Adicionar autenticação por token JWT
- [ ] Implementar logout
- [ ] Adicionar proteção de rotas

## Tipos

Os tipos relacionados à autenticação estão definidos em `src/features/auth/types/index.ts`:

- `LoginCredentials`: Dados do formulário de login
- `LoginResponse`: Resposta da API de autenticação
- `AuthState`: Estado global de autenticação
- `ForgotPasswordRequest`: Dados para recuperação de senha
- `ResetPasswordRequest`: Dados para redefinição de senha

## Estrutura de arquivos

```
src/features/auth/
├── components/
│   └── Login.tsx
├── styles/
│   └── Login.css
├── types/
│   └── index.ts
└── index.ts
```
