import {
  ExportContainer,
  FloatContainer,
  HeaderItem,
  LimitContainer,
  MobileCardItem,
  TableBody,
  TableControls,
  TableEmptyData,
  TableGradientBorder,
  TableRow,
} from '@/components/Table/styles';
import Link from 'next/link';
import { mix, transparentize } from 'polished';
import { Content as FilterContent } from '@/components/Filter/styles';
import { FilterContainer } from '@/components/TransactionsFilters/styles';
import styled, {
  css,
  DefaultTheme,
  Interpolation,
  keyframes,
} from 'styled-components';

/**
 * Shared design-system primitives for the data-list pages (asset holders,
 * assets registry): stat tiles, thin bars, badges, hover-revealed row actions
 * and the scoped table skin. Pages compose these; page-specific pieces stay
 * in the page's own styles file.
 */

/**
 * Table headers stick right below the site navigation. Its height varies
 * with the viewport (the bar wraps to two lines below 1440px), so the Header
 * component publishes the measured value and this is only the fallback.
 */
const STICKY_HEADER_OFFSET = 'var(--navbar-height, 72px)';

/**
 * One row height for every data-list table (assets, pools, holders), so the
 * section keeps a single rhythm instead of each table finding its own.
 */
export const DATA_LIST_ROW_HEIGHT = '60px';

/**
 * Derived colors: the raw theme tokens fail WCAG AA contrast in these exact
 * spots (violet on dark cards is 3.3:1, red at badge size 3.4:1), so each
 * mode gets a hand-picked equivalent.
 */
export const accentText = ({ theme }: { theme: DefaultTheme }): string =>
  theme.dark ? '#C95ED4' : theme.violet;

const voidText = ({ theme }: { theme: DefaultTheme }): string =>
  theme.dark ? '#FF4465' : '#C63A4D';

export const successColor = ({ theme }: { theme: DefaultTheme }): string =>
  theme.dark ? theme.green : '#2E9A66';

const growBar = keyframes`
  from {
    transform: scaleX(0);
  }
`;

const reducedMotion = css`
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transition: none;
  }
`;

/**
 * MobileCardItem gives every `a, span` inside a mobile card its own display,
 * height, min-width and font-weight. That descendant selector outranks a plain
 * styled-component class, so a value dropped into a card silently loses the
 * type it was given. Doubling the class wins the specificity back. This is
 * that fix, named once instead of repeated at every value.
 */
const cardWeight = (fontWeight: number) => css`
  font-weight: ${fontWeight};
`;

export const inCard = (display: string, fontWeight?: number) => css`
  && {
    display: ${display};
    height: auto;
    min-width: 0;
    ${fontWeight === undefined ? null : cardWeight(fontWeight)}
  }
`;

export const focusRing = css`
  &:focus-visible {
    outline: 2px solid ${props => props.theme.violet};
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

/* Doubled class, the same trick inCard uses: the cell rules give every span
   inside a data-list cell display:flex, a height and min-width:fit-content,
   and a used min-width beats a width. The box grew to the full width of the
   sentence it hides (482px in the assets rewards column) and, being absolutely
   positioned, took 358px of horizontal page scroll with it at 1440. */
export const visuallyHiddenRules = css`
  position: absolute;
  clip: rect(0 0 0 0);

  && {
    display: block;
    width: 1px;
    min-width: 0;
    max-width: 1px;
    height: 1px;
    min-height: 0;
    max-height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    white-space: nowrap;
    border: 0;
  }
`;

export const VisuallyHidden = styled.span`
  /* Readers get the rendered text: inheriting the badge's uppercase handed
     them whole sentences in caps, which VoiceOver spells out. */
  text-transform: none;
  ${visuallyHiddenRules}
`;

/* --------------------------------- badges -------------------------------- */

export type BadgeVariant =
  | 'void'
  | 'contract'
  | 'neutral'
  | 'warning'
  | 'accent'
  | 'success'
  | 'danger';

export const badgeColor = (
  props: { theme: DefaultTheme },
  variant: BadgeVariant,
): string => {
  const { theme } = props;
  switch (variant) {
    case 'void':
      return voidText(props);
    case 'contract':
      return theme.dark ? theme.lightPurple : theme.purple;
    case 'neutral':
      return theme.dark ? theme.darkText : theme.blueGray500;
    case 'warning':
      // Derived AA amber: the raw warning token fails 4.5:1 at badge size.
      return theme.dark ? '#EB9C27' : '#8F5A00';
    case 'accent':
      return accentText(props);
    case 'success':
      // successColor is derived for icon size, where 3:1 suffices. Badge
      // text at 0.625rem needs 4.5:1, which the light value misses (3.33:1
      // on the tint), so this spot darkens it further: 4.98:1 on the tint,
      // 4.70:1 on a hovered row.
      return theme.dark ? successColor(props) : '#217A50';
    case 'danger':
      // Red kin of the void badge; a separate name because a failed
      // transaction and the burn address are unrelated concepts, and a
      // slightly darker light value than voidText because the badge must
      // hold 4.5:1 on a hovered row's violet tint (4.78:1; voidText dips
      // to 4.39:1 there).
      return theme.dark ? voidText(props) : '#BE3448';
  }
};

export const badgeTint = (
  props: { theme: DefaultTheme },
  variant: BadgeVariant,
): string => {
  const { theme } = props;
  let base: string;
  switch (variant) {
    case 'void':
      base = theme.red;
      break;
    case 'contract':
      base = theme.purple;
      break;
    case 'warning':
      base = '#EB9C27';
      break;
    case 'accent':
      base = theme.violet;
      break;
    case 'success':
      base = theme.green;
      break;
    case 'danger':
      base = theme.red;
      break;
    default:
      base = theme.blueGray500;
  }
  return transparentize(theme.dark ? 0.88 : 0.92, base);
};

export const BadgePill = styled.span<{ $variant: BadgeVariant }>`
  && {
    display: inline-flex;
    align-items: center;
    height: 18px;
    min-width: 0;
    padding: 2px 6px;
    font-weight: 700;
  }
  border-radius: 4px;
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  cursor: default;
  color: ${props => badgeColor(props, props.$variant)};
  border: 1px solid ${props => badgeColor(props, props.$variant)};
  background-color: ${props => badgeTint(props, props.$variant)};
`;

/* ----------------------------- row actions ------------------------------- */

const actionControl = css<{ $large?: boolean; $success?: boolean }>`
  && {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: ${props => (props.$large ? '32px' : '24px')};
    height: ${props => (props.$large ? '32px' : '24px')};
    min-width: 0;
    padding: 0;
  }
  border: none;
  background: none;
  border-radius: 4px;
  cursor: pointer;
  color: ${props =>
    props.$success ? successColor(props) : props.theme.darkText};
  transition: color 150ms ease-out;

  &:hover {
    color: ${props =>
      props.$success ? successColor(props) : accentText(props)};
  }

  ${focusRing}
  ${reducedMotion}
`;

export const ActionButton = styled.button<{
  $large?: boolean;
  $success?: boolean;
}>`
  ${actionControl}
`;

export const ActionLink = styled.a<{ $large?: boolean; $success?: boolean }>`
  ${actionControl}
`;

export const RowActions = styled.span`
  && {
    display: inline-flex;
    align-items: center;
    min-width: 0;
  }
  gap: 4px;
  margin-left: auto;
`;

/* ------------------------------ identity cells --------------------------- */

export const IdentityCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-width: 280px;

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    min-width: 0;
  }
`;

export const IdentityLink = styled(Link)`
  ${inCard('flex')}
  align-items: center;
  gap: 8px;
  ${focusRing}
`;

export const IdentityText = styled.span`
  && {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    height: auto;
    min-width: 0;
  }
  gap: 2px;
`;

export const AssetName = styled.span`
  ${inCard('block', 600)}
  max-width: 100%;
  font-size: 0.875rem;
  color: ${props => props.theme.black};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const AssetIdLine = styled.span`
  ${inCard('flex')}
  align-items: baseline;
  gap: 4px;
  font-family: 'Fira Mono', monospace;
  font-size: 0.75rem;
  color: ${props => props.theme.darkText};
  white-space: nowrap;
`;

export const AddressLink = styled(Link)`
  font-family: 'Fira Mono', monospace;
  /* Matches the Total Balance value, so identity and primary figure read as
     one line rather than two sizes. */
  font-size: 0.875rem;
  color: ${props => props.theme.black};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
    text-underline-offset: 0.2rem;
  }

  ${focusRing}
`;

/* ------------------------------- amounts --------------------------------- */

export const AmountPrimary = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  font-size: 0.875rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: ${props => props.theme.black};
`;

export const AmountMuted = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  gap: 4px;
  font-size: 0.8125rem;
  font-variant-numeric: tabular-nums;
  color: ${props => props.theme.darkText};
`;

/* A picked colour rather than opacity: darkText at 0.75 dropped to 3.84:1
   on white, under the AA floor for small text. */
export const InlineShare = styled.span`
  font-size: 0.6875rem;
  color: ${props =>
    props.theme.dark ? props.theme.darkText : props.theme.blueGray500};
  white-space: nowrap;
`;

/* ------------------------------ share bars ------------------------------- */

export const ShareCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ShareValue = styled.span`
  && {
    font-weight: 600;
  }
  font-size: 0.8125rem;
  font-variant-numeric: tabular-nums;
  color: ${accentText};
`;

export const ShareTrack = styled.div<{ $fluid?: boolean }>`
  width: ${props => (props.$fluid ? '100%' : '150px')};
  height: 4px;
  border-radius: 2px;
  background-color: ${props => props.theme.black10};
  overflow: hidden;
`;

export const ShareFill = styled.div<{ $delay: number }>`
  display: flex;
  gap: 1px;
  width: 100%;
  height: 100%;
  transform-origin: left;
  animation: ${growBar} 400ms ease-out both;
  animation-delay: ${props => props.$delay}ms;
  ${reducedMotion}
`;

/**
 * Liquid and staked must differ in lightness, not just hue: violet and purple
 * compute to the same luminance, so the split in a 4px bar was invisible to
 * anyone with a colour-vision deficiency.
 */
const shareSegmentColor = (
  props: { theme: DefaultTheme },
  kind: 'liquid' | 'staked',
): string => (kind === 'liquid' ? props.theme.violet : props.theme.lightPurple);

export const ShareSegment = styled.div<{
  $kind: 'liquid' | 'staked';
}>`
  height: 100%;
  min-width: 2px;
  background-color: ${props => shareSegmentColor(props, props.$kind)};
`;

/* ----------------------------- summary strip ----------------------------- */

export const SummaryCard = styled.section`
  ${TableGradientBorder}
  border-radius: 16px;
  padding: 20px;
  /* Same 24px rhythm as between the tab row and this card. */
  margin-bottom: 24px;
`;

export const TilesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 24px;

  /* 767.98, not 768: a max-width and a min-width rule on the same value both
     match at that width, and the pages that switch their own layout there
     ended up with a two-column tile grid that exists at no other width. */
  @media screen and (max-width: 767.98px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
`;

export const Tile = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const TileLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${props => props.theme.darkText};
`;

/** Label plus the app's help-icon tooltip, when a tile needs explaining. */
export const TileLabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const TileValueRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
`;

export const TileValue = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: ${props => props.theme.black};
`;

export const TileSub = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.darkText};
  margin-top: 2px;
`;

export const DistBar = styled.div`
  display: flex;
  gap: 2px;
  width: 100%;
  height: 8px;
  margin-top: 16px;
`;

export const DistSegment = styled.div<{
  $color: string;
  $delay: number;
  $dimmed?: boolean;
}>`
  height: 100%;
  min-width: 3px;
  background-color: ${props => props.$color};
  opacity: ${props => (props.$dimmed ? 0.55 : 1)};
  transform-origin: left;
  animation: ${growBar} 400ms ease-out both;
  animation-delay: ${props => props.$delay}ms;
  transition:
    filter 150ms ease-out,
    opacity 150ms ease-out;

  &:first-child {
    border-radius: 4px 0 0 4px;
  }

  &:last-child {
    border-radius: 0 4px 4px 0;
  }

  &:only-child {
    border-radius: 4px;
  }

  &:hover {
    filter: brightness(1.08);
  }

  ${reducedMotion}
`;

export const LegendRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin-top: 8px;
`;

export const LegendItem = styled.span<{ $dimmed?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: ${props => props.theme.darkText};
  /* Still readable when dimmed: these carry counts, not just emphasis. */
  opacity: ${props => (props.$dimmed ? 0.7 : 1)};
  transition: opacity 150ms ease-out;
  ${reducedMotion}

  strong {
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: ${props => props.theme.black};
  }
`;

export const LegendDot = styled.span<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background-color: ${props => props.$color};
`;

/* --------------------------- compact filter row --------------------------- */

/**
 * A filter bar of at most two dropdowns beside the page-size controls, on one
 * row for as long as they fit.
 *
 * The shared FilterContainer stacks below the tablet breakpoint: each filter
 * full-width, controls on a row of their own. That suits the pages with four
 * filters; for one or two it wastes two rows on three small controls
 * (decided on /validators, 2026-08-31, then rolled out to the other short
 * bars). Each filter keeps the 13rem every filter measures on desktop; on
 * mobile the pair spreads over the full width at half each.
 */
export const CompactFilterBar = styled(FilterContainer)`
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: row;
    width: auto;

    > div {
      width: auto;
      flex: 0 0 13rem;
    }
  }

  /* On mobile a PAIR takes the whole width, half each, and the page-size
     controls drop to the row below. The base bar's 13rem minimum has to go
     with it: two of those overflow a 390px screen. Read off the DOM instead of
     a prop so a page that gains or loses a filter cannot get it wrong; a lone
     filter keeps its 13rem and stays beside the controls. */
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    &:has(> div + div) {
      width: 100%;

      > div {
        flex: 1 1 0;
        min-width: 0;
      }

      /* The minimum has to reach the dropdown itself: Filter's own Content
         carries a 12rem minimum, so at 320px the pair kept 168px each inside
         139px wrappers and pushed the page sideways by 13px, measured. */
      ${FilterContent} {
        min-width: 0;
      }
    }
  }

  /* Where even a lone filter no longer fits beside the page-size controls:
     182px for the filter, 214 for the pills and the button, the 16px gap and
     the container's padding come to 444, so 443 is the first width that wraps.
     It takes the whole row there rather than leaving the dead space beside
     it. */
  @media (max-width: 443px) {
    width: 100%;

    > div {
      flex: 1 1 0;
      min-width: 0;
    }
  }

  /* The third stage: full width, stacked. Half of the row stops holding a
     selected value below 344px (the current longest version string needs 61px
     and half a 344 viewport gives its value box exactly that, measured), so
     from 360 down the pair trades the second column for legible values. */
  @media (max-width: 359.98px) {
    flex-direction: column;

    > div {
      width: 100%;
      flex: 1 1 auto;
    }
  }
`;

/** The wrapper-side half of the same decision: keeps the shared
 *  FloatContainer a flex row below the tablet breakpoint, where it otherwise
 *  turns into a grid that parks the controls under the filter bar. Split out
 *  because /smart-contracts needs this half and lays its own controls out as a
 *  measured grid, which the rules below would overwrite. */
export const compactFilterFloat = css`
  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    ${FloatContainer} {
      display: flex;
      justify-content: space-between;
      align-items: end;
      flex-wrap: wrap;
    }
  }
`;

export const compactFilterRow = css`
  ${compactFilterFloat}

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    /* nowrap so the refresh button stays beside the page-size pills: the
       wrapping row always had a width where the pills still fit and the button
       alone dropped under them. Same fix as /smart-contracts. */
    ${TableControls} {
      margin-left: auto;
      justify-content: flex-end;
      flex-wrap: nowrap;
      flex-shrink: 0;
    }

    /* Both controls carry a 10px bottom margin below this width, put there for
       the stacked layout this row replaces. With align-items on the ends it
       lifted the pills 10px above the filter bottoms, measured on all three
       short-bar pages; leaving it on the button alone hung it 10px above the
       pills. */
    ${LimitContainer},
    ${ExportContainer} {
      margin-bottom: 0;
    }
  }
`;

/* ------------------------------ mobile card ------------------------------ */

export const MobileListCard = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px 14px;
  border-radius: 8px;
  border: solid 1px
    ${props => (props.theme.dark ? props.theme.darkGray : props.theme.black10)};
  background-color: ${props => props.theme.white};
`;

export const MobileTopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const MobileTotalRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin-top: 8px;

  strong {
    font-size: 1rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: ${props => props.theme.black};
  }
`;

export const MobileShareValue = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: ${accentText};
`;

export const MobileBarRow = styled.div`
  margin-top: 8px;
`;

export const MobileMetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 6px;
`;

export const MobileMetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  color: ${props => props.theme.darkText};
`;

/* --------------------------- scoped table skin --------------------------- */

/**
 * Restyles the shared Table for a data-list page by referencing the shared
 * styled components: tighter rows, sticky tinted uppercase header, row hover
 * tint that reveals the row actions, and no permanent link underline. Wrap a
 * page's Table in a styled.div composing this css plus the page's own
 * column alignment rules; nothing leaks into other tables.
 */
export const dataListTableSkin = css`
  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    ${TableBody} {
      gap: 8px;
    }
  }

  @media screen and (min-width: ${props => props.theme.breakpoints.tablet}) {
    /* No inner card padding: the tinted header band and the row tints run
       edge to edge, so the card border includes the header instead of
       framing it. The cells carry the 16px edge spacing themselves, and the
       corner cells inherit the card's rounding (16px minus the 1px border). */
    ${TableBody} {
      padding: 0;
    }

    ${TableEmptyData} {
      padding: 16px;
    }

    /* Tighter rows: roughly 12% less tall than the shared default. */
    ${MobileCardItem} {
      padding: 8px 12px;
      transition: background-color 150ms ease-out;
    }

    ${MobileCardItem}:first-child {
      padding-left: 16px;
    }

    ${MobileCardItem}:last-child {
      padding-right: 16px;
    }

    /* Identifier links read cleaner without the shared permanent underline. */
    ${MobileCardItem} a {
      text-decoration: none;
    }

    /* Actions sit right after the row's content; pushed to the cell edge
       they float in the column's slack space instead. */
    ${RowActions} {
      margin-left: 0;
    }

    ${HeaderItem} {
      position: sticky;
      top: ${STICKY_HEADER_OFFSET};
      /* Above the unpositioned row content, below open filter dropdowns
         (z-index 2) and the site navigation (6). */
      z-index: 1;
      padding: 12px;
      /* Tinted against the card it sits on, not against the page. Mixing into
         the page colour left the band darker than its own surface once the
         card stopped borrowing that colour: 1.02 against the card, and the
         wrong way round. Light mixes into the same surface and reads 1.07. */
      background-color: ${props =>
        props.theme.dark
          ? mix(0.05, '#FFFFFF', props.theme.white)
          : mix(0.03, props.theme.black, props.theme.white)};
      border-bottom: 1px solid ${props => props.theme.black10};
      /* Typography inherits like every other table header on the site
         (1rem, weight 500, primary text color). */
    }

    ${HeaderItem}:first-child {
      padding-left: 16px;
      border-top-left-radius: 15px;
    }

    ${HeaderItem}:last-child {
      padding-right: 16px;
      border-top-right-radius: 15px;
    }

    /* Hover tints paint on the cells (not the row) so the bottom corners
       can clip to the card's rounding. */
    ${TableRow}:not(:first-child):hover ${MobileCardItem},
    ${TableRow}:not(:first-child):focus-within ${MobileCardItem} {
      background-color: ${props =>
        transparentize(props.theme.dark ? 0.92 : 0.96, props.theme.violet)};
    }

    ${TableRow}:last-child ${MobileCardItem}:first-child {
      border-bottom-left-radius: 15px;
    }

    ${TableRow}:last-child ${MobileCardItem}:last-child {
      border-bottom-right-radius: 15px;
    }

    /* Hidden until its row is hovered, on hover-capable pointers only: on a
       large touch screen there is no hover, so the actions would be invisible
       yet tappable.

       Carried by the row rather than by the actions themselves. As a rule on
       RowActions it also caught a card rendered at this width, which happens
       on a list whose row needs more room than the shared breakpoint gives it,
       and there is no row there to reveal them again: the copy and open
       buttons were invisible on every card and stayed that way. */
    @media (hover: hover) {
      ${TableRow} ${RowActions} {
        opacity: 0;
        transition: opacity 150ms ease-out;
        ${reducedMotion}
      }
    }

    ${TableRow}:hover ${RowActions},
    ${TableRow}:focus-within ${RowActions} {
      opacity: 1;
    }

    @media (prefers-reduced-motion: reduce) {
      ${MobileCardItem} {
        transition: none;
      }
    }
  }
`;

/**
 * Four summary tiles stay on one row down to `from` px, where the shared grid
 * otherwise drops to a hard two columns below the mobile breakpoint and the
 * 2x2 wastes half the card. `from` is per card, set by its longest label plus
 * the 3x16px of gaps, 48 of card padding and 32 of page padding: measured 117px
 * on /validators (Open for delegation) and 94px on /assets (NFT collections).
 * auto-fit is avoided on purpose: it lands on three columns first and leaves
 * the fourth tile orphaned on its own row.
 */
export const holdFourTiles = (from: number) => css`
  @media screen and (min-width: ${from}px) and (max-width: ${props =>
      props.theme.breakpoints.mobile}) {
    ${TilesGrid} {
      grid-template-columns: repeat(4, 1fr);
    }
  }
`;

/* --------------------------- shared row layout ---------------------------- */

/** Left-aligned numerals. The `Amount*` pair flexes to the right edge, which
 *  is correct only in the columns the skin also right-aligns. */
export const NumericCell = styled.span`
  font-variant-numeric: tabular-nums;
`;

/**
 * Undoes the shared table layout between the tablet breakpoint and a list's own
 * row width, where the rows are already cards. A styled component's own media
 * query is not reachable from outside it, so it is undone here.
 *
 * Neither TableBody rule is cosmetic: `display: table` wraps each
 * MobileListCard in an anonymous cell and lays all ten side by side, and
 * `min-width: fit-content` pins the column to the widest card on the page,
 * measured at 378px against a 328px screen at 360.
 *
 * `belowRow` is the list's own row width minus 0.02px; a list that needs a
 * fixed card grid adds its own `grid-template-columns`.
 */
export const dataListCardBand = <P extends object>(
  belowRow: Interpolation<P>,
) => css<P>`
  @media screen and (max-width: ${belowRow}) {
    ${TableBody} {
      min-width: 0;
    }
  }

  @media screen and (min-width: ${props =>
      props.theme.breakpoints.tablet}) and (max-width: ${belowRow}) {
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
      gap: 4px;
      padding: 16px;
      border-radius: 16px;
      border: solid 1px
        ${props =>
          props.theme.dark ? props.theme.darkGray : props.theme.black10};
      background-color: ${props => props.theme.white};
    }

    /* Through TableRow to clear the skin's own :first-child and :last-child
       cell padding, which matches on class count alone. */
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
`;

/**
 * 8px of side padding rather than the skin's 12, and 12 rather than 16 on the
 * outer edges, for the lists that carry nine or ten columns. On validators it
 * spends 168px of the row on padding instead of 248, which is the difference
 * between a row that needs a 1297px viewport and one that needs 1217. The
 * header takes the same values or the columns stop lining up.
 */
export const dataListRowPadding = css`
  ${MobileCardItem} {
    padding: 8px;
  }

  ${MobileCardItem}:first-child {
    padding-left: 12px;
  }

  ${MobileCardItem}:last-child {
    padding-right: 12px;
  }

  ${HeaderItem} {
    padding: 12px 8px;
  }

  ${HeaderItem}:first-child {
    padding-left: 12px;
  }

  ${HeaderItem}:last-child {
    padding-right: 12px;
  }
`;
