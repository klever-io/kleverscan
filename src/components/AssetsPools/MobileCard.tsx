import React from 'react';
import CopyAction from '@/components/DataList/CopyAction';
import ExplorerLink from '@/components/DataList/ExplorerLink';
import { exactAmount } from '@/components/DataList/format';
import {
  BadgePill,
  MobileListCard,
  MobileMetaItem,
  MobileMetaRow,
  MobileTopRow,
  MobileTotalRow,
  RowActions,
} from '@/components/DataList/styles';
import AssetIdentity from '@/components/DataList/AssetIdentity';
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
  const { kda, name, logo, ticker, assetVerified, precision, active } = pool;
  const rate = getPoolRate(pool.fRatioKLV, pool.fRatioKDA, precision);
  const displayTicker = ticker || kda.split('-')[0];

  return (
    <MobileListCard data-testid={`table-row-${index}`}>
      <MobileTopRow>
        <AssetIdentity
          href={`/asset/${kda}`}
          testId="pool-link"
          name={name || kda}
          assetId={kda}
          ticker={displayTicker}
          logo={logo || ''}
          verified={assetVerified}
        />
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
          <ExplorerLink href={`/asset/${kda}`} subject="asset" large />
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
