import { useDeferred } from '@/components/DataList/useDeferred';
import { RIGHT_ALIGNED_COLUMNS } from '@/components/SmartContractsList/columns';
import ContractsFilters from '@/components/SmartContractsList/Filters';
import ContractsMobileCard, {
  type IContractsMobileCardExtras,
} from '@/components/SmartContractsList/MobileCard';
import { contractRowSections } from '@/components/SmartContractsList/rows';
import { ContractsTableWrapper } from '@/components/SmartContractsList/styles';
import { useContractHeaders } from '@/components/SmartContractsList/useContractHeaders';
import Table, { ITable } from '@/components/Table';
import { IInnerTableProps } from '@/types';
import { SmartContractsList } from '@/types/smart-contract';
import React, { PropsWithChildren } from 'react';

interface ISCDeployedByAddress {
  smartContractsTableProps: IInnerTableProps;
}

/**
 * The contracts one account deployed, as a tab on its page.
 *
 * Shares the list page's columns, rows and skin rather than carrying a second
 * copy of them: it is the same endpoint with the deployer already fixed, and
 * the copy it used to hold had already drifted into a fifth two-line table.
 */
const SCDeployedByAddress: React.FC<
  PropsWithChildren<ISCDeployedByAddress>
> = ({ smartContractsTableProps }) => {
  const header = useContractHeaders();
  const deferred = useDeferred();

  const tableProps: ITable<IContractsMobileCardExtras> = {
    ...smartContractsTableProps,
    type: 'smartContracts',
    header,
    rowSections: (contract: SmartContractsList | string) =>
      contractRowSections(contract, { deferred }),
    dataName: 'sc',
    showLimit: true,
    Filters: ContractsFilters,
    MobileCard: ContractsMobileCard,
    mobileCardProps: { deferred },
    singleLineSkeleton: true,
    rightAlignedSkeletonColumns: RIGHT_ALIGNED_COLUMNS,
  };

  return (
    <ContractsTableWrapper>
      <Table {...tableProps} />
    </ContractsTableWrapper>
  );
};

export default SCDeployedByAddress;
