import Table, { ITable } from '@/components/Table';
import { Row } from '@/components/Table/styles';
import { IBalance, IHolder } from '@/types/index';
import { parseAddress, toLocaleFixed } from '@/utils/index';
import Link from 'next/link';
import React from 'react';
import { RankingContainer } from './styles';

const Holders: React.FC<IHolder> = ({ holders, asset, holdersTableProps }) => {
  const TableBody: React.FC<IBalance> = ({ address, balance, index }) => {
    return (
      <Row type="holders">
        <span>
          <RankingContainer>
            {/* TODO: FIX RANKING, SINCE PROPS DONT CHANGE AFTER NEW RENDERING PAGE REMAINS 1 */}
            <p>{(index + 1) * (holdersTableProps?.page || 1)}°</p>
          </RankingContainer>
        </span>
        <Link href={`/account/${address}`}>{parseAddress(address, 40)}</Link>
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
    data: holders as any[],
    header,
    type: 'holders',
    ...holdersTableProps,
  };

  return <Table {...tableProps} />;
};

export default Holders;
