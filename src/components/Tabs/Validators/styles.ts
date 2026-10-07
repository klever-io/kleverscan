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
import styled, { css } from 'styled-components';

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
    /* Names stay short. The key uses the rest of the row and wraps, so a
       long key stays visible instead of ending in an ellipsis. */
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

    /* On a table cell, height is the minimum, so a wrapped key is not clipped. */
    ${MobileCardItem} {
      height: ${DATA_LIST_ROW_HEIGHT};
      overflow: visible;
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

    /* The name stays one line. The shared cell makes every span a flex row
       and pins it to 24px. Two classes beat that rule. The key does not
       use this span: it wraps in its own component. */
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

const keyWrap = css`
  display: block;
  flex: 1;
  height: auto;
  min-width: 0;
  overflow: visible;
  text-overflow: clip;
  white-space: normal;
  overflow-wrap: anywhere;
`;

export const ValidatorKeyLink = styled(AddressLink)`
  && {
    ${keyWrap}
  }
`;

export const ValidatorKeyText = styled.span`
  && {
    ${keyWrap}
    font-family: 'Fira Mono', monospace;
    font-size: 0.875rem;
    color: ${props => props.theme.black};
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
