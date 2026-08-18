import React from 'react';
import CopyAction from '@/components/DataList/CopyAction';
import { exactAmount } from '@/components/DataList/format';
import {
  ActionLink,
  AssetIdLine,
  AssetName,
  BadgePill,
  IdentityLink,
  IdentityText,
  MobileListCard,
  MobileMetaItem,
  MobileMetaRow,
  MobileTopRow,
  MobileTotalRow,
  RowActions,
} from '@/components/DataList/styles';
import AssetLogo from '@/components/Logo/AssetLogo';
import { IAssetPoolRow } from '@/types';
import { formatAmount } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { MdOpenInNew } from 'react-icons/md';

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
  const { kda, name, logo, ticker, assetVerified, precision, active } = pool;
  const rate = getPoolRate(pool.fRatioKLV, pool.fRatioKDA, precision);
  const displayTicker = ticker || kda.split('-')[0];

  return (
    <MobileListCard data-testid={`table-row-${index}`}>
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
          <IdentityText>
            <AssetName>{name || kda}</AssetName>
            <AssetIdLine>{kda}</AssetIdLine>
          </IdentityText>
        </IdentityLink>
        {!active && (
          <BadgePill $variant="warning" title={POOL_DISABLED_TOOLTIP}>
            Disabled
          </BadgePill>
        )}
        <RowActions>
          <CopyAction
            value={kda}
            label="Copy asset ID"
            announcement="Asset ID copied to clipboard"
            large
          />
          <ActionLink
            href={`/asset/${kda}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open asset in a new tab"
            title="Open in a new tab"
            $large
          >
            <MdOpenInNew size={16} />
          </ActionLink>
        </RowActions>
      </MobileTopRow>
      <MobileTotalRow>
        <MobileMetaItem>Fee rate</MobileMetaItem>
        <MobileRateCell>
          <MobileRateValue>
            {rate === undefined ? '--' : `${formatRate(rate)} ${displayTicker}`}
          </MobileRateValue>
          <RateUnit>per 1 KLV</RateUnit>
        </MobileRateCell>
      </MobileTotalRow>
      <MobileMetaRow>
        <MobileMetaItem
          title={`${exactAmount(pool.klvBalance, KLV_PRECISION)} KLV`}
        >
          KLV reserve {formatAmount(pool.klvBalance / 10 ** KLV_PRECISION)}
        </MobileMetaItem>
        <MobileMetaItem
          title={
            precision === undefined
              ? undefined
              : `${exactAmount(pool.kdaBalance, precision)} ${displayTicker}`
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
