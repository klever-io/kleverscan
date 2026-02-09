import { AssetSummary } from '@/components/Asset/AssetSummary';
import { AssetTabs } from '@/components/Asset/AssetTabs';
import Tabs, { ITabs } from '@/components/NewTabs';
import Table, { ITable } from '@/components/Table';
import Holders from '@/components/Tabs/Holders';
import TransactionsFilters from '@/components/TransactionsFilters';
import api from '@/services/api';
import { assetCall, assetPoolCall, ITOCall } from '@/services/requests/asset';
import { AssetTypeString } from '@/types/assets';
import { IAssetPage } from '@/types/index';
import { setQueryAndRouter } from '@/utils';
import { transactionTableHeaders } from '@/utils/contracts';
import { getParsedTransactionPrecision } from '@/utils/precisionFunctions';
import { AssetPageContainer } from '@/views/assets';
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
import { useQuery } from '@tanstack/react-query';
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

  const initialQueryState = {
    ...router.query,
  };

  useEffect(() => {
    if (router?.isReady) {
      setQueryAndRouter(initialQueryState, router);
      setSelectedTab((router.query.tab as string) || getTableHeaders()[0]);
    }
  }, [router.isReady]);

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
      <AssetTabs
        asset={asset}
        ITO={ITO}
        assetPool={assetPool}
        defaultCard={(router.query.card as string) || undefined}
        onCardChange={card =>
          setQueryAndRouter({ ...router.query, card }, router)
        }
      />

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
