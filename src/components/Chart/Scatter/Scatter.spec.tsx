import React from 'react';
import { renderWithTheme } from '../../../test/utils';
import Chart, { ChartType } from '../index';

const data = [
  { x: 100, y: 200, z: 200 },
  { x: 120, y: 100, z: 260 },
  { x: 170, y: 300, z: 400 },
  { x: 140, y: 250, z: 280 },
  { x: 150, y: 400, z: 500 },
  { x: 110, y: 280, z: 200 },
];

describe('Scatter Chart', () => {
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
      <Chart type={ChartType.Scatter} data={data} />,
    ).container;
    expect(container).toBeInTheDocument();
    const svg = document.querySelector('.recharts-surface');
    expect(svg?.nodeName).toBe('svg');
    expect(svg).toHaveAttribute('width', String(mockedClientWidth));
  });
});
