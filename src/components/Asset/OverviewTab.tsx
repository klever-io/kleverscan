import { PropsWithChildren } from 'react';
import Copy from '@/components/Copy';
import QrCodeModal from '@/components/QrCodeModal';
import Skeleton from '@/components/Skeleton';
import { holdersCall, transactionCall } from '@/services/requests/asset';
import { IAsset } from '@/types';
import { parseApr } from '@/utils';
import { toLocaleFixed } from '@/utils/formatFunctions';
import { HoverAnchor, Row } from '@/views/assets/detail';
import { ReceiveBackground } from '@/views/validator';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AssetTypeString } from '@/types/assets';

export interface AssetProps {
  asset?: IAsset;
}

export const OverviewTab: React.FC<PropsWithChildren<AssetProps>> = ({
  asset,
}) => {
  const router = useRouter();
  const { t } = useTranslation(['common', 'assets']);

  const { data: transactionsPagination } = useQuery({
    queryKey: [`transactionAsset`, router.query.asset],
    queryFn: () => transactionCall(router.query.asset as string),
    enabled: !!router?.isReady,
  });

  const { data: holdersPagination } = useQuery({
    queryKey: [`holdersAsset`, router.query.asset],
    queryFn: () => holdersCall(router.query.asset as string),
    enabled: !!router?.isReady,
  });

  const isSftCollection =
    asset?.assetType === AssetTypeString.SemiFungible &&
    !asset?.assetId?.includes('/');

  const formatSupply = (
    value?: number,
    { infiniteOnZero = false }: { infiniteOnZero?: boolean } = {},
  ) => {
    if (isSftCollection) return value;
    if (!asset) return 'N/A';
    if (infiniteOnZero && value === 0) return '∞';
    return toLocaleFixed(
      (value || 0) / 10 ** (asset?.precision || 0),
      asset?.precision || 0,
    );
  };

  return (
    <>
      {asset?.ownerAddress && (
        <Row span={2}>
          <span>
            <strong>{t('table:Owner')}</strong>
          </span>

          <div>
            <Link href={`/account/${asset?.ownerAddress}`} legacyBehavior>
              <HoverAnchor>{asset?.ownerAddress}</HoverAnchor>
            </Link>
            <Copy data={asset?.ownerAddress} info="ownerAddress" />
            <ReceiveBackground isOverflow={true}>
              <QrCodeModal value={asset?.ownerAddress} isOverflow={true} />
            </ReceiveBackground>
          </div>
        </Row>
      )}

      <Row>
        <span>
          <strong>{t('table:MaxSupply')}</strong>
        </span>
        <span>
          <small>
            {asset ? (
              formatSupply(asset?.maxSupply, { infiniteOnZero: true })
            ) : (
              <Skeleton />
            )}
          </small>
        </span>
      </Row>
      <Row>
        <span>
          <strong>{t('table:InitialSupply')}</strong>
        </span>
        <span>
          <small>
            {asset ? formatSupply(asset?.initialSupply) : <Skeleton />}
          </small>
        </span>
      </Row>
      <Row>
        <span>
          <strong>{t('table:CirculatingSupply')}</strong>
        </span>
        <span>
          <small>
            {asset ? formatSupply(asset?.circulatingSupply) : <Skeleton />}
          </small>
        </span>
      </Row>
      <Row>
        <span>
          <strong>{t('assets:Overview.Burned Value')}</strong>
        </span>
        <span>
          <small>
            {asset ? (
              toLocaleFixed(
                asset?.burnedValue / 10 ** asset?.precision,
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
          <strong>{t('common:Cards.Total Staked')}</strong>
        </span>
        <span>
          <small>
            {asset ? (
              toLocaleFixed(
                (asset?.staking?.totalStaked || 0) / 10 ** asset?.precision,
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
          <strong>{t('assets:Overview.Holders')}</strong>
        </span>
        <span>{asset ? holdersPagination?.totalRecords : <Skeleton />}</span>
      </Row>
      <Row>
        <span>
          <strong>{t('common:Titles.Transactions')}</strong>
        </span>
        <span>
          {asset ? (
            toLocaleFixed(transactionsPagination?.totalRecords ?? 0, 0)
          ) : (
            <Skeleton />
          )}
        </span>
      </Row>
      <Row>
        <span>
          <strong>{t('assets:Overview.Staking Type')}</strong>
        </span>
        <span>
          {asset ? parseApr(asset?.staking?.interestType) : <Skeleton />}
        </span>
      </Row>
    </>
  );
};
