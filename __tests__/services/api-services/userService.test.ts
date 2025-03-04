import { UserService } from '../../../services/api-services/userService';
import { UserRepository } from '../../../repository/userRepository';
import { sequelize } from '../../../db/models';
import { getLocalTimeString } from '../../../helper/date';

// Mock dependencies
jest.mock('../../../repository/userRepository');
jest.mock('../../../db/models', () => ({
  sequelize: {
    query: jest.fn()
  }
}));
jest.mock('../../../helper/date');

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Setup mocks
    mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
    (UserRepository as jest.Mock).mockImplementation(() => mockUserRepository);
    
    // Create instance of service with mocked dependencies
    userService = new UserService();
  });

  describe('getAllUsers', () => {
    it('should return all users from the repository', async () => {
      // Arrange
      const mockUsers = [
        { id: '1', fname: 'User 1', email: 'user1@example.com' },
        { id: '2', fname: 'User 2', email: 'user2@example.com' }
      ];
      mockUserRepository.getAllUsers = jest.fn().mockResolvedValue(mockUsers);

      // Act
      const result = await userService.getAllUsers();

      // Assert
      expect(mockUserRepository.getAllUsers).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });

    it('should propagate errors from the repository', async () => {
      // Arrange
      const error = new Error('Database error');
      mockUserRepository.getAllUsers = jest.fn().mockRejectedValue(error);

      // Act & Assert
      await expect(userService.getAllUsers()).rejects.toThrow('Database error');
    });
  });

  describe('getUserById', () => {
    const userId = '123';
    const mockUser = { id: userId, fname: 'Test User', email: 'test@example.com' };

    it('should return a user by ID from the repository', async () => {
      // Arrange
      mockUserRepository.getUserById = jest.fn().mockResolvedValue(mockUser);

      // Act
      const result = await userService.getUserById(userId);

      // Assert
      expect(mockUserRepository.getUserById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUser);
    });

    it('should propagate errors from the repository', async () => {
      // Arrange
      const error = new Error('User not found');
      mockUserRepository.getUserById = jest.fn().mockRejectedValue(error);

      // Act & Assert
      await expect(userService.getUserById(userId)).rejects.toThrow('User not found');
    });
  });

  describe('updateUser', () => {
    const userId = '123';
    const currentTime = '2025-03-03 12:00:00';
    const updateData = {
      fname: 'Updated Name',
      lname: 'Updated Last Name',
      dob: '2000-01-01'
    };
    const formattedDob = '2000-01-01';

    beforeEach(() => {
      (getLocalTimeString as jest.Mock).mockImplementation((date) => {
        if (date instanceof Date && date.toISOString().includes('2000-01-01')) {
          return formattedDob;
        }
        return currentTime;
      });
      mockUserRepository.updateUser = jest.fn().mockResolvedValue({ id: userId, ...updateData });
    });

    it('should update a user with the provided data', async () => {
      // Act
      const result = await userService.updateUser(userId, updateData);

      // Assert
      expect(getLocalTimeString).toHaveBeenCalledTimes(2);
      expect(mockUserRepository.updateUser).toHaveBeenCalledWith(userId, {
        ...updateData,
        dob: formattedDob
      });
      expect(result).toEqual({ id: userId, ...updateData });
    });

    it('should handle update data without dob', async () => {
      // Arrange
      const updateDataWithoutDob = {
        fname: 'Updated Name',
        lname: 'Updated Last Name'
      };

      // Act
      await userService.updateUser(userId, updateDataWithoutDob);

      // Assert
      expect(getLocalTimeString).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.updateUser).toHaveBeenCalledWith(userId, updateDataWithoutDob);
    });

    it('should propagate errors from the repository', async () => {
      // Arrange
      const error = new Error('Update failed');
      mockUserRepository.updateUser = jest.fn().mockRejectedValue(error);

      // Act & Assert
      await expect(userService.updateUser(userId, updateData)).rejects.toThrow('Update failed');
    });
  });

  describe('deleteUser', () => {
    const userId = '123';
    const mockResult = [{ affectedRows: 1 }];

    beforeEach(() => {
      (sequelize.query as jest.Mock).mockResolvedValue(mockResult);
    });

    it('should delete a user by ID', async () => {
      // Act
      const result = await userService.deleteUser(userId);

      // Assert
      expect(sequelize.query).toHaveBeenCalledWith(
        'DELETE FROM Users WHERE id = ?',
        {
          replacements: [userId],
        }
      );
      expect(result).toEqual(mockResult);
    });

    it('should propagate errors from the database', async () => {
      // Arrange
      const error = new Error('Delete failed');
      (sequelize.query as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(userService.deleteUser(userId)).rejects.toThrow('Delete failed');
    });
  });
});
