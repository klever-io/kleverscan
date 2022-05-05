import React from 'react';

import { withTheme } from 'styled-components';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import { IChartData } from '../../../configs/home';
import { Theme } from '../../../styles/styles';
import { formatAmount } from '@/utils/index';

interface IChart {
  data: IChartData[];
  theme: Theme;
}

const Chart: React.FC<IChart> = ({ data, theme }) => {
  const axisProps = {
    axisLine: false,
    tickLine: false,
    style: { fill: theme.chart.linear.fill, fontSize: '.75rem' },
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <YAxis
          type="number"
          scale="auto"
          tickFormatter={formatAmount}
          {...axisProps}
        />
        <XAxis
          dataKey="date"
          scale="auto"
          padding={{ left: 20 }}
          {...axisProps}
        />
        <Line
          type="linear"
          dataKey="value"
          dot={false}
          strokeWidth={2}
          stroke={theme.chart.linear.stroke}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default withTheme(Chart);
