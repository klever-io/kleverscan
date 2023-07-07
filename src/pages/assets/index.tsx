import { Assets as Icon } from '@/assets/title-icons';
import Copy from '@/components/Copy';
import Filter, { IFilter } from '@/components/Filter';
import Title from '@/components/Layout/Title';
import AssetLogo from '@/components/Logo/AssetLogo';
import Table, { ITable } from '@/components/Table';
import { FilterContainer } from '@/components/TransactionsFilters/styles';
import api from '@/services/api';
import { Container, Header } from '@/styles/common';
import { IAsset, IRowSection } from '@/types/index';
import { setQueryAndRouter } from '@/utils';
import { formatAmount } from '@/utils/formatFunctions';
import { useFetchPartial } from '@/utils/hooks';
import { ContainerAssetId, ContainerAssetName } from '@/views/assets';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import { IoIosInfinite } from 'react-icons/io';

const Assets: React.FC = () => {
  const router = useRouter();
  const [filterAssets, fetchPartialAsset, loading, setLoading] =
    useFetchPartial<IAsset>('assets', 'assets/list', 'assetId');

  const handleSelected = async (
    selected: string,
    filterType: string,
  ): Promise<void> => {
    while (!router.isReady) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (selected === 'All') {
      const updatedQuery = { ...router.query };
      delete updatedQuery[filterType];
      setQueryAndRouter(updatedQuery, router);
    } else if (filterType === 'type') {
      setQueryAndRouter({ ...router.query, [filterType]: selected }, router);
    } else if (selected !== router.query[filterType]) {
      setQueryAndRouter({ ...router.query, [filterType]: selected }, router);
    }
  };

  const filters: IFilter[] = [
    {
      title: 'Asset',
      data: filterAssets.map(asset => asset.assetId),
      onClick: value => handleSelected(value, 'asset'),
      onChange: async value => {
        setLoading(true);
        await fetchPartialAsset(value.toUpperCase());
      },
      current: (router.query.asset as string) || undefined,
      loading,
    },
    {
      title: 'Asset Type',
      data: ['Fungible', 'NonFungible'],
      onClick: value => handleSelected(value, 'type'),
      inputType: 'button',
      current: (router.query.type as string) || undefined,
      loading,
    },
  ];

  const requestAssets = async (page: number, limit: number) => {
    while (!router.isReady) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const localQuery = { ...router.query, page, limit, hidden: false };
    return api.get({
      route: `assets/list`,
      query: localQuery,
    });
  };

  const rowSections = (asset: IAsset): IRowSection[] => {
    const {
      ticker,
      name,
      logo,
      assetId,
      assetType,
      initialSupply,
      maxSupply,
      staking,
      circulatingSupply,
      precision,
      verified,
    } = asset;

    const renderMaxSupply = (): ReactNode => {
      return (
        <strong>
          {maxSupply !== 0 ? (
            formatAmount(maxSupply / 10 ** precision)
          ) : (
            <IoIosInfinite />
          )}
        </strong>
      );
    };

    const sections = [
      {
        element: (
          <Link href={`/asset/${assetId}`} key={assetId}>
            <a>
              <AssetLogo
                logo={logo}
                ticker={ticker}
                name={name}
                verified={verified}
              />
            </a>
          </Link>
        ),
        span: 1,
      },

      {
        element: (
          <Link href={`/asset/${assetId}`} key={ticker}>
            <a style={{ overflow: 'hidden' }}>
              <p>{ticker}</p>
            </a>
          </Link>
        ),
        span: 1,
      },

      {
        element: (
          <ContainerAssetId>
            <Link href={`/asset/${assetId}`} key={assetId}>
              {assetId}
            </Link>
            <Copy info="Asset ID" data={assetId} />
          </ContainerAssetId>
        ),
        span: 1,
      },
      {
        element: (
          <ContainerAssetName>
            <Link href={`/asset/${assetId}`} key={assetId}>
              <a>{name}</a>
            </Link>
          </ContainerAssetName>
        ),
        span: 1,
      },

      { element: <span key={assetType}>{assetType}</span>, span: 1 },
      {
        element: (
          <strong key={initialSupply}>
            {formatAmount(initialSupply / 10 ** precision)} {ticker}
          </strong>
        ),
        span: 1,
      },
      {
        element: (
          <strong key={maxSupply}>
            {renderMaxSupply()} {ticker}
          </strong>
        ),
        span: 1,
      },
      {
        element: (
          <strong key={circulatingSupply}>
            {formatAmount(circulatingSupply / 10 ** precision)} {ticker}
          </strong>
        ),
        span: 1,
      },
      {
        element: (
          <strong key={String(staking?.totalStaked)}>
            {staking?.totalStaked
              ? formatAmount(staking.totalStaked / 10 ** precision)
              : 0}
          </strong>
        ),
        span: 1,
      },
      {
        element: (
          <strong>
            {staking
              ? staking?.interestType === 'APRI'
                ? 'APR'
                : 'FPR'
              : '--'}
          </strong>
        ),
        span: 1,
      },
      { element: <strong key={precision}>{precision}</strong>, span: 1 },
    ];

    return sections;
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
    'Total Staked',
    'Rewards Type',
    'Precision',
  ];

  const tableProps: ITable = {
    rowSections,
    header,
    type: 'assetsPage',
    request: (page, limit) => requestAssets(page, limit),
    dataName: 'assets',
    scrollUp: true,
  };

  return (
    <Container>
      <Header>
        <Title title="Assets" Icon={Icon} />
      </Header>

      <FilterContainer>
        {filters.map(filter => (
          <Filter key={filter.current} {...filter} />
        ))}
      </FilterContainer>

      <Table {...tableProps} />
    </Container>
  );
};

export default Assets;
