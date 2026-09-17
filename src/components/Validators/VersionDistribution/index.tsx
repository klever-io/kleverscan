import { HOLD_LINE, SKELETON_INLINE } from '@/components/DataList/loadingText';
import Skeleton from '@/components/Skeleton';
import { useTranslation } from 'next-i18next';
import { VersionStat } from '@/services/requests/heartbeat';
import { formatAmount } from '@/utils/formatFunctions';
import { KLV_PRECISION } from '@/utils/globalVariables';
import React, { PropsWithChildren, useMemo, useState } from 'react';
import {
  BarSegment,
  CardTitle,
  CardTop,
  DistributionCard,
  EmptyText,
  ExpandButton,
  HeaderStack,
  ModeButton,
  ModeToggle,
  StackedBar,
  StatItem,
  StatLabel,
  StatsStrip,
  TitleBlock,
  StatValue,
  VersionBadge,
  VersionList,
  VersionMeta,
  VersionRow,
  VersionValues,
} from './styles';

export type DistributionMode = 'nodes' | 'stake';

export interface VersionDistributionProps {
  stats: VersionStat[];
  latestVersion?: string;
  /** True while validators and/or heartbeat are still loading. */
  loading: boolean;
  /** False when heartbeat finished without usable version data. */
  heartbeatAvailable: boolean;
  /** False when full validator snapshot failed to load. */
  validatorsAvailable: boolean;
  mode: DistributionMode;
  onModeChange: (mode: DistributionMode) => void;
  selectedVersion?: string;
  onSelectVersion: (version: string | undefined) => void;
}

const COLLAPSE_THRESHOLD = 4;
const INITIAL_VISIBLE = 3;

const toneFor = (stat: VersionStat): 'latest' | 'known' | 'unknown' => {
  if (stat.isUnknown) return 'unknown';
  if (stat.isLatest) return 'latest';
  return 'known';
};

const VersionDistribution: React.FC<
  PropsWithChildren<VersionDistributionProps>
> = ({
  stats,
  latestVersion,
  loading,
  heartbeatAvailable,
  validatorsAvailable,
  mode,
  onModeChange,
  selectedVersion,
  onSelectVersion,
}) => {
  const { t } = useTranslation(['validators']);
  const [expanded, setExpanded] = useState(false);

  const latestStat = useMemo(() => stats.find(s => s.isLatest), [stats]);

  const onLatestPercent =
    mode === 'stake'
      ? (latestStat?.stakePercent ?? 0)
      : (latestStat?.percent ?? 0);

  const heartbeatFailed = !loading && !heartbeatAvailable;
  const validatorsFailed = !loading && !validatorsAvailable;

  /* The selected row is always among the visible ones. Collapsing hides
     everything past the third, and the sort forces Unknown last, so on mainnet
     `?version=Unknown` (64 of 209 validators, and the state the card's own row
     click produces) left no row carrying aria-pressed and no way to see or
     clear the filter without first opening "other versions". */
  const visibleStats = useMemo(() => {
    if (expanded || stats.length <= COLLAPSE_THRESHOLD) return stats;
    const head = stats.slice(0, INITIAL_VISIBLE);
    const selected = stats.find(stat => stat.version === selectedVersion);
    return selected && !head.includes(selected) ? [...head, selected] : head;
  }, [expanded, stats, selectedVersion]);

  const hiddenCount = Math.max(stats.length - visibleStats.length, 0);

  const handleRowClick = (version: string) => {
    if (selectedVersion === version) {
      onSelectVersion(undefined);
    } else {
      onSelectVersion(version);
    }
  };

  const formatValue = (stat: VersionStat) => {
    if (mode === 'stake') {
      return `${formatAmount(stat.stake / 10 ** KLV_PRECISION)} KLV`;
    }
    return t('validators:Distribution.NodeCount', { count: stat.count });
  };

  const formatPercent = (stat: VersionStat) => {
    const value = mode === 'stake' ? stat.stakePercent : stat.percent;
    return `${value.toFixed(1)}%`;
  };

  const segmentPercent = (stat: VersionStat) =>
    mode === 'stake' ? stat.stakePercent : stat.percent;

  const distributionBody = () => {
    if (loading) {
      /* Two shapes because the loaded body has two: the 8px bar and the 30px
         row of version chips. Four placeholders (14 + 8 + 32 + 32) stood the
         card at 205px against the loaded 134, so it shrank 71px the moment the
         figures landed and took the table below it up with it. Measured at
         1440; both states are 134px now. */
      return (
        <>
          <Skeleton width="100%" height={8} />
          <Skeleton width="100%" height={30} />
        </>
      );
    }

    if (heartbeatFailed) {
      return (
        <EmptyText>{t('validators:Distribution.HeartbeatFailed')}</EmptyText>
      );
    }

    if (validatorsFailed) {
      return (
        <EmptyText>{t('validators:Distribution.ValidatorsFailed')}</EmptyText>
      );
    }

    if (stats.length === 0) {
      return <EmptyText>- -</EmptyText>;
    }

    return (
      <>
        <StackedBar
          role="img"
          aria-label={t('validators:Distribution.BarLabel')}
        >
          {stats.map(stat => (
            <BarSegment
              key={stat.version}
              $percent={segmentPercent(stat)}
              $tone={toneFor(stat)}
              title={`${stat.version}: ${formatValue(stat)} (${formatPercent(stat)})`}
            />
          ))}
        </StackedBar>

        <VersionList aria-label={t('validators:Distribution.ListLabel')}>
          {visibleStats.map(stat => (
            <li key={stat.version}>
              <VersionRow
                type="button"
                $selected={selectedVersion === stat.version}
                aria-pressed={selectedVersion === stat.version}
                title={t('validators:Distribution.FilterBy', {
                  version: stat.version,
                })}
                onClick={() => handleRowClick(stat.version)}
              >
                <VersionMeta>
                  <VersionBadge $tone={toneFor(stat)} title={stat.version}>
                    {stat.version}
                  </VersionBadge>
                </VersionMeta>
                <VersionValues>
                  <span>{formatValue(stat)}</span>
                  <small>{formatPercent(stat)}</small>
                </VersionValues>
              </VersionRow>
            </li>
          ))}
        </VersionList>

        {hiddenCount > 0 && !expanded && (
          <ExpandButton type="button" onClick={() => setExpanded(true)}>
            {t('validators:Distribution.OtherVersions', {
              count: hiddenCount,
            })}
          </ExpandButton>
        )}
        {expanded && stats.length > COLLAPSE_THRESHOLD && (
          <ExpandButton type="button" onClick={() => setExpanded(false)}>
            {t('validators:Distribution.ShowLess')}
          </ExpandButton>
        )}
      </>
    );
  };

  return (
    <HeaderStack data-testid="version-distribution">
      <DistributionCard>
        <CardTop>
          <TitleBlock>
            <CardTitle>
              <strong>{t('validators:Distribution.Title')}</strong>
            </CardTitle>

            <StatsStrip aria-label={t('validators:Distribution.SummaryLabel')}>
              <StatItem>
                <StatLabel>{t('validators:Distribution.Newest')}</StatLabel>
                {loading && !latestVersion ? (
                  /* Through StatValue, not beside it: a bare Skeleton carries
                     its own line box and stood the header 2px taller than the
                     loaded one. */
                  <StatValue>
                    {HOLD_LINE}
                    <Skeleton
                      width={80}
                      height={14}
                      containerCustomStyles={SKELETON_INLINE}
                    />
                  </StatValue>
                ) : (
                  <StatValue title={latestVersion}>
                    {latestVersion ?? '- -'}
                  </StatValue>
                )}
              </StatItem>

              <StatItem>
                {/* Follows the mode: it sits directly above the bar it
                    describes, so pinning it to nodes would print two
                    disagreeing "on latest" figures the moment you pick Stake. */}
                {loading && latestStat === undefined ? (
                  <StatValue>
                    {HOLD_LINE}
                    <Skeleton
                      width={64}
                      height={14}
                      containerCustomStyles={SKELETON_INLINE}
                    />
                  </StatValue>
                ) : latestStat !== undefined ? (
                  <StatValue
                    $accent={onLatestPercent >= 50}
                    data-testid="on-latest-callout"
                  >
                    {t(
                      mode === 'stake'
                        ? 'validators:Distribution.OnLatestStake'
                        : 'validators:Distribution.OnLatestNodes',
                      { percent: onLatestPercent.toFixed(1) },
                    )}
                  </StatValue>
                ) : (
                  <StatValue>- -</StatValue>
                )}
              </StatItem>
            </StatsStrip>
          </TitleBlock>

          {!heartbeatFailed && !validatorsFailed && (
            <ModeToggle
              role="group"
              aria-label={t('validators:Distribution.MetricLabel')}
            >
              <ModeButton
                type="button"
                $active={mode === 'nodes'}
                aria-pressed={mode === 'nodes'}
                onClick={() => onModeChange('nodes')}
              >
                {t('validators:Distribution.ModeNodes')}
              </ModeButton>
              <ModeButton
                type="button"
                $active={mode === 'stake'}
                aria-pressed={mode === 'stake'}
                onClick={() => onModeChange('stake')}
              >
                {t('validators:Distribution.ModeStake')}
              </ModeButton>
            </ModeToggle>
          )}
        </CardTop>

        {distributionBody()}
      </DistributionCard>
    </HeaderStack>
  );
};

export default VersionDistribution;
