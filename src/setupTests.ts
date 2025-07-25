// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock completo para axios
const mockAxios = {
  create: jest.fn(() => mockAxios),
  defaults: {
    baseURL: '',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    },
  },
  interceptors: {
    request: {
      use: jest.fn(() => {}),
      eject: jest.fn(),
    },
    response: {
      use: jest.fn(() => {}),
      eject: jest.fn(),
    },
  },
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
  patch: jest.fn(() => Promise.resolve({ data: {} })),
};

jest.mock('axios', () => ({
  default: mockAxios,
  ...mockAxios,
  AxiosError: class AxiosError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'AxiosError';
    }
    response?: any;
    request?: any;
  },
}));

// Mock para variáveis de ambiente
process.env.REACT_APP_API_BASE_URL = 'http://localhost:8080';
process.env.REACT_APP_API_TIMEOUT = '5000';
