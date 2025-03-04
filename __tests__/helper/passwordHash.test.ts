import { hashPassword, checkPassword } from '../../helper/passwordHash';
import bcrypt from 'bcrypt';
import '@testing-library/jest-dom'

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hashSync: jest.fn(),
  compareSync: jest.fn()
}));

describe('Password Hash Helper', () => {
  const password = 'password123';
  const hashedPassword = 'hashed_password';
  const saltRounds = 10;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('hashPassword', () => {
    it('should hash a password using bcrypt', async () => {
      // Arrange
      (bcrypt.hashSync as jest.Mock).mockReturnValue(hashedPassword);

      // Act
      const result = await hashPassword(password);

      // Assert
      expect(bcrypt.hashSync).toHaveBeenCalledWith(password, saltRounds);
      expect(result).toBe(hashedPassword);
    });

    it('should propagate errors from bcrypt', async () => {
      // Arrange
      const error = new Error('Hashing failed');
      (bcrypt.hashSync as jest.Mock).mockImplementation(() => {
        throw error;
      });

      // Act & Assert
      await expect(hashPassword(password)).rejects.toThrow('Hashing failed');
    });
  });

  describe('checkPassword', () => {
    it('should return true when password matches hash', async () => {
      // Arrange
      (bcrypt.compareSync as jest.Mock).mockReturnValue(true);

      // Act
      const result = await checkPassword(password, hashedPassword);

      // Assert
      expect(bcrypt.compareSync).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBe(true);
    });

    it('should return false when password does not match hash', async () => {
      // Arrange
      (bcrypt.compareSync as jest.Mock).mockReturnValue(false);

      // Act
      const result = await checkPassword(password, hashedPassword);

      // Assert
      expect(bcrypt.compareSync).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBe(false);
    });

    it('should propagate errors from bcrypt', async () => {
      // Arrange
      const error = new Error('Comparison failed');
      (bcrypt.compareSync as jest.Mock).mockImplementation(() => {
        throw error;
      });

      // Act & Assert
      await expect(checkPassword(password, hashedPassword)).rejects.toThrow('Comparison failed');
    });
  });
});
