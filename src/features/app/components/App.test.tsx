import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock do axios para evitar requisições reais durante os testes
jest.mock('axios');

test('renders the main header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Fed Team - Sistema de Usuários/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders the API URL display', () => {
  // Define uma URL de teste
  process.env.REACT_APP_API_BASE_URL = 'http://localhost:8080';
  
  render(<App />);
  const apiUrlElement = screen.getByText(/API: http:\/\/localhost:8080/i);
  expect(apiUrlElement).toBeInTheDocument();
});
