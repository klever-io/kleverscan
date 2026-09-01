import { AssetSummary } from '@/components/Asset/AssetSummary';
import { AssetTabs } from '@/components/Asset/AssetTabs';
import Tabs, { ITabs } from '@/components/NewTabs';
import { ITable } from '@/components/Table';
import TransactionsMobileCard from '@/components/TransactionsList/MobileCard';
import TransactionsTable from '@/components/TransactionsList/Table';
import { useTransactionHeaders } from '@/components/TransactionsList/useTransactionHeaders';
import Holders from '@/components/Tabs/Holders';
import TransactionsFilters from '@/components/TransactionsFilters';
import api from '@/services/api';
import { assetCall, assetPoolCall, ITOCall } from '@/services/requests/asset';
import { AssetTypeString } from '@/types/assets';
import { IAssetPage } from '@/types/index';
import { setQueryAndRouter } from '@/utils';
import { getParsedTransactionPrecision } from '@/utils/precisionFunctions';
import { AssetPageContainer } from '@/views/assets';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, {
  PropsWithChildren,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useQuery } from '@tanstack/react-query';
import nextI18nextConfig from '../../../next-i18next.config';
import { useTransactionRowSections } from '../transactions';

const Asset: React.FC<PropsWithChildren<IAssetPage>> = ({}) => {
  const router = useRouter();
  const { t } = useTranslation(['common', 'assets']);
  const transactionHeaders = useTransactionHeaders();

  // Unlike the two lookups below, assetCall answers undefined only when the
  // request failed, so it keeps React Query's retry rather than reporting a
  // failure as a successful "no asset".
  const { data: asset } = useQuery({
    queryKey: [`asset`, router.query.asset],
    queryFn: () => assetCall(router),
    enabled: !!router?.isReady,
  });

  // These two answer undefined only for a legitimate negative: no ITO, no
  // pool, or an ITO that is inactive or outside its window. Real failures now
  // throw out of the helper and reach React Query as errors. React Query
  // rejects an undefined result outright as "data is undefined", so null
  // carries that negative as a successful answer and the components keep
  // receiving undefined.
  const { data: ITOData } = useQuery({
    queryKey: [`ITOasset`, router.query.asset],
    queryFn: async () => (await ITOCall(router.query.asset as string)) ?? null,
    enabled: !!router?.isReady,
  });
  const ITO = ITOData ?? undefined;

  const { data: assetPoolData } = useQuery({
    queryKey: [`assetPool`, router.query.asset],
    queryFn: async () =>
      (await assetPoolCall(router.query.asset as string)) ?? null,
    enabled: !!router?.isReady,
  });
  const assetPool = assetPoolData ?? undefined;
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
    // Also keyed on the asset: the page persists across asset-to-asset
    // navigation now, and a kept Holders tab does not exist on an SFT.
  }, [router.isReady, router.query.asset]);

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

  const rowSections = useTransactionRowSections();

  const tableProps: ITable = {
    type: 'transactions',
    header: transactionHeaders,
    rowSections,
    dataName: 'transactions',
    request: (page, limit) => requestTransactions(page, limit),
    Filters: TransactionsFilters,
    MobileCard: TransactionsMobileCard,
    singleLineSkeleton: true,
  };

  // Rendered as elements, not as a component built during render: a fresh
  // component identity remounts the whole tab, restarting its loading state
  // and animations whenever the asset query resolves.
  const renderSelectedTab = (): ReactNode => {
    switch (selectedTab) {
      case `${t('common:Titles.Transactions')}`:
        return <TransactionsTable {...tableProps} />;
      case `${t('common:Tabs.Holders')}`:
        if (asset && asset.assetType !== AssetTypeString.SemiFungible) {
          return <Holders asset={asset} />;
        }
      default:
        return <div />;
    }
  };

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
        key={String(router.query.asset)}
        asset={asset}
        ITO={ITO}
        assetPool={assetPool}
        defaultCard={(router.query.card as string) || undefined}
        onCardChange={card =>
          setQueryAndRouter({ ...router.query, card }, router)
        }
      />

      <Tabs {...tabProps}>{renderSelectedTab()}</Tabs>
    </AssetPageContainer>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  const props = await serverSideTranslations(
    locale,
    ['common', 'assets', 'table', 'transactions'],
    nextI18nextConfig,
    ['en'],
  );

  return { props };
};

export default Asset;
