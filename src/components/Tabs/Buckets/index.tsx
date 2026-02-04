import { PropsWithChildren } from 'react';
import Copy from '@/components/Copy';
import Table, { ITable } from '@/components/Table';
import { useContractModal } from '@/contexts/contractModal';
import api from '@/services/api';
import { CenteredRow, RowContent } from '@/styles/common';
import { IAssetsBuckets, IInnerTableProps, IRowSection } from '@/types/index';
import { parseAddress } from '@/utils/parseValues';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ContractContainer, Status } from './styles';

export interface IBuckets {
  bucketsTableProps: IInnerTableProps;
  showInteractionButtons?: boolean;
}

const Buckets: React.FC<PropsWithChildren<IBuckets>> = ({
  bucketsTableProps,
  showInteractionButtons,
}) => {
  const UINT32_MAX = 4294967295;
  const { t } = useTranslation('accounts');
  const { getInteractionsButtons } = useContractModal();

  const { data: epoch } = useQuery({
    queryKey: ['epoch'],
    queryFn: () => requestBlockEpoch(),
  });

  const requestBlockEpoch = async () => {
    const response = await api.get({
      route: 'block/list',
    });
    const currentEpoch = response.data?.blocks[0]?.epoch;
    return currentEpoch;
  };

  const rowSections = (assetBucket: IAssetsBuckets): IRowSection[] => {
    const { asset, bucket } = assetBucket;

    const minEpochsToUnstake = asset?.staking?.minEpochsToUnstake ?? 1;
    const minEpochsToWithdraw = asset?.staking?.minEpochsToWithdraw ?? 2;

    const unfreezeEquation =
      (bucket?.stakedEpoch || 0) + minEpochsToUnstake - epoch;
    const isUnfreezeLocked = () => {
      return unfreezeEquation > 0;
    };
    const withdrawEquation =
      (bucket?.unstakedEpoch || 0) - epoch + minEpochsToWithdraw;

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
        isWithdrawLocked()
          ? t('SingleAccount.Buttons.Withdraw')
          : t('SingleAccount.Buttons.Unfreeze')
      } (in ${textEquation} epoch${textEquation > 1 ? 's' : ''})`;
    };

    const [
      DelegateButton,
      UndelegateButton,
      WithdrawButton,
      UnfreezeButton,
      LockedButton,
    ] = getInteractionsButtons([
      {
        title: t('SingleAccount.Buttons.Delegate'),
        contractType: 'DelegateContract',
        defaultValues: {
          bucketId: bucket?.id,
        },
      },
      {
        title: t('SingleAccount.Buttons.Undelegate'),
        contractType: 'UndelegateContract',
        defaultValues: {
          bucketId: bucket?.id,
        },
      },
      {
        title: t('SingleAccount.Buttons.Withdraw'),
        contractType: 'WithdrawContract',
        defaultValues: {
          withdrawType: 0,
          collection: asset?.assetId,
        },
      },
      {
        title: t('SingleAccount.Buttons.Unfreeze'),
        contractType: 'UnfreezeContract',
        defaultValues: {
          collection: asset?.assetId,
          bucketId: bucket?.id,
        },
      },
      {
        title: `${lockedText()}`,
        contractType: '--',
      },
    ]);

    const getDelegation = () => {
      if (bucket?.delegation) {
        return <></>;
      } else if (asset?.assetId === 'KLV') {
        return <>{showInteractionButtons && <DelegateButton />}</>;
      } else {
        return <>--</>;
      }
    };

    const getButton = () => {
      if (isUnfreezeLocked() || isWithdrawLocked()) {
        if (bucket?.delegation) {
          return (
            <>
              {showInteractionButtons && <UndelegateButton />}
              {showInteractionButtons && <LockedButton />}
            </>
          );
        }
        return <>{showInteractionButtons && <LockedButton />}</>;
      } else if (bucket?.unstakedEpoch !== UINT32_MAX) {
        if (bucket?.delegation) {
          return (
            <>
              {showInteractionButtons && <UndelegateButton />}
              {showInteractionButtons && <WithdrawButton />}
            </>
          );
        }
        return <>{showInteractionButtons && <WithdrawButton />}</>;
      } else {
        if (bucket?.delegation) {
          return (
            <ContractContainer>
              {showInteractionButtons && <UndelegateButton />}
              {showInteractionButtons && <UnfreezeButton />}
            </ContractContainer>
          );
        }
        return <>{showInteractionButtons && <UnfreezeButton />}</>;
      }
    };

    const sections: IRowSection[] = [
      {
        element: props => (
          <Link href={`/asset/${asset?.assetId}`} key={asset?.assetId}>
            {asset?.assetId}
          </Link>
        ),
        span: 1,
      },
      {
        element: props => (
          <p key={bucket?.unstakedEpoch}>
            {(
              (bucket?.balance || 0) /
              10 ** (asset?.precision || 0)
            ).toLocaleString()}
          </p>
        ),
        span: 1,
      },
      {
        element: props => (
          <Status staked={true} key={'true'}>
            {'True'}
          </Status>
        ),
        span: 1,
      },
      {
        element: props => (
          <span key={bucket?.unstakedEpoch}>
            {bucket?.stakedEpoch?.toLocaleString()}
          </span>
        ),
        span: 1,
      },
      {
        element: props => (
          <RowContent key={bucket?.id}>
            <CenteredRow className="bucketIdCopy">
              <span>{parseAddress(bucket?.id || '', 24)}</span>
              <Copy info="BucketId" data={bucket?.id} />
            </CenteredRow>
          </RowContent>
        ),
        span: 2,
      },
      {
        element: props => (
          <>
            {bucket?.unstakedEpoch === UINT32_MAX
              ? '--'
              : bucket?.unstakedEpoch?.toLocaleString()}
          </>
        ),
        span: 1,
      },
      {
        element: props => <>{bucket?.availableEpoch}</>,
        span: 1,
      },
      {
        element: props => (
          <>
            {bucket?.delegation?.length && bucket?.delegation?.length > 0 ? (
              <>
                <Link href={`/validator/${bucket?.delegation}`}>
                  {parseAddress(bucket?.delegation, 22)}
                </Link>
              </>
            ) : (
              <>{getDelegation()}</>
            )}
          </>
        ),
        span: 2,
      },
      { element: props => <> {getButton()}</>, span: 2 },
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
