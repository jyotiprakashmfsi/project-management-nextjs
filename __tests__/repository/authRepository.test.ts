import { AuthRepository } from '../../repository/authRepository';
import { sequelize } from '../../db/models';

jest.mock('../../db/models', () => ({
  sequelize: {
    query: jest.fn()
  }
}));

describe('AuthRepository', () => {
  let authRepository: AuthRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    authRepository = new AuthRepository();
  });

  describe('createUser', () => {
    const userData = {
      email: 'test@example.com',
      fname: 'Test User',
      password: 'password123'
    };
    const hashedPassword = 'hashed_password';

    it('should insert a new user into the database', async () => {
      // Arrange
      (sequelize.query as jest.Mock).mockResolvedValue([{ insertId: 1 }]);
      
      // Mock Date.now() to return a consistent value
      const mockDate = new Date('2025-03-03T12:00:00Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

      // Act
      await authRepository.createUser(userData, hashedPassword);

      // Assert
      expect(sequelize.query).toHaveBeenCalledWith(
        'INSERT INTO users (fname, email, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
        {
          replacements: [userData.fname, userData.email, hashedPassword, mockDate, mockDate],
          logging: expect.any(Function)
        }
      );
    });

    it('should throw an error if database query fails', async () => {
      // Arrange
      const dbError = new Error('Database error');
      (sequelize.query as jest.Mock).mockRejectedValue(dbError);

      // Act & Assert
      await expect(authRepository.createUser(userData, hashedPassword)).rejects.toThrow('Failed to create user');
    });
  });

  describe('findUserByEmail', () => {
    const email = 'test@example.com';
    const mockUser = {
      id: '1',
      email,
      fname: 'Test User',
      password: 'hashed_password'
    };

    it('should find a user by email', async () => {
      // Arrange
      (sequelize.query as jest.Mock).mockResolvedValue([[mockUser]]);

      // Act
      const result = await authRepository.findUserByEmail(email);

      // Assert
      expect(sequelize.query).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE email = ?',
        {
          replacements: [email],
          logging: expect.any(Function)
        }
      );
      expect(result).toEqual([mockUser]);
    });

    it('should return an empty array if user is not found', async () => {
      // Arrange
      (sequelize.query as jest.Mock).mockResolvedValue([[]]);

      // Act
      const result = await authRepository.findUserByEmail(email);

      // Assert
      expect(result).toEqual([]);
    });

    it('should throw an error if database query fails', async () => {
      // Arrange
      const dbError = new Error('Database error');
      (sequelize.query as jest.Mock).mockRejectedValue(dbError);

      // Act & Assert
      await expect(authRepository.findUserByEmail(email)).rejects.toThrow('Failed to find user');
    });
  });
});
