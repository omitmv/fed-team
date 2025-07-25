# Features

Esta pasta contém todas as features do projeto organizadas por domínio de negócio. Cada feature é uma unidade independente que agrupa:

- **Componentes** relacionados ao domínio
- **Estilos** específicos dos componentes
- **Documentação** da feature

## Estrutura Padrão

Cada feature deve seguir a seguinte estrutura:

```
src/features/{nome-da-feature}/
├── index.ts                    # Exportações principais da feature
├── components/                 # Componentes da feature
│   ├── ComponentePrincipal.tsx
│   └── ComponenteSecundario.tsx
├── styles/                    # Estilos específicos
│   ├── ComponentePrincipal.css
│   └── ComponenteSecundario.css
├── hooks/                     # Hooks específicos (opcional)
│   └── useFeatureHook.ts
├── types/                     # Types específicos (opcional)
│   └── index.ts
└── README.md                  # Documentação da feature
```

## Features Disponíveis

### 📁 usuario
Gerenciamento completo de usuários do sistema.
- **Componentes**: UsuarioList
- **Funcionalidades**: CRUD completo, validações, interface responsiva

## Boas Práticas

1. **Isolamento**: Cada feature deve ser independente e autocontida
2. **Exports**: Use o arquivo `index.ts` para exportar os componentes principais
3. **Nomenclatura**: Use nomes descritivos e consistentes
4. **Documentação**: Mantenha um README.md atualizado para cada feature
5. **Estilos**: Mantenha os estilos específicos dentro da feature

## Exemplo de Uso

```tsx
// Importação por feature
import { UsuarioList } from './features/usuario';

// Importação específica
import { UsuarioList } from './features/usuario/components/UsuarioList';
```

## Dependências Compartilhadas

As features podem usar:
- **Hooks compartilhados**: `src/hooks/`
- **Types globais**: `src/types/`
- **Constantes**: `src/constants/`
- **Utilitários**: `src/utils/`
- **Serviços**: `src/services/`
