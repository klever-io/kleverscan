import {
  AssetName,
  DATA_LIST_ROW_HEIGHT,
  dataListTableSkin,
  inCard,
  MobileListCard,
  MobileTotalRow,
  RowActions,
} from '@/components/DataList/styles';
import {
  HeaderItem,
  MobileCardItem,
  TableBody,
  TableRow,
} from '@/components/Table/styles';
import styled from 'styled-components';

/**
 * The viewport width from which an asset fits on one row.
 *
 * Measured over 50 rows as the widest text each column carries plus its cell
 * padding: 1158px against a content box of `viewport - 32`, so the row needs
 * 1190. 1240 is the number the transactions and validators lists also change
 * shape at, and it leaves room for a longer asset name, which is chosen by
 * whoever issued the asset and is not bounded here.
 *
 * Below this the list renders as cards; it used to keep the table down to the
 * shared tablet breakpoint and push the page 56px sideways at 1026.
 */
export const ROW_LAYOUT_MIN_WIDTH = 1240;

/** `max-width: N` and `min-width: N` both match at exactly N, and the row
 *  layout owns N. */
const BELOW_ROW = `${ROW_LAYOUT_MIN_WIDTH - 0.02}px`;

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

/** The composition bar and legend are desktop-and-tablet only; on phones the
    strip keeps just its tiles to protect above-the-fold space. */
export const StripBarArea = styled.div`
  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: none;
  }
`;

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

  /* The copy and open buttons belong beside the asset, at every card width.
     RowActions carries margin-left:auto for the table row it was drawn for and
     the skin only zeroes it from the shared breakpoint up, so the pair sat
     against the card's right edge below 1025 and against the name above it.
     Same rule the validator card carries, so the two lists behave alike. */
  ${MobileListCard} ${RowActions} {
    margin-left: 0;
  }

  /* The cap bar shares the Circulating line only where that line has room for
     it. A phone card is about 300px wide, and the 150px track plus its caption
     left the figure 90px, which broke "10.99 M KFI" across two lines. Below
     the mobile width the bar takes a line of its own again, after the figure,
     and the card is four rows there instead of three. */
  @media screen and (max-width: 767.98px) {
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

  /* Between the shared breakpoint and this list's own the rows are cards, and
     the shared stylesheet still lays the surface out as a table. A styled
     component's own media query is not reachable from outside it, so it is
     undone here. The TableBody rule is not cosmetic: display:table wraps each
     MobileListCard in an anonymous cell and lays them out side by side. */
  /* The card list must be allowed to be narrower than its widest card. The
     shared TableBody carries min-width:fit-content for the table it was
     drawn for, and in card form that pinned the whole column to the widest
     asset name on the page: 378px against a 328px screen at 360, so a single
     long name pushed every card sideways. Only visible with enough rows on
     screen to contain one, which is why 10 rows looked fine and 50 did not. */
  @media screen and (max-width: ${BELOW_ROW}) {
    ${TableBody} {
      min-width: 0;
    }
  }

  @media screen and (min-width: ${props =>
      props.theme.breakpoints.tablet}) and (max-width: ${BELOW_ROW}) {
    ${TableBody} {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 0;
      border: none;
      background-image: none;
    }

    ${TableRow} {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 4px;
      padding: 16px;
      border-radius: 16px;
      border: solid 1px
        ${props =>
          props.theme.dark ? props.theme.darkGray : props.theme.black10};
      background-color: ${props => props.theme.white};
    }

    ${TableRow} ${MobileCardItem} {
      display: flex;
      flex-direction: column;
      width: auto;
      max-width: none;
      height: auto;
      padding: 0;
      border-bottom: none;
      font-size: 0.75rem;
    }

    ${TableRow} ${MobileCardItem} a,
    ${TableRow} ${MobileCardItem} span {
      height: auto;
      min-width: 0;
      white-space: normal;
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
