import React, { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../context';
import MaterialIcon from './MaterialIcon';
import '../styles/components.css';

interface NavigationProps {
  className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ className = '' }) => {
  const { state, logout } = useAppContext();
  // Força o drawer a sempre iniciar fechado
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Garante que o drawer sempre inicie fechado após a montagem
  useEffect(() => {
    setIsDrawerOpen(false);
    // Limpa qualquer estado de scroll bloqueado
    document.body.style.overflow = '';
  }, []);

  const handleLogout = () => {
    logout();
    setIsDrawerOpen(false);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(prev => !prev);
  };

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  const handleMenuItemClick = () => {
    setIsDrawerOpen(false);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDrawerOpen(false);
  };

  // Handle escape key to close drawer
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };

    if (isDrawerOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when drawer is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen, closeDrawer]);

  return (
    <>
      {/* Hamburger Menu Button */}
      <button 
        className="hamburger-btn"
        onClick={toggleDrawer}
        aria-label={isDrawerOpen ? 'Fechar menu' : 'Abrir menu'}
        {...(isDrawerOpen ? { 'aria-expanded': 'true' } : { 'aria-expanded': 'false' })}
      >
        <div className={`hamburger-icon ${isDrawerOpen ? 'open' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {/* Overlay */}
      <div 
        className={`drawer-overlay ${isDrawerOpen ? 'open' : ''}`}
        onClick={handleOverlayClick}
      />

      {/* Drawer */}
      <nav 
        className={`drawer ${isDrawerOpen ? 'open' : ''} ${className}`}
        role="navigation"
        aria-label="Menu principal"
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <h1 className="drawer-title">Fed Team</h1>
        </div>

        {/* Drawer Content */}
        <div className="drawer-content">
          <ul className="drawer-menu">
            <li className="drawer-menu-item">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `drawer-menu-link ${isActive ? 'active' : ''}`
                }
                onClick={handleMenuItemClick}
                end
              >
                <MaterialIcon name="home" color="primary" size="small" />
                <span>Home</span>
              </NavLink>
            </li>
            <li className="drawer-menu-item">
              <NavLink 
                to="/auth" 
                className={({ isActive }) => 
                  `drawer-menu-link ${isActive ? 'active' : ''}`
                }
                onClick={handleMenuItemClick}
              >
                <MaterialIcon name="login" color="primary" size="small" />
                <span>Autenticação</span>
              </NavLink>
            </li>
            <li className="drawer-menu-item">
              <NavLink 
                to="/usuarios" 
                className={({ isActive }) => 
                  `drawer-menu-link ${isActive ? 'active' : ''}`
                }
                onClick={handleMenuItemClick}
              >
                <MaterialIcon name="people" color="primary" size="small" />
                <span>Usuários</span>
              </NavLink>
            </li>
            <li className="drawer-menu-item">
              <NavLink 
                to="/plugins" 
                className={({ isActive }) => 
                  `drawer-menu-link ${isActive ? 'active' : ''}`
                }
                onClick={handleMenuItemClick}
              >
                <MaterialIcon name="extension" color="primary" size="small" />
                <span>Plugins</span>
              </NavLink>
            </li>
            <li className="drawer-menu-item">
              <NavLink 
                to="/treinos" 
                className={({ isActive }) => 
                  `drawer-menu-link ${isActive ? 'active' : ''}`
                }
                onClick={handleMenuItemClick}
              >
                <MaterialIcon name="fitness_center" color="primary" size="small" />
                <span>Treinos</span>
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Drawer Footer */}
        <div className="drawer-footer">
          {state.isAuthenticated && state.currentUser ? (
            <div className="user-info">
              <div>
                <p className="user-name">
                  <MaterialIcon name="person" color="accent" size="small" />
                  <span>Olá, {state.currentUser.nome || 'Usuário'}</span>
                </p>
              </div>
              <button 
                className="btn-logout"
                onClick={handleLogout}
                aria-label="Fazer logout"
              >
                <MaterialIcon name="logout" color="error" size="small" />
                <span>Sair</span>
              </button>
            </div>
          ) : (
            <div className="auth-status">
              <MaterialIcon name="lock" color="warning" size="small" />
              <span>Não autenticado</span>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navigation;
