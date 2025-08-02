// Tipos específicos da feature Usuario

/**
 * Interface para o usuário do sistema
 */
export interface Usuario {
  cdUsuario: number;           // Chave única, chave primária, auto-incrementável
  login: string;               // Chave única, não pode ser nulo, máximo 250 caracteres
  senha: string;               // Senha criptografada retornada pela API (base64 + md5)
  nome: string;                // Não pode ser nulo, máximo 250 caracteres
  email: string;               // Chave única, não pode ser nulo, máximo 250 caracteres
  dataCadastro: string;        // DateTime, valor padrão: data e hora atual
  flAtivo: boolean;            // Valor padrão: true
  dtExpiracao?: string;        // DateTime, opcional
  cdTpAcesso: number;          // Tipo de acesso (1-Administrador, 2-Profissional, 3-Atleta, 4-Visitante, 5-Convidado, 6-Padrão)
}

/**
 * Interface para criação de usuário (sem cdUsuario e dataCadastro)
 * IMPORTANTE: senha deve ser enviada em texto plano - API fará a criptografia
 */
export interface UsuarioCreate {
  login: string;
  senha: string;               // Senha em texto plano - será criptografada pela API
  nome: string;
  email: string;
  flAtivo?: boolean;
  dtExpiracao?: string;
  cdTpAcesso?: number;         // Tipo de acesso (1-Administrador, 2-Profissional, 3-Atleta, 4-Visitante, 5-Convidado, 6-Padrão)
}

/**
 * Interface para atualização de usuário (todos os campos opcionais exceto cdUsuario)
 * IMPORTANTE: senha, se fornecida, deve ser em texto plano - API fará a criptografia
 */
export interface UsuarioUpdate {
  login: string;
  senha?: string;              // Nova senha em texto plano - será criptografada pela API
  nome: string;
  email: string;
  flAtivo?: boolean;
  dtExpiracao?: string;
  cdTpAcesso: number;         // Tipo de acesso (1-Administrador, 2-Profissional, 3-Atleta, 4-Visitante, 5-Convidado, 6-Padrão)
}

/**
 * Interface para resposta de autenticação
 */
export interface AuthResponse {
  usuario: Usuario;
  token?: string;
  message: string;
}

/**
 * Interface para formulário de login
 */
export interface LoginForm {
  login: string;
  senha: string;
}

/**
 * Enum para status do usuário
 */
export enum StatusUsuario {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
  EXPIRADO = 'EXPIRADO'
}

/**
 * Interface para validação de formulário de usuário
 */
export interface UsuarioFormValidation {
  login: string[];
  senha: string[];
  nome: string[];
  email: string[];
  flAtivo: string[];
  dtExpiracao: string[];
}

/**
 * Interface para filtros de usuário
 */
export interface UsuarioFilters {
  nome?: string;
  email?: string;
  login?: string;
  flAtivo?: boolean;
  expirado?: boolean;
}
