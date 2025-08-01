import React from 'react';

import '../styles/layout.css';

interface PageContentStaffTeamProps {
  children: React.ReactNode;
  className?: string;
}

const PageContentStaffTeam: React.FC<PageContentStaffTeamProps> = ({ children, className = '' }) => {
  return (
    <div className={`page-content ${className}`}>
      {children}
    </div>
  );
};

export default PageContentStaffTeam;
