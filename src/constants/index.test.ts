import { ENDPOINTS, HTTP_STATUS, ERROR_MESSAGES, API_CONFIG } from './index';

describe('Constants', () => {
  describe('ENDPOINTS', () => {
    test('should have correct USUARIOS endpoint', () => {
      expect(ENDPOINTS.USUARIOS).toBe('/v1/usuarios');
    });

    test('should generate correct USUARIO_BY_ID endpoint', () => {
      const id = 123;
      expect(ENDPOINTS.USUARIO_BY_ID(id)).toBe('/v1/usuarios/123');
    });

    test('should handle different ID values in USUARIO_BY_ID', () => {
      expect(ENDPOINTS.USUARIO_BY_ID(1)).toBe('/v1/usuarios/1');
      expect(ENDPOINTS.USUARIO_BY_ID(999)).toBe('/v1/usuarios/999');
    });
  });

  describe('HTTP_STATUS', () => {
    test('should have correct status codes', () => {
      expect(HTTP_STATUS.OK).toBe(200);
      expect(HTTP_STATUS.CREATED).toBe(201);
      expect(HTTP_STATUS.BAD_REQUEST).toBe(400);
      expect(HTTP_STATUS.UNAUTHORIZED).toBe(401);
      expect(HTTP_STATUS.FORBIDDEN).toBe(403);
      expect(HTTP_STATUS.NOT_FOUND).toBe(404);
      expect(HTTP_STATUS.INTERNAL_SERVER_ERROR).toBe(500);
    });
  });

  describe('ERROR_MESSAGES', () => {
    test('should have proper error messages', () => {
      expect(ERROR_MESSAGES.NETWORK_ERROR).toBe('Erro de conexão. Verifique sua internet.');
      expect(ERROR_MESSAGES.UNAUTHORIZED).toBe('Não autorizado. Faça login novamente.');
      expect(ERROR_MESSAGES.NOT_FOUND).toBe('Recurso não encontrado.');
      expect(ERROR_MESSAGES.SERVER_ERROR).toBe('Erro interno do servidor. Tente novamente.');
      expect(ERROR_MESSAGES.GENERIC_ERROR).toBe('Ocorreu um erro inesperado.');
    });

    test('should be non-empty strings', () => {
      Object.values(ERROR_MESSAGES).forEach(message => {
        expect(typeof message).toBe('string');
        expect(message.length).toBeGreaterThan(0);
      });
    });
  });

  describe('API_CONFIG', () => {
    test('should have valid API configuration', () => {
      expect(API_CONFIG.BASE_URL).toBeTruthy();
      expect(typeof API_CONFIG.TIMEOUT).toBe('number');
      expect(API_CONFIG.TIMEOUT).toBeGreaterThan(0);
    });
  });
});
