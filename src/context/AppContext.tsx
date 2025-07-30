import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, AuthUser } from '../services/authService';

// Tipos para o contexto da aplicação
interface AppState {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
  notifications: any[];
  isLoading: boolean;
}

interface AppContextType {
  state: AppState;
  setCurrentUser: (user: AuthUser | null) => void;
  setIsAuthenticated: (isAuth: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  addNotification: (notification: any) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  login: (token: string, user: AuthUser, refreshToken?: string) => void;
  logout: () => void;
  checkAuthStatus: () => void;
}

// Estado inicial
const initialState: AppState = {
  currentUser: null,
  isAuthenticated: false,
  theme: 'light',
  notifications: [],
  isLoading: true,
};

// Criação do contexto
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider do contexto
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);

  // Verificar status de autenticação ao inicializar
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const isAuth = authService.isAuthenticated();
      const user = authService.getUser();
      
      setState(prev => ({
        ...prev,
        isAuthenticated: isAuth,
        currentUser: user,
        isLoading: false,
      }));
      
      console.log('🔍 Status de autenticação verificado:', { isAuth, user });
    } catch (error) {
      console.error('❌ Erro ao verificar status de autenticação:', error);
      setState(prev => ({
        ...prev,
        isAuthenticated: false,
        currentUser: null,
        isLoading: false,
      }));
    }
  };

  const login = (token: string, user: AuthUser, refreshToken?: string) => {
    authService.setAuthData(token, user, refreshToken);
    setState(prev => ({
      ...prev,
      currentUser: user,
      isAuthenticated: true,
    }));
    
    console.log('✅ Login realizado com sucesso:', user);
  };

  const logout = () => {
    authService.logout();
    setState(prev => ({
      ...prev,
      currentUser: null,
      isAuthenticated: false,
    }));
    
    console.log('👋 Logout realizado');
  };

  const setCurrentUser = (user: AuthUser | null) => {
    setState(prev => ({
      ...prev,
      currentUser: user,
      isAuthenticated: !!user
    }));
    
    if (user) {
      authService.setUser(user);
    } else {
      authService.clearUser();
    }
  };

  const setIsAuthenticated = (isAuth: boolean) => {
    setState(prev => ({
      ...prev,
      isAuthenticated: isAuth,
      currentUser: isAuth ? prev.currentUser : null
    }));
  };

  const setTheme = (theme: 'light' | 'dark') => {
    setState(prev => ({
      ...prev,
      theme
    }));
  };

  const addNotification = (notification: any) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setState(prev => ({
      ...prev,
      notifications: [...prev.notifications, newNotification]
    }));
  };

  const removeNotification = (id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id)
    }));
  };

  const clearNotifications = () => {
    setState(prev => ({
      ...prev,
      notifications: []
    }));
  };

  const value: AppContextType = {
    state,
    setCurrentUser,
    setIsAuthenticated,
    setTheme,
    addNotification,
    removeNotification,
    clearNotifications,
    login,
    logout,
    checkAuthStatus
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook para usar o contexto
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext deve ser usado dentro de um AppProvider');
  }
  return context;
};

export default AppProvider;
