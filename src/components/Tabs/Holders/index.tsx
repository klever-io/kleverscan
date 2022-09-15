import Copy from '@/components/Copy';
import Table, { ITable } from '@/components/Table';
import { IAccountAsset, IAsset } from '@/types/index';
import { parseAddress, toLocaleFixed } from '@/utils/index';
import Link from 'next/link';
import React from 'react';
import { AddressContainer, RankingContainer, RankingText } from './styles';

interface IHolder {
  holders: IAccountAsset[];
  asset: IAsset;
  loading: boolean;
  holdersTableProps: any;
}

interface IBalance {
  address: string;
  balance: number;
  index: number;
}

const Holders: React.FC<IHolder> = ({ holders, asset, holdersTableProps }) => {
  const rowSections = (props: IBalance): JSX.Element[] => {
    const { address, balance, index } = props;

    return [
      <RankingContainer key={index}>
        <RankingText>{index + 1}°</RankingText>
      </RankingContainer>,
      <AddressContainer key={address}>
        <Link href={`/account/${address}`}>{parseAddress(address, 40)}</Link>

        <Copy info="Address" data={address} />
      </AddressContainer>,
      <strong key={asset.circulatingSupply}>
        {((balance / asset.circulatingSupply) * 100).toFixed(2)}%
      </strong>,
      <strong key={asset.precision}>
        {toLocaleFixed(balance / 10 ** asset.precision, asset.precision)}
      </strong>,
    ];
  };

  const header = ['Rank', 'Address', 'Percentage', 'Amount'];

  const tableProps: ITable = {
    rowSections,
    columnSpans: [1, 2, 1, 1],
    data: holders,
    header,
    type: 'holders',
    ...holdersTableProps,
  };

  return <Table {...tableProps} />;
};

export default Holders;
