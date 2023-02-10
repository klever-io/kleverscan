import { Assets as Icon } from '@/assets/title-icons';
import Filter, { IFilter } from '@/components/Filter';
import Title from '@/components/Layout/Title';
import AssetLogo from '@/components/Logo/AssetLogo';
import Table, { ITable } from '@/components/Table';
import { FilterContainer } from '@/components/TransactionsFilters/styles';
import api from '@/services/api';
import { IAsset, IPagination, IResponse, IRowSection } from '@/types/index';
import { useFetchPartialAsset } from '@/utils/hooks';
import { formatAmount, parseHardCodedInfo } from '@/utils/index';
import { Container, Header, HeaderContainer, Input } from '@/views/assets';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useState } from 'react';
import { IoIosInfinite } from 'react-icons/io';

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

const Assets: React.FC<IAssetPage> = ({ assets, pagination }) => {
  const router = useRouter();
  const [filterToken, setFilterToken] = useState(router.query.asset || 'All');

  const [filterAssets, fetchPartialAsset, loading, setLoading] =
    useFetchPartialAsset();

  const filters: IFilter[] = [
    {
      title: 'Asset',
      data: filterAssets.map(asset => asset.assetId),
      onClick: value => setFilterToken(value),
      onChange: async value => {
        setLoading(true);
        await fetchPartialAsset(value);
      },
      current: (filterToken as string) || undefined,
      loading,
    },
  ];

  const requestAssets = async (page: number, limit: number) => {
    if (filterToken === 'All' || filterToken === undefined) {
      const res: IAssetResponse = await api.getCached({
        route: `assets/kassets?hidden=false&page=${page}&limit=${limit}`,
        refreshTime: 21600,
      });
      return res;
    } else {
      return api.getCached({
        route: `assets/kassets?hidden=false&asset=${filterToken}&page=${page}&limit=${limit}`,
        refreshTime: 21600,
      });
    }
  };

  useEffect(() => {
    const changeUrl = async () => {
      if (filterToken === 'All') {
        router.push({ pathname: router.pathname, query: '' }, undefined, {
          shallow: true,
        });

        const assets: IAssetResponse = await api.getCached({
          route: 'assets/kassets?hidden=false',
          refreshTime: 21600,
        });
        filters[0].data = assets?.data?.assets?.map(asset => asset.assetId);
      } else {
        router.push(
          {
            pathname: router.pathname,
            query: `asset=${filterToken}`,
          },
          undefined,
          {
            shallow: true,
          },
        );
      }
    };
    changeUrl();
  }, [filterToken]);

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
          <Link href={`/asset/${assetId}`} key={assetId}>
            {assetId}
          </Link>
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
    data: assets as any[],
    header,
    type: 'assetsPage',
    request: (page, limit) => requestAssets(page, limit),
    dataName: 'assets',
    scrollUp: true,
    totalPages: pagination?.totalPages || 1,
  };

  return (
    <Container>
      <Header>
        <HeaderContainer>
          <Title title="Assets" Icon={Icon} />
          <FilterContainer>
            {filters.map((filter, index) => (
              <Filter key={String(filter)} {...filter} />
            ))}
          </FilterContainer>
        </HeaderContainer>

        <Input />
      </Header>

      <Table {...tableProps} />
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const props: IAssetPage = { assets: [], pagination: {} as IPagination };
  let assets: IAssetResponse;

  if (context.query.asset) {
    assets = await api.getCached({
      route: `assets/kassets?hidden=false&asset=${context.query.asset}`,
      refreshTime: 21600,
    });
  } else {
    assets = await api.getCached({
      route: 'assets/kassets?hidden=false',
      refreshTime: 21600,
    });
  }
  if (!assets.error) {
    props.assets = assets.data.assets;
    props.pagination = assets.pagination;
  }

  props.pagination = assets?.pagination || {};

  props.assets = parseHardCodedInfo(props.assets);

  return { props };
};

export default Assets;
