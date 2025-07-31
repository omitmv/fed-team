import React from 'react';
import PluginManager from '../features/app/components/PluginManager';
import { MaterialIcon } from '../components';

export const PluginsPage: React.FC = () => {
  return (
    <div className="page plugins-page">
      <div className="page-header">
        <h1>
          <MaterialIcon name="extension" color="primary" size="medium" />
          Gerenciamento de Plugins
        </h1>
        <p>Configure e administre plugins do sistema</p>
      </div>
      <div className="page-content">
        <div className="plugins-container">
          <PluginManager />
        </div>
      </div>
    </div>
  );
};

export default PluginsPage;
