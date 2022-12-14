import React from 'react';
import Area from './Area';
import DoubleLinear from './DoubleLinear';
import Horizontal from './Horizontal';
import Linear from './Linear';
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
  hasTooltip?: boolean;
}

const Chart: React.FC<IChart> = ({
  type,
  data,
  value,
  value2,
  hasTooltip = false,
}) => {
  const props = { data, hasTooltip };

  switch (type) {
    case ChartType.Area:
      return <Area {...props} />;
    case ChartType.Horizontal:
      return <Horizontal {...props} />;
    case ChartType.Linear:
      return <Linear {...props} value={value} />;
    case ChartType.DoubleLinear:
      return <DoubleLinear {...props} value={value} value2={value2} />;
    case ChartType.Scatter:
      return <Scatter {...props} />;
    default:
      return <Area {...props} />;
  }
};

export default Chart;
