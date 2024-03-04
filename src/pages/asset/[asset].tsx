import { AssetSummary } from '@/components/Asset/AssetSummary';
import { ITOTab } from '@/components/Asset/ITOTab';
import { KDAPoolTab } from '@/components/Asset/KDAPoolTab';
import { MoreTab } from '@/components/Asset/MoreTab';
import { OverviewTab } from '@/components/Asset/OverviewTab';
import { StakingHistoryTab } from '@/components/Asset/StakingHistoryTab';
import { StakingRoyaltiesTab } from '@/components/Asset/StakingRoyaltiesTab';
import { UrisTab } from '@/components/Asset/URIsTab';
import DateFilter, { ISelectedDays } from '@/components/DateFilter';
import Tabs, { ITabs } from '@/components/NewTabs';
import Holders from '@/components/Tabs/Holders';
import Transactions from '@/components/Tabs/Transactions';
import TransactionsFilters from '@/components/TransactionsFilters';
import {
  ContainerFilter,
  RightFiltersContent,
  TxsFiltersWrapper,
} from '@/components/TransactionsFilters/styles';
import api from '@/services/api';
import { assetCall, assetPoolCall, ITOCall } from '@/services/requests/asset';
import { CardHeader, CardTabContainer } from '@/styles/common';
import { IAssetPage, IBalance } from '@/types/index';
import { setQueryAndRouter } from '@/utils';
import { filterDate } from '@/utils/formatFunctions';
import { parseHolders } from '@/utils/parseValues';
import { resetDate } from '@/utils/resetDate';
import {
  AssetCardContent,
  AssetCardHeaderItem,
  AssetPageContainer,
} from '@/views/assets';
import { FilterByDate } from '@/views/transactions';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import nextI18nextConfig from '../../../next-i18next.config';

const Asset: React.FC<IAssetPage> = ({}) => {
  const router = useRouter();
  const { t } = useTranslation(['common', 'assets']);

  const { data: asset } = useQuery({
    queryKey: [`asset`, router.query.asset],
    queryFn: () => assetCall(router),
    enabled: !!router?.isReady,
  });

  const { data: ITO } = useQuery({
    queryKey: [`ITOasset`, router.query.asset],
    queryFn: () => ITOCall(router.query.asset as string),
    enabled: !!router?.isReady,
  });

  const { data: assetPool } = useQuery({
    queryKey: [`assetPool`, router.query.asset],
    queryFn: () => assetPoolCall(router.query.asset as string),
    enabled: !!router?.isReady,
  });
  const tableHeaders = [
    `${t('common:Titles.Transactions')}`,
    `${t('common:Tabs.Holders')}`,
  ];
  const [selectedTab, setSelectedTab] = useState<null | string>(null);

  const [holderQuery, setHolderQuery] = useState<string>('');
  const cardHeaders = [
    `${t('common:Tabs.Overview')}`,
    `${t('common:Tabs.More')}`,
  ];
  asset?.uris && cardHeaders.push('URIS');
  assetPool && cardHeaders.push('KDA Pool');
  ITO && cardHeaders.push('ITO');
  cardHeaders.push('Staking & Royalties');
  if (asset?.staking?.interestType === 'FPRI') {
    asset?.staking && cardHeaders.push('Staking History');
  }

  const [selectedCard, setSelectedCard] = useState(cardHeaders[0]);

  const initialQueryState = {
    ...router.query,
  };

  useEffect(() => {
    if (router?.isReady) {
      setQueryAndRouter(initialQueryState, router);
      setSelectedTab((router.query.tab as string) || tableHeaders[0]);
      setSelectedCard((router.query.card as string) || cardHeaders[0]);
      setHolderQuery(router.query.sortBy as string);
    }
  }, [router.isReady]);

  useEffect(() => {
    if (selectedTab !== 'Transactions' && selectedTab) {
      setQueryAndRouter({ ...router.query, sortBy: holderQuery }, router);
    }
  }, [holderQuery]);

  const requestTransactions = async (page: number, limit: number) => {
    const newQuery = { ...router.query, asset: asset?.assetId || '' };
    return await api.get({
      route: `transaction/list`,
      query: { page, limit, ...newQuery },
    });
  };

  const filterQueryDate = (selectedDays: ISelectedDays) => {
    const getFilteredDays = filterDate(selectedDays);
    setQueryAndRouter({ ...router.query, ...getFilteredDays }, router);
  };

  const resetQueryDate = () => {
    const newQuery = resetDate(router.query);
    setQueryAndRouter({ ...router.query, ...newQuery }, router);
  };

  const requestAssetHolders = async (page: number, limit: number) => {
    let newQuery = {
      ...router.query,
      sortBy: holderQuery?.toLowerCase() || '',
    };
    if (holderQuery === 'Total Balance') {
      newQuery = { ...router.query, sortBy: 'total' || '' };
    }
    if (asset) {
      const response = await api.get({
        route: `assets/holders/${asset.assetId}`,
        query: { page, limit, ...newQuery },
      });

      let parsedHolders: IBalance[] = [];
      if (!response.error) {
        const holders = response.data.accounts;
        parsedHolders = parseHolders(
          holders,
          asset.assetId,
          response.pagination,
        );
      }

      return { ...response, data: { accounts: parsedHolders } };
    }
    return { data: { accounts: [] } };
  };

  const SelectedComponent: React.FC = () => {
    switch (selectedCard) {
      case `${t('common:Tabs.Overview')}`:
        return <OverviewTab asset={asset} />;
      case `${t('common:Tabs.More')}`:
        return <MoreTab asset={asset} />;
      case 'URIS':
        return <UrisTab asset={asset} />;
      case 'Staking & Royalties':
        return (
          <StakingRoyaltiesTab
            asset={asset}
            setSelectedCard={setSelectedCard}
          />
        );
      case 'ITO':
        return <ITOTab ITO={ITO} />;
      case 'KDA Pool':
        return <KDAPoolTab asset={asset} assetPool={assetPool} />;
      case 'Staking History':
        return <StakingHistoryTab staking={asset?.staking} asset={asset} />;
      default:
        return <div />;
    }
  };

  const transactionsTableProps = {
    scrollUp: false,
    dataName: 'transactions',
    request: (page: number, limit: number) => requestTransactions(page, limit),
    query: router.query,
  };

  const holdersTableProps = {
    scrollUp: false,
    dataName: 'accounts',
    request: (page: number, limit: number) => requestAssetHolders(page, limit),
  };

  const SelectedTabComponent: React.FC = () => {
    switch (selectedTab) {
      case `${t('common:Titles.Transactions')}`:
        return <Transactions transactionsTableProps={transactionsTableProps} />;
      case `${t('common:Tabs.Holders')}`:
        if (asset) {
          return (
            <Holders
              asset={asset}
              holdersTableProps={holdersTableProps}
              setHolderQuery={setHolderQuery}
              holderQuery={holderQuery}
            />
          );
        }
      default:
        return <div />;
    }
  };

  const dateFilterProps = {
    resetDate: resetQueryDate,
    filterDate: filterQueryDate,
  };
  const transactionsFiltersProps = {
    query: router.query,
    setQuery: setQueryAndRouter,
  };
  const tabProps: ITabs = {
    headers: tableHeaders,
    onClick: header => {
      setSelectedTab(header);
      const updatedQuery = { ...router.query };
      delete updatedQuery.sortBy;
      delete updatedQuery.page;
      delete updatedQuery.limit;
      setQueryAndRouter({ ...updatedQuery, tab: header }, router);
    },
    dateFilterProps,
    showDataFilter: false,
  };

  return (
    <AssetPageContainer>
      <AssetSummary asset={asset} ITO={ITO} />
      <CardTabContainer>
        <CardHeader>
          {cardHeaders.map((header, index) => (
            <AssetCardHeaderItem
              key={String(index)}
              selected={selectedCard === header}
              onClick={() => {
                setSelectedCard(header);
                setQueryAndRouter({ ...router.query, card: header }, router);
              }}
            >
              <span>{header}</span>
            </AssetCardHeaderItem>
          ))}
        </CardHeader>

        <AssetCardContent>
          <SelectedComponent />
        </AssetCardContent>
      </CardTabContainer>

      <Tabs {...tabProps}>
        {selectedTab === `${t('common:Titles.Transactions')}` && (
          <TxsFiltersWrapper>
            <ContainerFilter>
              <TransactionsFilters
                disabledInput={true}
                {...transactionsFiltersProps}
              ></TransactionsFilters>
              <RightFiltersContent>
                <FilterByDate>
                  <DateFilter {...dateFilterProps} />
                </FilterByDate>
              </RightFiltersContent>
            </ContainerFilter>
          </TxsFiltersWrapper>
        )}
        <SelectedTabComponent />
      </Tabs>
    </AssetPageContainer>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  const props = await serverSideTranslations(
    locale,
    ['common', 'assets', 'table'],
    nextI18nextConfig,
  );

  return { props };
};

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export default Asset;
