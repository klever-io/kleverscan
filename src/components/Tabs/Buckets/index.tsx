import Copy from '@/components/Copy';
import Table, { ITable } from '@/components/Table';
import api from '@/services/api';
import { IAccountAsset, IAsset, IBucket } from '@/types/index';
import { parseAddress } from '@/utils/index';
import { CenteredRow, RowContent } from '@/views/accounts/detail';
import { useWidth } from 'contexts/width';
import Link from 'next/link';
import React, { useRef } from 'react';
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
  let assetDetails: IAsset;
  let assetsBuckets: IAssetsBuckets[] = [];

  assets.forEach(asset => {
    const assetHasUnstakedBucket = asset?.buckets?.find(
      bucket => bucket.unstakedEpoch !== UINT32_MAX,
    );

    const getDetails = async () => {
      if (detailsCache[asset.assetId]) {
        assetDetails = detailsCache[asset.assetId];
      } else {
        const details = await api.get({ route: `/assets/${asset.assetId}` });
        assetDetails = details;
        detailsCache.current[asset.assetId] = details;
      }
    };

    if (assetHasUnstakedBucket) {
      getDetails();
    }

    if (asset.buckets) {
      assetsBuckets = [
        ...assetsBuckets,
        ...asset.buckets.map(bucket => {
          return {
            asset,
            bucket,
          };
        }),
      ];
    }
  });
  const { isMobile } = useWidth();

  const rowSections = (assetBucket: IAssetsBuckets): JSX.Element[] => {
    const { asset, bucket } = assetBucket;

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

    const sections = [
      <Link href={`/asset/${asset.assetId}`} key={asset.assetId}>
        <a>{asset.assetId}</a>
      </Link>,
      <p key={bucket.unstakedEpoch}>
        {(bucket.balance / 10 ** asset.precision).toLocaleString()}
      </p>,
      <Status staked={true} key={'true'}>
        {'True'}
      </Status>,
      <span key={bucket.unstakedEpoch}>
        {bucket.stakedEpoch.toLocaleString()}
      </span>,
      <RowContent key={bucket.id}>
        <CenteredRow className="bucketIdCopy">
          <span>{!isMobile ? bucket.id : parseAddress(bucket.id, 24)}</span>
          <Copy info="BucketId" data={bucket.id} />
        </CenteredRow>
      </RowContent>,
      <>
        {bucket.unstakedEpoch === UINT32_MAX
          ? '--'
          : bucket.unstakedEpoch.toLocaleString()}
        {bucket.unstakedEpoch === UINT32_MAX
          ? '--'
          : getAvaliableEpoch(
              asset.assetId,
              bucket.unstakedEpoch,
            ).toLocaleString()}
      </>,
      <>
        {bucket.delegation.length > 0 ? (
          <Link href={`/account/${bucket.delegation}`}>
            <a>{parseAddress(bucket.delegation, 22)}</a>
          </Link>
        ) : (
          <span>--</span>
        )}
      </>,
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
    columnSpans: [1, 1, 1, 1, 2, 1, 1, 1],
  };

  return <Table {...tableProps} />;
};

export default Buckets;
