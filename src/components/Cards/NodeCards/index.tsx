import React, { useState, useEffect } from 'react';

import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import dynamic from 'next/dynamic';
import { fromUnixTime } from 'date-fns';

import {
  CardChartContainer,
  CardDetails,
  ChartBody,
  ChartContainer,
  ChartHeader,
  MapContainer,
} from '@/views/nodes';

import { Card, CardContainer, Container, Header, Title } from '@/views/blocks';

import Chart, { ChartType } from '@/components/Chart';
const Map = dynamic(() => import('@/components/Map/index'), { ssr: false });
import MapSvg from '@/components/MapSvg';

import { ArrowLeft } from '@/assets/icons';
import { coinMockedData, IChartData } from '@/configs/home';
import { getAge } from '@/utils/index';
import { getCountryISO3, ISO2 } from '@/utils/country';
import geoData from '@/assets/countries.geo.json';
import api from '@/services/api';
import { INodeCard } from '@/types/index';

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
      <Card style={{ backgroundColor: 'transparent' }} />
    </CardContainer>
  );
};

export default NodeCards;
