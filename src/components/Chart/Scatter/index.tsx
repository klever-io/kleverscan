import { PropsWithChildren } from 'react';
import React from 'react';
import {
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from 'recharts';
import { Coordinate } from 'recharts/types/util/types';
import { withTheme } from 'styled-components';
import { Theme } from '../../../styles/styles';

interface IChart {
  data: any[];
  poly?: Coordinate[];
  theme: Theme;
}

const Chart: React.FC<PropsWithChildren<IChart>> = ({ data }) => {
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
