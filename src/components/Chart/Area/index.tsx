import { transparentize } from 'polished';
import React from 'react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { withTheme } from 'styled-components';
import { IChartData } from '../../../configs/home';
import { Theme } from '../../../styles/styles';

interface IChart {
  data: IChartData[];
  theme: Theme;
  bg?: 'regular' | 'dark';
}

const Chart: React.FC<IChart> = ({ data, theme, bg = 'regular' }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="areaBackground" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="10%"
              stopColor={
                bg === 'regular'
                  ? transparentize(0.5, theme.chart.lightBg)
                  : theme.chart.darkBg
              }
              stopOpacity={0.9}
            />
            <stop
              offset="90%"
              stopColor={
                bg === 'regular' ? theme.chart.lightBg : theme.chart.darkBg
              }
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          strokeWidth={0}
          fillOpacity={1}
          fill="url(#areaBackground)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default withTheme(Chart);
