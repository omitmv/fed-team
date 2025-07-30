import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredAuth?: boolean;
}

/**
 * Componente para proteger rotas que requerem autenticação
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredAuth = true 
}) => {
  const { state } = useAppContext();
  const location = useLocation();

  // Se a rota não requer autenticação, sempre renderizar
  if (!requiredAuth) {
    return <>{children}</>;
  }

  // Se ainda está carregando, mostrar indicador de carregamento
  if (state.isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se não está autenticado, redirecionar para login
  if (!state.isAuthenticated) {
    // Salvar a localização atual para redirecionar após o login
    return (
      <Navigate 
        to="/auth" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Se está autenticado, renderizar o componente filho
  return <>{children}</>;
};

/**
 * Componente para rotas que só devem ser acessadas por usuários NÃO autenticados
 * (ex: página de login)
 */
export const PublicRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { state } = useAppContext();
  const location = useLocation();

  // Se ainda está carregando, mostrar indicador de carregamento
  if (state.isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se está autenticado, redirecionar para a página inicial ou página anterior
  if (state.isAuthenticated) {
    const from = (location.state as any)?.from || '/';
    return <Navigate to={from} replace />;
  }

  // Se não está autenticado, renderizar o componente filho
  return <>{children}</>;
};

export default ProtectedRoute;
