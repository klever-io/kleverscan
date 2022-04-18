import React from 'react';

import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import dynamic from 'next/dynamic';

import {
  ChartBody,
  ChartContainer,
  ChartHeader,
  MapContainer,
} from '@/views/nodes';

import { Container, Header, Title } from '@/views/blocks';

import Chart, { ChartType } from '@/components/Chart';
const Map = dynamic(() => import('@/components/Map/index'), { ssr: false });

import NodeCards from '@/components/Cards/NodeCards';

import { ICountriesGeoData, ICountryNode, INodeCard } from '../../types';

import { ArrowLeft } from '@/assets/icons';
import { Nodes as Icon } from '@/assets/title-icons';
import { coinMockedData } from '@/configs/home';

import { getCountryISO3, ISO2 } from '@/utils/country';
import geoData from '@/assets/countries.geo.json';
import api from '@/services/api';

interface INodePage {
  nodes: ICountryNode[];
  cardData: INodeCard[];
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
          <div onClick={() => router.push('/')}>
            <ArrowLeft />
          </div>
          <h1>Nodes</h1>
          <Icon />
        </Title>
      </Header>

      <NodeCards cardData={cardData} />

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
  /* eslint-disable */
  const geoip = require('geoip-lite');
  const geojson2svg = require('geojson2svg');
  const getBounds = require('svg-path-bounds');

  const countriesData: ICountriesGeoData = JSON.parse(JSON.stringify(geoData));
  let peers: IPeerData[] = [];

  const statistics: IPeerResponse = await api.get({
    route: 'node/peerinfo',
  });

  if (!statistics.error) {
    peers = statistics.data?.peers;
  }
  const nodes: ICountryNode[] = [];

  for (let i = 0; i < peers.length; i++) {
    const { addresses } = peers[i];
    const filteredAddresses = addresses.filter((item, pos, self) => {
      return (
        self.indexOf(item) === pos &&
        !item.startsWith('/ip4/127.0.0.1') &&
        !item.startsWith('/ip4/10.') &&
        !item.startsWith('/ip4/172.16.') &&
        !item.startsWith('/ip4/172.17.') &&
        !item.startsWith('.255/tcp')
      );
    });
    for (const address of filteredAddresses) {
      // IP comes as /ip4/xx.xx.x.xx/tcp/xxxxx
      const cleanIp = address.replace(/\/ip4\/|\/tcp\/[^\/]*$/g, '');

      const geo: IGeoIPLookup = geoip.lookup(cleanIp);
      if (geo === null) continue;

      // TODO: manually allocate node
      if (cleanIp == '35.200.204.226') {
        geo.country = 'IN';
        geo.ll[0] = 19.07;
        geo.ll[1] = 72.88;
      }

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

  nodes.sort((a, b) =>
    a.nodes.length > b.nodes.length
      ? -1
      : b.nodes.length > a.nodes.length
      ? 1
      : 0,
  );
  const mostNodes: ICountryNode = nodes.length
    ? nodes[0]
    : { country: 'Empty', nodes: [] };

  const mostNodesCountryGeo = countriesData.features.find(
    feat => feat.id === getCountryISO3(mostNodes.country),
  );

  let pathStrings: string[] = [];
  let viewBox: number[] = [];
  const converter = geojson2svg({
    viewportSize: { width: 200, height: 200 },
    mapExtent: { left: -180, bottom: -180, right: 180, top: 180 },
    output: 'path',
    fitTo: 'height',
  });
  if (mostNodesCountryGeo) {
    pathStrings = converter.convert(mostNodesCountryGeo);
    viewBox = getBounds(pathStrings.join(' '));
  }

  const totalNodes = nodes.reduce(
    (acc, node) => acc + (node.nodes.length || 0),
    0,
  );

  const mostNodesOptions: any = {
    scale: '1, 1',
    translate: '0, 0',
  };

  const cardData: INodeCard[] = [
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
      chartOptions: viewBox.length
        ? {
            scale: `${200 / (viewBox[2] - viewBox[0])}, ${
              200 / (viewBox[2] - viewBox[0])
            }`,
            translate: `${-viewBox[0]} ${-viewBox[1]}`,
          }
        : mostNodesOptions,
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
