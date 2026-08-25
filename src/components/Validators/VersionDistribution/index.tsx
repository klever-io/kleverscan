import Skeleton from '@/components/Skeleton';
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
  LatestCallout,
  ModeButton,
  ModeToggle,
  StackedBar,
  StatDivider,
  StatItem,
  StatLabel,
  StatsStrip,
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
  totalValidators?: number;
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
  totalValidators,
  loading,
  heartbeatAvailable,
  validatorsAvailable,
  mode,
  onModeChange,
  selectedVersion,
  onSelectVersion,
}) => {
  const [expanded, setExpanded] = useState(false);

  const latestStat = useMemo(() => stats.find(s => s.isLatest), [stats]);

  const onLatestPercent =
    mode === 'stake'
      ? (latestStat?.stakePercent ?? 0)
      : (latestStat?.percent ?? 0);

  // Strip always shows node-based % on latest (upgrade health at a glance).
  const onLatestNodesPercent = latestStat?.percent;
  const heartbeatFailed = !loading && !heartbeatAvailable;
  const validatorsFailed = !loading && !validatorsAvailable;

  const visibleStats = useMemo(() => {
    if (expanded || stats.length <= COLLAPSE_THRESHOLD) return stats;
    return stats.slice(0, INITIAL_VISIBLE);
  }, [expanded, stats]);

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
    return `${stat.count} node${stat.count === 1 ? '' : 's'}`;
  };

  const formatPercent = (stat: VersionStat) => {
    const value = mode === 'stake' ? stat.stakePercent : stat.percent;
    return `${value.toFixed(1)}%`;
  };

  const segmentPercent = (stat: VersionStat) =>
    mode === 'stake' ? stat.stakePercent : stat.percent;

  const distributionBody = () => {
    if (loading) {
      return (
        <>
          <Skeleton width="40%" height={14} />
          <Skeleton width="100%" height={8} />
          <Skeleton width="100%" height={32} />
          <Skeleton width="100%" height={32} />
        </>
      );
    }

    if (heartbeatFailed) {
      return (
        <EmptyText>
          Could not load node versions. Please try refreshing the page.
        </EmptyText>
      );
    }

    if (validatorsFailed) {
      return (
        <EmptyText>
          Could not load the full validator list for version stats. Please try
          refreshing the page.
        </EmptyText>
      );
    }

    if (stats.length === 0) {
      return <EmptyText>—</EmptyText>;
    }

    return (
      <>
        {latestVersion && (
          <LatestCallout $good={onLatestPercent >= 50}>
            {onLatestPercent.toFixed(1)}% of{' '}
            {mode === 'stake' ? 'stake' : 'nodes'} on latest ({latestVersion})
          </LatestCallout>
        )}

        <StackedBar role="img" aria-label="Version distribution bar">
          {stats.map(stat => (
            <BarSegment
              key={stat.version}
              $percent={segmentPercent(stat)}
              $tone={toneFor(stat)}
              title={`${stat.version}: ${formatValue(stat)} (${formatPercent(stat)})`}
            />
          ))}
        </StackedBar>

        <VersionList aria-label="Version distribution">
          {visibleStats.map(stat => (
            <li key={stat.version}>
              <VersionRow
                type="button"
                $selected={selectedVersion === stat.version}
                aria-pressed={selectedVersion === stat.version}
                title={`Filter by ${stat.version}`}
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
            +{hiddenCount} other version{hiddenCount === 1 ? '' : 's'}
          </ExpandButton>
        )}
        {expanded && stats.length > COLLAPSE_THRESHOLD && (
          <ExpandButton type="button" onClick={() => setExpanded(false)}>
            Show less
          </ExpandButton>
        )}
      </>
    );
  };

  return (
    <HeaderStack data-testid="version-distribution">
      <StatsStrip aria-label="Validator network summary">
        <StatItem>
          <StatLabel>Total Validators</StatLabel>
          {loading && totalValidators === undefined ? (
            <Skeleton width={48} height={22} />
          ) : (
            <StatValue>{totalValidators ?? '—'}</StatValue>
          )}
        </StatItem>

        <StatDivider aria-hidden />

        <StatItem>
          <StatLabel>Newest Version</StatLabel>
          {loading && !latestVersion ? (
            <Skeleton width={80} height={22} />
          ) : (
            <StatValue title={latestVersion}>{latestVersion ?? '—'}</StatValue>
          )}
        </StatItem>

        <StatDivider aria-hidden />

        <StatItem>
          <StatLabel>On Latest</StatLabel>
          {loading && onLatestNodesPercent === undefined ? (
            <Skeleton width={64} height={22} />
          ) : onLatestNodesPercent !== undefined ? (
            <StatValue
              $accent={onLatestNodesPercent >= 50}
              data-testid="on-latest-callout"
            >
              {onLatestNodesPercent.toFixed(1)}%
            </StatValue>
          ) : (
            <StatValue>—</StatValue>
          )}
        </StatItem>
      </StatsStrip>

      <DistributionCard>
        <CardTop>
          <CardTitle>
            <strong>Version Distribution</strong>
          </CardTitle>
          {!heartbeatFailed && !validatorsFailed && (
            <ModeToggle role="group" aria-label="Distribution metric">
              <ModeButton
                type="button"
                $active={mode === 'nodes'}
                aria-pressed={mode === 'nodes'}
                onClick={() => onModeChange('nodes')}
              >
                Nodes
              </ModeButton>
              <ModeButton
                type="button"
                $active={mode === 'stake'}
                aria-pressed={mode === 'stake'}
                onClick={() => onModeChange('stake')}
              >
                Stake
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
