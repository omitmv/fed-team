import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from '../context';
import Navigation from '../components/Navigation';
import ProtectedRoute, { PublicRoute } from '../components/ProtectedRoute';
import { HomePage, AuthPage, UsuariosPage, PluginsPage, NotFoundPage } from '../pages';
import '../styles/layout.css';

interface AppRouterProps {
  className?: string;
}

export const AppRouter: React.FC<AppRouterProps> = ({ className = '' }) => {
  return (
    <AppProvider>
      <Router>
        <div className={`app-router ${className}`}>
          <Navigation />
          <main className="main-content">
            <Routes>
              {/* Rota pública - Home */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute requiredAuth={false}>
                    <HomePage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Rota pública - apenas para usuários não autenticados */}
              <Route 
                path="/auth" 
                element={
                  <PublicRoute>
                    <AuthPage />
                  </PublicRoute>
                } 
              />
              
              {/* Rotas protegidas - requerem autenticação */}
              <Route 
                path="/usuarios" 
                element={
                  <ProtectedRoute>
                    <UsuariosPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/plugins" 
                element={
                  <ProtectedRoute>
                    <PluginsPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Página 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
};

export default AppRouter;
