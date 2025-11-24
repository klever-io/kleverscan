import { Assets as Icon } from '@/assets/title-icons';
import AssetsPools from '@/components/AssetsPools';
import Copy from '@/components/Copy';
import Filter, { IFilter } from '@/components/Filter';
import Title from '@/components/Layout/Title';
import AssetLogo from '@/components/Logo/AssetLogo';
import Table, { ITable } from '@/components/Table';
import Tabs, { ITabs } from '@/components/Tabs';
import { FilterContainer } from '@/components/TransactionsFilters/styles';
import { requestAssetsQuery } from '@/services/requests/assets';
import { CenteredRow, Container, DoubleRow, Header } from '@/styles/common';
import { IAsset, IRowSection } from '@/types/index';
import { setQueryAndRouter } from '@/utils';
import { formatAmount } from '@/utils/formatFunctions';
import { useFetchPartial } from '@/utils/hooks';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { IoIosInfinite } from 'react-icons/io';
import nextI18nextConfig from '../../../next-i18next.config';

const AssetsFilters: React.FC<PropsWithChildren> = () => {
  const router = useRouter();
  const { t } = useTranslation(['common', 'assets', 'table']);

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
      title: `${t('common:Titles.Assets')}`,
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
      title: `${t('common:Buttons.Asset Type')}`,
      data: [`Fungible`, `NonFungible`, `SemiFungible`],
      onClick: value => handleSelected(value, 'type'),
      inputType: 'button',
      current: (router.query.type as string) || undefined,
      loading,
      isHiddenInput: false,
    },
  ];

  return (
    <FilterContainer>
      {filters.map(filter => (
        <Filter key={filter.title} {...filter} />
      ))}
    </FilterContainer>
  );
};

const Assets: React.FC<PropsWithChildren> = () => {
  const router = useRouter();
  const { t } = useTranslation(['common', 'assets', 'table']);

  const header = [
    '',
    'Token Name/ID',
    `Type/Precision`,
    `Circulating/Maximum Supply`,
    `Initial Supply/Total Staked`,
    `${t('table:RewardsType')}`,
  ];

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
        <span>
          {maxSupply !== 0 ? (
            formatAmount(maxSupply / 10 ** precision)
          ) : (
            <IoIosInfinite />
          )}
        </span>
      );
    };

    const sections: IRowSection[] = [
      {
        element: props => (
          <Link href={`/asset/${assetId}`} key={assetId}>
            <AssetLogo
              logo={logo}
              ticker={ticker}
              name={name}
              verified={verified}
              size={36}
            />
          </Link>
        ),
        span: 1,
        width: 50,
      },
      {
        element: props => (
          <DoubleRow {...props} key={assetId}>
            <Link href={`/asset/${assetId}`} key={assetId}>
              {name}
            </Link>

            <CenteredRow>
              <Link href={`/asset/${assetId}`} key={assetId} legacyBehavior>
                {assetId}
              </Link>
              <Copy info="Asset ID" data={assetId} />
            </CenteredRow>
          </DoubleRow>
        ),
        span: 1,
      },

      {
        element: props => (
          <DoubleRow {...props} key={assetType + precision}>
            <span key={assetType}>{assetType}</span>
            <span key={precision}>
              {precision} decimal{precision > 1 && 's'}
            </span>
          </DoubleRow>
        ),

        span: 1,
      },
      {
        element: props => (
          <DoubleRow {...props}>
            <span key={circulatingSupply}>
              {formatAmount(circulatingSupply / 10 ** precision)} {ticker}
            </span>
            <span key={maxSupply}>
              {renderMaxSupply()} {ticker}
            </span>
          </DoubleRow>
        ),
        span: 1,
      },
      {
        element: props => (
          <DoubleRow
            {...props}
            key={initialSupply + String(staking?.totalStaked)}
          >
            <span key={initialSupply}>
              {formatAmount(initialSupply / 10 ** precision)} {ticker}
            </span>
            <span key={String(staking?.totalStaked)}>
              {staking?.totalStaked
                ? formatAmount(staking.totalStaked / 10 ** precision)
                : 0}
            </span>
          </DoubleRow>
        ),
        span: 1,
      },
      {
        element: props => (
          <span>
            {staking
              ? staking?.interestType === 'APRI'
                ? 'APR'
                : 'FPR'
              : '--'}
          </span>
        ),
        span: 1,
      },
    ];

    return sections;
  };

  const tableProps: ITable = {
    rowSections,
    header,
    type: 'assetsPage',
    request: (page, limit) => requestAssetsQuery(page, limit, router),
    dataName: 'assets',
    Filters: AssetsFilters,
  };

  const tableHeaders = [
    `${t('common:Titles.Overview')}`,
    `${t('common:Titles.Pools')}`,
  ];
  const [selectedTab, setSelectedTab] = useState(tableHeaders[0]);

  const tabProps: ITabs = {
    headers: tableHeaders,
    onClick: header => {
      setSelectedTab(header),
        setQueryAndRouter({ ...router.query, tab: header }, router);
    },
  };

  const SelectedTabComponent: React.FC<PropsWithChildren> = () => {
    switch (selectedTab) {
      case `${t('common:Titles.Overview')}`:
        return (
          <>
            <Header>
              <Title title={t('common:Titles.Assets')} Icon={Icon} />
            </Header>

            <Table {...tableProps} />
          </>
        );
      case `${t('common:Titles.Pools')}`:
        return <AssetsPools />;
      default:
        return <div />;
    }
  };

  useEffect(() => {
    if (!router.isReady) return;
    setSelectedTab((router.query.tab as string) || tableHeaders[0]);
  }, [router.isReady]);

  return (
    <Container>
      <Tabs {...tabProps}>
        <SelectedTabComponent />
      </Tabs>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  const props = await serverSideTranslations(
    locale,
    ['common', 'assets', 'table'],
    nextI18nextConfig,
    ['en'],
  );

  return { props };
};

export default Assets;
