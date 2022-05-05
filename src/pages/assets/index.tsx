import React, { useState } from 'react';

import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { Container, Header, Input, Title } from '@/views/assets';

import Table, { ITable } from '@/components/Table';

import { IAsset, IResponse, IPagination } from '@/types/index';
import { formatAmount, parseHardCodedInfo } from '@/utils/index';
import api from '@/services/api';

import { ArrowLeft } from '@/assets/icons';
import { Assets as Icon } from '@/assets/title-icons';
import { PaginationContainer } from '@/components/Pagination/styles';
import Pagination from '@/components/Pagination';
import { LetterLogo, Logo } from '@/views/assets/index';
import { useDidUpdateEffect } from '@/utils/hooks';
import { Row } from '@/components/Table/styles';

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

const Assets: React.FC<IAssetPage> = ({
  assets: defaultAssets,
  pagination,
}) => {
  const router = useRouter();

  const [page, setPage] = useState(0);
  const [assets, setAssets] = useState(defaultAssets);
  const [loading, setLoading] = useState(false);

  useDidUpdateEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const response: IAssetResponse = await api.get({
        route: `assets/kassets?page=${page}`,
      });
      if (!response.error) {
        setAssets(response.data.assets);
      }

      setLoading(false);
    };

    fetchData();
  }, [page]);

  const renderLogo = (logo: string, ticker: string, name: string) => {
    const regex = /[\/.](gif|jpg|jpeg|tiff|png)$/i;
    if (regex.test(logo)) {
      return <Logo alt={`${name}-logo`} src={logo} />;
    }
    return <LetterLogo>{ticker.split('')[0]}</LetterLogo>;
  };

  const TableBody: React.FC<IAsset> = ({
    ticker,
    name,
    logo,
    assetId,
    assetType,
    initialSupply,
    maxSupply,
    circulatingSupply,
    precision,
  }) => {
    return (
      <Row type="assetsPage">
        <span>{renderLogo(logo, ticker, name)}</span>

        <span>
          <p>{ticker}</p>
        </span>
        <span>
          <Link href={`/asset/${assetId}`}>{assetId}</Link>
        </span>
        <span>
          <p>{name}</p>
        </span>
        <span>{assetType}</span>
        <span>
          <strong>
            {formatAmount(initialSupply / 10 ** precision)} {ticker}
          </strong>
        </span>
        <span>
          <strong>
            {formatAmount(maxSupply / 10 ** precision)} {ticker}
          </strong>
        </span>
        <span>
          <strong>
            {formatAmount(circulatingSupply / 10 ** precision)} {ticker}
          </strong>
        </span>
        <span>
          <strong>{precision}</strong>
        </span>
      </Row>
    );
  };

  const header = [
    '',
    'Token',
    'ID',
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
    loading,
    type: 'assetsPage',
  };

  return (
    <Container>
      <Header>
        <Title>
          <div onClick={() => router.push('/')}>
            <ArrowLeft />
          </div>
          <h1>Assets</h1>
          <Icon />
        </Title>

        <Input />
      </Header>

      <Table {...tableProps} />

      <PaginationContainer>
        <Pagination
          count={pagination.totalPages}
          page={page}
          onPaginate={page => {
            setPage(page);
          }}
        />
      </PaginationContainer>
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

  props.assets = parseHardCodedInfo(props.assets);

  return { props };
};

export default Assets;
