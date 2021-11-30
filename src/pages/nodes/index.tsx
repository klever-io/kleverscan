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

import { ICountriesGeoData, ICountryNode } from '../../types';

import { ArrowLeft } from '@/assets/icons';
import { coinMockedData, IChartData, infoChartData } from '@/configs/home';
import { getAge } from '@/utils/index';
import { getCountryISO3, ISO2 } from '@/utils/country';
import geoData from '@/assets/countries.geo.json';
import api from '@/services/api';

const geojson2svg = require('geojson2svg');
const getBounds = require('svg-path-bounds');

interface ICard {
  title: string;
  headers: string[];
  values: string[];
  chartType: 'chart' | 'map';
  chartOptions?: any;
  chartData: IChartData[] | string[];
}
interface INodePage {
  nodes: ICountryNode[];
  cardData: ICard[];
}

interface IGeoIPLookup {
  range: [number, number];
  country: ISO2;
  region: string;
  timezone: string;
  ll: [number, number];
}

interface IPeerData {
  isblacklisted: boolean;
  pid: string;
  pk: string;
  peertype: string;
  addresses: string[];
}
interface IPeerResponse {
  data: { peers: IPeerData[] };
  pagination: string | null;
  error: string;
  code: string;
}

const Nodes: React.FC<INodePage> = ({ nodes, cardData }) => {
  const router = useRouter();

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

  const rankingChartData = () => {
    const maxItems = 6;
    let data = [...nodes];

    if (nodes.length > maxItems) {
      const othersCount = nodes
        .slice(maxItems, nodes.length)
        .reduce((acc, node) => acc + (node.nodes.length || 0), 0);

      data.length = maxItems;
      data = [...data, { country: 'Others', nodes: Array(othersCount) }];
    }

    return data.map(item => ({ name: item.country, value: item.nodes.length }));
  };

  return (
    <Container>
      <Header>
        <Title>
          <div onClick={router.back}>
            <ArrowLeft />
          </div>
          <h1>Nodes</h1>
        </Title>
      </Header>

      <CardContainer>
        {cardData.map((card, index) => {
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

      <MapContainer>
        <Map nodes={nodes} />
      </MapContainer>

      <ChartContainer>
        <ChartHeader>
          <h1>Nodes Ranking</h1>
          <span>Rank by country and region</span>
        </ChartHeader>
        <ChartBody>
          <Chart type={ChartType.Horizontal} data={rankingChartData()} />
        </ChartBody>
      </ChartContainer>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const geoip = require('geoip-lite');

  const countriesData: ICountriesGeoData = JSON.parse(JSON.stringify(geoData));

  const statistics: IPeerResponse = await api.get({
    route: 'node/peerinfo',
  });

  const { peers } = statistics.data;

  const nodes: ICountryNode[] = [];

  for (let i = 0; i < peers.length; i++) {
    const { addresses } = peers[i];
    const filteredAddresses = addresses.filter((item, pos, self) => {
      return self.indexOf(item) === pos && !item.startsWith('/ip4/127.0.0.1');
    });
    for (const address of filteredAddresses) {
      // IP comes as /ip4/xx.xx.x.xx/tcp/xxxxx
      const cleanIp = address.replace(/\/ip4\/|\/tcp\/[^\/]*$/g, '');
      // temporary geoip fix
      if (cleanIp === '35.200.204.226') continue;

      const geo: IGeoIPLookup = geoip.lookup(cleanIp);
      if (geo === null) continue;

      const { country, ll } = geo;

      const countryNodeIndex = nodes.findIndex(c => c.country === country);
      if (countryNodeIndex === -1) {
        nodes.push({
          country,
          nodes: [ll],
        });
      } else {
        nodes[countryNodeIndex].nodes.push(ll);
      }
    }
  }

  let mostNodes = nodes[0];
  for (const node of nodes) {
    if (node.nodes.length > mostNodes.nodes.length) {
      mostNodes = node;
    }
  }
  const mostNodesCountryGeo = countriesData.features.find(
    feat => feat.id === getCountryISO3(mostNodes.country),
  );

  const converter = geojson2svg({
    viewportSize: { width: 200, height: 200 },
    mapExtent: { left: -180, bottom: -180, right: 180, top: 180 },
    output: 'path',
    fitTo: 'height',
  });
  const pathStrings = converter.convert(mostNodesCountryGeo);
  const viewBox = getBounds(pathStrings.join(' '));

  const totalNodes = nodes.reduce(
    (acc, node) => acc + (node.nodes.length || 0),
    0,
  );

  const cardData: ICard[] = [
    {
      title: 'Total Nodes',
      headers: ['Value', 'Increase'],
      values: [String(totalNodes), '+0.00%'],
      chartType: 'chart',
      chartData: coinMockedData,
    },
    {
      title: 'Most Nodes',
      headers: ['Country', 'Nodes'],
      values: [
        mostNodesCountryGeo?.properties.name || '',
        String(mostNodes.nodes.length),
      ],
      chartType: 'map',
      chartOptions: {
        scale: `${200 / (viewBox[2] - viewBox[0])}, ${
          200 / (viewBox[2] - viewBox[0])
        }`,
        translate: `${-viewBox[0]} ${-viewBox[1]}`,
      },
      chartData: pathStrings,
    },
  ];

  const props: INodePage = {
    nodes,
    cardData,
  };

  return { props };
};

export default Nodes;
