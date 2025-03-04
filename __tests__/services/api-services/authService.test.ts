import { AuthService } from '../../../services/api-services/authService';
import { AuthRepository } from '../../../repository/authRepository';
import { hashPassword } from '../../../helper/passwordHash';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Mock dependencies
jest.mock('../../../repository/authRepository');
jest.mock('../../../helper/passwordHash');
jest.mock('jsonwebtoken');
jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let mockAuthRepository: jest.Mocked<AuthRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockAuthRepository = new AuthRepository() as jest.Mocked<AuthRepository>;
    (AuthRepository as jest.Mock).mockImplementation(() => mockAuthRepository);
    
    authService = new AuthService();
  });

  describe('createUser', () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      fname: 'Test'
    };
    
    const hashedPassword = 'hashed_password';

    beforeEach(() => {
      (hashPassword as jest.Mock).mockResolvedValue(hashedPassword);
      mockAuthRepository.createUser = jest.fn().mockResolvedValue(undefined);
    });

    it('should successfully create a user', async () => {
      // Act
      await authService.createUser(userData);

      // Assert
      expect(hashPassword).toHaveBeenCalledWith(userData.password);
      expect(mockAuthRepository.createUser).toHaveBeenCalledWith(userData, hashedPassword);
    });

    it('should throw an error if required user data is missing', async () => {
      // Arrange
      const incompleteUserData = { email: 'test@example.com' };

      // Act & Assert
      await expect(authService.createUser(incompleteUserData as any)).rejects.toThrow('Missing required user data fields');
      expect(mockAuthRepository.createUser).not.toHaveBeenCalled();
    });

    it('should throw an error if password hashing fails', async () => {
      // Arrange
      const hashError = new Error('Hashing failed');
      (hashPassword as jest.Mock).mockRejectedValue(hashError);

      // Act & Assert
      await expect(authService.createUser(userData)).rejects.toThrow('Password hashing failed');
      expect(mockAuthRepository.createUser).not.toHaveBeenCalled();
    });

    it('should throw an error if repository throws an error', async () => {
      // Arrange
      const repoError = new Error('Database error');
      mockAuthRepository.createUser = jest.fn().mockRejectedValue(repoError);

      // Act & Assert
      await expect(authService.createUser(userData)).rejects.toThrow('Repository error');
      expect(mockAuthRepository.createUser).toHaveBeenCalledWith(userData, hashedPassword);
    });
  });

  describe('authenticateUser', () => {
    const email = 'test@example.com';
    const password = 'password123';
    const userId = '123';
    const token = 'jwt_token';
    const user = {
      id: userId,
      email,
      fname: 'Test',
      password: 'hashed_password'
    };
    const safeUser = {
      id: userId,
      email,
      fname: 'Test'
    };

    beforeEach(() => {
      // Mock repository findUserByEmail
      mockAuthRepository.findUserByEmail = jest.fn().mockResolvedValue([[user]]);
      
      // Mock bcrypt compare
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      
      // Mock jwt sign
      (jwt.sign as jest.Mock).mockReturnValue(token);
    });

    it('should successfully authenticate a user and return token and user data', async () => {
      // Act
      const result = await authService.authenticateUser(email, password);

      // Assert
      expect(mockAuthRepository.findUserByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: user.id, email: user.email },
        expect.any(String),
        { expiresIn: '24h' }
      );
      expect(result).toEqual({ token, user: safeUser });
    });

    it('should throw an error if user is not found', async () => {
      // Arrange
      mockAuthRepository.findUserByEmail = jest.fn().mockResolvedValue([]);

      // Act & Assert
      await expect(authService.authenticateUser(email, password)).rejects.toThrow('User not found');
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('should throw an error if password is invalid', async () => {
      // Arrange
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(authService.authenticateUser(email, password)).rejects.toThrow('Invalid password');
      expect(mockAuthRepository.findUserByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('should throw an error if repository throws an error', async () => {
      // Arrange
      const repoError = new Error('Database error');
      mockAuthRepository.findUserByEmail = jest.fn().mockRejectedValue(repoError);

      // Act & Assert
      await expect(authService.authenticateUser(email, password)).rejects.toThrow('Authentication failed');
    });
  });
});
