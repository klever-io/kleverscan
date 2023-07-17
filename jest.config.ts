/* eslint-disable */
import { compilerOptions } from './tsconfig.json';

const SRC_PATH = '<rootDir>/src';

const makeModuleNameMapper = (srcPath: string) => {
  const { paths } = compilerOptions;
  const aliases = {
    '^.+\\.(css|less)$': '<rootDir>/config/CSSStub.js',
  };

  Object.keys(paths).forEach((item, index) => {
    if (index !== 0) {
      // workaround for tests to see node_modules/@types/react
      const key = item.replace('/*', '/(.*)');
      const path = paths[item][0].replace('./*', '$1');
      aliases[key] = srcPath + '/' + path;
    }
  });
  return aliases;
};

export default {
  clearMocks: true,
  coverageProvider: 'v8',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  testEnvironment: './src/test/custom-test-env.ts',
  moduleNameMapper: makeModuleNameMapper(SRC_PATH),
  transform: {
    '^.+\\.(t|j)sx?$': ['babel-jest'],
  },
};
