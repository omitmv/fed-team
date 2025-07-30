import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../context';
import '../styles/components.css';

interface NavigationProps {
  className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ className = '' }) => {
  const { state, logout } = useAppContext();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className={`navigation ${className}`}>
      <div className="navigation-brand">
        <h1>Fed Team</h1>
      </div>
      <ul className="navigation-menu">
        <li>
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? 'active' : ''}
            end
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/auth" 
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            Autenticação
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/usuarios" 
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            Usuários
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/plugins" 
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            Plugins
          </NavLink>
        </li>
      </ul>
      <div className="navigation-user">
        {state.isAuthenticated && state.currentUser ? (
          <div className="user-info">
            <span>Olá, {state.currentUser.nome || 'Usuário'}</span>
            <button 
              className="btn-logout"
              onClick={handleLogout}
            >
              Sair
            </button>
          </div>
        ) : (
          <div className="auth-status">
            <span>Não autenticado</span>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
