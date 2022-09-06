import Copy from '@/components/Copy';
import Table, { ITable } from '@/components/Table';
import { Row } from '@/components/Table/styles';
import api from '@/services/api';
import { IAccountAsset, IAsset } from '@/types/index';
import { parseAddress } from '@/utils/index';
import { CenteredRow, RowContent } from '@/views/accounts/detail';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { Status } from './styles';

interface IBuckets {
  assets: IAccountAsset[];
}

const Buckets: React.FC<IBuckets> = ({ assets }) => {
  const UINT32_MAX = 4294967295;
  const precision = 6; // default KLV precision
  const detailsCache = useRef<{ [key: string]: IAsset }>({});

  const TableBody: React.FC<IAccountAsset> = asset => {
    const [assetDetails, setAssetDetails] = useState<IAsset>();

    const assetHasUnstakedBucket = asset?.buckets?.find(
      bucket => bucket.unstakedEpoch !== UINT32_MAX,
    );

    useEffect(() => {
      const getDetails = async () => {
        if (detailsCache[asset.assetId]) {
          setAssetDetails(detailsCache[asset.assetId]);
        } else {
          const details = await api.get({ route: `/assets/${asset.assetId}` });
          setAssetDetails(details);
          detailsCache.current[asset.assetId] = details;
        }
      };

      if (assetHasUnstakedBucket) {
        getDetails();
      }
    }, []);

    if (!asset.buckets) {
      return <></>;
    }

    const getAvaliableEpoch = async (
      assetId: string,
      unstakedEpoch: number,
    ) => {
      if (assetId.length < 64) {
        return (
          unstakedEpoch + (assetDetails?.staking?.minEpochsToWithdraw || 2)
        );
      }
      return unstakedEpoch + 2; // Default for KLV
    };

    return (
      <>
        {asset.buckets.map(bucket => (
          <Row type="buckets" key={bucket.id}>
            <span>
              <Link href={`/asset/${asset.assetId}`}>
                <a>{asset.assetId}</a>
              </Link>
            </span>
            <span>
              <p>{(bucket.balance / 10 ** asset.precision).toLocaleString()}</p>
            </span>
            <Status staked={true}>{'True'}</Status>
            <span>{bucket.stakedEpoch.toLocaleString()}</span>
            <RowContent>
              <CenteredRow className="bucketIdCopy">
                <span>{bucket.id}</span>
                <Copy info="BucketId" data={bucket.id} />
              </CenteredRow>
            </RowContent>
            <span>
              {bucket.unstakedEpoch === UINT32_MAX
                ? '--'
                : bucket.unstakedEpoch.toLocaleString()}
            </span>
            <span>
              {bucket.unstakedEpoch === UINT32_MAX
                ? '--'
                : getAvaliableEpoch(
                    asset.assetId,
                    bucket.unstakedEpoch,
                  ).toLocaleString()}
            </span>
            <span>
              {bucket.delegation.length > 0 ? (
                <Link href={`/account/${bucket.delegation}`}>
                  <a>{parseAddress(bucket.delegation, 22)}</a>
                </Link>
              ) : (
                <span>--</span>
              )}
            </span>
          </Row>
        ))}
      </>
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
    data: assets,
    body: TableBody,
    loading: false,
  };

  return <Table {...tableProps} />;
};

export default Buckets;
