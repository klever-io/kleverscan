import { TransactionDetails as Icon } from '@/assets/title-icons';
import { NonFungibleView } from '@/components/Asset/NonFungibleView';
import { SemiFungibleView } from '@/components/Asset/SemiFungibleView';
import Title from '@/components/Layout/Title';
import { ITable } from '@/components/Table';
import TransactionsFilters from '@/components/TransactionsFilters';
import { transactionRowSections } from '@/pages/transactions';
import api from '@/services/api';
import { requestNonceDetails } from '@/services/requests/asset/nonce';
import { Container, Header, SpacedContainer } from '@/styles/common';
import { transactionTableHeaders } from '@/utils/contracts';
import { getParsedTransactionPrecision } from '@/utils/precisionFunctions';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';
import { useQuery } from 'react-query';
import nextI18nextConfig from '../../../../next-i18next.config';
import { AssetTitle } from '@/components/Asset/AssetSummary/AssetTitle';

const AssetNonce: React.FC<PropsWithChildren> = () => {
  const { t } = useTranslation(['common', 'assets']);
  const router = useRouter();
  const assetId = router.query.asset as string;
  const nonceValue = router.query.nonce as string;

  const { data: nonceData, isLoading: isLoadingNonce } = useQuery({
    queryKey: [`nftDetail-${assetId}-${nonceValue}`, assetId, nonceValue],
    queryFn: () => requestNonceDetails(assetId, nonceValue),
    enabled: !!router?.isReady && !!assetId && !!nonceValue,
  });

  const isNonFungible = nonceData?.assetType === 'NonFungible';
  const isSemiFungible = nonceData?.assetType === 'SemiFungible';

  const requestTransactions = async (page: number, limit: number) => {
    const newQuery = {
      asset: `${assetId}/${nonceValue}`,
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

  return (
    <>
      <SpacedContainer>
        <Header>
          <AssetTitle asset={nonceData} />
        </Header>

        {(isNonFungible || isLoadingNonce) && (
          <NonFungibleView
            assetId={assetId}
            nonceValue={nonceValue}
            nonceData={nonceData}
            isLoadingNonce={isLoadingNonce}
            tableProps={tableProps}
          />
        )}

        {isSemiFungible && <SemiFungibleView tableProps={tableProps} />}
      </SpacedContainer>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  const props = await serverSideTranslations(
    locale,
    ['common', 'assets'],
    nextI18nextConfig,
    ['en'],
  );

  return { props };
};

export default AssetNonce;
