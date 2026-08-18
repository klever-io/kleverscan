import {
  DATA_LIST_ROW_HEIGHT,
  dataListTableSkin,
  focusRing,
  successColor,
} from '@/components/DataList/styles';
import { HeaderItem, MobileCardItem } from '@/components/Table/styles';
import { FilterContainer } from '@/components/TransactionsFilters/styles';
import Link from 'next/link';
import { transparentize } from 'polished';
import styled, { css, DefaultTheme } from 'styled-components';
import {
  ConcentrationTone,
  DistributionSegmentKey,
  MedalTier,
} from './holdersMath';

/** Medal ring colors, used for rings and tints only, never for digits. */
export const MEDAL_COLORS: Record<MedalTier, string> = {
  gold: '#C9A24B',
  silver: '#8F97A8',
  bronze: '#B37A56',
};

const medalTint = (theme: DefaultTheme, medal: MedalTier): string =>
  transparentize(theme.dark ? 0.84 : 0.88, MEDAL_COLORS[medal]);

export const RankBadge = styled.span<{ $medal?: MedalTier }>`
  ${props =>
    props.$medal
      ? css`
          && {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 24px;
            height: 24px;
            padding: 0 4px;
            font-weight: 700;
          }
          border-radius: 50%;
          border: 1.5px solid ${MEDAL_COLORS[props.$medal]};
          background-color: ${medalTint(props.theme, props.$medal)};
          font-size: 0.75rem;
          color: ${props.theme.black};
        `
      : css`
          font-size: 0.8125rem;
          font-weight: 500;
          color: ${props.theme.darkText};
        `}
  font-variant-numeric: tabular-nums;
`;

export const HolderCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-width: 320px;

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    min-width: 0;
  }
`;

export const VoidShareNote = styled.span`
  font-size: 0.8125rem;
  font-variant-numeric: tabular-nums;
  color: ${props => props.theme.darkText};
`;

/* ----------------------------- summary strip ----------------------------- */

const chipDotColor = (props: {
  theme: DefaultTheme;
  $tone: ConcentrationTone;
}): string => {
  if (props.$tone === 'high')
    return props.theme.dark ? '#FF4465' : props.theme.red;
  if (props.$tone === 'low') return successColor(props);
  return props.theme.darkText;
};

export const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.6875rem;
  font-weight: 600;
  color: ${props => props.theme.black};
  cursor: default;
`;

export const ChipDot = styled.span<{ $tone: ConcentrationTone }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${chipDotColor};
`;

const SEGMENT_COLOR: Record<
  DistributionSegmentKey,
  (props: { theme: DefaultTheme }) => string
> = {
  largest: props => props.theme.violet,
  ranks2to10: props => props.theme.purple,
  ranks11to50: props => props.theme.lightPurple,
  rest: props => props.theme.black20,
  burned: props => (props.theme.dark ? '#FF4465' : props.theme.red),
};

/** Resolves a distribution segment color for use outside styled templates. */
export const segmentColor = (
  key: DistributionSegmentKey,
  theme: DefaultTheme,
): string => SEGMENT_COLOR[key]({ theme });

/* --------------------------- scoped table skin --------------------------- */

/**
 * The shared data-list skin plus the holders-specific column rules: numeric
 * columns right-aligned, the Supply Share column gets its own gutter, and
 * the Staked and Liquid headers carry the dots that bind them to their bar
 * segment colors.
 */
export const HoldersTableWrapper = styled.div`
  ${dataListTableSkin}

  @media screen and (min-width: ${props => props.theme.breakpoints.tablet}) {
    /* Same row height as the assets tables. */
    ${MobileCardItem} {
      height: ${DATA_LIST_ROW_HEIGHT};
    }

    /* The right-aligned Liquid column meets the left-aligned Supply Share
       column at their shared border, so that pair needs its own gutter to
       read as far apart as the other columns do. */
    ${MobileCardItem}:nth-child(6),
    ${HeaderItem}:nth-child(6) {
      padding-left: 48px;
    }

    /* Numeric columns right-align; Supply Share stays left. */
    ${MobileCardItem}:nth-child(3),
    ${MobileCardItem}:nth-child(4),
    ${MobileCardItem}:nth-child(5),
    ${HeaderItem}:nth-child(3),
    ${HeaderItem}:nth-child(4),
    ${HeaderItem}:nth-child(5) {
      text-align: right;
    }

    /* Column dots bind Staked and Liquid to their bar segment colors. */
    ${HeaderItem}:nth-child(4)::before,
    ${HeaderItem}:nth-child(5)::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      margin-right: 6px;
    }

    ${HeaderItem}:nth-child(4)::before {
      background-color: ${props => props.theme.lightPurple};
    }

    ${HeaderItem}:nth-child(5)::before {
      background-color: ${props => props.theme.violet};
    }
  }
`;

/**
 * The Sort By dropdown stays on mobile and tablet, where the table renders as
 * cards without column headers. On desktop the clickable headers are the one
 * sort control, so a second one would blur the source of truth.
 */
export const FilterContainerHolders = styled(FilterContainer)`
  @media screen and (min-width: ${props => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;
