import Copy from '@/components/Copy';
import Table, { ITable } from '@/components/Table';
import { IBalance, IHolders, IRowSection } from '@/types/index';
import { formatAmount } from '@/utils/formatFunctions';
import { parseAddress } from '@/utils/parseValues';
import Link from 'next/link';
import React from 'react';
import { AddressContainer, RankingContainer, RankingText } from './styles';

interface IHolderTableProps {
  scrollUp: boolean;
  totalPages: number;
  dataName: string;
  request: (page: number, limit: number) => Promise<any>;
  page: number;
}

const Holders: React.FC<IHolders> = ({ asset, holdersTableProps }) => {
  const rowSections = (props: IBalance): IRowSection[] => {
    const { address, frozenBalance, index, rank, balance, totalBalance } =
      props;

    return [
      {
        element: (
          <RankingContainer key={index}>
            <RankingText>{rank}°</RankingText>
          </RankingContainer>
        ),
        span: 1,
      },
      {
        element: (
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
        element: (
          <strong key={asset.circulatingSupply}>
            {((frozenBalance / asset.circulatingSupply) * 100).toFixed(2)}%
          </strong>
        ),
        span: 1,
      },
      {
        element: (
          <strong key={asset.precision}>
            {formatAmount(frozenBalance / 10 ** asset.precision)}
          </strong>
        ),
        span: 1,
      },
      {
        element: (
          <strong key={balance}>
            {formatAmount(balance / 10 ** asset.precision)}
          </strong>
        ),
        span: 1,
      },
      {
        element: (
          <strong key={totalBalance}>
            {formatAmount(totalBalance / 10 ** asset.precision)}
          </strong>
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

  const tableProps: ITable = {
    rowSections,
    header,
    type: 'holders',
    ...holdersTableProps,
  };

  return <Table {...tableProps} />;
};

export default Holders;
