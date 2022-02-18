import React, { useState } from 'react';

import { GetServerSideProps } from 'next';
import Link from 'next/link';

import Detail from '@/components/Layout/Detail';
import Table, { ITable } from '@/components/Table';
import { Row } from '@/components/Table/styles';

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
  const header = ['Rank', 'Name', 'Stake', 'Cumulative Stake', 'Owner Address'];

  const precision = 6;

  const fetchData = async () => {
    setLoading(true);

    const validators: IValidatorResponse = await api.get({
      route: `validator/delegated-list?page=${page}`,
    });
    if (!validators.error) {
      const delegations: IValidator[] = validators.data.delegations.map(
        (delegation: IDelegationsResponse, index): IValidator => {
          return {
            staked: delegation.totalDelegated,
            rank: index + validators.pagination.previous * 10 + 1,
            name: delegation.name || 'Klever Staking',
            cumulativeStaked: parseFloat(
              (
                (delegation.totalDelegated / validators.data.totalFrozen) *
                100
              ).toFixed(4),
            ),
            address: delegation.address,
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
        <span>{percent}%</span>
      </ProgressContainer>
    );
  };

  const TableBody: React.FC<IValidator> | null = ({
    rank,
    name,
    staked,
    cumulativeStaked,
    address,
  }) => {
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
        <span>
          <strong>{(staked / 10 ** precision).toLocaleString()} KLV</strong>
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
      route: 'validator/delegated-list',
    });
    if (!validators.error) {
      const delegations: IValidator[] = validators.data.delegations.map(
        (delegation: IDelegationsResponse, index): IValidator => {
          return {
            staked: delegation.totalDelegated,
            rank: index + validators.pagination.previous * 10 + 1,
            name: delegation.name || 'Klever Staking',
            cumulativeStaked: parseFloat(
              (
                (delegation.totalDelegated / validators.data.totalFrozen) *
                100
              ).toFixed(4),
            ),
            address: delegation.address,
          };
        },
      );

      props.validators = delegations;
      props.pagination = validators.pagination;
    }

    return { props };
  };

export default Validators;
