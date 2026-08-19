import React from 'react';
import CopyAction from '@/components/DataList/CopyAction';
import ExplorerLink from '@/components/DataList/ExplorerLink';
import {
  BadgePill,
  MobileBarRow,
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
import AssetIdentity from '@/components/DataList/AssetIdentity';
import { IAsset } from '@/types';
import { formatAmount } from '@/utils/formatFunctions';
import { IoIosInfinite } from 'react-icons/io';
import { MobileCapCaption, RewardsRate, RewardsUnit } from './styles';
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
      <MobileTopRow>
        <AssetIdentity
          href={`/asset/${assetId}`}
          testId="asset-link"
          name={name}
          assetId={assetId}
          ticker={ticker}
          logo={logo}
          verified={verified}
        />
        {assetType === 'NonFungible' && (
          <BadgePill $variant="neutral" title={ASSET_BADGE_TOOLTIPS.nft}>
            NFT
          </BadgePill>
        )}
        {assetType === 'SemiFungible' && (
          <BadgePill $variant="neutral" title={ASSET_BADGE_TOOLTIPS.sft}>
            SFT
          </BadgePill>
        )}
        {attributes?.isPaused && (
          <BadgePill $variant="warning" title={ASSET_BADGE_TOOLTIPS.paused}>
            Paused
          </BadgePill>
        )}
        {hasKdaPool && (
          <BadgePill $variant="accent" title={ASSET_BADGE_TOOLTIPS.pool}>
            Fee Pool
          </BadgePill>
        )}
        <RowActions>
          <CopyAction
            value={assetId}
            label="Copy asset ID"
            announcement="Asset ID copied to clipboard"
            large
          />
          <ExplorerLink href={`/asset/${assetId}`} subject="asset" large />
        </RowActions>
      </MobileTopRow>
      <MobileTotalRow>
        <MobileMetaItem>Circulating</MobileMetaItem>
        <strong>
          {formatAmount(circulating / precisionDivisor)} {ticker}
        </strong>
      </MobileTotalRow>
      <MobileBarRow>
        {cap.hasCap ? (
          <>
            <ShareTrack $fluid aria-hidden="true">
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
              {formatShare(capBasis, maxSupply)} of{' '}
              {formatAmount(maxSupply / precisionDivisor)} cap
            </MobileCapCaption>
          </>
        ) : (
          <MobileCapCaption>
            <IoIosInfinite size={14} /> Unlimited supply
          </MobileCapCaption>
        )}
      </MobileBarRow>
      <MobileMetaRow>
        <MobileMetaItem>
          Staked{' '}
          {staking
            ? `${formatAmount(totalStaked / precisionDivisor)} (${formatShare(
                totalStaked,
                circulating,
              )})`
            : 'n/a'}
        </MobileMetaItem>
        <MobileMetaItem>
          {rewards.kind === 'apr' && (
            <>
              <RewardsRate>{rewards.rate}</RewardsRate>
              <RewardsUnit>APR</RewardsUnit>
            </>
          )}
          {rewards.kind === 'apr-configured' && <RewardsUnit>APR</RewardsUnit>}
          {rewards.kind === 'fpr' && (
            <BadgePill $variant="neutral" title={FPR_TOOLTIP}>
              FPR
            </BadgePill>
          )}
          {rewards.kind === 'none' && 'Rewards n/a'}
        </MobileMetaItem>
      </MobileMetaRow>
    </MobileListCard>
  );
};

export default AssetsMobileCard;
