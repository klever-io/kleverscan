import { getStatusIcon } from '@/assets/status';
import Copy from '@/components/Copy';
import QrCodeModal from '@/components/QrCodeModal';
import Skeleton from '@/components/Skeleton';
import { Status } from '@/components/Table/styles';
import { IAssetPool } from '@/types';
import { toLocaleFixed } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { HoverAnchor, Row } from '@/views/assets/detail';
import { ReceiveBackground } from '@/views/validator';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React from 'react';
import { AssetProps } from './OverviewTab';

interface KDAPoolTabProps extends AssetProps {
  assetPool: IAssetPool | undefined;
}

export const KDAPoolTab: React.FC<KDAPoolTabProps> = ({ asset, assetPool }) => {
  const { t } = useTranslation(['common', 'assets']);

  const isActive = assetPool?.active;
  const ActiveIcon = getStatusIcon(isActive ? 'success' : 'fail');

  return (
    <>
      <Row span={2}>
        <span>
          <strong>Owner</strong>
        </span>

        <div>
          <Link href={`/account/${assetPool?.ownerAddress}`}>
            <HoverAnchor>{assetPool?.ownerAddress}</HoverAnchor>
          </Link>
          <Copy data={assetPool?.ownerAddress} info="ownerAddress" />
          <ReceiveBackground isOverflow={true}>
            <QrCodeModal
              value={assetPool?.ownerAddress as string}
              isOverflow={true}
            />
          </ReceiveBackground>
        </div>
      </Row>
      <Row>
        <span>
          <strong>Is Active</strong>
        </span>
        <span>
          <small>
            {assetPool ? (
              <Status
                status={isActive ? 'success' : 'fail'}
                key={String(isActive)}
              >
                <ActiveIcon />
                <p>
                  {isActive
                    ? `${t('common:Statements.Yes')}`
                    : `${t('common:Statements.No')}`}
                </p>
              </Status>
            ) : (
              <Skeleton />
            )}
          </small>
        </span>
      </Row>
      <Row>
        <span>
          <strong>KLV Balance</strong>
        </span>
        <span>
          <small>
            {assetPool ? (
              toLocaleFixed(
                assetPool?.klvBalance / 10 ** KLV_PRECISION,
                KLV_PRECISION,
              )
            ) : (
              <Skeleton />
            )}
          </small>
        </span>
      </Row>
      <Row>
        <span>
          <strong>KDA Balance</strong>
        </span>
        <span>
          <small>
            {assetPool && asset ? (
              toLocaleFixed(
                (assetPool?.kdaBalance || 0) / 10 ** asset?.precision,
                asset?.precision,
              )
            ) : (
              <Skeleton />
            )}
          </small>
        </span>
      </Row>
      <Row>
        <span>
          <strong>Converted Fees</strong>
        </span>
        <span>
          <small>
            {assetPool ? String(assetPool.convertedFees) : <Skeleton />}
          </small>
        </span>
      </Row>
      <Row span={2}>
        <span>
          <strong>Ratio</strong>
        </span>
        <span>{assetPool ? String(assetPool.ratio) : <Skeleton />}</span>
      </Row>
      <Row span={2}>
        <span>
          <strong>Admin Address</strong>
        </span>
        <div>{assetPool ? String(assetPool.adminAddress) : <Skeleton />}</div>
      </Row>
    </>
  );
};
