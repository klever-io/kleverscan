import { statusWithIcon } from '@/assets/status';
import Copy from '@/components/Copy';
import Skeleton from '@/components/Skeleton';
import { CenteredRow } from '@/styles/common';
import { timestampToDate } from '@/utils/timeFunctions';
import { Row } from '@/views/assets/detail';
import { useTranslation } from 'next-i18next';
import React, { useCallback } from 'react';
import { AssetProps } from './OverviewTab';

export const MoreTab: React.FC<AssetProps> = ({ asset }) => {
  const { t } = useTranslation(['common', 'assets']);

  const getIssueDate = useCallback(() => {
    if (asset?.issueDate) {
      return timestampToDate(asset?.issueDate);
    }

    return '--';
  }, [asset?.issueDate]);

  return (
    <>
      <Row isStakingRoyalties={false}>
        <span>
          <strong>{t('assets:More.Issuing Time')}</strong>
        </span>
        <span>{asset ? getIssueDate() : <Skeleton />}</span>
      </Row>
      <Row isStakingRoyalties={false}>
        <span>
          <strong>{t('assets:More.Issuer')}</strong>
        </span>
        <span>
          {asset ? (
            asset?.ownerAddress ? (
              asset?.ownerAddress
            ) : (
              '--'
            )
          ) : (
            <Skeleton />
          )}
        </span>
        {asset?.ownerAddress && (
          <CenteredRow>
            <Copy data={asset?.ownerAddress} info="Issue" />
          </CenteredRow>
        )}
      </Row>
      <Row isStakingRoyalties={false}>
        <span>
          <strong>{t('table:Precision')}</strong>
        </span>
        <span>{asset ? asset.precision : <Skeleton />}</span>
      </Row>
      <Row isStakingRoyalties={false}>
        <span>
          <strong>
            {t('common:Properties.Can', {
              type: `${t('common:Properties.Freeze')}`,
            })}
          </strong>
        </span>
        <span>
          {asset ? statusWithIcon(asset.properties.canFreeze, t) : <Skeleton />}
        </span>
      </Row>
      <Row isStakingRoyalties={false}>
        <span>
          <strong>
            {t('common:Properties.Can', {
              type: `${t('common:Properties.Wipe')}`,
            })}
          </strong>
        </span>
        <span>
          {asset ? statusWithIcon(asset.properties.canWipe, t) : <Skeleton />}
        </span>
      </Row>
      <Row isStakingRoyalties={false}>
        <span>
          <strong>
            {t('common:Properties.Can', {
              type: `${t('common:Properties.Pause')}`,
            })}
          </strong>
        </span>
        <span>
          {asset ? statusWithIcon(asset.properties.canPause, t) : <Skeleton />}
        </span>
      </Row>
      <Row isStakingRoyalties={false}>
        <span>
          <strong>
            {t('common:Properties.Can', {
              type: `${t('common:Properties.Mint')}`,
            })}
          </strong>
        </span>
        <span>
          {asset ? statusWithIcon(asset.properties.canMint, t) : <Skeleton />}
        </span>
      </Row>
      <Row isStakingRoyalties={false}>
        <span>
          <strong>
            {t('common:Properties.Can', {
              type: `${t('common:Properties.Burn')}`,
            })}
          </strong>
        </span>
        <span>
          {asset ? statusWithIcon(asset.properties.canBurn, t) : <Skeleton />}
        </span>
      </Row>
      <Row isStakingRoyalties={false}>
        <span>
          <strong>
            {t('common:Properties.Can', {
              type: `${t('common:Properties.Change Owner')}`,
            })}
          </strong>
        </span>
        <span>
          {asset ? (
            statusWithIcon(asset.properties.canChangeOwner, t)
          ) : (
            <Skeleton />
          )}
        </span>
      </Row>
      <Row isStakingRoyalties={false}>
        <span>
          <strong>
            {t('common:Properties.Can', {
              type: `${t('common:Properties.Add Roles')}`,
            })}
          </strong>
        </span>
        <span>
          {asset ? (
            statusWithIcon(asset.properties.canAddRoles, t)
          ) : (
            <Skeleton />
          )}
        </span>
      </Row>
      <Row isStakingRoyalties={false}>
        <span>
          <strong>
            {t('common:Properties.Can', {
              type: `${t('common:Properties.Pause')}`,
            })}
          </strong>
        </span>
        <span>
          {asset ? statusWithIcon(asset.attributes.isPaused, t) : <Skeleton />}
        </span>
      </Row>
      <Row isStakingRoyalties={false}>
        <span>
          <strong>{t('common:Properties.NFT Mint Stopped')}</strong>
        </span>
        <span>
          {asset ? (
            statusWithIcon(asset.attributes.isNFTMintStopped, t)
          ) : (
            <Skeleton />
          )}
        </span>
      </Row>
    </>
  );
};
