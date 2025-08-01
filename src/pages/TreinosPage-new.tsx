import React from 'react';
import { MaterialIcon } from '../components';
import PageStaffTeam from '../components/PageStaffTeam';
import PageHeaderStaffTeam from '../components/PageHeaderStaffTeam';
import PageContentStaffTeam from '../components/PageContentStaffTeam';
import { TreinoComponent } from '../features/treino';

const TreinosPage: React.FC = () => {
  return (
    <PageStaffTeam>
      <PageHeaderStaffTeam
        icon={<MaterialIcon name="fitness_center" color="primary" size="medium" />}
        title="Treinos"
        subtitle="Gerencie seus treinos de forma eficiente"
      />
      <PageContentStaffTeam>
        <TreinoComponent />
      </PageContentStaffTeam>
    </PageStaffTeam>
  );
};

export default TreinosPage;
