import Copy from '@/components/Copy';
import Table, { ITable } from '@/components/Table';
import { IAsset, IBalance, IRowSection } from '@/types/index';
import { parseAddress, toLocaleFixed } from '@/utils/index';
import Link from 'next/link';
import React from 'react';
import { AddressContainer, RankingContainer, RankingText } from './styles';

interface IHolder {
  holders: IBalance[];
  asset: IAsset;
  holdersTableProps: any;
}

const Holders: React.FC<IHolder> = ({ holders, asset, holdersTableProps }) => {
  const rowSections = (props: IBalance): IRowSection[] => {
    const { address, frozenBalance, index, rank } = props;

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
            {toLocaleFixed(
              frozenBalance / 10 ** asset.precision,
              asset.precision,
            )}
          </strong>
        ),
        span: 1,
      },
    ];
  };

  const header = ['Rank', 'Address', 'Percentage', 'Frozen Amount'];

  const tableProps: ITable = {
    rowSections,
    data: holders,
    header,
    type: 'holders',
    ...holdersTableProps,
  };

  return <Table {...tableProps} />;
};

export default Holders;
