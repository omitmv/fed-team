import React from 'react';
import PluginManager from '../features/app/components/PluginManager';

export const HomePage: React.FC = () => {
  return (
    <div className="page home-page">
      <div className="page-header">
        <h1>Bem-vindo ao Fed Team</h1>
        <p>Sistema de gerenciamento de plugins e usuários</p>
      </div>
      <div className="page-content">
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Plugins</h3>
            <p>Gerencie e configure plugins do sistema</p>
          </div>
          <div className="feature-card">
            <h3>Usuários</h3>
            <p>Administre usuários e permissões</p>
          </div>
          <div className="feature-card">
            <h3>Autenticação</h3>
            <p>Sistema de login e autenticação</p>
          </div>
        </div>
        <div className="plugin-section">
          <h2>Gerenciador de Plugins</h2>
          <PluginManager />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
