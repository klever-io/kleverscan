const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
  ],
};

// We need to override transformIgnorePatterns after next/jest sets its defaults,
// so that @klever ESM packages (and their ESM deps) get transformed by jest.
module.exports = async () => {
  const jestConfig = await createJestConfig(customJestConfig)();
  jestConfig.transformIgnorePatterns = [
    '/node_modules/(?!(@klever|@scure|@noble)/)',
    '^.+\\.module\\.(css|sass|scss)$',
  ];
  return jestConfig;
};
