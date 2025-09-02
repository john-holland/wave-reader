module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.js', '**/*.pact.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testTimeout: 30000, // Pact tests need more time
  verbose: true,
  collectCoverage: false,
  // Pact specific configuration
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  },
  // Ensure Pact tests run in sequence
  maxWorkers: 1,
  // Handle ES modules
  extensionsToTreatAsEsm: ['.js'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  }
};
