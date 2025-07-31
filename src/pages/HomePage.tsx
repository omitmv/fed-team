import React from 'react';
import { PermissionInfo } from '../components';
import { MaterialIcon } from '../components';

export const HomePage: React.FC = () => {
  return (
    <div className="page home-page">
      <div className="page-header">
        <h1>
          <MaterialIcon name="home" color="primary" size="medium" />
          Bem-vindo ao Fed Team
        </h1>
        <p>Sistema de gerenciamento de plugins e usuários</p>
      </div>
      <div className="page-content">
        <div className="feature-grid">
          <div className="feature-card">
            <h3>
              <MaterialIcon name="fitness_center" color="primary" size="small" />
              Treinos
            </h3>
            <p>Crie e gerencie seus treinos personalizados</p>
          </div>
          <div className="feature-card">
            <h3>
              <MaterialIcon name="extension" color="accent" size="small" />
              Plugins
            </h3>
            <p>Gerencie e configure plugins do sistema</p>
          </div>
          <div className="feature-card">
            <h3>
              <MaterialIcon name="people" color="secondary" size="small" />
              Usuários
            </h3>
            <p>Administre usuários e permissões</p>
          </div>
          <div className="feature-card">
            <h3>
              <MaterialIcon name="login" color="warning" size="small" />
              Autenticação
            </h3>
            <p>Sistema de login e autenticação</p>
          </div>
        </div>
        
        {/* Componente de debug para mostrar permissões */}
        <PermissionInfo />
      </div>
    </div>
  );
};

export default HomePage;
