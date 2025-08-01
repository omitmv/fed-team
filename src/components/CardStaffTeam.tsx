import React from 'react';
// Import necessary styles and components
import '../styles/components.css';
// Define the props for the CardStaffTeam component
interface CardStaffTeamProps {
  children: React.ReactNode;
  className?: string;
}
// Create the CardStaffTeam component
const CardStaffTeam: React.FC<CardStaffTeamProps> = ({ children, className }) => {
  return (
    <div className={`feature-card flex p-md mb-lg flex-wrap w-100 flex-center bg-surface ${className}`}>
      {children}
    </div>
  );
};
// Export the component for use in other parts of the application
export default CardStaffTeam;
