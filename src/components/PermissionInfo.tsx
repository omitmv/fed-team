import React from 'react';
import { usePermissions } from '../hooks/usePermissions';
import './PermissionInfo.css';

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
      <div className="permission-info">
        <h4>🔒 Usuário não autenticado</h4>
      </div>
    );
  }

  return (
    <div className="permission-info">
      <h4>👤 Informações de Permissão</h4>
      <div className="permission-details">
        <p><strong>Usuário:</strong> {currentUser?.nome || 'N/A'}</p>
        <p><strong>Login:</strong> {currentUser?.login || 'N/A'}</p>
        <p><strong>Código de Acesso:</strong> {cdTpAcesso}</p>
        <div className="permissions-list">
          <div className={`permission-item ${canCreateTraining() ? 'allowed' : 'denied'}`}>
            {canCreateTraining() ? '✅' : '❌'} Pode criar treinos
          </div>
          <div className={`permission-item ${isAdmin() ? 'allowed' : 'denied'}`}>
            {isAdmin() ? '✅' : '❌'} É administrador
          </div>
          <div className={`permission-item ${isReadOnly() ? 'warning' : 'allowed'}`}>
            {isReadOnly() ? '⚠️' : '✅'} {isReadOnly() ? 'Acesso limitado' : 'Acesso completo'}
          </div>
          <div className={`permission-item ${hasRestrictedAccess() ? 'warning' : 'normal'}`}>
            {hasRestrictedAccess() ? '🔒' : '🔓'} {hasRestrictedAccess() ? 'Acesso restrito (tipo 2)' : 'Sem restrições especiais'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionInfo;
