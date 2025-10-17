import { PropsWithChildren } from 'react';
import Copy from '@/components/Copy';
import QrCodeModal from '@/components/QrCodeModal';
import Skeleton from '@/components/Skeleton';
import { ISftAsset } from '@/types';
import { toLocaleFixed } from '@/utils/formatFunctions';
import { HoverAnchor, Row } from '@/views/assets/detail';
import { ReceiveBackground } from '@/views/validator';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React from 'react';

export interface SftOverviewProps {
  sft?: ISftAsset;
}

export const SftOverviewTab: React.FC<PropsWithChildren<SftOverviewProps>> = ({
  sft,
}) => {
  const { t } = useTranslation(['common', 'assets', 'table']);

  const formatSupply = (
    value?: number,
    { infiniteOnZero = false }: { infiniteOnZero?: boolean } = {},
  ) => {
    if (!sft) return 'N/A';
    if (infiniteOnZero && value === 0) return '∞';
    return toLocaleFixed(
      (value || 0) / 10 ** (sft?.precision || 0),
      sft?.precision || 0,
    );
  };

  return (
    <>
      {sft?.ownerAddress && (
        <Row span={2}>
          <span>
            <strong>{t('table:Owner')}</strong>
          </span>

          <div>
            <Link href={`/account/${sft?.ownerAddress}`} legacyBehavior>
              <HoverAnchor>{sft?.ownerAddress}</HoverAnchor>
            </Link>
            <Copy data={sft?.ownerAddress} info="ownerAddress" />
            <ReceiveBackground isOverflow={true}>
              <QrCodeModal value={sft?.ownerAddress} isOverflow={true} />
            </ReceiveBackground>
          </div>
        </Row>
      )}

      <Row span={2}>
        <span>
          <strong>{t('table:MaxSupply')}</strong>
        </span>
        <span>
          <small>
            {sft ? (
              formatSupply(sft?.meta?.maxSupply, { infiniteOnZero: true })
            ) : (
              <Skeleton />
            )}
          </small>
        </span>
      </Row>

      <Row span={2}>
        <span>
          <strong>{t('table:CirculatingSupply')}</strong>
        </span>
        <span>
          <small>
            {sft ? formatSupply(sft?.meta?.circulationSupply) : <Skeleton />}
          </small>
        </span>
      </Row>

      <Row>
        <span>
          <strong>{t('table:Precision')}</strong>
        </span>
        <span>
          <small>{sft ? sft?.precision : <Skeleton />}</small>
        </span>
      </Row>
    </>
  );
};
