import {
  DistBar,
  LegendItem,
  LegendRow,
  Tile,
  TileLabel,
  TileValue,
  TilesGrid,
} from '@/components/DataList/styles';
import Skeleton from '@/components/Skeleton';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { LIST_STATES } from './summaryFigures';
import {
  CompositionNotice,
  LegendPlaceholderDot,
  LoadingTileSub,
  ValidatorsSummaryCard,
  WideOnlyTile,
} from './styles';

/** Occupies a text line without painting one, so each slot keeps the exact
 *  line box its value will have, at every root font size and in every locale. */
const HOLD_LINE = '\u200b';

const INLINE: React.CSSProperties = {
  display: 'inline-block',
  verticalAlign: 'middle',
};

/** The bar's legend names one state per slice. The placeholder carries the
 *  REAL state names rather than a guessed pixel width, which is the only way
 *  it wraps onto the same number of lines the loaded legend does: a fixed 76px
 *  made the failed card taller than the loaded one at 320 and 480, and 64px
 *  still missed at 480. Same reasoning as the tile labels above. */
const LEGEND_STATES = LIST_STATES;

/** The fifth is hidden below the mobile breakpoint, exactly as the loaded card
 *  hides it, or the card changes height the moment the figures land. */
const TILE_KEYS = [
  'Validators',
  'Staked',
  'OpenForDelegation',
  'NodesOnline',
] as const;

/**
 * The bar and its legend, in the two states that have neither: still loading,
 * and loaded from a source that failed. The loaded card is 158px with them and
 * 109 without, and the version card and the table sit under it, so leaving the
 * space unheld moved the page 78px when a poll recovered mid-session.
 */
/**
 * The same slot when the list failed rather than when it is still coming.
 *
 * `CompositionPlaceholder` is a loading skeleton, and a failed list took that
 * branch too, so the bottom of the card shimmered for the life of the tab
 * while the tiles above it already said "Not available". It holds the same
 * height, because the version card and the table sit underneath.
 */
export const CompositionUnavailable: React.FC = () => {
  const { t } = useTranslation(['validators']);

  return (
    <CompositionNotice>
      {t('validators:Summary.CompositionUnavailable', {
        defaultValue:
          'Could not load the validator composition. Please try refreshing the page.',
      })}
    </CompositionNotice>
  );
};

export const CompositionPlaceholder: React.FC = () => {
  const { t } = useTranslation(['validators']);

  return (
    <>
      <DistBar aria-hidden="true">
        <Skeleton width="100%" height={8} />
      </DistBar>
      <LegendRow aria-hidden="true">
        {LEGEND_STATES.map(state => (
          <LegendItem key={state}>
            <LegendPlaceholderDot />
            {t(`validators:States.${state}`, { defaultValue: state })}
            <Skeleton width={22} height={12} containerCustomStyles={INLINE} />
          </LegendItem>
        ))}
      </LegendRow>
    </>
  );
};

/**
 * The card's loading shape, built from the loaded card's own components with
 * the real labels in place and bars only where figures go.
 *
 * Real labels rather than the generic `SummaryLoading`, for the reason blocks
 * documents: a fixed pixel height misses once the root font scales below the
 * tablet width, and again when a label wraps, so the card jumps when the
 * figures land.
 */
const ValidatorsSummaryLoadingCard: React.FC<{ label: string }> = ({
  label,
}) => {
  const { t } = useTranslation(['validators']);

  return (
    <ValidatorsSummaryCard aria-label={label} aria-busy="true">
      <TilesGrid>
        {TILE_KEYS.map(key => (
          <Tile key={key}>
            <TileLabel>{t(`validators:Summary.${key}`)}</TileLabel>
            <TileValue>
              {HOLD_LINE}
              <Skeleton width={90} height={20} containerCustomStyles={INLINE} />
            </TileValue>
            <LoadingTileSub>
              {HOLD_LINE}
              <Skeleton
                width={110}
                height={12}
                containerCustomStyles={INLINE}
              />
            </LoadingTileSub>
          </Tile>
        ))}
        <WideOnlyTile>
          <TileLabel>{t('validators:Summary.BlocksProduced')}</TileLabel>
          <TileValue>
            {HOLD_LINE}
            <Skeleton width={90} height={20} containerCustomStyles={INLINE} />
          </TileValue>
          <LoadingTileSub>
            {HOLD_LINE}
            <Skeleton width={110} height={12} containerCustomStyles={INLINE} />
          </LoadingTileSub>
        </WideOnlyTile>
      </TilesGrid>
      <CompositionPlaceholder />
    </ValidatorsSummaryCard>
  );
};

export default ValidatorsSummaryLoadingCard;
