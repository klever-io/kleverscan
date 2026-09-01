import { klvAmount, NUMBER_LOCALE } from '@/components/DataList/format';
import { HOLD_LINE } from '@/components/DataList/loadingText';
import {
  DistBar,
  DistSegment,
  LegendDot,
  LegendItem,
  LegendRow,
  Tile,
  TileLabel,
  TileSub,
  TileValue,
  TilesGrid,
} from '@/components/DataList/styles';
import { useTheme } from '@/contexts/theme';
import { useTranslation } from 'next-i18next';
import React, { useMemo } from 'react';
import {
  stateSegmentColor,
  ValidatorsSummaryCard,
  WideOnlyTile,
} from './styles';
import ValidatorsSummaryLoadingCard, {
  CompositionPlaceholder,
  CompositionUnavailable,
} from './LoadingCard';
import {
  blockResult,
  delegationRoom,
  listComposition,
  nodeFigures,
  sumStaked,
} from './summaryFigures';
import { useValidatorSources } from './useValidatorSources';

const pct = (value: number, digits = 1): string => `${value.toFixed(digits)}%`;

/**
 * What the page already fetches and used to throw away.
 *
 * Every figure here comes from the two calls the version distribution needed
 * anyway, so the card costs no extra request: four of them from the validator
 * list, three from the node heartbeat whose nine unread fields this is the
 * first consumer of.
 */
const ValidatorsSummary: React.FC = () => {
  const { t } = useTranslation(['validators']);
  const { theme } = useTheme();
  const { data, isLoading } = useValidatorSources();

  const { validators, entries, validatorsAvailable, heartbeatAvailable } = data;

  /* Five full passes over the set, so once per settle rather than once per
     render: the card has no React.memo and the page renders it on every
     Stake/Nodes toggle, which none of these five depend on. */
  const figures = useMemo(
    () => ({
      composition: listComposition(validators),
      totalStaked: sumStaked(validators),
      room: delegationRoom(validators),
      nodes: nodeFigures(entries, validators),
      blocks: blockResult(validators),
    }),
    [validators, entries],
  );

  const label = t('validators:Summary.Label', {
    defaultValue: 'Validator network statistics',
  });

  if (isLoading) return <ValidatorsSummaryLoadingCard label={label} />;

  const { composition, totalStaked, room, nodes, blocks } = figures;
  const elected = composition.find(part => part.state === 'elected');

  /* A failed source resolves as a successful empty answer (the hook settles
     both halves rather than rejecting), so without this every tile would state
     0 as a measured fact. The card next to this one already says so out loud
     from the same two flags. The sub keeps a line box, or the card changes
     height between the two states. */
  const unavailable = t('validators:Summary.NoData');
  const listed = <T,>(value: T): T | string =>
    validatorsAvailable ? value : unavailable;
  const listedSub = (value: string): string =>
    validatorsAvailable ? value : HOLD_LINE;
  const nodesKnown = heartbeatAvailable && validatorsAvailable;

  return (
    <ValidatorsSummaryCard aria-label={label}>
      <TilesGrid>
        <Tile>
          <TileLabel>{t('validators:Summary.Validators')}</TileLabel>
          <TileValue>
            {listed(validators.length.toLocaleString(NUMBER_LOCALE))}
          </TileValue>
          <TileSub>
            {listedSub(
              t('validators:Summary.Elected', { count: elected?.count ?? 0 }),
            )}
          </TileSub>
        </Tile>

        <Tile>
          <TileLabel>{t('validators:Summary.Staked')}</TileLabel>
          <TileValue>{listed(klvAmount(totalStaked))}</TileValue>
          <TileSub>
            {/* Not `shareOfNetwork`: that denominator is the sum of these very
                rows, so it reads 100% always. The elected set's slice of the
                stake does move, and is what concentration looks like here. */}
            {listedSub(
              t('validators:Summary.ElectedHolds', {
                share: pct(elected?.stakeShare ?? 0),
              }),
            )}
          </TileSub>
        </Tile>

        <Tile>
          <TileLabel>{t('validators:Summary.OpenForDelegation')}</TileLabel>
          <TileValue>
            {listed(room.open.toLocaleString(NUMBER_LOCALE))}
          </TileValue>
          <TileSub>
            {listedSub(
              `${t('validators:Summary.RoomLeft', {
                amount: klvAmount(room.room),
              })}${
                room.uncapped > 0
                  ? ` · ${t('validators:Summary.AlsoUncapped', {
                      count: room.uncapped,
                    })}`
                  : ''
              }`,
            )}
          </TileSub>
        </Tile>

        <Tile>
          <TileLabel>{t('validators:Summary.NodesOnline')}</TileLabel>
          <TileValue>
            {nodesKnown
              ? `${nodes.active.toLocaleString(NUMBER_LOCALE)} / ${nodes.total.toLocaleString(NUMBER_LOCALE)}`
              : unavailable}
          </TileValue>
          <TileSub>
            {/* No aggregate uptime beside this: a node reports `totalUpTimeSec`
                since its own last restart, so the sum swung from 97,33% to
                99,99% within one afternoon on mainnet. */}
            {nodesKnown
              ? t('validators:Summary.Observers', { count: nodes.observers })
              : HOLD_LINE}
          </TileSub>
        </Tile>

        <WideOnlyTile>
          <TileLabel>{t('validators:Summary.BlocksProduced')}</TileLabel>
          <TileValue>
            {listed(blocks.produced.toLocaleString(NUMBER_LOCALE))}
          </TileValue>
          <TileSub>
            {listedSub(
              blocks.successShare === undefined
                ? t('validators:Summary.NoData')
                : t('validators:Summary.SuccessRate', {
                    rate: pct(blocks.successShare, 1),
                  }),
            )}
          </TileSub>
        </WideOnlyTile>
      </TilesGrid>

      {/* Keyed on the composition, not on the availability flag, so the two
          branches are complementary by construction. A list that answers
          successfully with zero validators is in its loaded state and used to
          fall between them: measured at 1440 the card was 108.5px against the
          157.5 of every other state, the exact hole this placeholder holds. */}
      {composition.length === 0 &&
        (validatorsAvailable ? (
          <CompositionPlaceholder />
        ) : (
          /* A failed list used to take the placeholder branch, which is a
             loading skeleton: the tiles said "Not available" while the bottom
             of the card kept shimmering, and the recovery poll stops after ten
             attempts, so it shimmered for the life of the tab. */
          <CompositionUnavailable />
        ))}
      {composition.length > 0 && (
        <>
          <DistBar
            role="img"
            aria-label={`${t('validators:Summary.Composition')}: ${composition
              .map(
                part =>
                  `${t(`validators:States.${part.state}`, {
                    defaultValue: part.state,
                  })} ${part.count}`,
              )
              .join(', ')}`}
          >
            {composition.map((part, index) => (
              <DistSegment
                key={part.state}
                $color={stateSegmentColor(theme, part.state)}
                $delay={index * 40}
                style={{ width: `${part.share}%` }}
              />
            ))}
          </DistBar>
          <LegendRow>
            {composition.map(part => (
              <LegendItem key={part.state}>
                <LegendDot $color={stateSegmentColor(theme, part.state)} />
                {`${t(`validators:States.${part.state}`, {
                  defaultValue: part.state,
                })} ${part.count}`}
              </LegendItem>
            ))}
          </LegendRow>
        </>
      )}
    </ValidatorsSummaryCard>
  );
};

export default ValidatorsSummary;
