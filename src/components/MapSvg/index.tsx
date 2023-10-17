import { IChartData } from '@/configs/home';
import { Theme } from '@/styles/styles';
import React from 'react';
import { withTheme } from 'styled-components';

interface IMapSvg {
  chartData: IChartData[] | string[];
  chartOptions: any;
  theme: Theme;
}

const MapSvg: React.FC<IMapSvg> = ({ chartData, chartOptions, theme }) => {
  return (
    <svg viewBox="0 0 200 120">
      <linearGradient id="linear-gradient" x1="0" y1="0" x2="0" y2="100%">
        <stop offset="0%" stopColor={theme.chart.lightBg} stopOpacity="50%" />
        <stop offset="100%" stopColor={theme.chart.lightBg} stopOpacity="0%" />
      </linearGradient>
      {chartData?.map((d, index) => (
        <path
          key={index}
          d={String(d)}
          transform={`scale(${chartOptions?.scale}) translate(${chartOptions?.translate})`}
          fill="url(#linear-gradient)"
        />
      ))}
    </svg>
  );
};

export default withTheme(MapSvg);
