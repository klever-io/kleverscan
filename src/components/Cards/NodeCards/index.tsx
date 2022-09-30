import Chart from '@/components/Chart';
import MapSvg from '@/components/MapSvg';
import { INodeCard } from '@/types/index';
import { getAge } from '@/utils/index';
import { Card, CardContainer } from '@/views/blocks';
import { CardChartContainer, CardDetails } from '@/views/nodes';
import { fromUnixTime } from 'date-fns';
import React, { useEffect, useState } from 'react';

interface IProps {
  cardData: INodeCard[];
}

const NodeCards: React.FC<IProps> = ({ cardData }) => {
  const [uptime] = useState(new Date().getTime());
  const [age, setAge] = useState(
    getAge(fromUnixTime(new Date().getTime() / 1000)),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const newAge = getAge(fromUnixTime(uptime / 1000));

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
