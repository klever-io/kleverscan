import React, { useEffect, useState } from 'react';

import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { format, fromUnixTime } from 'date-fns';

import {
  Card,
  CardContainer,
  Container,
  Header,
  Input,
  TableContainer,
  Title,
} from '@/views/blocks';

import Table, { ITable } from '@/components/Table';
import { Row } from '@/components/Table/styles';

import { IBlock, IPagination, IResponse } from '@/types/index';
import api from '@/services/api';
import { formatAmount, getAge } from '@/utils/index';

import { ArrowLeft } from '@/assets/icons';

interface IBlocks {
  blocks: IBlock[];
  pagination: IPagination;
}

interface IBlockResponse extends IResponse {
  data: {
    blocks: IBlock[];
  };
  pagination: IPagination;
}

interface ICard {
  title: string;
  headers: string[];
  values: string[];
}

const Blocks: React.FC<IBlocks> = ({ blocks: defaultBlocks }) => {
  const router = useRouter();
  const precision = 6; // default KLV precision

  const [blocks] = useState(defaultBlocks);
  const [loading] = useState(false);
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

  const cards: ICard[] = [
    {
      title: 'Number of Blocks',
      headers: ['Blocks Yesterday', 'Cumulative Number'],
      values: ['+27,684', '35,519,349'],
    },
    {
      title: 'Block Reward',
      headers: ['Reward Yesterday', 'Cumulative Revenue'],
      values: ['4,872,384 KLV', '4.4 Bi KLV'],
    },
    {
      title: 'Stats on Burned KLV',
      headers: ['Burned Yesterday', 'Burned in Total'],
      values: ['8,607,197 KLV', '1.4 Bi KLV'],
    },
  ];

  const CardContent: React.FC<ICard> = ({ title, headers, values }) => {
    return (
      <Card>
        <div>
          <span>
            <strong>{title}</strong>
          </span>
          <p>{age} ago</p>
        </div>
        <div>
          <span>
            <small>{headers[0]}</small>
          </span>
          <span>
            <small>{headers[1]}</small>
          </span>
        </div>
        <div>
          <span>{values[0]}</span>
          <span>{values[1]}</span>
        </div>
      </Card>
    );
  };

  const header = [
    'Block',
    'Block size',
    'Produced by',
    'Created',
    'Tx Count',
    'Burned KLV',
    'kApp Fee',
    'Bandwith Fee',
    'Block Reward',
  ];

  const TableBody: React.FC<IBlock> = ({
    nonce,
    size,
    timestamp,
    txCount,
    txFees,
    kAppFees,
    blockRewards,
  }) => {
    return (
      <Row type="blocks">
        <span>
          <Link href={`/block/${nonce}`}>{String(nonce)}</Link>
        </span>
        <span>{size.toLocaleString()} Bytes</span>
        <span>Klever.io</span>
        <span>
          <small>
            {format(fromUnixTime(timestamp / 1000), 'MM/dd/yyyy HH:mm')}
          </small>
        </span>
        <span>{txCount}</span>
        <span>
          <small>32,230.23 KLV</small>
        </span>
        <span>
          <small>{formatAmount(txFees || 0)}</small>
        </span>
        <span>
          <small>{formatAmount(kAppFees || 0)}</small>
        </span>
        <span>
          <strong>{formatAmount(blockRewards / 10 ** precision)} KLV</strong>
        </span>
      </Row>
    );
  };

  const tableProps: ITable = {
    type: 'blocks',
    header,
    data: blocks as any[],
    body: TableBody,
    loading,
  };

  return (
    <Container>
      <Header>
        <Title>
          <div onClick={router.back}>
            <ArrowLeft />
          </div>
          <h1>Blocks</h1>
        </Title>

        <Input />
      </Header>

      <CardContainer>
        {cards.map((card, index) => (
          <CardContent key={String(index)} {...card} />
        ))}
      </CardContainer>

      <TableContainer>
        <h3>List of blocks</h3>
        <Table {...tableProps} />
      </TableContainer>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<IBlocks> = async () => {
  const props: IBlocks = {
    blocks: [],
    pagination: {} as IPagination,
  };

  const block: IBlockResponse = await api.get({
    route: 'block/list',
  });
  if (!block.error) {
    props.blocks = block.data.blocks;
    props.pagination = block.pagination;
  }

  return { props };
};

export default Blocks;
