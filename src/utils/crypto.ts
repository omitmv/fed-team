import CryptoJS from 'crypto-js';

/**
 * IMPORTANTE: Esta classe é usada apenas para validação e utilidades no FRONTEND.
 * A criptografia real das senhas é feita no BACKEND/API.
 * 
 * As senhas são enviadas em texto plano através de HTTPS para a API,
 * que se encarrega de aplicar a criptografia Base64 + MD5.
 */

/**
 * Utilitário para criptografia de senhas
 * Segue o padrão: senha -> base64 -> md5
 * 
 * NOTA: Usado apenas para referência e validação.
 * A criptografia real é feita no backend.
 */
export class PasswordCrypto {
  /**
   * Criptografa a senha seguindo o padrão especificado:
   * 1. Aplica base64 na senha
   * 2. Aplica MD5 no resultado do base64
   * @param senha - Senha em texto plano
   * @returns Senha criptografada
   */
  static encrypt(senha: string): string {
    if (!senha || senha.trim() === '') {
      throw new Error('Senha não pode estar vazia');
    }

    try {
      // Passo 1: Aplicar base64
      const base64Password = btoa(senha);
      
      // Passo 2: Aplicar MD5 no resultado do base64
      const md5Hash = CryptoJS.MD5(base64Password).toString();
      
      return md5Hash;
    } catch (error) {
      console.error('Erro ao criptografar senha:', error);
      throw new Error('Falha na criptografia da senha');
    }
  }

  /**
   * Valida se uma senha em texto plano corresponde ao hash armazenado
   * @param senhaTextoPlano - Senha em texto plano para validar
   * @param senhaHash - Hash armazenado no banco de dados
   * @returns true se as senhas coincidem
   */
  static validate(senhaTextoPlano: string, senhaHash: string): boolean {
    try {
      const hashCalculado = this.encrypt(senhaTextoPlano);
      return hashCalculado === senhaHash;
    } catch (error) {
      console.error('Erro ao validar senha:', error);
      return false;
    }
  }

  /**
   * Gera uma senha aleatória
   * @param length - Comprimento da senha (padrão: 12)
   * @returns Senha aleatória
   */
  static generateRandomPassword(length: number = 12): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    
    return password;
  }

  /**
   * Verifica se uma senha atende aos critérios mínimos
   * @param senha - Senha para validar
   * @returns Objeto com resultado da validação e mensagens
   */
  static validatePasswordStrength(senha: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (senha.length < 6) {
      errors.push('Senha deve ter pelo menos 6 caracteres');
    }

    if (senha.length > 250) {
      errors.push('Senha não pode ter mais de 250 caracteres');
    }

    if (!/[a-z]/.test(senha)) {
      errors.push('Senha deve conter pelo menos uma letra minúscula');
    }

    if (!/[A-Z]/.test(senha)) {
      errors.push('Senha deve conter pelo menos uma letra maiúscula');
    }

    if (!/[0-9]/.test(senha)) {
      errors.push('Senha deve conter pelo menos um número');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

/**
 * Utilitário para formatação de dados do usuário
 */
export class UserDataFormatter {
  /**
   * Formata a data de cadastro para exibição
   * @param dataCadastro - Data em formato ISO string
   * @returns Data formatada
   */
  static formatDataCadastro(dataCadastro: string): string {
    try {
      const date = new Date(dataCadastro);
      if (isNaN(date.getTime())) {
        return 'Data inválida';
      }
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'Data inválida';
    }
  }

  /**
   * Formata a data de expiração para exibição
   * @param dtExpiracao - Data em formato ISO string
   * @returns Data formatada ou 'Sem expiração'
   */
  static formatDataExpiracao(dtExpiracao?: string): string {
    if (!dtExpiracao) {
      return 'Sem expiração';
    }

    try {
      const date = new Date(dtExpiracao);
      if (isNaN(date.getTime())) {
        return 'Data inválida';
      }
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (error) {
      return 'Data inválida';
    }
  }

  /**
   * Verifica se o usuário está expirado
   * @param dtExpiracao - Data de expiração
   * @returns true se o usuário está expirado
   */
  static isUserExpired(dtExpiracao?: string): boolean {
    if (!dtExpiracao) {
      return false;
    }

    try {
      const expirationDate = new Date(dtExpiracao);
      const now = new Date();
      return expirationDate < now;
    } catch (error) {
      return false;
    }
  }

  /**
   * Retorna o status do usuário baseado em flAtivo e dtExpiracao
   * @param flAtivo - Flag de usuário ativo
   * @param dtExpiracao - Data de expiração
   * @returns Status do usuário
   */
  static getUserStatus(flAtivo: boolean, dtExpiracao?: string): 'ATIVO' | 'INATIVO' | 'EXPIRADO' {
    if (!flAtivo) {
      return 'INATIVO';
    }

    if (this.isUserExpired(dtExpiracao)) {
      return 'EXPIRADO';
    }

    return 'ATIVO';
  }

  /**
   * Mascara o login para exibição (mostra apenas os primeiros e últimos caracteres)
   * @param login - Login do usuário
   * @returns Login mascarado
   */
  static maskLogin(login: string): string {
    if (login.length <= 4) {
      return login;
    }

    const start = login.substring(0, 2);
    const end = login.substring(login.length - 2);
    const middle = '*'.repeat(login.length - 4);

    return start + middle + end;
  }
}
