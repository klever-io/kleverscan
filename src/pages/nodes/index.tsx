import React from 'react';

import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';

import {
  ChartBody,
  ChartContainer,
  ChartHeader,
  Container,
  MapContainer,
} from '../../views/nodes';

import {
  HeaderContainer,
  HeaderIcon,
} from '../../components/Layout/List/styles';
import CardList, { ICard } from '../../components/CardList';
import Chart, { ChartType } from '../../components/Chart';
const Map = dynamic(() => import('../../components/Map/index'), { ssr: false });

import { navbarItems } from '../../configs/navbar';
import { INodeData } from '../../types';

import { BsQuestionCircleFill } from 'react-icons/bs';

interface INodePage {
  totalNodes: number;
  mostNodes: INodeData;
  nodes: INodeData[];
}

const Nodes: React.FC<INodePage> = ({ totalNodes, mostNodes, nodes }) => {
  const cardData: ICard[] = [
    {
      title: 'Total Nodes',
      subtitle: String(totalNodes),
      transparent: false,
    },
    {
      title: 'Most Nodes',
      subtitle: `${mostNodes.name} (${mostNodes.count})`,
      transparent: true,
    },
  ];

  const Header: React.FC = () => {
    const Icon = navbarItems.find(item => item.name === 'Nodes')?.Icon;

    return (
      <HeaderContainer>
        <div>
          <HeaderIcon>{Icon ? <Icon /> : <BsQuestionCircleFill />}</HeaderIcon>
          <span>Nodes</span>
        </div>
      </HeaderContainer>
    );
  };

  const chartData = () => {
    const maxItems = 6;
    let data = [...nodes];

    if (nodes.length > maxItems) {
      const othersCount = nodes
        .slice(maxItems, nodes.length)
        .reduce((acc, node) => acc + (node.count || 0), 0);

      data.length = maxItems;
      data = [
        ...data,
        { name: 'Others', location: [0, 0], count: othersCount },
      ];
    }

    return data.map(item => ({ name: item.name, value: item.count || 0 }));
  };

  return (
    <Container>
      <Header />
      <CardList data={cardData} />

      <MapContainer>
        <Map nodes={nodes} />
      </MapContainer>

      <ChartContainer>
        <ChartHeader>
          <h1>Nodes Ranking</h1>
          <span>Rank by country and region</span>
        </ChartHeader>
        <ChartBody>
          <Chart type={ChartType.Horizontal} data={chartData()} />
        </ChartBody>
      </ChartContainer>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const nodes: INodeData[] = [
    {
      name: 'Brasil',
      count: 3,
      location: [-15.793889, -47.882778],
      nodes: [
        { name: 'Rio de Janeiro', location: [-22.908333, -43.196388] },
        { name: 'Belém', location: [-1.455833, -48.503887] },
        { name: 'Porto Alegre', location: [-30.033056, -51.23] },
      ],
    },
    {
      name: 'United States',
      count: 4,
      location: [38.785091, -90.968285],
      nodes: [
        { name: 'New York', location: [40.73061, -73.935242] },
        { name: 'Washington', location: [47.751076, -120.740135] },
        { name: 'Texas', location: [31.0, -100.0] },
        { name: 'Oregon', location: [44.0, -120.5] },
      ],
    },
  ];

  let mostNodes = nodes[0];
  for (const node of nodes) {
    if ((node.count || 0) > (mostNodes.count || 0)) {
      mostNodes = node;
    }
  }

  const props: INodePage = {
    totalNodes: nodes.reduce((acc, node) => acc + (node.count || 0), 0),
    mostNodes,
    nodes,
  };

  return { props };
};

export default Nodes;
