import React from 'react';
import { Login } from '../features/auth';

export const AuthPage: React.FC = () => {
  return (
    <div className="page auth-page">
      <div className="page-header">
        <h1>Autenticação</h1>
        <p>Faça login para acessar o sistema</p>
      </div>
      <div className="page-content">
        <div className="auth-container">
          <Login />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
