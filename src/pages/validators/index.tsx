import { Validators as Icon } from '@/assets/cards';
import { getStatusIcon } from '@/assets/status';
import Detail from '@/components/Layout/Detail';
import { ITable } from '@/components/Table';
import { Status } from '@/components/Table/styles';
import api from '@/services/api';
import {
  IDelegationsResponse,
  IPagination,
  IResponse,
  IValidator,
} from '@/types/index';
import { useDidUpdateEffect } from '@/utils/hooks';
import { capitalizeString, formatAmount, parseAddress } from '@/utils/index';
import {
  ProgressContainer,
  ProgressContent,
  ProgressIndicator,
  ProgressPercentage,
} from '@/views/validators';
import { useTheme } from 'contexts/theme';
import { useWidth } from 'contexts/width';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import React, { useState } from 'react';

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
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [validators, setValidators] = useState<IValidator[]>(initialValidators);
  const header = [
    'Rank',
    'Name',
    'Rating',
    'Status',
    'Stake',
    'Commission',
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
      setValidators([]);
      setPage(1);
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
            rank: index + 1 + (page * pagination.perPage - 10),
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
            commission: delegation.commission,
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
    const { theme } = useTheme();
    return (
      <ProgressContainer>
        <ProgressContent>
          <ProgressIndicator percent={percent} />
        </ProgressContent>
        <ProgressPercentage textColor={theme.black}>
          {percent?.toFixed(2)}%
        </ProgressPercentage>
      </ProgressContainer>
    );
  };

  const { isMobile } = useWidth();

  const rowSections = (validator: IValidator): JSX.Element[] | undefined => {
    const {
      rank,
      name,
      staked,
      commission,
      cumulativeStaked,
      address,
      rating,
      status,
      totalProduced,
      totalMissed,
      canDelegate,
    } = validator;

    const DelegateIcon = getStatusIcon(canDelegate ? 'success' : 'fail');

    const sections = address
      ? [
          <p key={rank}>{rank}°</p>,
          <span key={name}>
            {validators[rank - 1 - (page * pagination.perPage - 10)]
              ?.address ? (
              <Link
                href={`validator/${
                  validators[rank - 1 - (page * pagination.perPage - 10)]
                    .address
                }`}
              >
                {isMobile ? parseAddress(name, 14) : parseAddress(name, 20)}
              </Link>
            ) : (
              <span>{parseAddress(name, 20)}</span>
            )}
          </span>,
          <span key={rating}>{((rating * 100) / 10000000).toFixed(2)}%</span>,

          <span key={status}>{capitalizeString(status)}</span>,
          <strong key={staked}>
            {formatAmount(staked / 10 ** precision)} KLV
          </strong>,
          <strong key={commission}>{commission / 10 ** 2}%</strong>,
          <strong
            key={totalProduced}
          >{`${totalProduced} / ${totalMissed}`}</strong>,
          <Status
            status={canDelegate ? 'success' : 'fail'}
            key={String(canDelegate)}
          >
            <DelegateIcon />
            <p>{canDelegate ? 'Yes' : 'No'}</p>
          </Status>,

          <Progress percent={cumulativeStaked} key={cumulativeStaked} />,
        ]
      : undefined;

    return sections;
  };

  const tableProps: ITable = {
    type: 'validators',
    header,
    rowSections,
    columnSpans: [1, 1, 1, 1, 1, 1, 1, 1, 2],
    data: validators as any[],
    loading: loading,
  };

  const detailProps = {
    title: 'Validators',
    headerIcon: Icon,
    cards: undefined,
    paginationCount: validators.length > 0 ? pagination.totalPages : 0,
    page: page,
    setPage: setPage,
    tableProps,
  };

  return <Detail {...detailProps} />;
};

export const getServerSideProps: GetServerSideProps<
  IValidatorPage
> = async () => {
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
          rank:
            index +
            (validators.pagination.self - 1) * validators.pagination.perPage +
            1,
          name: delegation.name || parseAddress(delegation.ownerAddress, 20),
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
          commission: delegation.commission,
        };
      },
    );

    props.validators = delegations;
    props.pagination = validators.pagination;
  }
  return { props };
};

export default Validators;
