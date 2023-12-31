import Chart from '@/components/Chart';
import MapSvg from '@/components/MapSvg';
import { Card, CardContainer } from '@/styles/common';
import { INodeCard } from '@/types/index';
import { getAge } from '@/utils/timeFunctions';
import { CardChartContainer, CardDetails } from '@/views/nodes';
import React, { useEffect, useState } from 'react';

interface IProps {
  cardData: INodeCard[];
}

const NodeCards: React.FC<IProps> = ({ cardData }) => {
  const [uptime] = useState(new Date().getTime());
  const [age, setAge] = useState(getAge(new Date()));

  useEffect(() => {
    const interval = setInterval(() => {
      const newAge = getAge(new Date(uptime / 1000));

      setAge(newAge);
    }, 1 * 1000); // 1 sec

    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <CardContainer>
      {cardData.map((card: INodeCard, index: number) => {
        const { title, headers, values, chartType, chartOptions, chartData } =
          card;
        return (
          <Card key={index}>
            <div>
              <span>
                <strong>{title}</strong>
              </span>
              <p>{age} ago</p>
            </div>
            <CardChartContainer>
              {chartType === 'chart' ? (
                <Chart data={chartData} />
              ) : (
                <MapSvg chartData={chartData} chartOptions={chartOptions} />
              )}
              <CardDetails variation={values[1].includes('%')}>
                <div>
                  <span title={headers[0]}>{values[0]}</span>
                  <span title={headers[1]}>{values[1]}</span>
                </div>
              </CardDetails>
            </CardChartContainer>
          </Card>
        );
      })}
    </CardContainer>
  );
};

export default NodeCards;
