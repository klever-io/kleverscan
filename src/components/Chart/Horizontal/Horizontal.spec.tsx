import React from 'react';
import Chart, { ChartType } from '../index';

import { renderWithTheme } from '../../../test/utils';

const nodes = [
  { name: 'US', value: 62 },
  { name: 'DE', value: 10 },
  { name: 'RU', value: 7 },
  { name: 'CA', value: 3 },
  { name: 'FR', value: 2 },
  { name: 'SG', value: 2 },
  { name: 'Others', value: 7 },
];

describe('Horizontal Chart', () => {
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
    const container = renderWithTheme(
      <Chart type={ChartType.Horizontal} data={nodes} />,
    ).container;
    expect(container).toBeInTheDocument();
    const svg = document.querySelector('.recharts-surface');
    expect(svg?.nodeName).toBe('svg');
    expect(svg).toHaveAttribute('width', String(mockedClientWidth));
  });
});
