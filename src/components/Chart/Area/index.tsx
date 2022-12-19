import { ITooltipContent } from '@/pages/charts';
import { toLocaleFixed } from '@/utils/index';
import { transparentize } from 'polished';
import React from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from 'recharts';
import { withTheme } from 'styled-components';
import { IChartData } from '../../../configs/home';
import { Theme } from '../../../styles/styles';
import { TooltipContainer } from './styles';

interface IChart {
  data: IChartData[];
  theme: Theme;
  bg?: 'regular' | 'dark';
  hasTooltip?: boolean;
  yAxis?: boolean;
  strokeWidth?: number;
  height?: string;
}

const CustomTooltip = ({ payload, label, active }: ITooltipContent) => {
  if (active && payload && payload.length) {
    return (
      <TooltipContainer>
        <p>{`price: ${toLocaleFixed(payload[0]?.value, 6)} U$`}</p>
      </TooltipContainer>
    );
  }

  return null;
};

const Chart: React.FC<IChart> = ({
  data,
  theme,
  bg = 'regular',
  hasTooltip,
  yAxis = false,
  strokeWidth = 0,
  height = '100%',
}) => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer width="100%" height={height} debounce={500}>
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
            type="monotone"
            dataKey="value"
            strokeWidth={strokeWidth}
            stroke="#AA33B5"
            fill="url(#areaBackground)"
            fillOpacity={1}
          />
          {hasTooltip && <Tooltip content={<CustomTooltip />} />}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default withTheme(Chart);
