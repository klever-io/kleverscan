import React, { useState } from 'react';

import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Table, { ITable } from '@/components/Table';
import Detail from '@/components/Layout/Detail';
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
import { capitalizeString, parseAddress } from '@/utils/index';
import { formatAmount } from '@/utils/index';
import { getStatusIcon } from '@/assets/status';
import theme from '@/styles/theme';

interface IValidatorPage {
  validators: IValidator[];
  pagination: IPagination;
}

interface IValidatorResponse extends IResponse {
  data: {
    delegations: IDelegationsResponse[];
    networkTotalStake: number;
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
    'Status',
    'Stake',
    'Produced / Missed',
    'Can Delegate',
    'Cumulative Stake',
  ];

  const precision = 6;

  const fetchData = async () => {
    setLoading(true);

    const validators: IValidatorResponse = await api.get({
      route: `validator/list?page=${page}`,
    });
    if (validators.code !== 'successful') {
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
            rank: index + page * pagination.perPage + 1,
            name: delegation.name || parseAddress(delegation.ownerAddress, 14),
            cumulativeStaked: parseFloat(
              (
                (delegation.totalStake / validators.data.networkTotalStake) *
                100
              ).toFixed(4),
            ),
            address: delegation.ownerAddress,
            rating: delegation.rating,
            canDelegate: delegation.canDelegate,
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

  const Progress: React.FC<{ percent: number }> = ({ percent }) => {
    return (
      <ProgressContainer textColor={theme.black}>
        <ProgressContent>
          <ProgressIndicator percent={percent} />
        </ProgressContent>
        <span>{percent?.toFixed(2)}%</span>
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
    status,
    totalProduced,
    totalMissed,
    canDelegate,
  }) => {
    const DelegateIcon = getStatusIcon(canDelegate ? 'success' : 'error');

    return address ? (
      <Row type="validators">
        <span>
          <p>{rank}°</p>
        </span>
        <span>
          {validators[rank - page * pagination.perPage - 1]?.address ? (
            <Link
              href={`validator/${
                validators[rank - page * pagination.perPage - 1].address
              }`}
            >
              {name}
            </Link>
          ) : (
            <span>{name}</span>
          )}
        </span>
        <span>{((rating * 100) / 10000000).toFixed(2)}%</span>

        <span>{capitalizeString(status)}</span>
        <span>
          <strong>{formatAmount(staked / 10 ** precision)} KLV</strong>
        </span>
        <span>
          <strong>{`${totalProduced} / ${totalMissed}`}</strong>
        </span>
        <span>
          <Status status={canDelegate ? 'success' : 'fail'}>
            <DelegateIcon />
            <p>{canDelegate ? 'Yes' : 'No'}</p>
          </Status>
        </span>

        <span>
          <strong>
            <Progress percent={cumulativeStaked} />
          </strong>
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

  const detailProps = {
    title: 'Validators',
    headerIcon: Icon,
    cards: undefined,
    paginationCount: pagination.totalPages,
    page: page,
    setPage: setPage,
    tableProps,
  };

  return <Detail {...detailProps} />;
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

    if (validators.code !== 'successful') {
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
            name: delegation.name || parseAddress(delegation.ownerAddress, 8),
            cumulativeStaked: parseFloat(
              (
                (delegation.totalStake / validators.data.networkTotalStake) *
                100
              ).toFixed(4),
            ),
            address: delegation.ownerAddress,
            rating: delegation.rating,
            canDelegate: delegation.canDelegate,
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
