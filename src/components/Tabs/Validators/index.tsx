import { PropsWithChildren, useMemo } from 'react';
import CopyAction from '@/components/DataList/CopyAction';
import Table, { ITable } from '@/components/Table';
import { fetchAllValidators } from '@/services/requests/validators';
import { IPaginatedResponse, IRowSection } from '@/types/index';
import { parseAddress } from '@/utils/parseValues';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import ValidatorsMobileCard from './MobileCard';
import { buildBlockValidatorPage } from './page';
import { IBlockValidatorRow } from './row';
import {
  LeaderBadge,
  NameLine,
  ValidatorAddress,
  ValidatorKeyLink,
  ValidatorLine,
  ValidatorNameLink,
  ValidatorsTableWrapper,
} from './styles';

interface IValidatorsProps {
  validators: string[];
  producerOwnerAddress?: string;
}

const DIRECTORY_STALE_MS = 5 * 60 * 1000;

const NameCell: React.FC<{ row: IBlockValidatorRow }> = ({ row }) => {
  const label =
    row.name ||
    (row.ownerAddress ? parseAddress(row.ownerAddress, 16) : 'Unknown');
  if (!row.ownerAddress) {
    return <ValidatorAddress title={row.blsKey}>{label}</ValidatorAddress>;
  }
  return (
    <NameLine>
      <ValidatorNameLink
        href={`/validator/${row.ownerAddress}`}
        title={row.name || row.ownerAddress}
        data-testid="validator-link"
      >
        {label}
      </ValidatorNameLink>
      {row.leader && (
        <LeaderBadge $variant="accent" data-testid="block-leader">
          Leader
        </LeaderBadge>
      )}
    </NameLine>
  );
};

const KeyCell: React.FC<{ row: IBlockValidatorRow }> = ({ row }) => {
  return (
    <ValidatorLine>
      {row.ownerAddress ? (
        <ValidatorKeyLink
          href={`/validator/${row.ownerAddress}`}
          title={row.blsKey}
        >
          {row.blsKey}
        </ValidatorKeyLink>
      ) : (
        <ValidatorAddress title={row.blsKey}>{row.blsKey}</ValidatorAddress>
      )}
      <CopyAction
        value={row.blsKey}
        label="Copy BLS key"
        announcement="BLS key copied to clipboard"
      />
    </ValidatorLine>
  );
};

const Validators: React.FC<PropsWithChildren<IValidatorsProps>> = props => {
  const validators = props.validators;
  const producerOwnerAddress = props.producerOwnerAddress;
  const directory = useQuery({
    queryKey: ['block-validator-directory'],
    queryFn: fetchAllValidators,
    staleTime: DIRECTORY_STALE_MS,
  });

  const byKey = useMemo(() => {
    const map = new Map<string, { name?: string; ownerAddress: string }>();
    for (const validator of directory.data?.validators ?? []) {
      if (!validator.blsPublicKey || !validator.ownerAddress) continue;
      // Block keys and the list do not share a case. The heartbeat join
      // folds the same way.
      map.set(validator.blsPublicKey.toLowerCase(), {
        name: validator.name,
        ownerAddress: validator.ownerAddress,
      });
    }
    return map;
  }, [directory.data]);

  const requestBlockValidators = (
    page: number,
    limit: number,
  ): Promise<IPaginatedResponse> => {
    const { rows, pagination } = buildBlockValidatorPage(
      validators,
      producerOwnerAddress,
      byKey,
      page,
      limit,
    );
    return Promise.resolve({
      data: { blockValidatorList: rows },
      pagination,
      code: '',
      error: '',
    });
  };

  // The shared table calls this with a header string while the skeleton is
  // up. Reading the row there would throw, so the cells only render a row.
  const rowSections = (entry: IBlockValidatorRow | string): IRowSection[] => {
    const row = typeof entry === 'string' ? undefined : entry;
    return [
      { element: () => (row ? <NameCell row={row} /> : null), span: 1 },
      { element: () => (row ? <KeyCell row={row} /> : null), span: 1 },
    ];
  };

  const tableProps: ITable = {
    rowSections,
    header: ['Name', 'BLS key'],
    dataName: 'blockValidatorList',
    type: 'validatorsList',
    request: requestBlockValidators,
    requestReady: !directory.isLoading,
    MobileCard: ValidatorsMobileCard,
    singleLineSkeleton: true,
    // The table query does not see the directory. Keyed on when that query
    // last settled, so a late result does not leave every row as Unknown.
    refreshKey: directory.dataUpdatedAt,
  };

  return (
    <ValidatorsTableWrapper>
      <Table {...tableProps} />
    </ValidatorsTableWrapper>
  );
};

export default Validators;
