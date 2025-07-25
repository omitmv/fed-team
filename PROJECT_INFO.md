# Fed Team - React + Axios Project

Este é um projeto front-end desenvolvido em React com TypeScript que utiliza a biblioteca Axios para consumir APIs REST.

## 🚀 Tecnologias Utilizadas

- **React 18+** com TypeScript
- **Axios** para requisições HTTP
- **CSS3** para estilização
- **Environment Variables** para configuração

## 📁 Estrutura do Projeto

```
fed-team/
├── public/
├── src/
│   ├── components/
│   │   └── UserList.tsx       # Componente exemplo com CRUD
│   ├── services/
│   │   └── api.ts             # Configuração do Axios
│   ├── App.tsx
│   ├── App.css
│   └── index.tsx
├── .env                       # Variáveis de ambiente
├── package.json
└── README.md
```

## ⚙️ Configuração da API

O projeto está configurado para se conectar com uma API REST rodando em:
- **Host:** localhost
- **Porta:** 8080
- **Base URL:** http://localhost:8080

### Variáveis de Ambiente

O arquivo `.env` contém as seguintes configurações:

```env
REACT_APP_API_BASE_URL=http://localhost:8080
REACT_APP_API_TIMEOUT=5000
NODE_ENV=development
```

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn

### Passos para execução:

1. **Clone ou navegue até o diretório do projeto:**
   ```bash
   cd c:\Projetos\React\fed-team
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Execute o projeto:**
   ```bash
   npm start
   ```

4. **Acesse no navegador:**
   ```
   http://localhost:3000
   ```

## 🔧 Funcionalidades

### Serviço API (`src/services/api.ts`)

O arquivo de configuração do Axios inclui:

- **Configuração base** da URL e timeout
- **Interceptors** para requisições e respostas
- **Tratamento de erros** automático
- **Logging** de requisições e respostas
- **Funções auxiliares** para GET, POST, PUT, PATCH e DELETE

### Componente de Exemplo (`src/components/UserList.tsx`)

Demonstra como usar a API com:

- **Listagem** de usuários (GET)
- **Criação** de usuários (POST)
- **Atualização** de usuários (PUT)
- **Exclusão** de usuários (DELETE)
- **Tratamento de loading** e erros
- **Interface responsiva**

## 📡 Endpoints da API

O componente exemplo espera os seguintes endpoints na API:

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET    | `/users` | Lista todos os usuários |
| POST   | `/users` | Cria um novo usuário |
| PUT    | `/users/:id` | Atualiza um usuário específico |
| DELETE | `/users/:id` | Remove um usuário específico |

### Estrutura esperada do usuário:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}
```

## 🧪 Scripts Disponíveis

- `npm start` - Executa o app em modo de desenvolvimento
- `npm run build` - Cria build de produção
- `npm test` - Executa os testes
- `npm run eject` - Remove create-react-app (irreversível)

## 📝 Personalização

### Para alterar a URL da API:

1. Modifique o arquivo `.env`:
   ```env
   REACT_APP_API_BASE_URL=http://sua-api.com
   ```

2. Ou altere diretamente em `src/services/api.ts`

### Para adicionar autenticação:

Modifique o interceptor de requisições em `src/services/api.ts`:

```typescript
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);
```

## 🚨 Tratamento de Erros

O projeto inclui tratamento abrangente de erros:

- **Erros de rede** (sem conexão)
- **Erros de servidor** (5xx)
- **Erros de cliente** (4xx)
- **Timeout** de requisições
- **Feedback visual** para o usuário

---

**Developed with ❤️ using React + TypeScript + Axios**
