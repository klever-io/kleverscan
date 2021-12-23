import React from 'react';

import { Status } from './styles';

import Table, { ITable } from '@/components/Table';
import { Row } from '@/components/Table/styles';

import { IBucket } from '@/types/index';

interface IBuckets {
  [key: string]: IBucket[];
}

interface IBucketData extends IBucket {
  bucketId: string;
}

const Buckets: React.FC<IBuckets> = props => {
  const bucketData = Object.values(props).map((item, index) => ({
    bucketId: Object.keys(props)[index],
    ...item,
  }));

  const UINT32_MAX = 4294967295;
  const precision = 6; // default KLV precision

  const TableBody: React.FC<IBucketData> = ({
    stakeValue,
    staked,
    stakedEpoch,
    unstakedEpoch,
    delegation,
  }) => {
    return (
      <Row type="buckets">
        <span>
          <p>{(stakeValue / 10 ** precision).toLocaleString()}</p>
        </span>
        <Status staked={staked}>{staked ? 'True' : 'False'}</Status>
        <span>{stakedEpoch.toLocaleString()}</span>
        <span>
          {unstakedEpoch === UINT32_MAX ? '--' : unstakedEpoch.toLocaleString()}
        </span>
        <span>{delegation}</span>
      </Row>
    );
  };

  const header = [
    'Staked Values',
    'Staked',
    'Staked Epoch',
    'Unstaked Epoch',
    'Delegation',
  ];

  const tableProps: ITable = {
    type: 'buckets',
    header,
    data: bucketData,
    body: TableBody,
    loading: false,
  };

  return <Table {...tableProps} />;
};

export default Buckets;
