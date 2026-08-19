import { isValidContractAddress } from '@klever/connect';
import React from 'react';
import { useTheme } from '@/contexts/theme';
import { IAsset, IBalance } from '@/types';
import { formatAmount } from '@/utils/formatFunctions';
import { parseAddress } from '@/utils/parseValues';
import { useTranslation } from 'next-i18next';
import CopyAction from '@/components/DataList/CopyAction';
import {
  AddressLink,
  BadgePill,
  LegendDot,
  MobileBarRow,
  MobileListCard,
  MobileMetaItem,
  MobileMetaRow,
  MobileShareValue,
  MobileTopRow,
  MobileTotalRow,
  RowActions,
  ShareFill,
  ShareSegment,
  ShareTrack,
} from '@/components/DataList/styles';
import {
  buildRowBar,
  formatShare,
  getMedalTier,
  IHoldersSummary,
  isVoidAddress,
} from './holdersMath';
import { RankBadge, VoidShareNote } from './styles';

/** What the card needs beyond the row itself; the table supplies the rest. */
export interface IHoldersMobileCardExtras {
  asset: IAsset;
  summary: IHoldersSummary;
  sortedByTotal: boolean;
}

export interface IHoldersMobileCardProps extends IHoldersMobileCardExtras {
  item: IBalance;
  index: number;
}

/**
 * Card layout for mobile and tablet, where the table has no column headers:
 * identity on top, the primary metric with its share below it, then the
 * liquidity split bar, and the color-dotted staked/liquid line as its legend.
 */
const HoldersMobileCard: React.FC<IHoldersMobileCardProps> = ({
  item,
  index,
  asset,
  summary,
  sortedByTotal,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation(['assets']);
  const { address, balance, frozenBalance, totalBalance, rank } = item;
  const isVoid = isVoidAddress(address);
  const isContract = !isVoid && !!address && isValidContractAddress(address);
  const medal = getMedalTier(rank, isVoid, sortedByTotal, summary.medalRanks);
  const bar = isVoid ? undefined : buildRowBar(item, summary.grossSupply);
  const precisionDivisor = 10 ** asset.precision;
  const shareText = formatShare(totalBalance, summary.grossSupply);

  return (
    <MobileListCard data-testid={`table-row-${index}`}>
      <MobileTopRow>
        <RankBadge $medal={medal}>{rank}</RankBadge>
        <AddressLink href={`/account/${address}`} title={address}>
          {parseAddress(address, 12)}
        </AddressLink>
        {isVoid && (
          <BadgePill $variant="void">{t('assets:Overview.Void')}</BadgePill>
        )}
        {isContract && (
          <BadgePill $variant="contract">
            {t('assets:Holders.Contract')}
          </BadgePill>
        )}
        <RowActions>
          <CopyAction
            value={address}
            label={t('assets:Common.CopyAddress')}
            announcement={t('assets:Common.AddressCopied')}
            large
          />
        </RowActions>
      </MobileTopRow>
      <MobileTotalRow>
        <strong>{formatAmount(totalBalance / precisionDivisor)}</strong>
        {isVoid ? (
          <VoidShareNote>{shareText} · burned</VoidShareNote>
        ) : (
          <MobileShareValue>{shareText}</MobileShareValue>
        )}
      </MobileTotalRow>
      {bar && (
        <MobileBarRow>
          <ShareTrack $fluid aria-hidden="true">
            <ShareFill $delay={Math.min(index, 15) * 20}>
              {balance > 0 && (
                <ShareSegment
                  $kind="liquid"
                  style={{
                    width: `${bar.fillRatio * bar.liquidFraction * 100}%`,
                  }}
                />
              )}
              {frozenBalance > 0 && (
                <ShareSegment
                  $kind="staked"
                  style={{
                    width: `${bar.fillRatio * (1 - bar.liquidFraction) * 100}%`,
                  }}
                />
              )}
            </ShareFill>
          </ShareTrack>
        </MobileBarRow>
      )}
      <MobileMetaRow>
        <MobileMetaItem>
          <LegendDot $color={theme.lightPurple} />
          Staked {formatAmount(frozenBalance / precisionDivisor)} (
          {formatShare(frozenBalance, summary.grossSupply)})
        </MobileMetaItem>
        <MobileMetaItem>
          <LegendDot $color={theme.violet} />
          Liquid {formatAmount(balance / precisionDivisor)} (
          {formatShare(balance, summary.grossSupply)})
        </MobileMetaItem>
      </MobileMetaRow>
    </MobileListCard>
  );
};

export default HoldersMobileCard;
