import { PropsWithChildren } from 'react';
import { ITooltipContent } from '@/pages/charts';
import { formatAmount } from '@/utils/formatFunctions';
import React from 'react';
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { withTheme } from 'styled-components';
import { IChartData } from '../../../configs/home';
import { Theme } from '../../../styles/styles';
import { TooltipContainer } from './styles';

interface IChart {
  data: IChartData[];
  theme: Theme;
  value?: string;
  value2?: string;
}

const CustomTooltip = ({ payload, label, active }: ITooltipContent) => {
  if (active && payload && payload.length) {
    return (
      <TooltipContainer>
        <p>{`${label}`}</p>
        <p>{`${payload[0]?.name}: ${formatAmount(payload[0]?.value)}`}</p>
        <p>{`${payload[1]?.name}: ${formatAmount(payload[1]?.value)}`}</p>
      </TooltipContainer>
    );
  }

  return null;
};

const Chart: React.FC<PropsWithChildren<IChart>> = ({
  data,
  theme,
  value,
  value2,
}) => {
  const axisProps = {
    axisLine: false,
    tickLine: false,
    style: { fill: theme.lightBlue, fontSize: '.75rem' },
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
          dataKey={value}
          dot={false}
          strokeWidth={2}
          stroke={theme.violet}
        />
        <Line
          type="linear"
          dataKey={value2}
          dot={false}
          strokeWidth={2}
          stroke={theme.lightBlue}
        />
        <Legend />
        <Tooltip content={<CustomTooltip />} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default withTheme(Chart);
