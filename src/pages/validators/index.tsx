import { Validators as Icon } from '@/assets/cards';
import { getStatusIcon } from '@/assets/status';
import Copy from '@/components/Copy';
import Detail from '@/components/Detail';
import { IFilter } from '@/components/Filter';
import Progress from '@/components/Progress';
import { ITable } from '@/components/Table';
import { CustomFieldWrapper, Status } from '@/components/Table/styles';
import Tooltip from '@/components/Tooltip';
import api from '@/services/api';
import { CenteredRow, DoubleRow, Mono } from '@/styles/common';
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
import React, { PropsWithChildren, useMemo } from 'react';

export const validatorsHeaders = [
  'Rank',
  'Name/Can Delegate',
  'Status/Rating',
  'Stake/Commission',
  'Produced / Missed',
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
  const sections: IRowSection[] = ownerAddress
    ? [
        { element: (props) => <p key={rank}>{rank}°</p>, span: 1, width: 100 },
        {
          element: (props) => (
            <DoubleRow {...props} key={ownerAddress + status}>
              <span>
                {
                  <AddressContainer>
                    <Link href={`validator/${ownerAddress}`}>
                      {name ? name : <Mono>{parsedAddress}</Mono>}
                    </Link>
                    <Copy data={ownerAddress} info="Validator Address" />
                  </AddressContainer>
                }
              </span>
              <Status
                status={canDelegate ? 'success' : 'fail'}
                key={String(canDelegate)}
              >
                {canDelegate ? 'Yes' : 'No'}
              </Status>
            </DoubleRow>
          ),
          span: 1,
        },

        {
          element: (props) => (
            <DoubleRow {...props} key={status + rating}>
              <span>{capitalizeString(status)}</span>
              <span>{((rating * 100) / 10000000).toFixed(2)}%</span>
            </DoubleRow>
          ),
          span: 1,
        },
        {
          element: (props) => (
            <DoubleRow {...props} key={staked}>
              <span>{formatAmount(staked / 10 ** KLV_PRECISION)} KLV</span>
              <span key={commission}>{commission / 10 ** 2}%</span>
            </DoubleRow>
          ),
          span: 1,
        },
        {
          element: (props) => (
            <DoubleRow {...props} key={totalProduced}>
              <span>{totalProduced}</span>
              <CenteredRow>
                <span>{totalMissed}</span>
                <Tooltip
                  msg="Missed Percentage"
                  Component={() => (
                    <CustomFieldWrapper>
                      <span>
                        {' '}
                        (
                        {totalProduced
                          ? (
                              ((totalMissed || 0) * 100) /
                              totalProduced
                            ).toFixed(2)
                          : '- -'}
                        %)
                      </span>
                    </CustomFieldWrapper>
                  )}
                />
              </CenteredRow>
            </DoubleRow>
          ),
          span: 1,
        },
        {
          element: (props) => (
            <Progress percent={cumulativeStaked} key={cumulativeStaked} />
          ),
          span: 2,
        },
      ]
    : [];

  return sections;
};

const Validators: React.FC<PropsWithChildren> = () => {
  const router = useRouter();
  const [
    filterValidators,
    fetchPartialValidator,
    loading,
    setLoading,
  ] = useFetchPartial<IValidator>('validators', 'validator/list', 'name');

  const filters: IFilter[] = useMemo(() => {
    return [
      {
        title: 'Name',
        data: filterValidators
          .map((validator) => validator.name)
          .filter((validator) => !!validator) as string[],
        onClick: async (value) => {
          if (value === 'All') {
            setQueryAndRouter({}, router);
          } else {
            setQueryAndRouter({ name: value }, router);
          }
        },
        onChange: async (value) => {
          setLoading(true);
          await fetchPartialValidator(value);
        },
        current: (router.query.name as string) || undefined,
        loading,
      },
    ];
  }, [filterValidators, router]);

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

  // useEffect(() => {
  //   fetchPartialValidator('');
  // }, [fetchPartialValidator]);

  return <Detail {...detailProps} />;
};

export default Validators;
