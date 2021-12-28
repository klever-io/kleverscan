import React from 'react';

import Link from 'next/link';

import Table, { ITable } from '@/components/Table';
import { Row } from '@/components/Table/styles';
import { IAccountAsset, IAsset } from '@/types/index';
import { toLocaleFixed } from '@/utils/index';
import { RankingContainer } from './styles';

interface IHolder {
  holders: IAccountAsset[];
  asset: IAsset;
  loading: boolean;
}

interface IBalance {
  address: string;
  balance: number;
  index: number;
}

const Holders: React.FC<IHolder> = ({ holders, asset, loading }) => {
  const balances = holders
    .map(holder => {
      if (holder.assetId === asset.assetId) {
        return {
          address: holder.address,
          balance: holder.frozenBalance,
        };
      } else
        return {
          address: '',
          balance: 0,
        };
    })
    .map((holder, index) => ({ ...holder, index }));

  const totalAmount = balances.reduce((acc, holder) => acc + holder.balance, 0);

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
    loading: loading,
    header,
    type: 'holders',
  };

  return <Table {...tableProps} />;
};

export default Holders;
