import { belowWidth } from '@/components/DataList/layout';
import {
  AddressLink,
  BadgePill,
  DATA_LIST_ROW_HEIGHT,
  dataListTableSkin,
  MobileListCard,
} from '@/components/DataList/styles';
import {
  HeaderItem,
  MobileCardItem,
  TableBody,
  TableRow,
} from '@/components/Table/styles';
import styled from 'styled-components';

// theme.breakpoints.tablet, and the width isTablet treats as desktop.
// belowWidth keeps the card rule off at that exact pixel, where both a
// max-width and a min-width query would otherwise match.
const TABLET_PX = 1025;

export const ValidatorAddress = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: 'Fira Mono', monospace;
  font-size: 0.875rem;
  color: ${props => props.theme.black};
`;

export const ValidatorsTableWrapper = styled.div`
  ${dataListTableSkin}

  /* Below the table breakpoint the full key is one flex item. Without a
     bounded body it widens the card past the screen. */
  @media screen and (max-width: ${belowWidth(TABLET_PX)}) {
    ${TableBody} {
      min-width: 0;
      width: 100%;
    }

    ${MobileListCard} {
      min-width: 0;
      max-width: 100%;
      overflow: hidden;
    }

    /* The shared row becomes two equal columns here. The loaded card stacks
       the name and the key, so the skeleton does the same, in the same
       padding and radius as MobileListCard. */
    ${TableRow} {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px 14px;
      border-radius: 8px;
    }

    ${MobileCardItem}:nth-child(1) [data-testid='skeleton'] {
      width: 8.5rem;
    }

    ${MobileCardItem}:nth-child(2) [data-testid='skeleton'] {
      width: calc(100% - 2rem);
    }
  }

  @media screen and (min-width: ${props => props.theme.breakpoints.tablet}) {
    /* Names are short. The key takes the rest of the card and ellipsizes,
       so the row fills instead of leaving a gap after an 8-character clip. */
    ${TableBody} {
      min-width: 0;
      width: 100%;
      table-layout: fixed;
    }

    /* Wins at the one width where a max-width rule would also match, so the
       desktop row cannot stay a column. */
    ${TableRow} {
      display: table-row;
    }

    ${MobileCardItem} {
      height: ${DATA_LIST_ROW_HEIGHT};
      overflow: hidden;
    }

    ${HeaderItem}:nth-child(1),
    ${MobileCardItem}:nth-child(1) {
      width: 32%;
    }

    ${HeaderItem}:nth-child(2),
    ${MobileCardItem}:nth-child(2) {
      width: 68%;
    }

    /* The shared skeleton is 70% then 40% of every cell. Here the name is
       short and the key fills its cell, so the bars follow that. */
    ${MobileCardItem}:nth-child(1) [data-testid='skeleton'] {
      width: 8.5rem;
    }

    ${MobileCardItem}:nth-child(2) [data-testid='skeleton'] {
      width: calc(100% - 2rem);
    }

    /* One 20px line inside the 60px row. The shared cell rule pins spans
       to 24px, which is the two-line row this list does not use. */
    /* The shared cell makes every span a flex row, which cannot ellipsize.
       Two classes beat that rule. */
    ${MobileCardItem} ${ValidatorAddress} {
      display: block;
      flex: 1;
      height: 20px;
      /* The shared cell sets min-width: fit-content on every span, which
         outranks this component's own min-width and lets the key widen the
         row past the copy button. */
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;

export const NameLine = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  width: 100%;
`;

export const LeaderBadge = styled(BadgePill)`
  && {
    flex-shrink: 0;
    min-width: fit-content;
  }
`;

export const ValidatorKeyLink = styled(AddressLink)`
  && {
    display: block;
    flex: 1;
    height: 20px;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* On the card the 20px box is centered on the 24px copy button, but the
     glyphs sit at the top of that box, about 3px above the icon. A box as
     tall as the line centers on the icon. The button is not in this rule. */
  @media screen and (max-width: ${belowWidth(TABLET_PX)}) {
    && {
      height: auto;
    }
  }
`;

export const ValidatorNameLink = styled(AddressLink)`
  && {
    display: block;
    /* As tall as the line, so the glyphs center on the 18px Leader badge.
       A fixed 20px box kept the line at the top and left the badge low. */
    height: auto;
    min-width: 0;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-family: inherit;
  }
`;

export const ValidatorLine = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  width: 100%;
`;
