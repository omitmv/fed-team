import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="page not-found-page">
      <div className="page-header">
        <h1>Página não encontrada</h1>
        <p>A página que você está procurando não existe.</p>
      </div>
      <div className="page-content">
        <div className="not-found-container">
          <div className="error-code">404</div>
          <div className="error-message">
            <p>Oops! Parece que você se perdeu.</p>
            <Link to="/" className="btn btn-primary">
              Voltar para Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
