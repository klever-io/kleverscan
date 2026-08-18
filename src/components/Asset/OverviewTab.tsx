import { PropsWithChildren } from 'react';
import Copy from '@/components/Copy';
import { formatShare } from '@/components/DataList/format';
import { InlineShare } from '@/components/DataList/styles';
import QrCodeModal from '@/components/QrCodeModal';
import Skeleton from '@/components/Skeleton';
import Tooltip from '@/components/Tooltip';
import { holdersCall, transactionCall } from '@/services/requests/asset';
import { IAsset } from '@/types';
import { parseApr } from '@/utils';
import { toLocaleFixed } from '@/utils/formatFunctions';
import { VOID_ADDRESS } from '@/utils/globalVariables';
import { getCirculatingSupply, hasVoidSupply } from '@/utils/voidSupply';
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

  // Both answer undefined on an API error, which React Query rejects
  // outright as "data is undefined"; null keeps the counts blank as a
  // successful answer, the same way the asset page handles its lookups.
  const { data: transactionsPagination } = useQuery({
    queryKey: [`transactionAsset`, router.query.asset],
    queryFn: async () =>
      (await transactionCall(router.query.asset as string)) ?? null,
    enabled: !!router?.isReady,
  });

  const { data: holdersPagination } = useQuery({
    queryKey: [`holdersAsset`, router.query.asset],
    queryFn: async () =>
      (await holdersCall(router.query.asset as string)) ?? null,
    enabled: !!router?.isReady,
  });

  // While the asset is still loading we cannot know yet, so keep the rows and
  // let them render their skeletons; only hide them once a loaded asset turns
  // out to come from an API build that does not report the void figures.
  const showVoidSupply = !asset || hasVoidSupply(asset);

  const isSftCollection =
    asset?.assetType === AssetTypeString.SemiFungible &&
    !asset?.assetId?.includes('/');

  // Shares next to the raw amounts: burned measures against everything ever
  // minted (burned plus circulating), staked against the circulating supply.
  const burnedShare =
    asset && asset.burnedValue > 0 && asset.mintedValue > 0
      ? formatShare(asset.burnedValue, asset.mintedValue)
      : undefined;
  const totalStaked = asset?.staking?.totalStaked ?? 0;
  const stakedShare =
    asset && totalStaked > 0 && getCirculatingSupply(asset) > 0
      ? formatShare(totalStaked, getCirculatingSupply(asset))
      : undefined;

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

  // Both void-derived rows mount before the asset resolves, so both need the
  // same loading guard: formatSupply() would answer 'N/A' for a missing asset.
  const renderCirculatingSupply = () => {
    if (!asset) return <Skeleton />;
    return formatSupply(asset.netCirculatingSupply);
  };

  const renderVoidValue = () => {
    if (!asset) return <Skeleton />;
    return (
      <Link href={`/account/${VOID_ADDRESS}`} legacyBehavior>
        <HoverAnchor>
          <small>{formatSupply(asset.voidedSupply)}</small>
        </HoverAnchor>
      </Link>
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
          <strong>{t('assets:Overview.Total Supply')}</strong>
        </span>
        <div>
          <small>
            {asset ? formatSupply(asset?.circulatingSupply) : <Skeleton />}
          </small>
          <Tooltip
            msg={t('assets:Overview.TotalSupplyTooltip')}
            customStyles={{ place: 'right' }}
            maxVw={24}
          />
        </div>
      </Row>
      <Row>
        <span>
          <strong>{t('assets:Overview.Contract Burn')}</strong>
        </span>
        <div>
          <small>
            {asset ? (
              <>
                {toLocaleFixed(
                  (asset?.burnedValue ?? 0) / 10 ** asset?.precision,
                  asset?.precision,
                )}
                {burnedShare && (
                  <InlineShare title="Share of everything ever minted">
                    {' '}
                    ({burnedShare})
                  </InlineShare>
                )}
              </>
            ) : (
              <Skeleton />
            )}
          </small>
          <Tooltip
            msg={t('assets:Overview.ContractBurnTooltip')}
            customStyles={{ place: 'right' }}
            maxVw={24}
          />
        </div>
      </Row>
      {showVoidSupply && (
        <Row>
          <span>
            <strong>{t('assets:Overview.Void')}</strong>
          </span>
          <div>
            {renderVoidValue()}
            <Tooltip
              msg={t('assets:Overview.VoidTooltip')}
              customStyles={{ place: 'right' }}
              maxVw={24}
            />
          </div>
        </Row>
      )}
      <Row>
        <span>
          <strong>{t('common:Titles.Transactions')}</strong>
        </span>
        <span>
          <small>
            {asset ? (
              toLocaleFixed(transactionsPagination?.totalRecords ?? 0, 0)
            ) : (
              <Skeleton />
            )}
          </small>
        </span>
      </Row>
      {showVoidSupply && (
        <Row>
          <span>
            <strong>{t('table:CirculatingSupply')}</strong>
          </span>
          <div>
            <small>{renderCirculatingSupply()}</small>
            <Tooltip
              msg={t('assets:Overview.CirculatingSupplyTooltip')}
              customStyles={{ place: 'right' }}
              maxVw={24}
            />
          </div>
        </Row>
      )}
      <Row>
        <span>
          <strong>{t('assets:Overview.Holders')}</strong>
        </span>
        <span>
          <small>
            {asset ? holdersPagination?.totalRecords : <Skeleton />}
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
              <>
                {toLocaleFixed(
                  (asset?.staking?.totalStaked || 0) / 10 ** asset?.precision,
                  asset?.precision,
                )}
                {stakedShare && (
                  <InlineShare title="Share of the circulating supply">
                    {' '}
                    ({stakedShare})
                  </InlineShare>
                )}
              </>
            ) : (
              <Skeleton />
            )}
          </small>
        </span>
      </Row>
      <Row>
        <span>
          <strong>{t('assets:Overview.Staking Type')}</strong>
        </span>
        <span>
          <small>
            {asset ? parseApr(asset?.staking?.interestType) : <Skeleton />}
          </small>
        </span>
      </Row>
    </>
  );
};
