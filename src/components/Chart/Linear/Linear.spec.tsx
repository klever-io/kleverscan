import React from 'react';
import { renderWithTheme } from '../../../test/utils';
import Chart, { ChartType } from '../index';

const data = [
  { date: '01 Nov', value: 257271 },
  { date: '02 Nov', value: 116556 },
  { date: '03 Nov', value: 110105 },
  { date: '04 Nov', value: 98829 },
];

describe('Linear Chart', () => {
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
      <Chart
        type={ChartType.Linear}
        data={data}
        value="burned"
        value2="minted"
      />,
    ).container;
    expect(container).toBeInTheDocument();
    const svg = document.querySelector('.recharts-surface');
    expect(svg?.nodeName).toBe('svg');
    expect(svg).toHaveAttribute('width', String(mockedClientWidth));
  });
});
