/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  globals: {
    "config": {
      default: {
        mode: "test"
      }
    }
  },
  "transform": {
    "node_modules/variables/.+\\.(j|t)sx?$": "ts-jest",
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  "transformIgnorePatterns": [
    "node_modules/(?!variables/.*)"
  ],
  "moduleNameMapper": {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts']
};
