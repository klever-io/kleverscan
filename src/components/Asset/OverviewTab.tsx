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
import { useQuery } from 'react-query';

export interface AssetProps {
  asset?: IAsset;
}

export const OverviewTab: React.FC<AssetProps> = ({ asset }) => {
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

  return (
    <>
      {asset?.ownerAddress && (
        <Row span={2}>
          <span>
            <strong>{t('table:Owner')}</strong>
          </span>

          <div>
            <Link href={`/account/${asset?.ownerAddress}`}>
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
          <strong>{t('table:MaxSupply').toUpperCase()}</strong>
        </span>
        <span>
          <small>
            {asset ? (
              toLocaleFixed(
                asset?.maxSupply / 10 ** asset?.precision,
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
          <strong>{t('table:InitialSupply').toUpperCase()}</strong>
        </span>
        <span>
          <small>
            {asset ? (
              toLocaleFixed(
                asset?.initialSupply / 10 ** asset?.precision,
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
          <strong>{t('table:CirculatingSupply').toUpperCase()}</strong>
        </span>
        <span>
          <small>
            {asset ? (
              toLocaleFixed(
                asset?.circulatingSupply / 10 ** asset?.precision,
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
          <strong>{t('assets:Overview.Burned Value').toUpperCase()}</strong>
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
          <strong>{t('common:Cards.Total Staked').toUpperCase()}</strong>
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
          <strong>{t('assets:Overview.Holders').toUpperCase()}</strong>
        </span>
        <span>{asset ? holdersPagination?.totalRecords : <Skeleton />}</span>
      </Row>
      <Row>
        <span>
          <strong>{t('common:Titles.Transactions').toUpperCase()}</strong>
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
          <strong>{t('common:Cards.Market Cap').toUpperCase()}</strong>
        </span>
        <span>--</span>
      </Row>
      <Row>
        <span>
          <strong>{t('assets:Overview.Staking Type').toUpperCase()}</strong>
        </span>
        <span>
          {asset ? parseApr(asset?.staking?.interestType) : <Skeleton />}
        </span>
      </Row>
    </>
  );
};
