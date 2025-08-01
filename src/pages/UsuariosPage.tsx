import React from 'react';
import { UsuarioComponent } from '../features/usuario';
import { MaterialIcon } from '../components';
import PageStaffTeam from '../components/PageStaffTeam';
import PageHeaderStaffTeam from '../components/PageHeaderStaffTeam';
import PageContentStaffTeam from '../components/PageContentStaffTeam';

export const UsuariosPage: React.FC = () => {
  return (
    <PageStaffTeam>
      <PageHeaderStaffTeam
        icon={<MaterialIcon name="people" color="primary" size="medium" />}
        title="Gerenciamento de Usuários"
        subtitle="Administre usuários do sistema"
      />
      <PageContentStaffTeam>
        <UsuarioComponent />
      </PageContentStaffTeam>
    </PageStaffTeam>
  );
};

export default UsuariosPage;
