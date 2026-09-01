import { ROW_LAYOUT_MIN_WIDTH, belowWidth } from '@/components/DataList/layout';
import {
  AssetIdLine,
  AssetName,
  BadgePill,
  compactFilterRow,
  SummaryCard,
  TilesGrid,
  DATA_LIST_ROW_HEIGHT,
  dataListCardBand,
  dataListTableSkin,
  inCard,
  MobileListCard,
  MobileTotalRow,
  RowActions,
} from '@/components/DataList/styles';
import { ToolTipSpan } from '@/components/Tooltip/styles';
import {
  HeaderItem,
  MobileCardItem,
  TableRow,
} from '@/components/Table/styles';
import styled from 'styled-components';

const BELOW_ROW = belowWidth(ROW_LAYOUT_MIN_WIDTH);

/** The registry strip's four tiles stay on one row at every width: its labels
 *  wrap by word and its figures are three digits, so even the smallest screen
 *  holds four columns. The gap narrows below the mobile breakpoint to give the
 *  columns back what the 2x2 kept as slack. */
export const RegistryCard = styled(SummaryCard)`
  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}) {
    ${TilesGrid} {
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }
  }
`;

/** The asset id as a tag rather than loose text beside the name: the ticker
 *  is the handle people know an asset by, so it reads as a badge. */
export const TickerBadge = styled(BadgePill)`
  font-family: 'Fira Mono', monospace;
  letter-spacing: 0;
`;

/* ------------------------------ supply cells ----------------------------- */

export const SupplyCell = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    align-items: flex-start;
  }
`;

export const SupplyPrimary = styled.span`
  ${inCard('inline', 600)}
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;
  color: ${props => props.theme.black};
  white-space: nowrap;
`;

export const ShareValueLine = styled.div`
  display: flex;
  align-items: baseline;
  gap: 4px;
`;

export const CapContext = styled.span`
  ${inCard('inline')}
  font-size: 0.75rem;
  font-weight: 400;
  color: ${props => props.theme.darkText};
`;

/* ------------------------------ rewards cell ----------------------------- */

export const RewardsCell = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  gap: 4px;

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    justify-content: flex-start;
  }
`;

export const RewardsRate = styled.span`
  ${inCard('inline', 600)}
  font-size: 0.8125rem;
  font-variant-numeric: tabular-nums;
  color: ${props => props.theme.black};
`;

export const RewardsUnit = styled.span`
  ${inCard('inline', 600)}
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${props => props.theme.darkText};
`;

export const RewardsMuted = styled.span`
  ${inCard('inline')}
  font-size: 0.75rem;
  color: ${props => props.theme.darkText};
  opacity: 0.75;
`;

/* ------------------------------ registry strip --------------------------- */

/** The bar reads at every width: its segments are percentages and the legend
 *  wraps, so the old phone-width display:none only lost information. */
export const StripBarArea = styled.div``;

/* --------------------------- mobile card pieces -------------------------- */

/**
 * The cap bar and its caption on one line.
 *
 * The bar used to be `$fluid`, so it ran the full width of the card: on a
 * tablet-width card that is a 700px hairline carrying a single percentage, and
 * the wider the card the less it looked like a measurement. 150px is exactly
 * what the same bar occupies in the desktop CapUsed cell, so the card and the
 * row now state the figure at the same size. It wraps rather than shrinks: at
 * 360px the pair needs 270px against the 300 the card has, and a bar squeezed
 * below its track width stops being readable at all.
 */
export const MobileCapRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;

  /* Sits right after the Circulating label and lets the figure keep the far
     end of the line. */
  margin-right: auto;
`;

export const MobileCapCaption = styled.span`
  ${inCard('inline-flex')}
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  color: ${props => props.theme.darkText};

  svg {
    flex-shrink: 0;
  }
`;

/* --------------------------- scoped table skin --------------------------- */

/**
 * The shared data-list skin plus the assets-specific column rules: numeric
 * columns right-aligned, and the Cap Used column gets its own gutter where
 * the right-aligned supply column would otherwise meet it at the border.
 */
export const AssetsTableWrapper = styled.div`
  ${dataListTableSkin}
  ${compactFilterRow}

  /* At the card's right edge at every width, the same place on every card:
     beside the identity they tracked the name's width, so scanning a column of
     cards the buttons never sat still. Same rule the validator card carries. */
  ${MobileListCard} ${RowActions} {
    margin-left: auto;
  }

  /* The badge tooltips render wrapper span plus inner div, and the pill rides
     that div's text baseline, a few px below the ticker badge beside it
     (measured on the validators card first). Flexed, the wrappers hug the pill
     and the row centres every badge level. */
  ${MobileListCard} ${ToolTipSpan},
  ${MobileListCard} ${ToolTipSpan} > div {
    display: flex;
    align-items: center;
  }

  /* The name gives way, the id does not: a flex item's min-width is auto, so
     without this a long name pushed the inline id and the buttons out of the
     card instead of truncating. */
  ${MobileListCard} ${AssetName} {
    flex: 0 1 auto;
    min-width: 0;
  }

  ${MobileListCard} ${AssetIdLine} {
    flex-shrink: 0;
  }

  /* The cap bar shares the Circulating line only where that line has room for
     it: on a ~300px phone card the 150px track plus its caption broke
     "10.99 M KFI" across two lines. The widest row on the page measures 396px,
     which a 480 viewport still holds (420 inner), so only below that does the
     bar take a line of its own; the old 768 cut made every tablet card a row
     taller for nothing. */
  @media screen and (max-width: 479.98px) {
    ${MobileTotalRow} {
      flex-wrap: wrap;
    }

    ${MobileTotalRow} > strong {
      white-space: nowrap;
    }

    ${MobileCapRow} {
      order: 1;
      flex-basis: 100%;
      margin-right: 0;
      margin-top: 4px;
    }
  }

  ${dataListCardBand(BELOW_ROW)}

  @media screen and (min-width: ${props =>
    props.theme.breakpoints.tablet}) and (max-width: ${BELOW_ROW}) {
    ${TableRow} {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media screen and (min-width: ${ROW_LAYOUT_MIN_WIDTH}px) {
    /* Whoever issues an asset chooses its name, so this column has no maximum
       of its own. AssetName carries max-width:100%, which resolves against a
       shrink-to-fit table cell and so bounds nothing, and the shared cell rules
       give it min-width:fit-content, which beats a max-width outright.
       Measured with a 120-character name before these two lines: the name
       rendered 1162px wide, the row 2046, and the page scrolled 688px
       sideways. 240px clears the widest name on chain, 220px over 31
       characters. */
    ${AssetName} {
      min-width: 0;
      max-width: 240px;
    }

    /* One row height across the whole assets section. */
    ${MobileCardItem} {
      height: ${DATA_LIST_ROW_HEIGHT};
    }

    ${MobileCardItem}:nth-child(2),
    ${MobileCardItem}:nth-child(3),
    ${MobileCardItem}:nth-child(5),
    ${MobileCardItem}:nth-child(6),
    ${HeaderItem}:nth-child(2),
    ${HeaderItem}:nth-child(3),
    ${HeaderItem}:nth-child(5),
    ${HeaderItem}:nth-child(6) {
      text-align: right;
    }

    ${MobileCardItem}:nth-child(4),
    ${HeaderItem}:nth-child(4) {
      padding-left: 48px;
    }
  }
`;
