import { useTranslation } from 'next-i18next';
import React from 'react';
import ExplainedBadge from '@/components/DataList/ExplainedBadge';
import CopyAction from '@/components/DataList/CopyAction';
import ExplorerLink from '@/components/DataList/ExplorerLink';
import { exactAmount } from '@/components/DataList/format';
import {
  AssetName,
  IdentityLink,
  MobileListCard,
  MobileMetaItem,
  MobileMetaRow,
  MobileTopRow,
  MobileTotalRow,
  RowActions,
} from '@/components/DataList/styles';
import { TickerBadge } from '@/components/DataList/styles';
import AssetLogo from '@/components/Logo/AssetLogo';
import { IAssetPoolRow } from '@/types';
import { formatAmount } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';

import { formatRate, getPoolRate } from './helpers';
import { POOL_DISABLED_TOOLTIP } from './texts';
import { MobileRateCell, MobileRateValue, RateUnit } from './styles';

export interface IPoolsMobileCardProps {
  item: IAssetPoolRow;
  index: number;
}

/**
 * Card layout for mobile and tablet: pool identity on top, the fee rate as
 * the headline, then both reserves on the meta line.
 */
const PoolsMobileCard: React.FC<IPoolsMobileCardProps> = ({
  item: pool,
  index,
}) => {
  const { t } = useTranslation(['assets']);
  const { kda, name, logo, ticker, assetVerified, precision, active } = pool;
  const rate = getPoolRate(pool.fRatioKLV, pool.fRatioKDA, precision);
  const displayTicker = ticker || kda.split('-')[0];

  return (
    <MobileListCard data-testid={`table-row-${index}`}>
      {/* One line, id included, so the badge and the two action buttons centre
          on the name instead of floating between two lines: the same header
          the assets card carries. */}
      <MobileTopRow>
        <IdentityLink
          href={`/asset/${kda}`}
          data-testid="pool-link"
          title={name || kda}
        >
          <AssetLogo
            logo={logo || ''}
            ticker={displayTicker}
            name={name || kda}
            verified={assetVerified}
            size={32}
          />
          <AssetName>{name || kda}</AssetName>
          <TickerBadge $variant="contract">{kda}</TickerBadge>
        </IdentityLink>
        {!active && (
          <ExplainedBadge variant="warning" msg={t(POOL_DISABLED_TOOLTIP)}>
            {t('assets:Pools.Disabled')}
          </ExplainedBadge>
        )}
        <RowActions>
          <CopyAction
            value={kda}
            label={t('assets:Common.CopyAssetId')}
            announcement={t('assets:Common.AssetIdCopied')}
            large
          />
          <ExplorerLink
            href={`/asset/${kda}`}
            label={t('assets:Common.OpenAsset')}
            title={t('assets:Common.OpenInNewTab')}
            large
          />
        </RowActions>
      </MobileTopRow>
      <MobileTotalRow>
        <MobileMetaItem>{t('assets:Pools.FeeRate')}</MobileMetaItem>
        <MobileRateCell>
          <MobileRateValue>
            {rate === undefined ? '--' : `${formatRate(rate)} ${displayTicker}`}
          </MobileRateValue>
          <RateUnit>{t('assets:Pools.PerOneKlv')}</RateUnit>
        </MobileRateCell>
      </MobileTotalRow>
      <MobileMetaRow>
        <MobileMetaItem
          title={`${exactAmount(pool.klvBalanceString ?? pool.klvBalance, KLV_PRECISION)} KLV`}
        >
          KLV reserve {formatAmount(pool.klvBalance / 10 ** KLV_PRECISION)}
        </MobileMetaItem>
        <MobileMetaItem
          title={
            precision === undefined
              ? undefined
              : `${exactAmount(pool.kdaBalanceString ?? pool.kdaBalance, precision)} ${displayTicker}`
          }
        >
          {displayTicker} reserve{' '}
          {precision === undefined
            ? '--'
            : formatAmount(pool.kdaBalance / 10 ** precision)}
        </MobileMetaItem>
      </MobileMetaRow>
    </MobileListCard>
  );
};

export default PoolsMobileCard;
