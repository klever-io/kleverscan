import { Validators as Icon } from '@/assets/cards';
import { getStatusIcon } from '@/assets/status';
import Copy from '@/components/Copy';
import Detail from '@/components/Detail';
import Progress from '@/components/Progress';
import { ITable } from '@/components/Table';
import { Status } from '@/components/Table/styles';
import api from '@/services/api';
import { IRowSection, IValidator } from '@/types/index';
import { capitalizeString } from '@/utils/convertString';
import { formatAmount } from '@/utils/formatFunctions';
import { parseValidators } from '@/utils/parseValues';
import { AddressContainer } from '@/views/validators/detail';
import Link from 'next/link';
import React from 'react';

const Validators: React.FC = () => {
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

  const requestValidators = async (page: number, limit: number) => {
    const validators = await api.get({
      route: `validator/list?sort=elected&sort=eligible&sort=waiting&sort=inactive&sort=jailed&page=${page}&limit=${limit}`,
    });

    if (!validators.error) {
      const parsedValidators = parseValidators(validators);
      return { ...validators, data: { validators: parsedValidators } };
    } else {
      return validators;
    }
  };

  const rowSections = (validator: IValidator): IRowSection[] | undefined => {
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
          { element: <p key={rank}>{rank}°</p>, span: 1 },
          {
            element: (
              <span key={ownerAddress}>
                {
                  <AddressContainer>
                    <Link href={`validator/${ownerAddress}`}>
                      {name ? name : parsedAddress}
                    </Link>
                    <Copy data={ownerAddress} info="Validator Address" />
                  </AddressContainer>
                }
              </span>
            ),
            span: 1,
          },
          {
            element: (
              <span key={rating}>
                {((rating * 100) / 10000000).toFixed(2)}%
              </span>
            ),
            span: 1,
          },

          {
            element: <span key={status}>{capitalizeString(status)}</span>,
            span: 1,
          },
          {
            element: (
              <strong key={staked}>
                {formatAmount(staked / 10 ** precision)} KLV
              </strong>
            ),
            span: 1,
          },
          {
            element: <strong key={commission}>{commission / 10 ** 2}%</strong>,
            span: 1,
          },
          {
            element: (
              <strong
                key={totalProduced}
              >{`${totalProduced} / ${totalMissed}`}</strong>
            ),
            span: 1,
          },
          {
            element: (
              <Status
                status={canDelegate ? 'success' : 'fail'}
                key={String(canDelegate)}
              >
                <DelegateIcon />
                <p>{canDelegate ? 'Yes' : 'No'}</p>
              </Status>
            ),
            span: 1,
          },

          {
            element: (
              <Progress percent={cumulativeStaked} key={cumulativeStaked} />
            ),
            span: 2,
          },
        ]
      : undefined;

    return sections;
  };

  const tableProps: ITable = {
    type: 'validators',
    header,
    rowSections,
    request: (page, limit) => requestValidators(page, limit),
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

export default Validators;
