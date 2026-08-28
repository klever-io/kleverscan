import {
  AddressLink,
  MobileListCard,
  MobileMetaItem,
  MobileMetaRow,
  MobileTopRow,
  MobileTotalRow,
} from '@/components/DataList/styles';
import { klvAmount, NUMBER_LOCALE } from '@/components/DataList/format';
import { IBlock } from '@/types/blocks';
import { formatDate, formatDateWithSeconds } from '@/utils/formatFunctions';
import { bandwidthFeeReward } from '@/utils/fees';
import { parseAddress } from '@/utils/parseValues';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { BLOCK_COLUMNS, BlockColumnKey } from './columns';

export interface IBlocksMobileCardProps {
  item: IBlock;
  index: number;
}

/**
 * Replaces the generic heading-per-cell card the shared Table falls back to,
 * which stacked all nine columns into a 217px block; this is the same
 * information at a third of the height.
 */
const BlocksMobileCard: React.FC<IBlocksMobileCardProps> = ({
  item,
  index,
}) => {
  const { t } = useTranslation(['blocks']);
  const label = (key: BlockColumnKey): string => {
    const column = BLOCK_COLUMNS.find(c => c.key === key);
    return column ? t(column.i18nKey, { defaultValue: column.header }) : key;
  };

  const {
    nonce,
    epoch,
    size,
    producerName,
    producerOwnerAddress,
    timestamp,
    txCount,
    txFees,
    kAppFees,
    txBurnedFees,
    blockRewards,
  } = item;

  const elapsed = formatDate(timestamp, { showElapsedTime: true }).split(
    ' (',
  )[0];

  return (
    <MobileListCard data-testid={`table-row-${index}`}>
      <MobileTopRow>
        <AddressLink href={`/block/${nonce}`} data-testid="block-link">
          {nonce}
        </AddressLink>
        <MobileMetaItem title={formatDateWithSeconds(timestamp)}>
          {elapsed}
        </MobileMetaItem>
      </MobileTopRow>

      <MobileTotalRow>
        <MobileMetaItem>{label('blockRewards')}</MobileMetaItem>
        <strong>{klvAmount(blockRewards, { nbsp: true })}</strong>
      </MobileTotalRow>

      <MobileMetaRow>
        <AddressLink href={`/validator/${producerOwnerAddress}`}>
          {parseAddress(producerName, 18)}
        </AddressLink>
        <MobileMetaItem>
          {/* Pluralised through i18next's `count`, so one transaction does not
              read "1 Txs" the way the column heading would have it. */}
          {t('blocks:List.TxCount', {
            count: txCount ?? 0,
            formatted: (txCount ?? 0).toLocaleString(NUMBER_LOCALE),
            defaultValue_one: '{{formatted}} tx',
            defaultValue_other: '{{formatted}} txs',
          })}
          {' · '}
          {`${(size ?? 0).toLocaleString(NUMBER_LOCALE)} B`}
          {' · '}
          {`${t('blocks:Table.Epoch', { defaultValue: 'Epoch' })} ${epoch}`}
        </MobileMetaItem>
      </MobileMetaRow>

      <MobileMetaRow>
        <MobileMetaItem>
          {label('kAppFees')} {klvAmount(kAppFees, { nbsp: true })}
        </MobileMetaItem>
        <MobileMetaItem>
          {label('burnedFees')} {klvAmount(txBurnedFees, { nbsp: true })}
        </MobileMetaItem>
        <MobileMetaItem>
          {label('feeRewards')}{' '}
          {klvAmount(bandwidthFeeReward(txFees), { nbsp: true })}
        </MobileMetaItem>
      </MobileMetaRow>
    </MobileListCard>
  );
};

export default BlocksMobileCard;
