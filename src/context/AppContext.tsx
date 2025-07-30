import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tipos para o contexto da aplicação
interface AppState {
  currentUser: any | null;
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
  notifications: any[];
}

interface AppContextType {
  state: AppState;
  setCurrentUser: (user: any | null) => void;
  setIsAuthenticated: (isAuth: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  addNotification: (notification: any) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

// Estado inicial
const initialState: AppState = {
  currentUser: null,
  isAuthenticated: false,
  theme: 'light',
  notifications: []
};

// Criação do contexto
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider do contexto
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);

  const setCurrentUser = (user: any | null) => {
    setState(prev => ({
      ...prev,
      currentUser: user,
      isAuthenticated: !!user
    }));
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
    clearNotifications
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
