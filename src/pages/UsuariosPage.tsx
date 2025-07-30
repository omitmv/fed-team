import React from 'react';
import { UsuarioList } from '../features/usuario';

export const UsuariosPage: React.FC = () => {
  return (
    <div className="page usuarios-page">
      <div className="page-header">
        <h1>Gerenciamento de Usuários</h1>
        <p>Administre usuários do sistema</p>
      </div>
      <div className="page-content">
        <div className="usuarios-container">
          <UsuarioList />
        </div>
      </div>
    </div>
  );
};

export default UsuariosPage;
