import { AssetSummary } from '@/components/Asset/AssetSummary';
import { ITOTab } from '@/components/Asset/ITOTab';
import { KDAPoolTab } from '@/components/Asset/KDAPoolTab';
import { MoreTab } from '@/components/Asset/MoreTab';
import { OverviewTab } from '@/components/Asset/OverviewTab';
import { StakingHistoryTab } from '@/components/Asset/StakingHistoryTab';
import { StakingRoyaltiesTab } from '@/components/Asset/StakingRoyaltiesTab';
import { UrisTab } from '@/components/Asset/URIsTab';
import Tabs, { ITabs } from '@/components/NewTabs';
import Table, { ITable } from '@/components/Table';
import Holders from '@/components/Tabs/Holders';
import TransactionsFilters from '@/components/TransactionsFilters';
import api from '@/services/api';
import { assetCall, assetPoolCall, ITOCall } from '@/services/requests/asset';
import { CardHeader, CardHeaderItem, CardTabContainer } from '@/styles/common';
import { AssetTypeString } from '@/types/assets';
import { IAssetPage } from '@/types/index';
import { setQueryAndRouter } from '@/utils';
import { transactionTableHeaders } from '@/utils/contracts';
import { getParsedTransactionPrecision } from '@/utils/precisionFunctions';
import { AssetCardContent, AssetPageContainer } from '@/views/assets';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useQuery } from 'react-query';
import nextI18nextConfig from '../../../next-i18next.config';
import { transactionRowSections } from '../transactions';

const Asset: React.FC<PropsWithChildren<IAssetPage>> = ({}) => {
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
  const getTableHeaders = useCallback(() => {
    let tableHeaders = [`${t('common:Titles.Transactions')}`];
    if (asset && asset.assetType !== AssetTypeString.SemiFungible) {
      tableHeaders.push(`${t('common:Tabs.Holders')}`);
    }
    return tableHeaders;
  }, [t, asset]);

  const [selectedTab, setSelectedTab] = useState<null | string>(null);

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
      setSelectedTab((router.query.tab as string) || getTableHeaders()[0]);
      setSelectedCard((router.query.card as string) || cardHeaders[0]);
    }
  }, [router.isReady]);

  const SelectedComponent: React.FC<PropsWithChildren> = useCallback(() => {
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
  }, [selectedCard, asset, ITO, assetPool, t]);

  const requestTransactions = async (page: number, limit: number) => {
    const newQuery = {
      ...router.query,
      asset: router.query.asset || '',
      page,
      limit,
    };

    const transactionsResponse = await api.get({
      route: `transaction/list`,
      query: newQuery,
    });

    const parsedTransactions =
      await getParsedTransactionPrecision(transactionsResponse);

    return {
      ...transactionsResponse,
      data: {
        transactions: parsedTransactions,
      },
    };
  };

  const tableProps: ITable = {
    type: 'transactions',
    header: transactionTableHeaders,
    rowSections: transactionRowSections,
    dataName: 'transactions',
    request: (page, limit) => requestTransactions(page, limit),
    Filters: TransactionsFilters,
  };

  const SelectedTabComponent: React.FC<PropsWithChildren> = useCallback(() => {
    switch (selectedTab) {
      case `${t('common:Titles.Transactions')}`:
        return <Table {...tableProps} />;
      case `${t('common:Tabs.Holders')}`:
        if (asset && asset.assetType !== AssetTypeString.SemiFungible) {
          return <Holders asset={asset} />;
        }
      default:
        return <div />;
    }
  }, [selectedTab, asset]);

  const tabProps: ITabs = {
    headers: getTableHeaders(),
    onClick: header => {
      setSelectedTab(header);
      const updatedQuery = { ...router.query };
      delete updatedQuery.sortBy;
      delete updatedQuery.page;
      delete updatedQuery.limit;
      setQueryAndRouter({ ...updatedQuery, tab: header }, router);
    },
    showDataFilter: false,
  };

  return (
    <AssetPageContainer>
      <AssetSummary asset={asset} ITO={ITO} />
      <CardTabContainer>
        <CardHeader>
          {cardHeaders.map((header, index) => (
            <CardHeaderItem
              key={String(index)}
              selected={selectedCard === header}
              onClick={() => {
                setSelectedCard(header);
                setQueryAndRouter({ ...router.query, card: header }, router);
              }}
            >
              <span>{header}</span>
            </CardHeaderItem>
          ))}
        </CardHeader>

        <AssetCardContent>
          <SelectedComponent />
        </AssetCardContent>
      </CardTabContainer>

      <Tabs {...tabProps}>
        <SelectedTabComponent />
      </Tabs>
    </AssetPageContainer>
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

export default Asset;
