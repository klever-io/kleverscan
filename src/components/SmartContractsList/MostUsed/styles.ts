import {
  accentText,
  focusRing,
  inCard,
  ShareFill,
  ShareTrack,
} from '@/components/DataList/styles';
import Link from 'next/link';
import styled from 'styled-components';

/**
 * Section heading above the carousel.
 *
 * An explicit size, not an inherited one. The old wrapper set 24px on a div
 * and put an `h3` inside it, and the browser's default `h3` of 1.17em turned
 * that into 28,08px, a hair under the page's own 28,8px `h1`. Measured.
 */
export const SectionTitle = styled.h2`
  margin: 2rem 0 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.6rem;
  color: ${props => props.theme.black};
`;

export const SectionNote = styled.p`
  margin: -0.5rem 0 0.75rem;
  font-size: 0.75rem;
  color: ${props => props.theme.darkText};
`;

export const EmptyNote = styled.p`
  padding: 24px 0;
  font-size: 0.875rem;
  color: ${props => props.theme.darkText};
`;

/* ------------------------------- carousel -------------------------------- */

export const CarouselRow = styled.div`
  display: flex;
  align-items: stretch;
  gap: 8px;
`;

export const CarouselTrack = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  /* The track is scrollable, so it is a focus target for keyboard users; the
     ring would otherwise only ever land on the cards inside it. */
  ${focusRing}

  @media (prefers-reduced-motion: reduce) {
    scroll-behavior: auto;
  }
`;

/**
 * Enabled state driven by the real scroll position rather than hardcoded.
 * Both arrows used to be `active={true}` unconditionally, so the left one
 * looked and behaved like a live control at `scrollLeft: 0`.
 */
export const CarouselArrow = styled.button<{ $enabled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  border: none;
  border-radius: 8px;
  background: none;
  color: ${props => props.theme.darkText};
  cursor: ${props => (props.$enabled ? 'pointer' : 'not-allowed')};
  opacity: ${props => (props.$enabled ? 1 : 0.3)};
  transition: opacity 150ms ease-out;

  ${focusRing}

  &:hover {
    color: ${props => (props.$enabled ? accentText(props) : undefined)};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

/* --------------------------------- cards --------------------------------- */

/**
 * Border in both themes. The old card drew a violet border in light and
 * `0px none` in dark, where its surface sat at 1,03:1 against the page, so in
 * dark mode there was no card to see. Measured.
 */
export const ContractCard = styled(Link)`
  ${inCard('flex')}

  && {
    flex-direction: column;
    align-items: stretch;
    height: auto;
    min-width: 216px;
    max-width: 216px;
  }

  scroll-snap-align: start;
  gap: 8px;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid
    ${props => (props.theme.dark ? props.theme.darkGray : props.theme.black10)};
  background-color: ${props => props.theme.white};
  color: ${props => props.theme.black};
  text-decoration: none;
  transition: border-color 150ms ease-out;

  &:hover {
    border-color: ${props => props.theme.violet};
    text-decoration: none;
  }

  ${focusRing}

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const CardRank = styled.span`
  ${inCard('inline-flex', 700)}

  && {
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
  }

  border-radius: 6px;
  font-size: 0.6875rem;
  font-variant-numeric: tabular-nums;
  color: ${accentText};
  background-color: ${props => props.theme.black10};
`;

export const CardTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const CardName = styled.span`
  ${inCard('block', 600)}

  && {
    max-width: 100%;
  }

  font-size: 0.875rem;
  color: ${props => props.theme.black};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CardAddress = styled.span`
  ${inCard('block')}

  font-family: 'Fira Mono', monospace;
  font-size: 0.6875rem;
  color: ${props => props.theme.darkText};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CardCount = styled.span`
  ${inCard('block', 600)}

  font-size: 1.125rem;
  font-variant-numeric: tabular-nums;
  color: ${props => props.theme.black};
`;

export const CardCountLabel = styled.span`
  ${inCard('block')}

  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${props => props.theme.darkText};
`;

/* ------------------------------ ranked rows ------------------------------ */

export const RankedList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const RankedRow = styled(Link)`
  ${inCard('grid')}

  && {
    align-items: center;
    height: auto;
  }

  grid-template-columns: 28px minmax(0, 1fr) 150px 110px;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  color: ${props => props.theme.black};
  text-decoration: none;
  transition: background-color 150ms ease-out;

  &:hover {
    background-color: ${props => props.theme.black10};
    text-decoration: none;
  }

  ${focusRing}

  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 24px minmax(0, 1fr) 90px;

    /* The bar is the first thing to go when the row runs out of room: it is
       the only element here that repeats what the number beside it says. */
    ${ShareTrack} {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const RowRank = styled.span`
  ${inCard('block', 600)}

  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  color: ${props => props.theme.darkText};
`;

export const RowName = styled.span`
  ${inCard('block', 600)}

  font-size: 0.875rem;
  color: ${props => props.theme.black};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const RowCount = styled.span`
  ${inCard('block')}

  font-size: 0.8125rem;
  font-variant-numeric: tabular-nums;
  text-align: right;
  color: ${props => props.theme.darkText};
`;

/** The share bar reuses the shared track, but one solid segment: these are
 *  independent contracts, not two parts of one quantity. */
export const RowBar = styled(ShareFill)`
  background-color: ${props => props.theme.violet};
`;

/** The three featured cards of the "featured" variant. */
export const PodiumRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 12px;
`;
