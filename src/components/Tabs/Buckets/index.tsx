import React from 'react';

import { Status } from './styles';

import Table, { ITable } from '@/components/Table';
import { Row } from '@/components/Table/styles';

import { IBucket } from '@/types/index';
import Link from 'next/link';

interface IBuckets {
  [key: string]: IBucket[];
}

const Buckets: React.FC<IBuckets> = ({ buckets }) => {
  const UINT32_MAX = 4294967295;
  const precision = 6; // default KLV precision

  const TableBody: React.FC<IBucket> = ({
    id,
    balance,
    stakedEpoch,
    unstakedEpoch,
    delegation,
  }) => {
    return (
      <Row type="buckets">
        <span>
          <p>{(balance / 10 ** precision).toLocaleString()}</p>
        </span>
        <Status staked={true}>{'True'}</Status>
        <span>{stakedEpoch.toLocaleString()}</span>
        <span>{id}</span>
        <span>
          {unstakedEpoch === UINT32_MAX ? '--' : unstakedEpoch.toLocaleString()}
        </span>
        <Link href={`/account/${delegation}`}>{delegation}</Link>
      </Row>
    );
  };

  const header = [
    'Staked Values',
    'Staked',
    'Staked Epoch',
    'Bucket Id',
    'Unstaked Epoch',
    'Delegation',
  ];

  const tableProps: ITable = {
    type: 'buckets',
    header,
    data: buckets,
    body: TableBody,
    loading: false,
  };

  return <Table {...tableProps} />;
};

export default Buckets;
