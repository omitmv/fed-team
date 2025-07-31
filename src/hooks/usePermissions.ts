import { useAppContext } from '../context';

/**
 * Hook para verificar permissões de acesso do usuário
 */
export const usePermissions = () => {
  const { state } = useAppContext();
  
  const currentUser = state.currentUser;
  const cdTpAcesso = currentUser?.cdTpAcesso;

  /**
   * Verifica se o usuário tem acesso a funcionalidades de cadastro
   * @returns true se cdTpAcesso for diferente de 6 E diferente de 2
   */
  const canCreateTraining = () => {
    return cdTpAcesso !== undefined && cdTpAcesso !== 6 && cdTpAcesso !== 2;
  };

  /**
   * Verifica se o usuário tem acesso administrativo
   * @returns true se cdTpAcesso for 1 (admin)
   */
  const isAdmin = () => {
    return cdTpAcesso === 1;
  };

  /**
   * Verifica se o usuário tem acesso a funcionalidades específicas baseado no cdTpAcesso
   * @param requiredAccess - código de acesso necessário
   * @returns true se o usuário tem o acesso necessário
   */
  const hasAccess = (requiredAccess: number) => {
    return cdTpAcesso === requiredAccess;
  };

  /**
   * Verifica se o usuário tem acesso limitado (somente leitura)
   * @returns true se cdTpAcesso for 6 ou 2
   */
  const isReadOnly = () => {
    return cdTpAcesso === 6 || cdTpAcesso === 2;
  };

  /**
   * Verifica se o usuário tem acesso restrito (tipo 2)
   * @returns true se cdTpAcesso for 2
   */
  const hasRestrictedAccess = () => {
    return cdTpAcesso === 2;
  };

  return {
    currentUser,
    cdTpAcesso,
    canCreateTraining,
    isAdmin,
    hasAccess,
    isReadOnly,
    hasRestrictedAccess,
    isAuthenticated: state.isAuthenticated
  };
};

export default usePermissions;
