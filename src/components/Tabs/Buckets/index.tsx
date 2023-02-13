import Copy from '@/components/Copy';
import Table, { ITable } from '@/components/Table';
import { useMobile } from '@/contexts/mobile';
import { IAssetsBuckets, IInnerTableProps, IRowSection } from '@/types/index';
import { parseAddress } from '@/utils/index';
import { CenteredRow, RowContent } from '@/views/accounts/detail';
import Link from 'next/link';
import React from 'react';
import { ContractContainer, Status } from './styles';

export interface IBuckets {
  bucketsTableProps: IInnerTableProps;
  showInteractionsButtons?: (
    title: string,
    valueContract: string,
    value?: any,
    isAssetTrigger?: boolean,
  ) => JSX.Element;
}

const Buckets: React.FC<IBuckets> = ({
  bucketsTableProps,
  showInteractionsButtons,
}) => {
  const UINT32_MAX = 4294967295;

  const { isMobile } = useMobile();

  const rowSections = (assetBucket: IAssetsBuckets): IRowSection[] => {
    const { asset, bucket } = assetBucket;
    const minEpochsToUnstake = 1;
    const minEpochsToWithdraw = 2;

    const unfreezeEquation =
      bucket.stakedEpoch + minEpochsToUnstake - asset.lastClaim.epoch;
    const isUnfreezeLocked = () => {
      return unfreezeEquation > 0;
    };
    const withdrawEquation =
      bucket.unstakedEpoch - asset.lastClaim.epoch + minEpochsToWithdraw;

    const isWithdrawLocked = () => {
      if (bucket?.unstakedEpoch === UINT32_MAX) {
        return false;
      }

      return withdrawEquation > 0;
    };
    const lockedText = () => {
      const textEquation = isWithdrawLocked()
        ? withdrawEquation
        : unfreezeEquation;
      return `${
        isWithdrawLocked() ? 'Withdraw' : 'Unfreeze'
      } (in ${textEquation} epoch${textEquation > 1 ? 's' : ''})`;
    };

    const getDelegation = () => {
      if (bucket.delegation) {
        return <></>;
      } else if (asset.assetId === 'KLV') {
        return (
          <>
            {showInteractionsButtons &&
              showInteractionsButtons('Delegate', 'DelegateContract', [
                asset.assetId,
                bucket.id,
              ])}
          </>
        );
      } else {
        return <>--</>;
      }
    };
    const getButton = () => {
      if (isUnfreezeLocked() || isWithdrawLocked()) {
        if (bucket.delegation) {
          return (
            <>
              {showInteractionsButtons &&
                showInteractionsButtons('Undelegate', 'UndelegateContract', [
                  asset.assetId,
                  bucket.id,
                ])}
              {showInteractionsButtons &&
                showInteractionsButtons(`${lockedText()}`, '--')}
            </>
          );
        }
        return (
          <>
            {showInteractionsButtons &&
              showInteractionsButtons(`${lockedText()}`, '--')}
          </>
        );
      } else if (bucket.unstakedEpoch !== UINT32_MAX) {
        if (bucket.delegation) {
          return (
            <>
              {showInteractionsButtons &&
                showInteractionsButtons('Undelegate', 'UndelegateContract', [
                  asset.assetId,
                  bucket.id,
                ])}
              {showInteractionsButtons &&
                showInteractionsButtons('Withdraw', 'WithdrawContract', [
                  asset.assetId,
                  bucket.id,
                ])}
            </>
          );
        }
        return (
          <>
            {showInteractionsButtons &&
              showInteractionsButtons('Withdraw', 'WithdrawContract', [
                asset.assetId,
                bucket.id,
              ])}
          </>
        );
      } else {
        if (bucket.delegation) {
          return (
            <ContractContainer>
              {showInteractionsButtons &&
                showInteractionsButtons('Undelegate', 'UndelegateContract', [
                  asset.assetId,
                  bucket.id,
                ])}
              {showInteractionsButtons &&
                showInteractionsButtons('Unfreeze', 'UnfreezeContract', [
                  asset.assetId,
                  bucket.id,
                ])}
            </ContractContainer>
          );
        }
        return (
          <>
            {showInteractionsButtons &&
              showInteractionsButtons('Unfreeze', 'UnfreezeContract', [
                asset.assetId,
                bucket.id,
              ])}
          </>
        );
      }
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
        element: <>{bucket?.availableEpoch}</>,
        span: 1,
      },
      {
        element: (
          <>
            {bucket.delegation.length > 0 ? (
              <>
                <Link href={`/account/${bucket.delegation}`}>
                  <a>{parseAddress(bucket.delegation, 22)}</a>
                </Link>
              </>
            ) : (
              <>{getDelegation()}</>
            )}
          </>
        ),
        span: 2,
      },
      { element: <> {getButton()}</>, span: 2 },
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
    'Actions',
  ];

  const tableProps: ITable = {
    ...bucketsTableProps,
    type: 'buckets',
    header,
    rowSections,
  };

  return <Table {...tableProps} />;
};

export default Buckets;
