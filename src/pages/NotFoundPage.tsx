import React from 'react';
import { Link } from 'react-router-dom';
import { MaterialIcon } from '../components';
import PageStaffTeam from '../components/PageStaffTeam';
import PageHeaderStaffTeam from '../components/PageHeaderStaffTeam';
import PageContentStaffTeam from '../components/PageContentStaffTeam';
import CardStaffTeam from '../components/CardStaffTeam';

export const NotFoundPage: React.FC = () => {
  return (
    <PageStaffTeam>
      <PageHeaderStaffTeam
        icon={<MaterialIcon name="error" color="error" size="medium" />}
        title="Página não encontrada"
        subtitle="A página que você está procurando não existe."
      />
      <PageContentStaffTeam>
        <CardStaffTeam className="text-center">
          <div className="error-code text-6xl font-bold text-error mb-lg">404</div>
          <div className="error-message">
            <p className="text-lg mb-lg">Oops! Parece que você se perdeu.</p>
            <Link to="/" className="btn btn-primary">
              <MaterialIcon name="home" color="white" size="small" />
              Voltar para Home
            </Link>
          </div>
        </CardStaffTeam>
      </PageContentStaffTeam>
    </PageStaffTeam>
  );
};

export default NotFoundPage;
