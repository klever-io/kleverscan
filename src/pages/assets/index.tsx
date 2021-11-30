import React from 'react';

import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { Container, Header, Input, Title } from '@/views/assets';

import Table, { ITable } from '@/components/Table';
import { Row } from '@/components/Table/styles';

import { IAsset, IResponse, IPagination } from '@/types/index';
import { formatAmount } from '@/utils/index';
import api from '@/services/api';

import { ArrowLeft } from '@/assets/icons';

interface IAssetPage {
  assets: IAsset[];
  pagination: IPagination;
}

interface IAssetResponse extends IResponse {
  data: {
    assets: IAsset[];
  };
  pagination: IPagination;
}

const Assets: React.FC<IAssetPage> = ({ assets }) => {
  const router = useRouter();

  const TableBody: React.FC<IAsset> = ({
    ticker,
    name,
    address,
    type,
    initialSupply,
    maxSupply,
    circulatingSupply,
    precision,
  }) => {
    return (
      <Row type="assetsPage">
        <span>
          <p>{ticker}</p>
        </span>
        <span>
          <Link href={`/asset/${address}`}>{address}</Link>
        </span>
        <span>
          <p>{name}</p>
        </span>
        <span>{type}</span>
        <span>
          <strong>{formatAmount(initialSupply / 10 ** precision)} KLV</strong>
        </span>
        <span>
          <strong>{formatAmount(maxSupply / 10 ** precision)} KLV</strong>
        </span>
        <span>
          <strong>
            {formatAmount(circulatingSupply / 10 ** precision)} KLV
          </strong>
        </span>
        <span>
          <strong>{precision}</strong>
        </span>
      </Row>
    );
  };

  const header = [
    'Token',
    'Address',
    'Name',
    'Type',
    'Initial Supply',
    'Max Supply',
    'Circulating Supply',
    'Precision',
  ];

  const tableProps: ITable = {
    body: TableBody,
    data: assets as any[],
    header,
    loading: false,
    type: 'assetsPage',
  };

  return (
    <Container>
      <Header>
        <Title>
          <div onClick={router.back}>
            <ArrowLeft />
          </div>
          <h1>Assets</h1>
        </Title>

        <Input />
      </Header>

      <Table {...tableProps} />
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const props: IAssetPage = { assets: [], pagination: {} as IPagination };

  const assets: IAssetResponse = await api.get({ route: 'assets/kassets' });
  if (!assets.error) {
    props.assets = assets.data.assets;
    props.pagination = assets.pagination;
  }

  return { props };
};

export default Assets;
