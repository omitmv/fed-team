import React, { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/components.css';

interface NavigationTestProps {
  className?: string;
}

export const NavigationTest: React.FC<NavigationTestProps> = ({ className = '' }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Debug: Monitor state changes
  useEffect(() => {
    console.log('🔄 Estado do drawer alterado:', isDrawerOpen);
  }, [isDrawerOpen]);

  const toggleDrawer = useCallback(() => {
    console.log('🔄 toggleDrawer chamado');
    setIsDrawerOpen(prev => {
      console.log('📱 Alterando estado de', prev, 'para', !prev);
      return !prev;
    });
  }, []);

  const closeDrawer = useCallback(() => {
    console.log('❌ closeDrawer chamado');
    setIsDrawerOpen(false);
  }, []);

  const handleMenuItemClick = useCallback(() => {
    console.log('🔗 handleMenuItemClick chamado');
    setIsDrawerOpen(false);
  }, []);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    console.log('🖱️ handleOverlayClick chamado', e.target, e.currentTarget);
    if (e.target === e.currentTarget) {
      console.log('✅ Clique válido no overlay, fechando drawer');
      closeDrawer();
    } else {
      console.log('❌ Clique inválido no overlay (propagação)');
    }
  }, [closeDrawer]);

  // Handle escape key to close drawer
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };

    if (isDrawerOpen) {
      document.addEventListener('keydown', handleEscape);
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
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/* Debug info */}
      <div style={{ 
        position: 'fixed', 
        top: '70px', 
        left: '10px', 
        zIndex: 2000, 
        background: 'white', 
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '12px'
      }}>
        Estado: {isDrawerOpen ? 'ABERTO' : 'FECHADO'}
      </div>

      {/* Hamburger Menu Button */}
      <button 
        className="hamburger-btn"
        onClick={toggleDrawer}
        aria-label={isDrawerOpen ? 'Fechar menu' : 'Abrir menu'}
        style={{ zIndex: 1001 }}
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
        style={{ zIndex: 999 }}
      />

      {/* Drawer */}
      <nav 
        className={`drawer ${isDrawerOpen ? 'open' : ''} ${className}`}
        role="navigation"
        aria-label="Menu principal"
        style={{ zIndex: 1000 }}
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <h1 className="drawer-title">Fed Team (Test)</h1>
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
                Home
              </NavLink>
            </li>
            <li className="drawer-menu-item">
              <NavLink 
                to="/test" 
                className={({ isActive }) => 
                  `drawer-menu-link ${isActive ? 'active' : ''}`
                }
                onClick={handleMenuItemClick}
              >
                Test Page
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
                Autenticação
              </NavLink>
            </li>
            <li className="drawer-menu-item">
              <button 
                onClick={closeDrawer}
                style={{
                  background: 'red',
                  color: 'white',
                  border: 'none',
                  padding: '10px',
                  width: '100%',
                  cursor: 'pointer'
                }}
              >
                Fechar (Teste Direto)
              </button>
            </li>
          </ul>
        </div>

        {/* Drawer Footer */}
        <div className="drawer-footer">
          <div className="auth-status">
            <span>Componente de teste</span>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavigationTest;
