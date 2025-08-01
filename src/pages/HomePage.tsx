import React from 'react';
import { PermissionInfo } from '../components';
import { MaterialIcon } from '../components';
import PageStaffTeam from '../components/PageStaffTeam';
import PageHeaderStaffTeam from '../components/PageHeaderStaffTeam';
import PageContentStaffTeam from '../components/PageContentStaffTeam';
import CardStaffTeam from '../components/CardStaffTeam';

export const HomePage: React.FC = () => {
  return (
    <PageStaffTeam>
      <PageHeaderStaffTeam 
        icon={<MaterialIcon name="home" color="primary" size="medium" />} 
        title='Bem-vindo ao Fed Team' 
        subtitle='Sistema de gerenciamento de plugins e usuários' />
      <PageContentStaffTeam>
        <div className="feature-grid">
          <CardStaffTeam>
            <h3>
              <MaterialIcon name="fitness_center" color="primary" size="small" />
              Treinos: 
            </h3>
            <p>Crie e gerencie seus treinos personalizados</p>
          </CardStaffTeam>
          <CardStaffTeam>
            <h3>
              <MaterialIcon name="extension" color="accent" size="small" />
              Plugins: 
            </h3>
            <p>Gerencie e configure plugins do sistema</p>
          </CardStaffTeam>
          <CardStaffTeam>
            <h3>
              <MaterialIcon name="people" color="secondary" size="small" />
              Usuários: 
            </h3>
            <p>Administre usuários e permissões</p>
          </CardStaffTeam>
          <CardStaffTeam>
            <h3>
              <MaterialIcon name="login" color="warning" size="small" />
              Autenticação: 
            </h3>
            <p>Sistema de login e autenticação</p>
          </CardStaffTeam>
        </div>
        <PermissionInfo />
      </PageContentStaffTeam>
    </PageStaffTeam>
  );
};

export default HomePage;
