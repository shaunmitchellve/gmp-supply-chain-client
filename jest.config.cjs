/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

const nextJest = require('next/jest.js');

const createJestConfig = nextJest({
  dir: './',
});

const config = {
  //clearMocks: true,
  //collectCoverage: true,
  //coverageDirectory: 'coverage',
  //coverageProvider: 'v8',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  roots: ['<rootDir>'],
  moduleDirectories: ['node_modules', 'app'],
  testMatch: ['<rootDir>/__tests__/*.test.tsx'],
  moduleNameMapper: {
    'next-auth/providers/credentials':
      '<rootDir>/__tests__/__mocks__/next-auth-providers-credentials.ts',
    'next-auth': '<rootDir>/__tests__/__mocks__/next-auth.ts',
    '@/auth': '<rootDir>/__tests__/mocks/auth.ts',
  },
};

module.exports = createJestConfig(config);
