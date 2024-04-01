import { Validators as Icon } from '@/assets/cards';
import { getStatusIcon } from '@/assets/status';
import Copy from '@/components/Copy';
import Detail from '@/components/Detail';
import { IFilter } from '@/components/Filter';
import Progress from '@/components/Progress';
import { Status } from '@/components/Table/styles';
import { ITable } from '@/components/TableV2';
import api from '@/services/api';
import { IRowSection, IValidator } from '@/types/index';
import { setQueryAndRouter } from '@/utils';
import { capitalizeString } from '@/utils/convertString';
import { formatAmount } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { useFetchPartial } from '@/utils/hooks';
import { parseValidators } from '@/utils/parseValues';
import { AddressContainer } from '@/views/validators/detail';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

export const validatorsHeaders = [
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

const validatorsRowSections = (validator: IValidator): IRowSection[] => {
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
            <span key={rating}>{((rating * 100) / 10000000).toFixed(2)}%</span>
          ),
          span: 1,
        },

        {
          element: <span key={status}>{capitalizeString(status)}</span>,
          span: 1,
        },
        {
          element: (
            <span key={staked}>
              {formatAmount(staked / 10 ** KLV_PRECISION)} KLV
            </span>
          ),
          span: 1,
        },
        {
          element: <span key={commission}>{commission / 10 ** 2}%</span>,
          span: 1,
        },
        {
          element: (
            <span
              key={totalProduced}
            >{`${totalProduced} / ${totalMissed}`}</span>
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
    : [];

  return sections;
};

const Validators: React.FC = () => {
  const router = useRouter();
  const [filterValidators, fetchPartialValidator, loading, setLoading] =
    useFetchPartial<IValidator>('validators', 'validator/list', 'name');

  const filters: IFilter[] = [
    {
      title: 'Name',
      data: filterValidators.map(validator => validator.name || ''),
      onClick: async value => {
        if (value === 'All') {
          setQueryAndRouter({}, router);
        } else {
          setQueryAndRouter({ name: value }, router);
        }
      },
      onChange: async value => {
        setLoading(true);
        await fetchPartialValidator(value);
      },
      current: (router.query.name as string) || undefined,
      loading,
    },
  ];

  const requestValidators = async (page: number, limit: number) => {
    const localQuery = { ...router.query, page, limit };
    const validators = await api.get({
      route: 'validator/list',
      query: { sort: 'elected', ...localQuery },
    });

    if (!validators.error) {
      const parsedValidators = parseValidators(validators);
      return { ...validators, data: { validators: parsedValidators } };
    } else {
      return validators;
    }
  };

  const tableProps: ITable = {
    type: 'validators',
    header: validatorsHeaders,
    rowSections: validatorsRowSections,
    request: (page, limit) => requestValidators(page, limit),
    dataName: 'validators',
  };

  const detailProps = {
    title: 'Validators',
    headerIcon: Icon,
    cards: undefined,
    tableProps,
    filters,
  };

  return <Detail {...detailProps} />;
};

export default Validators;
