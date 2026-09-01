import {
  DistBar,
  LegendItem,
  LegendRow,
  Tile,
  TileLabel,
  TileSub,
  TileValue,
  TilesGrid,
} from '@/components/DataList/styles';
import Skeleton from '@/components/Skeleton';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { PageSummaryCard } from './styles';

/** Occupies a text line without painting one, so each slot keeps the exact
 *  line box its value will have, at every root font size and in every locale. */
const HOLD_LINE = '\u200b';

const INLINE: React.CSSProperties = {
  display: 'inline-block',
  verticalAlign: 'middle',
};

/** The breakdown names Transfer, Smart Contract, Claim, Freeze and Other. */
const LEGEND_SLOTS = [0, 1, 2, 3, 4];

const TILES = [
  { key: 'Last24h', fallback: 'Transactions (24h)' },
  { key: 'Total', fallback: 'Total transactions' },
  { key: 'MostTransacted', fallback: 'Most transacted' },
] as const;

/**
 * The bar and its legend, in both states that lack them: the full skeleton and
 * the middle state where the tiles have landed and the breakdown has not. The
 * shared SummaryBarPlaceholder draws three 150px entries, which is one line at
 * 390px where this legend's five take two, so using it for the middle state
 * dropped the card 17px and grew it back when the bar arrived.
 */
export const ContractsBarPlaceholder: React.FC = () => (
  <>
    <DistBar aria-hidden="true">
      <Skeleton width="100%" height={8} />
    </DistBar>
    <LegendRow aria-hidden="true">
      {LEGEND_SLOTS.map(slot => (
        <LegendItem key={slot}>
          {HOLD_LINE}
          <Skeleton width={92} height={12} containerCustomStyles={INLINE} />
        </LegendItem>
      ))}
    </LegendRow>
  </>
);

/**
 * The card's loading shape, built from the loaded card's own components with
 * the real labels in place and bars only where figures go.
 *
 * Real labels rather than the generic `SummaryLoading`: that one sizes its
 * slots with fixed pixel heights (15/27.5/16.5), and this card's lines measure
 * 14/24/16, so the card stood 14px taller than the loaded one and the page
 * dropped when the figures landed. Same reasoning as the validators card.
 */
const TransactionsSummaryLoadingCard: React.FC<{ label: string }> = ({
  label,
}) => {
  const { t } = useTranslation(['transactions']);

  return (
    <PageSummaryCard aria-label={label} aria-busy="true">
      <TilesGrid>
        {TILES.map(tile => (
          <Tile key={tile.key}>
            <TileLabel>
              {t(`transactions:Summary.${tile.key}`, {
                defaultValue: tile.fallback,
              })}
            </TileLabel>
            <TileValue>
              {HOLD_LINE}
              <Skeleton width={90} height={20} containerCustomStyles={INLINE} />
            </TileValue>
            <TileSub>
              {HOLD_LINE}
              <Skeleton
                width={110}
                height={14}
                containerCustomStyles={INLINE}
              />
            </TileSub>
          </Tile>
        ))}
      </TilesGrid>
      <ContractsBarPlaceholder />
    </PageSummaryCard>
  );
};

export default TransactionsSummaryLoadingCard;
