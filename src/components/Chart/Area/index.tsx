import React from 'react';

import { withTheme } from 'styled-components';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

import { IChartData } from '../../../configs/home';
import { Theme } from '../../../styles/styles';

interface IChart {
  data: IChartData[];
  theme: Theme;
}

const Chart: React.FC<IChart> = ({ data, theme }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="background" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="10%"
              stopColor={theme.chart.background}
              stopOpacity={0.9}
            />
            <stop
              offset="90%"
              stopColor={theme.chart.transparent}
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          strokeWidth={0}
          fillOpacity={1}
          fill="url(#background)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default withTheme(Chart);
