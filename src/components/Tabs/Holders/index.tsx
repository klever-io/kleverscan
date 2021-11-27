import React from 'react';

import Link from 'next/link';

import Table, { ITable } from '@/components/Table';
import { Row } from '@/components/Table/styles';

import { IHolder } from '@/types/index';

const Holders: React.FC<IHolder[]> = props => {
  const TableBody: React.FC<IHolder> = ({ address }) => {
    return (
      <Row type="holders">
        <span>
          <Link href={`/account/${address}`}>{address}</Link>
        </span>
      </Row>
    );
  };

  const header = ['Rank', 'Address', 'Percentage', 'Amount'];

  const tableProps: ITable = {
    body: TableBody,
    data: Object.values(props) as any[],
    loading: false,
    header,
    type: 'holders',
  };

  return <Table {...tableProps} />;
};

export default Holders;
