import React from 'react';

import '../styles/layout.css';

interface PageHeaderStaffTeamProps {
  children: React.ReactNode;
  className?: string;
}

export const GridStaffTeam: React.FC<PageHeaderStaffTeamProps> = ({ children, className }) => {
  return (
    <header className={`feature-grid grid-cols-auto gap-lg ${className}`}>
      {children}
    </header>
  );
};
export default GridStaffTeam;
