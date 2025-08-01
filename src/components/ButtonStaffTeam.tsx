import React from "react";

import '../styles/layout.css';

interface ButtonStaffTeamProps {
  onClick: () => Promise<void> | void;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  text?: string;
  typeButton?: 'button' | 'submit' | 'reset';
  children?: React.ReactNode;
}
const ButtonStaffTeam: React.FC<ButtonStaffTeamProps> = ({
  onClick,
  icon,
  className,
  disabled,
  text,
  typeButton,
  children
}) => {
  return (
    <button
      type={typeButton}
      onClick={onClick}
      className={`btn ${className}`}
      disabled={disabled}
    >
      {icon}
      {text}
      {children}
    </button>
  );
};

export default ButtonStaffTeam;
