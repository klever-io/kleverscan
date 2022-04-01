import React from 'react';

import { withTheme } from 'styled-components';
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { IChartData } from '../../../configs/home';
import { Theme } from '../../../styles/styles';

interface IChart {
  data: IChartData[];
  theme: Theme;
  value?: string;
  value2?: string;
}

const Chart: React.FC<IChart> = ({ data, theme, value, value2 }) => {
  const axisProps = {
    axisLine: false,
    tickLine: false,
    style: { fill: theme.chart.linear.fill, fontSize: '.75rem' },
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <YAxis type="number" scale="auto" {...axisProps} />
        <XAxis
          dataKey="date"
          scale="auto"
          padding={{ left: 20 }}
          {...axisProps}
        />
        <Line
          type="linear"
          dataKey={value}
          dot={false}
          strokeWidth={2}
          stroke={theme.chart.linear.stroke}
        />
        <Line
          type="linear"
          dataKey={value2}
          dot={false}
          strokeWidth={2}
          stroke={theme.chart.linear.fill}
        />
        <Legend />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default withTheme(Chart);
