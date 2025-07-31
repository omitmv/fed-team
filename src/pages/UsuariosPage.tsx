import React from 'react';
import { UsuarioList } from '../features/usuario';
import { MaterialIcon } from '../components';

export const UsuariosPage: React.FC = () => {
  return (
    <div className="page usuarios-page">
      <div className="page-header">
        <h1>
          <MaterialIcon name="people" color="primary" size="medium" />
          Gerenciamento de Usuários
        </h1>
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
