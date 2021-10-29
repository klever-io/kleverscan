import React from 'react';
import Area from './Area';
import Horizontal from './Horizontal';

export enum ChartType {
  Area,
  Horizontal,
}

interface IChart {
  type?: ChartType;
  data: any;
}

const Chart: React.FC<IChart> = ({ type, data }) => {
  const props = { data };

  switch (type) {
    case ChartType.Area:
      return <Area {...props} />;
    case ChartType.Horizontal:
      return <Horizontal {...props} />;
    default:
      return <Area {...props} />;
  }
};

export default Chart;
