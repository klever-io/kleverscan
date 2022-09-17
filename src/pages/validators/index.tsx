import { Validators as Icon } from '@/assets/cards';
import { getStatusIcon } from '@/assets/status';
import Detail from '@/components/Layout/Detail';
import { ITable } from '@/components/Table';
import { Status } from '@/components/Table/styles';
import api from '@/services/api';
import { IPagination, IValidator, IValidatorResponse } from '@/types/index';
import { capitalizeString, formatAmount, parseValidators } from '@/utils/index';
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
import React from 'react';

interface IValidatorPage {
  validators: IValidator[];
  pagination: IPagination;
}

const Validators: React.FC<IValidatorPage> = ({
  validators: initialValidators,
  pagination,
}) => {
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

  const requestValidators = async (page: number) => {
    const validators = await api.get({
      route: `validator/list?page=${page}`,
    });

    if (!validators.error) {
      const parsedValidators = parseValidators(validators);
      return { ...validators, data: { validators: parsedValidators } };
    } else {
      return validators;
    }
  };

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
      name,
      ownerAddress,
      parsedAddress,
      rank,
      staked,
      commission,
      cumulativeStaked,
      rating,
      status,
      totalProduced,
      totalMissed,
      canDelegate,
    } = validator;

    const DelegateIcon = getStatusIcon(canDelegate ? 'success' : 'fail');
    const sections = ownerAddress
      ? [
          <p key={rank}>{rank}°</p>,
          <span key={ownerAddress}>
            {
              <Link href={`validator/${ownerAddress}`}>
                {name ? name : parsedAddress}
              </Link>
            }
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
    data: initialValidators,
    request: page => requestValidators(page),
    totalPages: pagination.totalPages,
    scrollUp: true,
    dataName: 'validators',
  };

  const detailProps = {
    title: 'Validators',
    headerIcon: Icon,
    cards: undefined,
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
    const parsedValidators = parseValidators(validators);

    props.validators = parsedValidators;
    props.pagination = validators.pagination;
  }
  return { props };
};

export default Validators;
