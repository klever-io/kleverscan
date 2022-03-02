import React, { useState } from 'react';

import { GetServerSideProps } from 'next';
import Link from 'next/link';

import Detail from '@/components/Layout/Detail';
import Table, { ITable } from '@/components/Table';
import { Row, Status } from '@/components/Table/styles';

import {
  IResponse,
  IPagination,
  IValidator,
  IDelegationsResponse,
} from '@/types/index';
import api from '@/services/api';

import { Validators as Icon } from '@/assets/cards';
import {
  ProgressContainer,
  ProgressContent,
  ProgressIndicator,
} from '@/views/validators';
import { useDidUpdateEffect } from '@/utils/hooks';
import { formatAmount } from '@/utils/index';
import { getStatusIcon } from '@/assets/status';

interface IValidatorPage {
  validators: IValidator[];
  pagination: IPagination;
}

interface IValidatorResponse extends IResponse {
  data: {
    delegations: IDelegationsResponse[];
    totalFrozen: number;
  };
  pagination: IPagination;
}

const Validators: React.FC<IValidatorPage> = ({
  validators: initialValidators,
  pagination,
}) => {
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [validators, setValidators] = useState<IValidator[]>(initialValidators);
  const header = [
    'Rank',
    'Name',
    'Rating',
    'Self Stake',
    'Status',
    'Total Produced',
    'Total Missed',
    'Stake',
    'Can Delegate',
    'Max Delegation',
    'Cumulative Stake',
    'Owner Address',
  ];

  const precision = 6;

  const fetchData = async () => {
    setLoading(true);

    const validators: IValidatorResponse = await api.get({
      route: `validator/list?page=${page}`,
    });

    const delegatedList: IValidatorResponse = await api.get({
      route: 'validator/delegated-list',
    });
    if (delegatedList.code !== 'successful') {
      setLoading(false);
      return;
    }

    if (!validators.error) {
      const delegations: IValidator[] = validators.data['validators'].map(
        (delegation: IDelegationsResponse, index: number): IValidator => {
          const totalProduced =
            delegation.totalLeaderSuccessRate.numSuccess +
            delegation.totalValidatorSuccessRate.numSuccess;
          const totalMissed =
            delegation.totalLeaderSuccessRate.numFailure +
            delegation.totalValidatorSuccessRate.numFailure;

          return {
            staked: delegation.totalStake,
            rank: index + validators.pagination.previous * 10 + 1,
            name: delegation.name || delegation.ownerAddress,
            cumulativeStaked: parseFloat(
              (
                (delegation.totalStake / delegatedList.data.totalFrozen) *
                100
              ).toFixed(4),
            ),
            address: delegation.ownerAddress,
            rating: delegation.rating,
            canDelegate: delegation.canDelegate,
            maxDelegation: delegation.maxDelegation,
            selfStake: delegation.selfStake,
            status: delegation.list,
            totalProduced,
            totalMissed,
          };
        },
      );
      setValidators(delegations);
      setLoading(false);
    }
  };

  useDidUpdateEffect(() => {
    fetchData();
  }, [page]);

  const detailProps = {
    title: 'Validators',
    headerIcon: Icon,
    cards: undefined,
    paginationCount: pagination.totalPages,
    page: page,
    setPage: setPage,
  };

  const Progress: React.FC<{ percent: number }> = ({ percent }) => {
    return (
      <ProgressContainer>
        <ProgressContent>
          <ProgressIndicator percent={percent} />
        </ProgressContent>
        <span>{percent.toFixed(2)}%</span>
      </ProgressContainer>
    );
  };

  const TableBody: React.FC<IValidator> | null = ({
    rank,
    name,
    staked,
    cumulativeStaked,
    address,
    rating,
    selfStake,
    status,
    totalProduced,
    totalMissed,
    canDelegate,
    maxDelegation,
  }) => {
    const DelegateIcon = getStatusIcon(canDelegate ? 'success' : 'error');

    return address ? (
      <Row type="validators">
        <span>
          <p>{rank - 1}°</p>
        </span>
        <span>
          {validators[rank - pagination.previous * 10 - 1]?.address ? (
            <Link
              href={`validator/${
                validators[rank - pagination.previous * 10 - 1].address
              }`}
            >
              {name}
            </Link>
          ) : (
            <span>{name}</span>
          )}
        </span>
        <span>{rating}</span>

        <span>
          <strong>{formatAmount(selfStake / 10 ** precision)} KLV</strong>
        </span>
        <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
        <span>{totalProduced}</span>
        <span>{totalMissed}</span>
        <span>
          <strong>{formatAmount(staked / 10 ** precision)} KLV</strong>
        </span>
        <span>
          <Status status={canDelegate ? 'success' : 'fail'}>
            <DelegateIcon />
            <p>{canDelegate ? 'Yes' : 'No'}</p>
          </Status>
        </span>
        <span>
          <strong>{formatAmount(maxDelegation / 10 ** precision)} KLV</strong>
        </span>
        <span>
          <strong>
            <Progress percent={cumulativeStaked} />
          </strong>
        </span>
        <span>
          {address ? (
            <Link href={`/account/${address}`}>
              <a className="address">{address}</a>
            </Link>
          ) : (
            <span> -- </span>
          )}
        </span>
      </Row>
    ) : null;
  };

  const tableProps: ITable = {
    type: 'validators',
    header,
    body: TableBody,
    data: validators as any[],
    loading: loading,
  };

  return (
    <Detail {...detailProps}>
      <Table {...tableProps}></Table>
    </Detail>
  );
};

export const getServerSideProps: GetServerSideProps<IValidatorPage> =
  async () => {
    const props: IValidatorPage = {
      validators: [],
      pagination: {} as IPagination,
    };

    const validators: IValidatorResponse = await api.get({
      route: 'validator/list',
    });

    const delegatedList: IValidatorResponse = await api.get({
      route: 'validator/delegated-list',
    });
    if (delegatedList.code !== 'successful') {
      return { props };
    }

    if (!validators.error) {
      const delegations: IValidator[] = validators.data['validators'].map(
        (delegation: IDelegationsResponse, index: number): IValidator => {
          const totalProduced =
            delegation.totalLeaderSuccessRate.numSuccess +
            delegation.totalValidatorSuccessRate.numSuccess;
          const totalMissed =
            delegation.totalLeaderSuccessRate.numFailure +
            delegation.totalValidatorSuccessRate.numFailure;

          return {
            staked: delegation.totalStake,
            rank: index + validators.pagination.previous * 10 + 1,
            name: delegation.name || delegation.ownerAddress,
            cumulativeStaked: parseFloat(
              (
                (delegation.totalStake / delegatedList.data.totalFrozen) *
                100
              ).toFixed(4),
            ),
            address: delegation.ownerAddress,
            rating: delegation.rating,
            canDelegate: delegation.canDelegate,
            maxDelegation: delegation.maxDelegation,
            selfStake: delegation.selfStake,
            status: delegation.list,
            totalProduced,
            totalMissed,
          };
        },
      );

      props.validators = delegations;
      props.pagination = validators.pagination;
    }

    return { props };
  };

export default Validators;
