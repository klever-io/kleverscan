import React from 'react';

import { withTheme } from 'styled-components';
import {
  Scatter,
  ScatterChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

import { IChartData } from '../../../configs/home';
import { Theme } from '../../../styles/styles';
import { Coordinate } from 'recharts/types/util/types';

interface IChart {
  data: any[];
  poly?: Coordinate[];
  theme: Theme;
}

const Chart: React.FC<IChart> = ({ data, theme }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart>
        <XAxis
          dataKey="x"
          allowDuplicatedCategory={false}
          allowDecimals={true}
        />
        <YAxis dataKey="y" allowDuplicatedCategory={false} />
        <Scatter name="A school" data={data} fill="#8884d8" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default withTheme(Chart);
