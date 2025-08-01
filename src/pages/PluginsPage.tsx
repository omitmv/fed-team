import React from 'react';
import PluginManager from '../features/app/components/PluginManager';
import { MaterialIcon } from '../components';
import PageStaffTeam from '../components/PageStaffTeam';
import PageHeaderStaffTeam from '../components/PageHeaderStaffTeam';
import PageContentStaffTeam from '../components/PageContentStaffTeam';

export const PluginsPage: React.FC = () => {
  return (
    <PageStaffTeam>
      <PageHeaderStaffTeam
        icon={<MaterialIcon name="extension" color="primary" size="medium" />}
        title="Gerenciamento de Plugins"
        subtitle="Configure e administre plugins do sistema"
      />
      <PageContentStaffTeam>
        <PluginManager />
      </PageContentStaffTeam>
    </PageStaffTeam>
  );
};

export default PluginsPage;
