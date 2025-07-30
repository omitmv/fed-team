# Fed Team - Sistema de Gerenciamento de Usuários

Este é um projeto React + TypeScript para gerenciamento de usuários, desenvolvido para integração com uma API REST.

## 🚀 Tecnologias Utilizadas

- **React 18+** com TypeScript
- **Axios** para requisições HTTP
- **Crypto-js** para criptografia de senhas
- **CSS3** com design responsivo
- **Custom Hooks** para gerenciamento de estado
- **Environment Variables** para configuração

## 📋 Funcionalidades

- ✅ Listagem de usuários com paginação visual
- ✅ Criação de novos usuários
- ✅ Edição de usuários existentes
- ✅ Exclusão de usuários
- ✅ Criptografia de senhas (Base64 + MD5)
- ✅ Validação de formulários
- ✅ Tratamento de erros
- ✅ Interface responsiva
- ✅ Estados de loading
- ✅ Formatação de datas
- ✅ Status de usuários (Ativo/Inativo/Expirado)

## 🏗️ Estrutura do Projeto

```
src/
├── components/
│   └── UserList.tsx          # Componente principal de usuários
├── hooks/
│   └── useApi.ts             # Hooks customizados para API
├── services/
│   └── api.ts                # Configuração do Axios
├── types/
│   └── index.ts              # Definições de tipos TypeScript
├── constants/
│   └── index.ts              # Constantes e endpoints da API
├── utils/
│   ├── crypto.ts             # Utilitários de criptografia
│   └── errorHandler.ts       # Manipulação de erros
├── styles/
│   └── UsuarioList.css       # Estilos específicos do componente
├── App.tsx                   # Componente principal
└── App.css                   # Estilos globais
```

## 🔧 Configuração

### 1. Instalação das Dependências

```bash
npm install
```

### 2. Configuração do Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
REACT_APP_API_BASE_URL=http://localhost:8080
REACT_APP_API_TIMEOUT=5000
```

### 3. Executar o Projeto

```bash
# Desenvolvimento
npm start

# Build de produção
npm run build

# Testes
npm test
```

## 📡 API Integration

O projeto está configurado para consumir uma API REST com os seguintes endpoints:

### Endpoints Utilizados

- `GET /v1/usuario` - Lista todos os usuários
- `GET /v1/usuario/{id}` - Busca usuário por ID
- `POST /v1/usuario` - Cria novo usuário
- `PUT /v1/usuario/{id}` - Atualiza usuário
- `DELETE /v1/usuario/{id}` - Remove usuário

### Modelo de Dados - Usuario

```typescript
interface Usuario {
  cdUsuario: number // Código único do usuário
  login: string // Login (max 250 caracteres)
  senha: string // Senha criptografada
  nome: string // Nome completo (max 250 caracteres)
  email: string // Email (max 250 caracteres)
  dataCadastro: string // Data de cadastro (ISO string)
  flAtivo: boolean // Flag de usuário ativo
  dtExpiracao?: string // Data de expiração (opcional)
}
```

## 🔐 Sistema de Criptografia

**IMPORTANTE**: A criptografia de senhas é realizada no **backend/API**, não no frontend.

O frontend:

- Envia senhas em **texto plano** através de HTTPS
- Valida a força da senha antes do envio
- Não possui lógica de criptografia

O backend implementa o padrão:

1. **Base64**: Converte a senha para Base64
2. **MD5**: Aplica hash MD5 no resultado do Base64

```typescript
// Exemplo no frontend - apenas validação
const validacao = PasswordCrypto.validatePasswordStrength('MinhaSenh@123')
if (!validacao.isValid) {
  console.log('Senha não atende aos critérios:', validacao.errors)
}

// A senha é enviada em texto plano para a API
const novoUsuario = {
  login: 'usuario',
  senha: 'MinhaSenh@123', // Texto plano - API fará a criptografia
  nome: 'Nome do Usuário',
  email: 'email@exemplo.com'
}
```

## 🎨 Interface do Usuário

### Características do Design

- **Layout em Cards**: Exibição dos usuários em cartões organizados
- **Formulário Modal**: Criação e edição através de formulário integrado
- **Status Visual**: Cores diferentes para status do usuário (Ativo/Inativo/Expirado)
- **Responsivo**: Adaptável para dispositivos móveis
- **Loading States**: Indicadores visuais durante operações
- **Error Handling**: Mensagens de erro amigáveis

### Status do Usuário

- 🟢 **Ativo**: Usuário ativo e dentro da validade
- 🔴 **Inativo**: Usuário desativado (flAtivo = false)
- 🟡 **Expirado**: Usuário com data de expiração ultrapassada

## 🛠️ Recursos Técnicos

### Custom Hooks

- `useApi<T>` - Hook para requisições GET
- `useApiCreate<T, K>` - Hook para requisições POST
- `useApiUpdate<T, K>` - Hook para requisições PUT
- `useApiDelete` - Hook para requisições DELETE

### Interceptors do Axios

- **Request Interceptor**: Adiciona headers automáticos
- **Response Interceptor**: Trata erros globalmente
- **Timeout**: Configuração de timeout por requisição

### Utilitários

- **Formatação de Datas**: Conversão para padrão brasileiro
- **Validação de Email**: Verificação de formato
- **Geração de Senhas**: Criação de senhas aleatórias
- **Mascaramento**: Ocultação de dados sensíveis

## 🚦 Estados da Aplicação

### Loading States

- Lista de usuários carregando
- Operações CRUD em andamento
- Botões desabilitados durante operações

### Error States

- Erros de rede
- Erros de validação
- Timeouts de requisição
- Dados não encontrados

## 📱 Responsividade

O projeto é totalmente responsivo com breakpoints:

- **Desktop**: Grid com múltiplas colunas
- **Tablet**: Grid adaptativo
- **Mobile**: Lista em coluna única

## 🔍 Validações

### Validações de Formulário

- Login: obrigatório, máximo 250 caracteres
- Senha: obrigatória na criação, opcional na edição
- Nome: obrigatório, máximo 250 caracteres
- Email: obrigatório, formato válido, máximo 250 caracteres
- Data de Expiração: formato de data válido

### Validações de Senha

- Mínimo 6 caracteres
- Máximo 250 caracteres
- Pelo menos uma letra minúscula
- Pelo menos uma letra maiúscula
- Pelo menos um número

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de CORS**: Configurar o servidor backend para aceitar requisições do frontend
2. **API não encontrada**: Verificar se a API está rodando na porta 8080
3. **Timeout**: Ajustar `REACT_APP_API_TIMEOUT` no arquivo `.env`

### Logs e Debugging

```bash
# Ver logs detalhados
npm start -- --verbose

# Build com análise
npm run build -- --analyze
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Contato

Projeto Fed Team - Sistema de Gerenciamento de Usuários

Link do Projeto: [https://github.com/seu-usuario/fed-team](https://github.com/seu-usuario/fed-team)

---

Desenvolvido com ❤️ usando React + TypeScript
