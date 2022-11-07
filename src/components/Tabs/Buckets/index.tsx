import Copy from '@/components/Copy';
import Table, { ITable } from '@/components/Table';
import { useMobile } from '@/contexts/mobile';
import api from '@/services/api';
import { IAccountAsset, IAsset, IBucket, IRowSection } from '@/types/index';
import { parseAddress } from '@/utils/index';
import { CenteredRow, RowContent } from '@/views/accounts/detail';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { Status } from './styles';

interface IBuckets {
  assets: IAccountAsset[];
}

interface IAssetsBuckets {
  asset: IAccountAsset;
  bucket: IBucket;
}

const Buckets: React.FC<IBuckets> = ({ assets }) => {
  const UINT32_MAX = 4294967295;
  const precision = 6; // default KLV precision
  const detailsCache = useRef<{ [key: string]: IAsset }>({});
  const [assetDetails, setAssetDetails] = useState<IAsset>();
  const [assetsBuckets, setAssetsBuckets] = useState<IAssetsBuckets[]>([]);

  useEffect(() => {
    assets.forEach(asset => {
      const assetHasUnstakedBucket = asset?.buckets?.find(
        bucket => bucket.unstakedEpoch !== UINT32_MAX,
      );

      const getDetails = async () => {
        if (detailsCache[asset.assetId]) {
          setAssetDetails(detailsCache[asset.assetId]);
        } else {
          const details = await api.get({ route: `assets/${asset.assetId}` });
          if (details.error !== '') {
            return;
          }
          setAssetDetails(details.data.asset);
          detailsCache.current[asset.assetId] = details;
        }
      };

      if (assetHasUnstakedBucket) {
        getDetails();
      }

      if (asset.buckets) {
        const newBuckets = asset.buckets.map(bucket => {
          return {
            asset,
            bucket,
          };
        });

        setAssetsBuckets(prevAssetBuckets => [
          ...prevAssetBuckets,
          ...newBuckets,
        ]);
      }
    });
  }, [assets]);

  const { isMobile } = useMobile();

  const rowSections = (assetBucket: IAssetsBuckets): IRowSection[] => {
    const { asset, bucket } = assetBucket;

    const getAvaliableEpoch = (assetId: string, unstakedEpoch: number) => {
      if (assetId.length < 64) {
        return assetDetails?.staking?.minEpochsToWithdraw
          ? unstakedEpoch + assetDetails.staking.minEpochsToWithdraw
          : '--';
      }
      return unstakedEpoch + 2; // Default for KLV and KFI
    };

    const sections = [
      {
        element: (
          <Link href={`/asset/${asset.assetId}`} key={asset.assetId}>
            <a>{asset.assetId}</a>
          </Link>
        ),
        span: 1,
      },
      {
        element: (
          <p key={bucket.unstakedEpoch}>
            {(bucket.balance / 10 ** asset.precision).toLocaleString()}
          </p>
        ),
        span: 1,
      },
      {
        element: (
          <Status staked={true} key={'true'}>
            {'True'}
          </Status>
        ),
        span: 1,
      },
      {
        element: (
          <span key={bucket.unstakedEpoch}>
            {bucket.stakedEpoch.toLocaleString()}
          </span>
        ),
        span: 1,
      },
      {
        element: (
          <RowContent key={bucket.id}>
            <CenteredRow className="bucketIdCopy">
              <span>{!isMobile ? bucket.id : parseAddress(bucket.id, 24)}</span>
              <Copy info="BucketId" data={bucket.id} />
            </CenteredRow>
          </RowContent>
        ),
        span: 2,
      },
      {
        element: (
          <>
            {bucket.unstakedEpoch === UINT32_MAX
              ? '--'
              : bucket.unstakedEpoch.toLocaleString()}
          </>
        ),
        span: 1,
      },
      {
        element: (
          <>
            {bucket.unstakedEpoch === UINT32_MAX
              ? '--'
              : getAvaliableEpoch(
                  asset.assetId,
                  bucket.unstakedEpoch,
                ).toLocaleString()}
          </>
        ),
        span: 1,
      },
      {
        element: (
          <>
            {bucket.delegation.length > 0 ? (
              <Link href={`/account/${bucket.delegation}`}>
                <a>{parseAddress(bucket.delegation, 22)}</a>
              </Link>
            ) : (
              <span>--</span>
            )}
          </>
        ),
        span: 1,
      },
    ];

    return sections;
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
    data: assetsBuckets,
    rowSections,
  };

  return <Table {...tableProps} />;
};

export default Buckets;
