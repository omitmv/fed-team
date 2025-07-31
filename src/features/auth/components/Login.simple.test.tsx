import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './Login';
import { AppProvider } from '../../../context';

// Mock básico para useAppNavigation
jest.mock('../../../hooks/useAppNavigation', () => ({
  useAppNavigation: () => ({
    navigateTo: jest.fn(),
    goBack: jest.fn(),
    goForward: jest.fn(),
    getCurrentPath: jest.fn(() => '/auth'),
    isCurrentPath: jest.fn(() => true),
    location: { pathname: '/auth' }
  })
}));

test('Login component renders without crashing', () => {
  render(
    <AppProvider>
      <Login />
    </AppProvider>
  );
});
