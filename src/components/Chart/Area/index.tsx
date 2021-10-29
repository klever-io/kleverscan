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
            <stop offset="10%" stopColor={theme.rose} stopOpacity={0.5} />
            <stop offset="90%" stopColor={theme.white} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="stroke" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={theme.rose} stopOpacity={1} />
            <stop offset="95%" stopColor={theme.purple} stopOpacity={1} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          strokeWidth={2}
          stroke="url(#stroke)"
          fillOpacity={1}
          fill="url(#background)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default withTheme(Chart);
