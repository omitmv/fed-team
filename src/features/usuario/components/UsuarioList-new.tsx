import React from 'react';
import { Usuario } from '../types';
import { UserDataFormatter } from '../../../utils/crypto';
import CardStaffTeam from '../../../components/CardStaffTeam';

interface UsuarioListProps {
  usuarios: Usuario[];
  onEdit: (usuario: Usuario) => void;
  onDelete: (cdUsuario: number) => void;
  isLoading?: boolean;
}

const UsuarioList: React.FC<UsuarioListProps> = ({ 
  usuarios, 
  onEdit, 
  onDelete, 
  isLoading = false 
}) => {
  // Função para mapear status para classes do tema
  const getUserStatusClass = (flAtivo: boolean, dtExpiracao?: string): string => {
    const status = UserDataFormatter.getUserStatus(flAtivo, dtExpiracao).toLowerCase();
    switch (status) {
      case 'ativo':
        return 'badge-success';
      case 'inativo':
        return 'badge-error';
      case 'expirado':
        return 'badge-warning';
      default:
        return 'badge-secondary';
    }
  };

  if (!usuarios || usuarios.length === 0) {
    return (
      <p className="text-muted text-center">Nenhum usuário encontrado.</p>
    );
  }

  return (
    <CardStaffTeam>
      <div className="feature-grid grid-cols-auto gap-lg">
        {usuarios.map(usuario => (
          <div key={usuario.cdUsuario} className="feature-card hover-shadow">
            <div className="mb-md">
              <h4 className="text-primary mb-sm">{usuario.nome}</h4>
              <p className="text-sm mb-xs"><strong>Login:</strong> {usuario.login}</p>
              <p className="text-sm mb-xs"><strong>E-mail:</strong> {usuario.email}</p>
              <p className="text-sm mb-xs"><strong>Cadastro:</strong> {UserDataFormatter.formatDataCadastro(usuario.dataCadastro)}</p>
              <p className="text-sm mb-xs"><strong>Expiração:</strong> {UserDataFormatter.formatDataExpiracao(usuario.dtExpiracao)}</p>
              <p className="text-sm">
                <strong>Status:</strong> 
                <span className={`badge ml-sm ${getUserStatusClass(usuario.flAtivo, usuario.dtExpiracao)}`}>
                  {UserDataFormatter.getUserStatus(usuario.flAtivo, usuario.dtExpiracao)}
                </span>
              </p>
            </div>
            
            <div className="flex gap-sm justify-end">
              <button 
                onClick={() => onEdit(usuario)}
                className="btn btn-warning btn-sm"
                disabled={isLoading}
              >
                Editar
              </button>
              <button 
                onClick={() => onDelete(usuario.cdUsuario)}
                className="btn btn-error btn-sm"
                disabled={isLoading}
              >
                Deletar
              </button>
            </div>
          </div>
        ))}
      </div>
    </CardStaffTeam>
  );
};

export default UsuarioList;
