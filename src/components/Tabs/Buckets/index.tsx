import Copy from '@/components/Copy';
import Table, { ITable } from '@/components/Table';
import { Row } from '@/components/Table/styles';
import { IAccountAsset, IBucket } from '@/types/index';
import { parseAddress } from '@/utils/index';
import { CenteredRow, RowContent } from '@/views/accounts/detail';
import Link from 'next/link';
import React from 'react';
import { Status } from './styles';

interface IBuckets {
  buckets: IBucket[];
  assets: IAccountAsset[];
}

const Buckets: React.FC<IBuckets> = ({ buckets, assets }) => {
  const UINT32_MAX = 4294967295;
  const precision = 6; // default KLV precision

  const TableBody: React.FC<IBucket> = ({
    id,
    balance,
    stakedEpoch,
    unstakedEpoch,
    delegation,
  }) => {
    const getAvaliableEpoch = (id: string) => {
      if (id.length < 64) {
        return (
          assets.find(({ assetId }) => assetId === id)?.staking
            ?.minEpochsToWithdraw || 2
        );
      }

      return 2; // Default for KLV
    };

    const getAssetId = (id: string) => {
      if (id.length === 64) {
        return assets.find(
          ({ buckets }) =>
            (bucket: string) =>
              bucket === id,
        )?.assetId;
      }
      return id;
    };

    return (
      <Row type="buckets">
        <span>{getAssetId(id)}</span>
        <span>
          <p>{(balance / 10 ** precision).toLocaleString()}</p>
        </span>
        <Status staked={true}>{'True'}</Status>
        <span>{stakedEpoch.toLocaleString()}</span>
        <RowContent>
          <CenteredRow className="bucketIdCopy">
            <span>{id}</span>
            <Copy info="BucketId" data={id} />
          </CenteredRow>
        </RowContent>
        <span>
          {unstakedEpoch === UINT32_MAX ? '--' : unstakedEpoch.toLocaleString()}
        </span>
        <span>
          {unstakedEpoch === UINT32_MAX
            ? '--'
            : (unstakedEpoch + getAvaliableEpoch(id)).toLocaleString()}
        </span>
        <span>
          {delegation.length > 0 ? (
            <Link href={`/account/${delegation}`}>
              <a>{parseAddress(delegation, 22)}</a>
            </Link>
          ) : (
            <span>--</span>
          )}
        </span>
      </Row>
    );
  };

  const header = [
    'Asset Id',
    'Staked Values',
    'Staked',
    'Staked Epoch',
    'Bucket Id',
    'Unstaked Epoch',
    'Available Epoch',
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
