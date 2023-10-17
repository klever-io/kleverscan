import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import 'jest';

window.matchMedia = jest.fn().mockImplementation(query => {
  return {
    matches: false,
    media: query,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  };
});
