import React from 'react';

import Link from 'next/link';

import Table, { ITable } from '@/components/Table';
import { Row } from '@/components/Table/styles';
import { IAccountAsset, IAsset } from '@/types/index';
import { parseAddress, toLocaleFixed } from '@/utils/index';
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
          balance: holder.frozenBalance + holder.balance,
        };
      } else
        return {
          address: '',
          balance: 0,
        };
    })
    .map((holder, index) => ({ ...holder, index }));

  const TableBody: React.FC<IBalance> = ({ address, balance, index }) => {
    return (
      <Row type="holders">
        <span>
          <RankingContainer>
            <p>{index + 1}°</p>
          </RankingContainer>
        </span>
        <span>
          <Link href={`/account/${address}`}>
            <a>{parseAddress(address, 40)}</a>
          </Link>
        </span>
        <span>
          <strong>
            {((balance / asset.circulatingSupply) * 100).toFixed(2)}%
          </strong>
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
