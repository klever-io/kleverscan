import { DefaultCardStyleWithBorder } from '@/styles/common';
import { focusRing } from '@/components/DataList/styles';
import { transparentize } from 'polished';
import styled, { css } from 'styled-components';

/** Light-mode-only tokens for stronger badge/label contrast on white cards. */
const light = {
  label: '#404264',
  successText: '#1B7A4E',
  successBg: '#E6F6EE',
  successAccent: '#2F9B6A',
  pendingText: '#9A6200',
  pendingBg: '#FFF4E0',
  pendingBar: '#E09A2E',
  unknownText: '#4A4A5A',
  unknownBg: '#F0F0F4',
  unknownBar: 'rgba(0, 0, 0, 0.18)',
  hover: 'rgba(0, 0, 0, 0.04)',
  selectedBg: 'rgba(47, 155, 106, 0.1)',
};

export const HeaderStack = styled.section`
  /* Pulled up under the summary card and given its 24px rhythm back below:
     this reads as the tail of that card rather than a third bordered block,
     which is what made it dominate the page. */
  margin: -0.5rem 0 1.5rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

/** Dense KPI strip: Total · Newest · % on latest */
/**
 * Title, facts and the mode toggle on one line.
 *
 * The figures used to be a KPI strip with dividers, sized by a card that is no
 * longer there: two values at the far left, a divider mid-page and half a
 * screen of nothing after it. They are a caption to the bar below, so they sit
 * inline with the title instead.
 */
/**
 * Title and its two facts as one block, so the facts tuck under the heading
 * instead of under the whole row.
 *
 * The row's height is set by the 34px mode pills, and the 20,5px title sits
 * centred in it. Measured, that left 22,7px between the title and the facts:
 * 6,7px of that centring, 10,4px of the card's column gap and 5,6px of margin.
 * The room this line needs is beside the pills, not below them.
 */
export const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

export const StatsStrip = styled.div`
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  /* Both axes named. A leftover gap declaration from the old strip set the
     column gap to zero and won on source order, so title, label and figure
     rendered as one run: "Version DistributionNEWESTv1.7.21-rc268.4%". */
  gap: 0.2rem 0.75rem;
  color: ${props => props.theme.black};
`;

export const StatItem = styled.div`
  display: inline-flex;
  align-items: baseline;
  gap: 0.35rem;
  white-space: nowrap;
`;

export const StatLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${props => props.theme.darkText};
`;

export const StatValue = styled.span<{ $accent?: boolean }>`
  font-size: 0.8125rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  /* The AA success value, not theme.green: at 0.8125rem this is small text and
     needs 4.5:1, where the raw token measures 2.37:1 on the white card. The
     darkened one is 5.30:1, and it is the value the shared badge palette
     already uses for the same reason. Dark mode keeps the bright token, which
     is 7.71:1 there. */
  color: ${props =>
    props.$accent
      ? props.theme.dark
        ? props.theme.green
        : '#217A50'
      : props.theme.black};
`;

export const DistributionCard = styled.div`
  ${DefaultCardStyleWithBorder}

  width: 100%;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  color: ${props => props.theme.black};
`;

export const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  /* Wraps, or the pills run off the card: at 390px the title block and the
     130px toggle do not fit on one line and "Stake" was clipped by the card
     edge. Measured, not assumed. */
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
`;

export const CardTitle = styled.div`
  font-size: 0.9375rem;
  color: ${props => props.theme.black};

  strong {
    font-weight: 600;
  }
`;

export const ModeToggle = styled.div`
  display: inline-flex;
  border-radius: 999px;
  border: 1px solid
    ${props => (props.theme.dark ? props.theme.black20 : props.theme.black10)};
  overflow: hidden;
  background: ${props =>
    props.theme.dark ? props.theme.black2 : props.theme.white};
`;

export const ModeButton = styled.button<{ $active: boolean }>`
  min-height: 32px;
  min-width: 64px;
  padding: 0.3rem 0.75rem;
  border: none;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  color: ${props => {
    if (props.$active) return props.theme.white;
    return props.theme.dark ? props.theme.darkText : light.label;
  }};
  background: ${props => {
    if (!props.$active) return 'transparent';
    return props.theme.dark ? props.theme.table.success : light.successAccent;
  }};
  transition:
    background 0.15s linear,
    color 0.15s linear;

  &:focus-visible {
    outline: 2px solid
      ${props =>
        props.theme.dark ? props.theme.table.success : light.successAccent};
    outline-offset: 2px;
  }
`;

export const LatestCallout = styled.p<{ $good?: boolean }>`
  margin: 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${props => {
    if (!props.$good) {
      return props.theme.dark ? props.theme.darkText : light.label;
    }
    return props.theme.dark ? props.theme.table.success : light.successText;
  }};
`;

export const StackedBar = styled.div`
  display: flex;
  width: 100%;
  height: 8px;
  border-radius: 999px;
  overflow: hidden;
  background: ${props =>
    props.theme.dark ? props.theme.black20 : props.theme.black10};
`;

export const BarSegment = styled.div<{
  $percent: number;
  $tone: 'latest' | 'known' | 'unknown';
}>`
  height: 100%;
  width: ${props => props.$percent}%;
  min-width: ${props => (props.$percent > 0 ? '2px' : '0')};
  flex-shrink: 0;
  transition: width 0.2s linear;
  background: ${props => {
    if (props.$tone === 'latest') {
      return props.theme.dark ? props.theme.table.success : light.successAccent;
    }
    if (props.$tone === 'unknown') {
      return props.theme.dark ? props.theme.black20 : light.unknownBar;
    }
    return props.theme.dark
      ? transparentize(0.35, props.theme.table.pending)
      : light.pendingBar;
  }};
`;

/** A wrapping legend, not a stack of full-width rows. Those put a badge at one
 *  edge and its numbers at the other, which on a wide screen is a hand-span of
 *  empty space per version. */
export const VersionList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 6px 10px;
`;

export const VersionRow = styled.button<{ $selected: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 8px 3px 3px;
  border: 1px solid
    ${props => (props.$selected ? props.theme.violet : 'transparent')};
  border-radius: 999px;
  background-color: ${props =>
    props.$selected ? transparentize(0.9, props.theme.violet) : 'transparent'};
  cursor: pointer;
  transition: background-color 150ms ease-out;

  &:hover {
    background-color: ${props => transparentize(0.94, props.theme.violet)};
  }

  ${focusRing}
`;

export const VersionMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-width: 0;
  flex: 1;
`;

export const VersionBadge = styled.span<{
  $tone: 'latest' | 'known' | 'unknown';
}>`
  display: inline-flex;
  align-items: center;
  max-width: 14rem;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${props => {
    if (props.$tone === 'latest') {
      return props.theme.dark
        ? css`
            color: ${props.theme.table.success};
            background: ${transparentize(0.8, props.theme.table.success)};
          `
        : css`
            color: ${light.successText};
            background: ${light.successBg};
          `;
    }
    if (props.$tone === 'unknown') {
      return props.theme.dark
        ? css`
            color: ${props.theme.darkText};
            background: ${props.theme.black2};
          `
        : css`
            color: ${light.unknownText};
            background: ${light.unknownBg};
          `;
    }
    return props.theme.dark
      ? css`
          color: ${props.theme.table.pending};
          background: ${transparentize(0.85, props.theme.table.pending)};
        `
      : css`
          color: ${light.pendingText};
          background: ${light.pendingBg};
        `;
  }}
`;

export const VersionValues = styled.div`
  display: inline-flex;
  align-items: baseline;
  gap: 5px;
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  color: ${props => props.theme.black};

  small {
    color: ${props => props.theme.darkText};
  }
`;

export const ExpandButton = styled.button`
  align-self: flex-start;
  min-height: 32px;
  padding: 0.2rem 0.4rem;
  border: none;
  background: transparent;
  color: ${props => (props.theme.dark ? props.theme.darkText : light.label)};
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;

  &:focus-visible {
    outline: 2px solid
      ${props =>
        props.theme.dark ? props.theme.table.success : light.successAccent};
    outline-offset: 2px;
  }
`;

export const EmptyText = styled.span`
  color: ${props => (props.theme.dark ? props.theme.darkText : light.label)};
  font-size: 0.9rem;
`;
