import { DefaultCardStyleWithBorder } from '@/styles/common';
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
  margin: 1.5rem 0 0.75rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

/** Dense KPI strip: Total · Newest · % on latest */
export const StatsStrip = styled.div`
  ${DefaultCardStyleWithBorder}

  width: 100%;
  padding: 0.85rem 1.25rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0;
  color: ${props => props.theme.black};
`;

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
  flex: 1 1 8rem;
  padding: 0.15rem 0.75rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex: 1 1 100%;
    padding: 0.35rem 0;
  }
`;

export const StatDivider = styled.div`
  width: 1px;
  align-self: stretch;
  min-height: 2.25rem;
  background: ${props =>
    props.theme.dark ? props.theme.black20 : props.theme.black10};
  flex-shrink: 0;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 100%;
    height: 1px;
    min-height: 0;
  }
`;

export const StatLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: ${props => (props.theme.dark ? props.theme.darkText : light.label)};
  line-height: 1.2;
`;

export const StatValue = styled.span<{ $accent?: boolean }>`
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: ${props => {
    if (!props.$accent) return props.theme.black;
    return props.theme.dark ? props.theme.table.success : light.successAccent;
  }};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem 0.75rem;
`;

export const CardTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;

  strong {
    font-weight: 600;
    font-size: 0.95rem;
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

export const VersionList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`;

export const VersionRow = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  min-height: 36px;
  padding: 0.25rem 0.4rem;
  border-radius: 8px;
  border: 1px solid
    ${props => {
      if (!props.$selected) return 'transparent';
      return props.theme.dark ? props.theme.table.success : light.successAccent;
    }};
  background: ${props => {
    if (!props.$selected) return 'transparent';
    return props.theme.dark
      ? transparentize(0.9, props.theme.table.success)
      : light.selectedBg;
  }};
  color: inherit;
  cursor: pointer;
  text-align: left;
  transition:
    background 0.15s linear,
    border-color 0.15s linear;

  &:hover {
    background: ${props =>
      props.theme.dark ? props.theme.black2 : light.hover};
  }

  &:focus-visible {
    outline: 2px solid
      ${props =>
        props.theme.dark ? props.theme.table.success : light.successAccent};
    outline-offset: 2px;
  }
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
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 0.65rem;
  flex-shrink: 0;

  span {
    font-size: 0.85rem;
    font-weight: 600;
  }

  small {
    font-size: 0.75rem;
    color: ${props => (props.theme.dark ? props.theme.darkText : light.label)};
    min-width: 3rem;
    text-align: right;
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
