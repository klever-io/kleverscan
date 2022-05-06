/* eslint-disable */
import { compilerOptions } from './tsconfig.json'

const SRC_PATH = '<rootDir>/src';

const makeModuleNameMapper = (srcPath: string) => {
  const { paths } = compilerOptions;

  const aliases = {};

  Object.keys(paths).forEach((item) => {
      const key = item.replace('/*', '/(.*)');
      const path = paths[item][0].replace('/*', '/$1');
      aliases[key] = srcPath + '/' + path;
  });
  return aliases;
};


export default {
  clearMocks: true,
  coverageProvider: "v8",
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
  testEnvironment: "jsdom",
  moduleNameMapper: makeModuleNameMapper(SRC_PATH),
  transform: {
    '^.+\\.(t|j)sx?$': [
      "babel-jest"
    ],
  },
};