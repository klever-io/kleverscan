import {
  HeaderItem,
  MobileCardItem,
  TableBody,
  TableEmptyData,
  TableGradientBorder,
  TableRow,
} from '@/components/Table/styles';
import Link from 'next/link';
import { mix, transparentize } from 'polished';
import styled, { css, DefaultTheme, keyframes } from 'styled-components';

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

export const VisuallyHidden = styled.span`
  /* Readers get the rendered text: inheriting the badge's uppercase handed
     them whole sentences in caps, which VoiceOver spells out. */
  text-transform: none;
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
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

  /* Hover-capable pointers only: on a large touch screen there is no hover,
     so the actions would be invisible yet tappable. */
  @media screen and (min-width: ${props =>
      props.theme.breakpoints.tablet}) and (hover: hover) {
    opacity: 0;
    transition: opacity 150ms ease-out;
    ${reducedMotion}
  }
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

  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}) {
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
