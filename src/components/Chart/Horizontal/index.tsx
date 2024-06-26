import { PropsWithChildren } from 'react';
import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { withTheme } from 'styled-components';
import { Theme } from '../../../styles/styles';

export interface IBarData {
  name: string;
  value: number;
}

interface IHorizontal {
  data: IBarData[];
  theme: Theme;
}

const Horizontal: React.FC<PropsWithChildren<IHorizontal>> = ({
  data,
  theme,
}) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data} layout="vertical">
      <defs>
        <linearGradient id="horizontalBackground" x1="0" y1=".5" x2="1" y2="0">
          <stop offset="5%" stopColor={theme.violet} stopOpacity={1} />
          <stop offset="95%" stopColor={theme.violet} stopOpacity={1} />
        </linearGradient>
      </defs>

      <CartesianGrid horizontal={false} />
      <XAxis
        type="number"
        tickLine={false}
        style={{ fontWeight: 300, fill: theme.navbar.mobile }}
        axisLine={{ stroke: theme.shadow }}
      />
      <YAxis
        type="category"
        dataKey="name"
        axisLine={false}
        tickLine={false}
        style={{ fontWeight: 300, fill: theme.navbar.mobile }}
      />
      <Bar
        label={{ fill: theme.white }}
        dataKey="value"
        fill="url(#horizontalBackground)"
        barSize={30}
      />
    </BarChart>
  </ResponsiveContainer>
);

export default withTheme(Horizontal);
