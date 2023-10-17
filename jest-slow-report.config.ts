import jestConfig from './jest.config';

const config = {
  ...jestConfig,
  verbose: false,
  reporters: [
    [
      'jest-slow-test-reporter',
      { numTests: 8, warnOnSlowerThan: 300, color: true },
    ],
  ],
};

export default config;
