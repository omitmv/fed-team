// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock para axios - precisa ser feito antes de qualquer import que use axios
const mockAxiosInstance = {
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
  patch: jest.fn(() => Promise.resolve({ data: {} })),
  request: jest.fn(() => Promise.resolve({ data: {} })),
  defaults: {
    baseURL: '',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    },
  },
  interceptors: {
    request: {
      use: jest.fn(() => 1),
      eject: jest.fn(),
    },
    response: {
      use: jest.fn(() => 1),
      eject: jest.fn(),
    },
  },
};

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: jest.fn(() => mockAxiosInstance),
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
    patch: jest.fn(() => Promise.resolve({ data: {} })),
    request: jest.fn(() => Promise.resolve({ data: {} })),
    defaults: {
      baseURL: '',
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    },
    interceptors: {
      request: {
        use: jest.fn(() => 1),
        eject: jest.fn(),
      },
      response: {
        use: jest.fn(() => 1),
        eject: jest.fn(),
      },
    },
  },
  AxiosError: class AxiosError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'AxiosError';
    }
    response?: any;
    request?: any;
    config?: any;
    code?: string;
  },
}));

// Mock para variáveis de ambiente
process.env.REACT_APP_API_BASE_URL = 'http://localhost:8080';
process.env.REACT_APP_API_TIMEOUT = '5000';
