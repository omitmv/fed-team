import React from 'react';

import '../styles/layout.css';

interface PageStaffTeamProps {
  children: React.ReactNode;
}

export const PageStaffTeam: React.FC<PageStaffTeamProps> = ({ children }) => {
  return (
    <div className="page">
      {children}
    </div>
  );
};

export default PageStaffTeam;
