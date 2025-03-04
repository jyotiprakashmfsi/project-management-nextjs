/**
 * Jest configuration for backend tests
 */

import type {Config} from 'jest';

const config: Config = {
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage/backend",

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",

  // A list of paths to directories that Jest should use to search for files in
  roots: [
    "<rootDir>/__tests__/services",
    "<rootDir>/__tests__/repository",
    "<rootDir>/__tests__/helper",
  ],

  // The maximum amount of workers used to run your tests
  maxWorkers: "50%",

  // An array of file extensions your modules use
  moduleFileExtensions: [
    "js",
    "mjs",
    "cjs",
    "jsx",
    "ts",
    "tsx",
    "json",
    "node"
  ],

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1"
  },

  // A preset that is used as a base for Jest's configuration
  preset: 'ts-jest',

  // The paths to modules that run some code to configure or set up the testing environment before each test
  setupFiles: [],

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: [
    "<rootDir>/jest.setup.backend.ts"
  ],

  // The test environment that will be used for testing
  testEnvironment: "node",

  // The glob patterns Jest uses to detect test files
  testMatch: [
    "**/__tests__/services/**/*.[jt]s?(x)",
    "**/__tests__/repository/**/*.[jt]s?(x)",
    "**/__tests__/helper/**/*.[jt]s?(x)"
  ],

  // A map from regular expressions to paths to transformers
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },

  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  transformIgnorePatterns: [
    "/node_modules/",
    "\\.pnp\\.[^\\/]+$"
  ],
};

export default config;
