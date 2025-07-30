import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from '../context';
import Navigation from '../components/Navigation';
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
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/usuarios" element={<UsuariosPage />} />
              <Route path="/plugins" element={<PluginsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
};

export default AppRouter;
