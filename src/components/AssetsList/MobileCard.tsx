import { useTranslation } from 'next-i18next';
import React from 'react';
import ExplainedBadge from '@/components/DataList/ExplainedBadge';
import CopyAction from '@/components/DataList/CopyAction';
import ExplorerLink from '@/components/DataList/ExplorerLink';
import {
  AssetName,
  IdentityLink,
  MobileListCard,
  MobileMetaItem,
  MobileMetaRow,
  MobileTopRow,
  MobileTotalRow,
  RowActions,
  ShareFill,
  ShareSegment,
  ShareTrack,
} from '@/components/DataList/styles';
import { formatShare } from '@/components/DataList/format';
import AssetLogo from '@/components/Logo/AssetLogo';
import { IAsset } from '@/types';
import { formatAmount } from '@/utils/formatFunctions';
import { IoIosInfinite } from 'react-icons/io';
import {
  TickerBadge,
  MobileCapCaption,
  MobileCapRow,
  RewardsRate,
  RewardsUnit,
} from './styles';
import { assetSupplyViews, getCapUsage, getRewardsModel } from './helpers';
import { ASSET_BADGE_TOOLTIPS, FPR_TOOLTIP } from './badgeTexts';

export interface IAssetsMobileCardProps {
  item: IAsset;
  index: number;
}

/**
 * Card layout for mobile and tablet: identity on top, circulating below it,
 * the cap lifecycle bar with its caption, then the staked and rewards line.
 */
const AssetsMobileCard: React.FC<IAssetsMobileCardProps> = ({
  item: asset,
  index,
}) => {
  const { t } = useTranslation(['assets']);
  const {
    assetId,
    name,
    ticker,
    logo,
    verified,
    assetType,
    precision,
    maxSupply,
    staking,
    attributes,
    hasKdaPool,
  } = asset;

  const precisionDivisor = 10 ** precision;
  const { circulating, capBasis } = assetSupplyViews(asset);
  // See the desktop row: the cap measures minted minus burned, so the void
  // balance counts towards it.
  const cap = getCapUsage(capBasis, maxSupply);
  const rewards = getRewardsModel(staking);
  const totalStaked = staking?.totalStaked ?? 0;

  return (
    <MobileListCard data-testid={`table-row-${index}`}>
      {/* One line, id included, so the badges and the two action buttons
          centre on the name instead of floating between two lines, and the
          card is a row shorter than the stacked identity block made it. */}
      <MobileTopRow>
        <IdentityLink
          href={`/asset/${assetId}`}
          data-testid="asset-link"
          title={name}
        >
          <AssetLogo
            logo={logo}
            ticker={ticker}
            name={name}
            verified={verified}
            size={32}
          />
          <AssetName>{name}</AssetName>
          <TickerBadge $variant="contract">{assetId}</TickerBadge>
        </IdentityLink>
        {assetType === 'NonFungible' && (
          <ExplainedBadge variant="neutral" msg={t(ASSET_BADGE_TOOLTIPS.nft)}>
            {t('assets:List.Nft')}
          </ExplainedBadge>
        )}
        {assetType === 'SemiFungible' && (
          <ExplainedBadge variant="neutral" msg={t(ASSET_BADGE_TOOLTIPS.sft)}>
            {t('assets:List.Sft')}
          </ExplainedBadge>
        )}
        {attributes?.isPaused && (
          <ExplainedBadge
            variant="warning"
            msg={t(ASSET_BADGE_TOOLTIPS.paused)}
          >
            {t('assets:List.Paused')}
          </ExplainedBadge>
        )}
        {hasKdaPool && (
          <ExplainedBadge variant="accent" msg={t(ASSET_BADGE_TOOLTIPS.pool)}>
            Fee Pool
          </ExplainedBadge>
        )}
        <RowActions>
          <CopyAction
            value={assetId}
            label={t('assets:Common.CopyAssetId')}
            announcement={t('assets:Common.AssetIdCopied')}
            large
          />
          <ExplorerLink
            href={`/asset/${assetId}`}
            label={t('assets:Common.OpenAsset')}
            title={t('assets:Common.OpenInNewTab')}
            large
          />
        </RowActions>
      </MobileTopRow>
      {/* Circulating, its cap bar and the figure on one line: the bar
          measures the same supply the figure states, and as its own row it
          left the card four lines tall with the middle of two of them
          empty. */}
      <MobileTotalRow>
        <MobileMetaItem>{t('assets:List.Circulating')}</MobileMetaItem>
        <MobileCapRow>
          {cap.hasCap ? (
            <>
              <ShareTrack aria-hidden="true">
                <ShareFill $delay={Math.min(index, 15) * 20}>
                  {cap.usedShare > 0 && (
                    <ShareSegment
                      $kind="liquid"
                      style={{ width: `${cap.usedShare * 100}%` }}
                    />
                  )}
                </ShareFill>
              </ShareTrack>
              <MobileCapCaption>
                {t('assets:List.OfCapAmount', {
                  share: formatShare(capBasis, maxSupply),
                  max: formatAmount(maxSupply / precisionDivisor),
                })}
              </MobileCapCaption>
            </>
          ) : (
            <MobileCapCaption>
              <IoIosInfinite size={14} /> {t('assets:List.UnlimitedSupply')}
            </MobileCapCaption>
          )}
        </MobileCapRow>
        <strong>
          {formatAmount(circulating / precisionDivisor)} {ticker}
        </strong>
      </MobileTotalRow>
      <MobileMetaRow>
        <MobileMetaItem>
          {t('assets:List.Staked')}{' '}
          {staking
            ? `${formatAmount(totalStaked / precisionDivisor)} (${formatShare(
                totalStaked,
                circulating,
              )})`
            : t('assets:List.NotAvailable')}
        </MobileMetaItem>
        <MobileMetaItem>
          {rewards.kind === 'apr' && (
            <>
              <RewardsRate>{rewards.rate}</RewardsRate>
              <RewardsUnit>{t('assets:List.Apr')}</RewardsUnit>
            </>
          )}
          {rewards.kind === 'apr-configured' && (
            <RewardsUnit>{t('assets:List.Apr')}</RewardsUnit>
          )}
          {rewards.kind === 'fpr' && (
            <ExplainedBadge variant="neutral" msg={t(FPR_TOOLTIP)}>
              FPR
            </ExplainedBadge>
          )}
          {rewards.kind === 'none' && t('assets:List.RewardsUnavailable')}
        </MobileMetaItem>
      </MobileMetaRow>
    </MobileListCard>
  );
};

export default AssetsMobileCard;
