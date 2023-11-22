import { Validators as Icon } from '@/assets/cards';
import { getStatusIcon } from '@/assets/status';
import Copy from '@/components/Copy';
import Detail from '@/components/Detail';
import { IFilter } from '@/components/Filter';
import Progress from '@/components/Progress';
import { ITable } from '@/components/Table';
import { Status } from '@/components/Table/styles';
import api from '@/services/api';
import { IRowSection, IValidator } from '@/types/index';
import { setQueryAndRouter } from '@/utils';
import { capitalizeString } from '@/utils/convertString';
import { formatAmount } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { useFetchPartial } from '@/utils/hooks';
import { parseValidators } from '@/utils/parseValues';
import { AddressContainer } from '@/views/validators/detail';
import { GetStaticProps } from 'next';
import { TFunction, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import nextI18nextConfig from '../../../next-i18next.config';

export const validatorsHeaders = (t: TFunction): string[] => {
  return [
    `${t('Validators.Rank')}`,
    `${t('Name')}`,
    `${t('Validators.Rating')}`,
    `${t('Transactions.Status')}`,
    `${t('Validators.Stake')}`,
    `${t('Validators.Commission')}`,
    `${t('Validators.Produced / Missed')}`,
    `${t('Transactions.Can Delegate')}`,
    `${t('Validators.Cumulative Stake')}`,
  ];
};

const validatorsRowSections = (
  validator: IValidator,
): IRowSection[] | undefined => {
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
            <strong key={staked}>
              {formatAmount(staked / 10 ** KLV_PRECISION)} KLV
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

const Validators: React.FC = () => {
  const { t: tableT } = useTranslation('table');
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
    header: validatorsHeaders(tableT),
    rowSections: validatorsRowSections,
    request: (page, limit) => requestValidators(page, limit),
    scrollUp: true,
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

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  const props = await serverSideTranslations(
    locale,
    ['common', 'validators', 'table'],
    nextI18nextConfig,
  );

  return { props };
};

export default Validators;
