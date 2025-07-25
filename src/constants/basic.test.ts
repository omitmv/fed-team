import { HTTP_STATUS, ERROR_MESSAGES } from './index';

describe('Constants Basic Tests', () => {
  test('should have correct HTTP status codes', () => {
    expect(HTTP_STATUS.OK).toBe(200);
    expect(HTTP_STATUS.CREATED).toBe(201);
    expect(HTTP_STATUS.BAD_REQUEST).toBe(400);
    expect(HTTP_STATUS.UNAUTHORIZED).toBe(401);
    expect(HTTP_STATUS.NOT_FOUND).toBe(404);
    expect(HTTP_STATUS.INTERNAL_SERVER_ERROR).toBe(500);
  });

  test('should have error messages', () => {
    expect(typeof ERROR_MESSAGES.NETWORK_ERROR).toBe('string');
    expect(typeof ERROR_MESSAGES.SERVER_ERROR).toBe('string');
    expect(typeof ERROR_MESSAGES.NOT_FOUND).toBe('string');
    expect(typeof ERROR_MESSAGES.UNAUTHORIZED).toBe('string');
    expect(typeof ERROR_MESSAGES.GENERIC_ERROR).toBe('string');
  });
});
