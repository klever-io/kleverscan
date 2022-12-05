import { transparentize } from 'polished';
import React from 'react';
import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts';
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
    <div style={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer width="100%" height="110%" debounce={500}>
        <AreaChart data={data}>
          <YAxis type="number" domain={['auto', 'auto']} hide={true} />
          <defs>
            <linearGradient id="areaBackground" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="50%"
                stopColor={
                  bg === 'regular'
                    ? transparentize(0.5, theme.chart.lightBg)
                    : theme.chart.darkBg
                }
                stopOpacity={0.9}
              />
              <stop
                offset="100%"
                stopColor={bg === 'regular' ? theme.violet : theme.chart.darkBg}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            strokeWidth={1}
            stroke="#AA33B5"
            fill="url(#areaBackground)"
            fillOpacity={1}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default withTheme(Chart);
