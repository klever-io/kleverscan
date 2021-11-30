import React from 'react';
import Area from './Area';
import Horizontal from './Horizontal';
import Linear from './Linear';
import Scatter from './Scatter';

export enum ChartType {
  Area,
  Horizontal,
  Linear,
  Scatter,
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
    case ChartType.Linear:
      return <Linear {...props} />;
    case ChartType.Scatter:
      return <Scatter {...props} />;
    default:
      return <Area {...props} />;
  }
};

export default Chart;
