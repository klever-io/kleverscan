import React from 'react';
import { screen } from '@testing-library/react';
import Chart, { ChartType } from '../index';

import { renderWithTheme } from '../../../test/utils';

const statistics = [
  { date: '23 May', burned: 1100825.905, minted: 2690.412102, value: 112485 },
  { date: '24 May', burned: 2148672.6, minted: 34466.540008, value: 324000 },
  { date: '26 May', burned: 13394784.875, minted: 0, value: 323940 },
  { date: '27 May', burned: 3167733.15, minted: 0, value: 323985 },
];

describe('Double Linear Chart', () => {
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
        type={ChartType.DoubleLinear}
        data={statistics}
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
