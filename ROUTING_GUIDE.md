# Estrutura de Roteamento - Fed Team

Este documento descreve a nova estrutura de roteamento implementada no projeto Fed Team.

## Visão Geral

O projeto foi refatorado para trabalhar como uma Single Page Application (SPA) com roteamento baseado em React Router DOM. Cada feature agora corresponde a uma rota específica.

## Estrutura de Rotas

### Rotas Principais

- `/` - **Home Page**: Página inicial com visão geral do sistema e gerenciador de plugins
- `/auth` - **Auth Page**: Página de autenticação e login
- `/usuarios` - **Usuários Page**: Gerenciamento de usuários do sistema
- `/plugins` - **Plugins Page**: Gerenciamento dedicado de plugins
- `*` - **404 Page**: Página de erro para rotas não encontradas

## Arquitetura

### Componentes Principais

1. **AppRouter** (`src/router/AppRouter.tsx`)

   - Componente principal que configura o roteamento
   - Envolve a aplicação com providers necessários (AppProvider, Router)
   - Define todas as rotas e seus componentes correspondentes

2. **Navigation** (`src/components/Navigation.tsx`)

   - Barra de navegação principal
   - Links para todas as páginas com indicadores de página ativa
   - Mostra informações do usuário quando autenticado

3. **Pages** (`src/pages/`)
   - Componentes de página para cada rota
   - Cada página encapsula sua respectiva feature

### Hooks Customizados

1. **useAppNavigation** (`src/hooks/useAppNavigation.ts`)

   - Hook para navegação programática
   - Métodos: `navigateTo()`, `goBack()`, `goForward()`, `getCurrentPath()`, `isCurrentPath()`

2. **useAppContext** (`src/context/AppContext.tsx`)
   - Gerenciamento de estado global da aplicação
   - Estados: usuário atual, autenticação, tema, notificações

## Features como Rotas

### Home (`/`)

- Visão geral do sistema
- Cards de features disponíveis
- Integração com o PluginManager

### Autenticação (`/auth`)

- Formulário de login
- Componente de autenticação da feature `auth`

### Usuários (`/usuarios`)

- Lista e gerenciamento de usuários
- Componente principal da feature `usuario`

### Plugins (`/plugins`)

- Gerenciamento dedicado de plugins
- Interface específica para configuração de plugins

## Estilização

### Layout Responsivo

- Design adaptável para desktop e mobile
- Navegação que se adapta a diferentes tamanhos de tela

### CSS Organizado

- `layout.css`: Estilos gerais de layout, navegação e páginas
- `components.css`: Estilos reutilizáveis para componentes
- `theme.css`: Variáveis de tema e cores

## Como Adicionar Novas Rotas

1. **Criar nova página** em `src/pages/`:

   ```tsx
   import React from 'react'

   export const NovaPage: React.FC = () => {
     return (
       <div className="page nova-page">
         <div className="page-header">
           <h1>Nova Feature</h1>
         </div>
         <div className="page-content">{/* Conteúdo da página */}</div>
       </div>
     )
   }
   ```

2. **Exportar no barrel file** (`src/pages/index.ts`):

   ```typescript
   export { default as NovaPage } from './NovaPage'
   ```

3. **Adicionar rota no AppRouter**:

   ```tsx
   <Route path="/nova" element={<NovaPage />} />
   ```

4. **Adicionar link na navegação**:
   ```tsx
   <li>
     <NavLink to="/nova">Nova Feature</NavLink>
   </li>
   ```

## Navegação Programática

Para navegar programaticamente entre rotas:

```tsx
import { useAppNavigation } from '../hooks/useAppNavigation'

const MeuComponente = () => {
  const { navigateTo, isCurrentPath } = useAppNavigation()

  const handleClick = () => {
    navigateTo('/usuarios')
  }

  const isActive = isCurrentPath('/usuarios')

  return (
    <button onClick={handleClick}>
      Ir para Usuários {isActive && '(atual)'}
    </button>
  )
}
```

## Estado Global

O contexto da aplicação fornece:

```tsx
const { state, setCurrentUser, addNotification } = useAppContext()

// Verificar autenticação
if (state.isAuthenticated) {
  console.log('Usuário logado:', state.currentUser)
}

// Adicionar notificação
addNotification({
  type: 'success',
  message: 'Operação realizada com sucesso!'
})
```

## Benefícios da Nova Estrutura

1. **Modularidade**: Cada feature é isolada em sua própria rota
2. **Navegação Intuitiva**: URLs claras e organizadas
3. **SEO Friendly**: URLs semânticas para cada funcionalidade
4. **Experiência do Usuário**: Navegação fluida sem recarregamento de página
5. **Manutenibilidade**: Código organizado e fácil de manter
6. **Escalabilidade**: Fácil adição de novas features/rotas

## Tecnologias Utilizadas

- **React Router DOM v6**: Roteamento principal
- **React Context**: Gerenciamento de estado global
- **TypeScript**: Tipagem estática
- **CSS Modules**: Estilização organizada
