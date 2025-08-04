import React, { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../context';
import MaterialIcon from './MaterialIcon';
import '../styles/components.css';

interface NavigationProps {
  className?: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path?: string;
  children?: MenuItem[];
}

interface MenuGroup {
  id: string;
  label: string;
  icon: string;
  items: MenuItem[];
}

const menuStructure: (MenuItem | MenuGroup)[] = [
  // Dashboard - Item único
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'home',
    path: '/'
  },
  
  // Alunos - Grupo
  {
    id: 'alunos',
    label: 'Alunos',
    icon: 'people',
    items: [
      {
        id: 'alunos-cadastro',
        label: 'Cadastro',
        icon: 'person_add',
        path: '/usuarios'
      }
    ]
  },
  
  // Biblioteca - Grupo
  {
    id: 'biblioteca',
    label: 'Biblioteca',
    icon: 'library_books',
    items: [
      {
        id: 'biblioteca-treino',
        label: 'Treino',
        icon: 'fitness_center',
        path: '/treinos'
      },
      {
        id: 'biblioteca-plano-alimentar',
        label: 'Plano Alimentar',
        icon: 'restaurant',
        path: '/planos-alimentares'
      }
    ]
  },
  
  // Financeiro - Grupo
  {
    id: 'financeiro',
    label: 'Financeiro',
    icon: 'attach_money',
    items: [
      {
        id: 'financeiro-planos',
        label: 'Planos',
        icon: 'credit_card',
        path: '/planos'
      }
    ]
  },
  
  // Plugins - Item único (mantido para compatibilidade)
  {
    id: 'plugins',
    label: 'Plugins',
    icon: 'extension',
    path: '/plugins'
  }
];

// Função auxiliar para verificar se é um grupo
const isGroup = (item: MenuItem | MenuGroup): item is MenuGroup => {
  return 'items' in item;
};

export const Navigation: React.FC<NavigationProps> = ({ className = '' }) => {
  const { state, logout } = useAppContext();
  // Força o drawer a sempre iniciar fechado
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  
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

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const renderMenuItem = (item: MenuItem, isSubItem = false) => (
    <li key={item.id} className="drawer-menu-item">
      <NavLink 
        to={item.path || '/'} 
        className={({ isActive }) => 
          `drawer-menu-link ${isActive ? 'active' : ''} ${isSubItem ? 'sub-item' : ''}`
        }
        onClick={handleMenuItemClick}
        end={item.path === '/'}
      >
        <MaterialIcon name={item.icon} color="primary" size="small" />
        <span>{item.label}</span>
      </NavLink>
    </li>
  );

  const renderMenuGroup = (group: MenuGroup) => {
    const isExpanded = expandedGroups.has(group.id);
    
    return (
      <li key={group.id} className="drawer-menu-group">
        <button 
          className={`drawer-menu-group-header ${isExpanded ? 'expanded' : ''}`}
          onClick={() => toggleGroup(group.id)}
          {...(isExpanded ? { 'aria-expanded': 'true' } : { 'aria-expanded': 'false' })}
        >
          <MaterialIcon name={group.icon} color="primary" size="small" />
          <span>{group.label}</span>
          <MaterialIcon 
            name={isExpanded ? 'expand_less' : 'expand_more'} 
            color="primary" 
            size="small" 
          />
        </button>
        <ul className={`drawer-submenu ${isExpanded ? 'expanded' : ''}`}>
          {group.items.map(item => renderMenuItem(item, true))}
        </ul>
      </li>
    );
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
            {menuStructure.map(item => 
              isGroup(item) ? renderMenuGroup(item) : renderMenuItem(item)
            )}
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
