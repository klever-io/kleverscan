import { Accounts as Icon } from '@/assets/title-icons';
import Title from '@/components/Layout/Title';
import ActiveFilter from '@/components/SmartContractsList/ActiveFilter';
import { RIGHT_ALIGNED_COLUMNS } from '@/components/SmartContractsList/columns';
import ContractsFilters from '@/components/SmartContractsList/Filters';
import ContractsMobileCard, {
  type IContractsMobileCardExtras,
} from '@/components/SmartContractsList/MobileCard';
import MostUsed from '@/components/SmartContractsList/MostUsed';
import { contractRowSections } from '@/components/SmartContractsList/rows';
import { ContractsTableWrapper } from '@/components/SmartContractsList/styles';
import ContractsSummary from '@/components/SmartContractsList/Summary';
import { useContractHeaders } from '@/components/SmartContractsList/useContractHeaders';
import Table, { ITable } from '@/components/Table';
import { useDeferred } from '@/components/DataList/useDeferred';
import { smartContractsTableRequest } from '@/services/requests/smartContracts';
import { Container, Header } from '@/styles/common';
import { SmartContractsList } from '@/types/smart-contract';
import { isKVMAvailable } from '@/utils/kvm';
import { getNetwork } from '@/utils/networkFunctions';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { PropsWithChildren } from 'react';
import nextI18nextConfig from '../../../next-i18next.config';

const SmartContracts: React.FC<PropsWithChildren> = () => {
  const router = useRouter();
  const header = useContractHeaders();
  const { t } = useTranslation(['common', 'smartContracts']);

  // Once here, not per row: every cell calling this would open its own
  // subscription to the query cache's fetch counter. It gates the per-row name
  // and deployer-count lookups so they stay behind the rows themselves.
  const deferred = useDeferred();

  const tableProps: ITable<IContractsMobileCardExtras> = {
    type: 'smartContracts',
    header,
    rowSections: (contract: SmartContractsList | string) =>
      contractRowSections(contract, { deferred }),
    dataName: 'sc',
    request: (page, limit) =>
      smartContractsTableRequest(page, limit, router.query),
    Filters: ContractsFilters,
    MobileCard: ContractsMobileCard,
    mobileCardProps: { deferred },
    singleLineSkeleton: true,
    rightAlignedSkeletonColumns: RIGHT_ALIGNED_COLUMNS,
    // The chip's second spot, beside the page-size controls; the filter bar
    // holds the other. The page skin shows whichever the bar's direction
    // leaves room for.
    TableControl: <ActiveFilter />,
  };

  return (
    <Container>
      <Header>
        <Title title={t('common:Titles.Smart Contracts')} Icon={Icon} />
      </Header>

      <ContractsSummary />

      <MostUsed />

      <ContractsTableWrapper>
        <Table {...tableProps} />
      </ContractsTableWrapper>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  const network = getNetwork();
  if (!isKVMAvailable(network)) {
    return {
      notFound: true,
    };
  }
  const props = await serverSideTranslations(
    locale,
    ['common', 'smartContracts', 'table'],
    nextI18nextConfig,
    ['en'],
  );
  return { props };
};

export default SmartContracts;
