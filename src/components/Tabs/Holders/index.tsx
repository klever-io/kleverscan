import Copy from '@/components/Copy';
import Filter, { IFilter } from '@/components/Filter';
import Table, { ITable } from '@/components/TableV2';
import { IBalance, IHolders, IRowSection } from '@/types/index';
import { formatAmount } from '@/utils/formatFunctions';
import { parseAddress } from '@/utils/parseValues';
import Link from 'next/link';
import React from 'react';
import {
  AddressContainer,
  FilterContainerHolders,
  RankingContainer,
  RankingText,
} from './styles';

interface IHolderTableProps {
  scrollUp: boolean;
  totalPages: number;
  dataName: string;
  request: (page: number, limit: number) => Promise<any>;
  page: number;
}

const Holders: React.FC<IHolders> = ({
  asset,
  holdersTableProps,
  setHolderQuery,
  holderQuery,
}) => {
  const rowSections = (props: IBalance): IRowSection[] => {
    const { address, frozenBalance, index, rank, balance, totalBalance } =
      props;
    return [
      {
        element: props => (
          <RankingContainer key={index}>
            <RankingText>{rank}°</RankingText>
          </RankingContainer>
        ),
        span: 1,
      },
      {
        element: props => (
          <AddressContainer key={address}>
            <Link href={`/account/${address}`}>
              {parseAddress(address, 40)}
            </Link>

            <Copy info="Address" data={address} />
          </AddressContainer>
        ),
        span: 1,
      },
      {
        element: props => (
          <span key={asset.circulatingSupply}>
            {((totalBalance / asset.circulatingSupply) * 100).toFixed(2)}%
          </span>
        ),
        span: 1,
      },
      {
        element: props => (
          <span key={asset.precision}>
            {formatAmount(frozenBalance / 10 ** asset.precision)}
          </span>
        ),
        span: 1,
      },
      {
        element: props => (
          <span key={balance}>
            {formatAmount(balance / 10 ** asset.precision)}
          </span>
        ),
        span: 1,
      },
      {
        element: props => (
          <span key={totalBalance}>
            {formatAmount(totalBalance / 10 ** asset.precision)}
          </span>
        ),
        span: 1,
      },
    ];
  };

  const header = [
    'Rank',
    'Address',
    'Percentage',
    'Frozen Amount',
    'Balance',
    'Total Balance',
  ];

  const filters: IFilter[] = [
    {
      title: 'Sort By',
      firstItem: 'Total Balance',
      data: ['Balance', 'Frozen'],
      onClick: value => {
        setHolderQuery(value);
      },
      current: holderQuery as string | undefined,
      inputType: 'button',
      isHiddenInput: false,
    },
  ];

  const tableProps: ITable = {
    rowSections,
    header,
    type: 'holders',
    ...holdersTableProps,
  };

  return (
    <>
      <FilterContainerHolders>
        {filters.map(filter => (
          <Filter key={JSON.stringify(filter)} {...filter} />
        ))}
      </FilterContainerHolders>
      <Table {...tableProps} />
    </>
  );
};

export default Holders;
