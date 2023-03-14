import { Assets as Icon } from '@/assets/title-icons';
import Copy from '@/components/Copy';
import Filter, { IFilter } from '@/components/Filter';
import Title from '@/components/Layout/Title';
import AssetLogo from '@/components/Logo/AssetLogo';
import Table, { ITable } from '@/components/Table';
import { FilterContainer } from '@/components/TransactionsFilters/styles';
import api from '@/services/api';
import { IAsset, IPagination, IResponse, IRowSection } from '@/types/index';
import { formatAmount } from '@/utils/formatFunctions';
import { useFetchPartialAsset } from '@/utils/hooks';
import { NextParsedUrlQuery } from 'next/dist/server/request-meta';
import {
  Container,
  ContainerAssetId,
  Header,
  HeaderContainer,
} from '@/views/assets';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useState } from 'react';
import { IoIosInfinite } from 'react-icons/io';

interface IAssetResponse extends IResponse {
  data: {
    assets: IAsset[];
  };
  pagination: IPagination;
}

const Assets: React.FC = () => {
  const router = useRouter();
  const [filterAssets, fetchPartialAsset, loading, setLoading] =
    useFetchPartialAsset();
  const [query, setQuery] = useState<NextParsedUrlQuery>({});

  useEffect(() => {
    if (!router.isReady) return;
    setQuery(router.query);
  }, [router.isReady]);

  const handleSelected = (selected: string, filterType: string): void => {
    if (selected === 'All') {
      const updatedQuery = { ...query };
      delete updatedQuery[filterType];
      setQuery(updatedQuery);
    } else if (filterType === 'type') {
      setQuery({ ...query, [filterType]: selected });
    } else if (selected !== query[filterType]) {
      setQuery({ ...query, [filterType]: selected });
    }
  };

  const filters: IFilter[] = [
    {
      title: 'Asset',
      data: filterAssets.map(asset => asset.assetId),
      onClick: value => handleSelected(value, 'asset'),
      onChange: async value => {
        setLoading(true);
        await fetchPartialAsset(value);
      },
      current: query.asset as string | undefined,
      loading,
    },
    {
      title: 'Asset Type',
      data: ['Fungible', 'NonFungible'],
      onClick: value => handleSelected(value, 'type'),
      inputType: 'button',
      current: query.type as string | undefined,
      loading,
    },
  ];

  const requestAssets = async (page: number, limit: number) => {
    const localQuery = { ...query, page, limit };
    return api.get({
      route: `assets/kassets`,
      query: localQuery,
    });
  };

  useEffect(() => {
    const changeUrl = async () => {
      router.push(
        {
          pathname: router.pathname,
          query: query,
        },
        undefined,
        {
          shallow: true,
        },
      );
    };
    changeUrl();
  }, [query]);

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
            <a>
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
          <Link href={`/asset/${assetId}`} key={assetId}>
            <a>
              <p
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {name}
              </p>
            </a>
          </Link>
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
        <HeaderContainer>
          <Title title="Assets" Icon={Icon} />
          <FilterContainer>
            {filters.map(filter => (
              <Filter key={JSON.stringify(filter)} {...filter} />
            ))}
          </FilterContainer>
        </HeaderContainer>
      </Header>
      <Table {...tableProps} />
    </Container>
  );
};

export default Assets;
