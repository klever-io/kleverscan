import React from 'react';
import Area from './Area';
import Horizontal from './Horizontal';
import Linear from './Linear';
import DoubleLinear from './DoubleLinear';
import Scatter from './Scatter';

export enum ChartType {
  Area,
  Horizontal,
  Linear,
  Scatter,
  DoubleLinear,
}

interface IChart {
  type?: ChartType;
  data: any;
  value?: string;
  value2?: string;
}

const Chart: React.FC<IChart> = ({ type, data, value, value2 }) => {
  const props = { data };

  switch (type) {
    case ChartType.Area:
      return <Area {...props} />;
    case ChartType.Horizontal:
      return <Horizontal {...props} />;
    case ChartType.Linear:
      return <Linear {...props} />;
    case ChartType.DoubleLinear:
      return <DoubleLinear {...props} value={value} value2={value2} />;
    case ChartType.Scatter:
      return <Scatter {...props} />;
    default:
      return <Area {...props} />;
  }
};

export default Chart;
