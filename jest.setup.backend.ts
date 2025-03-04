// Mock environment variables
process.env.JWT_SECRET_TOKEN = 'test-secret-token';
process.env.DB_USER = 'test-user';
process.env.DB_PASSWORD = 'test-password';
process.env.DB_NAME = 'test-db';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '3306';

// Clean up mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Mock database connection
jest.mock('./db/models/index', () => {
  return {
    sequelize: {
      query: jest.fn(),
      authenticate: jest.fn().mockResolvedValue(true),
      sync: jest.fn().mockResolvedValue(true),
      close: jest.fn().mockResolvedValue(true),
    },
    initializeDatabase: jest.fn().mockResolvedValue(true),
  };
});
