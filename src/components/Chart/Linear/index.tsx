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
import { formatAmount } from '@/utils/index';
import { TooltipContainer } from '../DoubleLinear/styles';

interface IChart {
  data: IChartData[];
  theme: Theme;
  value?: string;
}

interface ITooltipContent {
  payload?: {
    value: number;
    name: string;
  }[];
  label?: string;
  active?: boolean;
}

const CustomTooltip = ({ payload, label, active }: ITooltipContent) => {
  if (active && payload && payload.length) {
    return (
      <TooltipContainer>
        <p>{`${label}`}</p>
        <p>{`${payload[0]?.name}: ${formatAmount(payload[0]?.value)}`}</p>
      </TooltipContainer>
    );
  }

  return null;
};

const Chart: React.FC<IChart> = ({ data, theme, value }) => {
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
        <Tooltip content={<CustomTooltip />} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default withTheme(Chart);
