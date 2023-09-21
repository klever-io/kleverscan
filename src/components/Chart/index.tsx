import { ITooltipContent } from '@/pages/charts';
import React from 'react';
import Area from './Area';
import DoubleArea from './DoubleArea';
import DoubleLinear from './DoubleLinear';
import Horizontal from './Horizontal';
import Linear from './Linear';
import Scatter from './Scatter';

export enum ChartType {
  Area,
  DoubleArea,
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
  CustomTooltip?: ({
    payload,
    label,
    active,
  }: ITooltipContent) => JSX.Element | null;
  yAxis?: boolean;
  strokeWidth?: number;
  height?: string;
}

const Chart: React.FC<IChart> = ({
  type,
  data,
  value,
  value2,
  hasTooltip = false,
  CustomTooltip,
  yAxis,
  strokeWidth,
  height,
}) => {
  const props = { data, hasTooltip, yAxis, strokeWidth, height, CustomTooltip };

  switch (type) {
    case ChartType.Area:
      return <Area {...props} />;
    case ChartType.DoubleArea:
      return <DoubleArea {...props} />;
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
