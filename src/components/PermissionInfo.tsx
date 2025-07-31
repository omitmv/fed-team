import React from 'react';
import { usePermissions } from '../hooks/usePermissions';

/**
 * Componente para exibir informações de permissão do usuário
 * Útil para debug e demonstração
 */
export const PermissionInfo: React.FC = () => {
  const { 
    currentUser, 
    cdTpAcesso, 
    canCreateTraining, 
    isAdmin, 
    isReadOnly,
    hasRestrictedAccess,
    isAuthenticated 
  } = usePermissions();

  if (!isAuthenticated) {
    return (
      <div className="card max-w-md">
        <h4 className="text-primary text-lg font-semibold">🔒 Usuário não autenticado</h4>
      </div>
    );
  }

  return (
    <div className="card max-w-md">
      <h4 className="text-primary text-lg font-semibold mb-md flex items-center gap-sm">👤 Informações de Permissão</h4>
      <div className="space-y-sm">
        <p className="text-secondary text-sm"><strong className="text-primary">Usuário:</strong> {currentUser?.nome || 'N/A'}</p>
        <p className="text-secondary text-sm"><strong className="text-primary">Login:</strong> {currentUser?.login || 'N/A'}</p>
        <p className="text-secondary text-sm"><strong className="text-primary">Código de Acesso:</strong> {cdTpAcesso}</p>
        <div className="mt-md space-y-xs">
          <div className={`p-sm rounded border text-sm font-medium flex items-center gap-xs ${
            canCreateTraining() 
              ? 'bg-success-light text-success border-success' 
              : 'bg-error-light text-error border-error'
          }`}>
            {canCreateTraining() ? '✅' : '❌'} Pode criar treinos
          </div>
          <div className={`p-sm rounded border text-sm font-medium flex items-center gap-xs ${
            isAdmin() 
              ? 'bg-success-light text-success border-success' 
              : 'bg-error-light text-error border-error'
          }`}>
            {isAdmin() ? '✅' : '❌'} É administrador
          </div>
          <div className={`p-sm rounded border text-sm font-medium flex items-center gap-xs ${
            isReadOnly() 
              ? 'bg-warning-light text-warning border-warning' 
              : 'bg-success-light text-success border-success'
          }`}>
            {isReadOnly() ? '⚠️' : '✅'} {isReadOnly() ? 'Acesso limitado' : 'Acesso completo'}
          </div>
          <div className={`p-sm rounded border text-sm font-medium flex items-center gap-xs ${
            hasRestrictedAccess() 
              ? 'bg-warning-light text-warning border-warning' 
              : 'bg-surface-hover text-secondary border-border'
          }`}>
            {hasRestrictedAccess() ? '🔒' : '🔓'} {hasRestrictedAccess() ? 'Acesso restrito (tipo 2)' : 'Sem restrições especiais'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionInfo;
