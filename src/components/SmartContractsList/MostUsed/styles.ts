import {
  accentText,
  badgeTint,
  focusRing,
  inCard,
  ShareFill,
  ShareTrack,
} from '@/components/DataList/styles';
import Link from 'next/link';
import styled, { css } from 'styled-components';

/**
 * The page's blocks sit 24px apart everywhere (measured on /blocks, /accounts
 * and /transactions: title to summary 24, summary to filter row 24). The
 * section itself carries the 24px below it; above it, the summary card's own
 * 24px bottom margin is the whole gap, so the heading adds no top margin. It
 * used to add 2rem, and in a flex container margins stack instead of
 * collapsing: 56px above against 0px below, measured.
 */
export const Section = styled.section`
  /* px like the summary card's own margin, not rem: the root font shrinks to
     87,5% below tablet width, and 1.5rem left this gap 21px where the gap
     above the section stays 24. Measured on /blocks: the house keeps 24px
     fixed at every width. */
  margin-bottom: 24px;
`;

/**
 * An explicit size, not an inherited one. The old wrapper set 24px on a div
 * and put an `h3` inside it, and the browser's default `h3` of 1.17em turned
 * that into 28,08px, a hair under the page's own 28,8px `h1`. Measured.
 */
export const SectionTitle = styled.h2`
  margin: 0 0 0.25rem;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.6rem;
  color: ${props => props.theme.black};
`;

export const SectionNote = styled.p`
  margin: 0 0 0.75rem;
  font-size: 0.75rem;
  color: ${props => props.theme.darkText};
`;

export const EmptyNote = styled.p`
  padding: 24px 0;
  font-size: 0.875rem;
  color: ${props => props.theme.darkText};
`;

/* --------------------------------- podium -------------------------------- */

/**
 * Three equal columns across the full container. The old carousel parked its
 * fixed-width cards on the left and left the right half of a 1440px viewport
 * empty; a grid makes the section's width a decision instead of a leftover.
 */
export const PodiumRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media screen and (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: minmax(0, 1fr);
    gap: 8px;
  }
`;

/**
 * One frame for the real card and its loading shape, so the two cannot end up
 * at different heights and shift the table when the figures land.
 *
 * Border in both themes. The old card drew a violet border in light and
 * `0px none` in dark, where its surface sat at 1,03:1 against the page, so in
 * dark mode there was no card to see. Measured.
 */
const cardFrame = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid
    ${props => (props.theme.dark ? props.theme.darkGray : props.theme.black10)};
  background-color: ${props => props.theme.white};
`;

export const ContractCard = styled(Link)`
  ${inCard('flex')}

  && {
    align-items: stretch;
    height: auto;
    min-width: 0;
  }

  ${cardFrame}
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

export const PlaceholderCard = styled.div`
  ${cardFrame}
`;

export const CardTopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

/**
 * The leader's chip is accent-tinted, the other two stay neutral: one podium
 * signal, not three competing ones.
 */
export const CardRank = styled.span<{ $leader?: boolean }>`
  ${inCard('inline-flex', 700)}

  && {
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 26px;
    height: 26px;
  }

  border-radius: 8px;
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  color: ${props => (props.$leader ? accentText(props) : props.theme.darkText)};
  background-color: ${props =>
    props.$leader ? badgeTint(props, 'accent') : badgeTint(props, 'neutral')};
`;

export const CardIdentity = styled.span`
  ${inCard('flex')}

  && {
    flex-direction: column;
    align-items: flex-start;
    min-width: 0;
  }

  gap: 2px;
`;

export const CardName = styled.span`
  ${inCard('block', 600)}

  && {
    max-width: 100%;
  }

  font-size: 1rem;
  line-height: 1.25rem;
  color: ${props => props.theme.black};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CardAddress = styled.span`
  ${inCard('block')}

  && {
    max-width: 100%;
  }

  font-family: 'Fira Mono', monospace;
  font-size: 0.6875rem;
  line-height: 1rem;
  color: ${props => props.theme.darkText};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CardCountRow = styled.span`
  ${inCard('flex')}

  && {
    align-items: baseline;
  }

  gap: 8px;
  margin-top: auto;
`;

export const CardCount = styled.span`
  ${inCard('block', 600)}

  font-size: 1.5rem;
  line-height: 1.875rem;
  font-variant-numeric: tabular-nums;
  color: ${props => props.theme.black};
`;

export const CardCountLabel = styled.span`
  ${inCard('block', 600)}

  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${props => props.theme.darkText};
`;

export const CardBarRow = styled.span`
  ${inCard('flex')}

  && {
    align-items: center;
  }

  gap: 8px;
`;

/** One solid segment on the shared track: independent contracts, not two
 *  parts of one quantity. */
export const CardBar = styled(ShareFill)`
  background-color: ${accentText};
`;

export const CardShare = styled.span`
  ${inCard('block', 600)}

  flex-shrink: 0;
  font-size: 0.6875rem;
  font-variant-numeric: tabular-nums;
  color: ${props => props.theme.darkText};
`;

/** The track grows, the share text keeps its width. */
export const CardTrack = styled(ShareTrack)`
  flex: 1;
`;
