import { ApiErrorHandler } from './errorHandler';
import { ERROR_MESSAGES } from '../constants';

describe('ApiErrorHandler', () => {
  describe('handleError', () => {
    test('should handle generic Error object', () => {
      const error = new Error('Test error message');
      const result = ApiErrorHandler.handleError(error);
      expect(result).toBe('Test error message');
    });

    test('should handle string error', () => {
      const error = 'String error';
      const result = ApiErrorHandler.handleError(error);
      expect(result).toBe(ERROR_MESSAGES.GENERIC_ERROR);
    });

    test('should handle undefined error', () => {
      const result = ApiErrorHandler.handleError(undefined);
      expect(result).toBe(ERROR_MESSAGES.GENERIC_ERROR);
    });

    test('should handle null error', () => {
      const result = ApiErrorHandler.handleError(null);
      expect(result).toBe(ERROR_MESSAGES.GENERIC_ERROR);
    });

    test('should return string for any input', () => {
      const result1 = ApiErrorHandler.handleError(new Error('test'));
      const result2 = ApiErrorHandler.handleError('test string');
      const result3 = ApiErrorHandler.handleError(123);
      
      expect(typeof result1).toBe('string');
      expect(typeof result2).toBe('string');
      expect(typeof result3).toBe('string');
    });
  });
});
