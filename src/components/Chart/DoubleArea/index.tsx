import { PropsWithChildren } from 'react';
import { ITooltipContent } from '@/pages/charts';
import { transparentize } from 'polished';
import React from 'react';
import {
  Area,
  AreaChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  YAxis,
} from 'recharts';
import { withTheme } from 'styled-components';
import { IChartData } from '../../../configs/home';
import { Theme } from '../../../styles/styles';
import { StyledText } from '../styles';

interface IChart {
  data: IChartData[];
  theme: Theme;
  bg?: 'regular' | 'dark';
  CustomTooltip?: ({
    payload,
    label,
    active,
  }: ITooltipContent) => JSX.Element | null;
  yAxis?: boolean;
  strokeWidth?: number;
  height?: string;
}

const Chart: React.FC<PropsWithChildren<IChart>> = ({
  data,
  theme,
  bg = 'regular',
  CustomTooltip,
  yAxis = false,
  strokeWidth = 0,
  height = '100%',
}) => {
  return (
    <div style={{ width: '100%', height: '95%' }}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          {yAxis && (
            <YAxis type="number" domain={['auto', 'auto']} hide={true} />
          )}
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
            type="linear"
            dataKey="valueNow"
            strokeWidth={strokeWidth}
            stroke="#AA33B5"
            fill="url(#areaBackground)"
            fillOpacity={0.7}
            name="Current period"
          />
          <Area
            type="linear"
            dataKey="valuePast"
            strokeWidth={strokeWidth}
            stroke="#b0b0b0"
            fill="none"
            fillOpacity={1}
            strokeDasharray="3 3"
            name="Previous period"
          />
          {CustomTooltip && <Tooltip content={<CustomTooltip />} />}
          <Legend
            align="left"
            iconType={'circle'}
            iconSize={10}
            wrapperStyle={{ bottom: '-0.3rem', left: '0.7rem' }}
            formatter={value => <StyledText>{value}</StyledText>}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default withTheme(Chart);
