import { PropsWithChildren } from 'react';
import { statusWithIcon } from '@/assets/status';
import Copy from '@/components/Copy';
import Skeleton from '@/components/Skeleton';
import { timestampToDate } from '@/utils/timeFunctions';
import { Row } from '@/views/assets/detail';
import { useTranslation } from 'next-i18next';
import React, { useCallback } from 'react';
import { AssetProps } from './OverviewTab';

export const MoreTab: React.FC<PropsWithChildren<AssetProps>> = ({ asset }) => {
  const { t } = useTranslation(['common', 'assets']);

  const getIssueDate = useCallback(() => {
    if (asset?.issueDate) {
      return timestampToDate(asset?.issueDate);
    }

    return '--';
  }, [asset?.issueDate]);

  return (
    <>
      <Row span={2}>
        <span>
          <strong>{t('assets:More.Issuing Time')}</strong>
        </span>
        <span>{asset ? getIssueDate() : <Skeleton />}</span>
      </Row>
      <Row span={2}>
        <span>
          <strong>{t('assets:More.Issuer')}</strong>
        </span>
        <div>
          {asset ? (
            asset?.ownerAddress ? (
              <>
                <span>{asset?.ownerAddress}</span>
                <Copy data={asset?.ownerAddress} info="Issue" />
              </>
            ) : (
              '--'
            )
          ) : (
            <Skeleton />
          )}
        </div>
      </Row>
      <Row>
        <span>
          <strong>{t('table:Precision')}</strong>
        </span>
        <span>{asset ? asset.precision : <Skeleton />}</span>
      </Row>
      <Row>
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
      <Row>
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
      <Row>
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
      <Row>
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
      <Row>
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
      <Row>
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
      <Row>
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
      <Row>
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
      <Row>
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
