import React from 'react';

import Link from 'next/link';

import Table, { ITable } from '@/components/Table';
import { Row } from '@/components/Table/styles';
import { IAccount, IAsset } from '@/types/index';
import { toLocaleFixed } from '@/utils/index';
import { RankingContainer } from './styles';

interface IHolder {
  holders: IAccount[];
  asset: IAsset;
}

interface IBalance {
  address: string;
  balance: number;
  index: number;
}

const Holders: React.FC<IHolder> = ({ holders, asset }) => {
  const balances = holders
    .map(holder => {
      if (Object.keys(holder.assets).includes(asset.address)) {
        return {
          address: holder.address,
          balance: holder.assets[asset.address].balance,
        };
      }
    })
    .sort((a, b) => b?.balance - a?.balance)
    .map((holder, index) => ({ ...holder, index }));

  const totalAmount = Object.values(balances).reduce(
    (acc, holder) => acc + holder?.balance,
    0,
  );

  const TableBody: React.FC<IBalance> = ({ address, balance, index }) => {
    return (
      <Row type="holders">
        <span>
          <RankingContainer>
            <p>{index + 1}°</p>
          </RankingContainer>
        </span>
        <span>
          <Link href={`/account/${address}`}>{address}</Link>
        </span>
        <span>
          <strong>{((balance / totalAmount) * 100).toFixed(2)}%</strong>
        </span>
        <span>
          <strong>
            {toLocaleFixed(balance / 10 ** asset.precision, asset.precision)}
          </strong>
        </span>
      </Row>
    );
  };

  const header = ['Rank', 'Address', 'Percentage', 'Amount'];

  const tableProps: ITable = {
    body: TableBody,
    data: balances as any[],
    loading: false,
    header,
    type: 'holders',
  };

  return <Table {...tableProps} />;
};

export default Holders;
