import React from 'react';
import { Login } from '../features/auth';
import { MaterialIcon } from '../components';
import PageContentStaffTeam from '../components/PageContentStaffTeam';
import PageHeaderStaffTeam from '../components/PageHeaderStaffTeam';
import PageStaffTeam from '../components/PageStaffTeam';

export const AuthPage: React.FC = () => {
  return (
    <PageStaffTeam>
      <PageHeaderStaffTeam
        icon={<MaterialIcon name="login" color="primary" size="medium" />}
        title="Autenticação"
        subtitle="Faça login para acessar o sistema"
      />
      <PageContentStaffTeam>
        <Login />
      </PageContentStaffTeam>
    </PageStaffTeam>
  );
};

export default AuthPage;
