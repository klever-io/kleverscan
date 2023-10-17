import React from 'react';
import { renderWithTheme } from '../../../test/utils';
import Area from './index';

const data = [
  { value: 500, date: 1 },
  { value: 300, date: 2 },
  { value: 330, date: 3 },
  { value: 400, date: 4 },
  { value: 350, date: 5 },
  { value: 150, date: 6 },
  { value: 250, date: 7 },
  { value: 350, date: 8 },
  { value: 450, date: 9 },
  { value: 500, date: 10 },
];

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
describe('Area Chart', () => {
  const mockedClientHeight = 100;
  const mockedClientWidth = 100;
  beforeAll(() => {
    jest
      .spyOn(HTMLElement.prototype, 'clientHeight', 'get')
      .mockReturnValue(mockedClientHeight);
    jest
      .spyOn(HTMLElement.prototype, 'clientWidth', 'get')
      .mockReturnValue(mockedClientWidth);
  });

  it('should render the chart with the correct data', async () => {
    const container = renderWithTheme(<Area data={data} bg="dark" />).container;
    expect(container).toBeInTheDocument();
    const svg = document.querySelector('.recharts-surface');
    expect(svg?.nodeName).toBe('svg');
    expect(svg).toHaveAttribute('width', String(mockedClientWidth));
  });
});
