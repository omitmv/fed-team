import React from 'react';

import '../styles/layout.css';

interface PageHeaderStaffTeamProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
}

const PageHeaderStaffTeam: React.FC<PageHeaderStaffTeamProps> = ({ icon, title, subtitle }) => {
  return (
    <header className="page-header">
      <h1>
        {icon}
        {title}
      </h1>
      {subtitle && <p>{subtitle}</p>}
    </header>
  );
};

export default PageHeaderStaffTeam;
