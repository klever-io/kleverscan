import { PropsWithChildren } from 'react';
import Copy from '@/components/Copy';
import { exactAmount, formatShare } from '@/components/DataList/format';
import { InlineShare } from '@/components/DataList/styles';
import QrCodeModal from '@/components/QrCodeModal';
import Skeleton from '@/components/Skeleton';
import Tooltip from '@/components/Tooltip';
import { holdersCall, transactionCall } from '@/services/requests/asset';
import { IAsset } from '@/types';
import { parseApr } from '@/utils';
import { toLocaleFixed } from '@/utils/formatFunctions';
import { VOID_ADDRESS } from '@/utils/globalVariables';
import { getCirculatingSupply, voidRowState } from '@/utils/voidSupply';
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

  const voidRows = voidRowState(asset);
  const showVoidSupply = voidRows !== 'hidden';

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
    {
      infiniteOnZero = false,
      exact,
    }: { infiniteOnZero?: boolean; exact?: string } = {},
  ) => {
    if (isSftCollection) return value;
    if (!asset) return 'N/A';
    // A missing figure is not zero. Rendering it as 0 would claim a supply
    // that was never reported, which is the failure this metric prevents.
    if (typeof value !== 'number') return 'N/A';
    if (infiniteOnZero && value === 0) return '∞';
    // The exact digit twin from the parse boundary (#679), rendered with the
    // same fixed-decimals presentation the number path produces.
    if (exact !== undefined) {
      return exactAmount(exact, asset.precision, { trimFraction: false });
    }
    return toLocaleFixed(value / 10 ** asset.precision, asset.precision);
  };

  // Both void-derived rows mount before the asset resolves, so both render a
  // skeleton first; formatSupply would answer 'N/A'. A missing asset is the
  // 'loading' state of voidRowState, spelled out here so it narrows the type.
  const renderCirculatingSupply = () => {
    if (!asset) return <Skeleton />;
    return formatSupply(asset.netCirculatingSupply, {
      exact: asset.netCirculatingSupplyString,
    });
  };

  const renderVoidValue = () => {
    if (!asset) return <Skeleton />;
    return (
      <Link href={`/account/${VOID_ADDRESS}`} legacyBehavior>
        <HoverAnchor>
          <small>
            {formatSupply(asset.voidedSupply, {
              exact: asset.voidedSupplyString,
            })}
          </small>
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
              formatSupply(asset?.maxSupply, {
                infiniteOnZero: true,
                exact: asset?.maxSupplyString,
              })
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
            {asset ? (
              formatSupply(asset?.initialSupply, {
                exact: asset?.initialSupplyString,
              })
            ) : (
              <Skeleton />
            )}
          </small>
        </span>
      </Row>
      <Row>
        <span>
          <strong>{t('assets:Overview.Total Supply')}</strong>
        </span>
        <div>
          <small>
            {asset ? (
              formatSupply(asset?.circulatingSupply, {
                exact: asset?.circulatingSupplyString,
              })
            ) : (
              <Skeleton />
            )}
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
