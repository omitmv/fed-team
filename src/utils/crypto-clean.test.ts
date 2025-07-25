import { PasswordCrypto, UserDataFormatter } from './crypto';

describe('Crypto Utils', () => {
  describe('PasswordCrypto', () => {
    test('should encrypt password', () => {
      const password = 'testPassword123';
      const encrypted = PasswordCrypto.encrypt(password);
      
      expect(encrypted).toBeDefined();
      expect(typeof encrypted).toBe('string');
      expect(encrypted.length).toBeGreaterThan(0);
    });

    test('should generate different hashes for different passwords', () => {
      const hash1 = PasswordCrypto.encrypt('password1');
      const hash2 = PasswordCrypto.encrypt('password2');
      
      expect(hash1).not.toBe(hash2);
    });

    test('should validate correct password', () => {
      const password = 'testPassword123';
      const hash = PasswordCrypto.encrypt(password);
      
      expect(PasswordCrypto.validate(password, hash)).toBe(true);
    });

    test('should reject incorrect password', () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword';
      const hash = PasswordCrypto.encrypt(password);
      
      expect(PasswordCrypto.validate(wrongPassword, hash)).toBe(false);
    });

    test('should generate random password', () => {
      const password = PasswordCrypto.generateRandomPassword();
      expect(password).toBeDefined();
      expect(typeof password).toBe('string');
      expect(password.length).toBe(12);
    });

    test('should validate password strength', () => {
      const result = PasswordCrypto.validatePasswordStrength('StrongPass123');
      expect(result).toHaveProperty('isValid');
      expect(result).toHaveProperty('errors');
      expect(Array.isArray(result.errors)).toBe(true);
    });

    test('should throw error for empty password', () => {
      expect(() => PasswordCrypto.encrypt('')).toThrow();
    });
  });

  describe('UserDataFormatter', () => {
    test('should format data cadastro', () => {
      const isoDate = '2024-01-15T10:30:00Z';
      const formatted = UserDataFormatter.formatDataCadastro(isoDate);
      
      expect(formatted).toBeDefined();
      expect(typeof formatted).toBe('string');
      expect(formatted).not.toBe('Data inválida');
    });

    test('should format data expiracao', () => {
      const isoDate = '2024-12-31T23:59:59Z';
      const formatted = UserDataFormatter.formatDataExpiracao(isoDate);
      
      expect(formatted).toBeDefined();
      expect(typeof formatted).toBe('string');
    });

    test('should handle empty expiration date', () => {
      const formatted = UserDataFormatter.formatDataExpiracao();
      expect(formatted).toBe('Sem expiração');
    });

    test('should check if user is expired', () => {
      const pastDate = '2020-01-01T00:00:00Z';
      const futureDate = '2030-01-01T00:00:00Z';
      
      expect(UserDataFormatter.isUserExpired(pastDate)).toBe(true);
      expect(UserDataFormatter.isUserExpired(futureDate)).toBe(false);
      expect(UserDataFormatter.isUserExpired()).toBe(false);
    });

    test('should get user status', () => {
      expect(UserDataFormatter.getUserStatus(true)).toBe('ATIVO');
      expect(UserDataFormatter.getUserStatus(false)).toBe('INATIVO');
      expect(UserDataFormatter.getUserStatus(true, '2020-01-01T00:00:00Z')).toBe('EXPIRADO');
    });

    test('should mask login', () => {
      expect(UserDataFormatter.maskLogin('usuario123')).toBe('us******23');
      expect(UserDataFormatter.maskLogin('test')).toBe('test');
      expect(UserDataFormatter.maskLogin('ab')).toBe('ab');
    });
  });
});
