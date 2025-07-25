# Feature Usuario

Esta feature contém todos os componentes, estilos e lógica relacionados ao gerenciamento de usuários.

## Estrutura

```
src/features/usuario/
├── index.ts                    # Arquivo de exportação principal da feature
├── components/                 # Componentes específicos da feature
│   └── UsuarioList.tsx        # Componente principal de listagem de usuários
└── styles/                    # Estilos específicos da feature
    └── UsuarioList.css        # Estilos do componente UsuarioList
```

## Componentes

### UsuarioList
- **Localização**: `src/features/usuario/components/UsuarioList.tsx`
- **Função**: Gerencia a listagem, criação, edição e exclusão de usuários
- **Dependências**: 
  - `useApi` hooks (hooks/useApi.ts)
  - Types (types/index.ts)
  - Constants (constants/index.ts)
  - Crypto utilities (utils/crypto.ts)

## Como usar

Para utilizar esta feature em outros componentes:

```tsx
import { UsuarioList } from '../features/usuario';

// ou importação específica:
import { UsuarioList } from '../features/usuario/components/UsuarioList';
```

## Estilos

Os estilos estão organizados na pasta `styles/` dentro da feature e incluem:
- Estilos para formulários
- Grid de usuários
- Estados de loading e erro
- Responsividade mobile

## Funcionalidades

- ✅ Listar usuários
- ✅ Criar novo usuário
- ✅ Editar usuário existente
- ✅ Excluir usuário
- ✅ Validação de formulários
- ✅ Estados de loading
- ✅ Tratamento de erros
- ✅ Interface responsiva
