import {
  ButtonExpand,
  OperationsContainer,
  OperationsContent,
  ValidOperation,
} from '@/components/AccountPermission/styles';
import { focusRing } from '@/components/DataList/styles';
import { TableGradientBorder } from '@/components/Table/styles';
import { FrozenContainer } from '@/styles/common';
import {
  AmountContainer,
  BalanceKLVValue,
  BalanceTransferContainer,
  IconContainer,
  StakingRewards,
  ItemContainerPermissions,
  ItemContentPermissions,
} from '@/views/accounts/detail';
import styled from 'styled-components';

/* Shared by the total and both boxes, so Available lines up with Allowance
   and with the KLV total. 11rem fits "Participação de KLV" (149px at 16px).
   12rem fits the longest amount on this page (165px). */
const FIGURE_LABEL = '11rem';
const FIGURE_VALUE = '12rem';
const FIGURE_GAP = '16px';

/* Local copy of the block detail facts skin. The account card adds signer
   rows, grouped balance boxes, and a wrapping value row, so the two pages
   do not share one styled module. views/accounts/detail is also imported
   by transaction pages, so this skin cannot live there either. The
   reduced-motion rule below matches FactsTab on the block page. */

export const FactsCard = styled.section`
  ${TableGradientBorder}
  border-radius: 16px;
  margin-top: 24px;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: grid;
    grid-template-columns: max-content minmax(0, 1fr);
  }
`;

export const FactsTabs = styled.div`
  display: flex;
  gap: 4px;
  padding: 8px 12px 0;
  border-bottom: 1px solid ${props => props.theme.black10};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-column: 1 / -1;
  }
`;

export const FactsTab = styled.button<{ $selected: boolean }>`
  margin: 0;
  padding: 8px 12px;
  border: none;
  border-bottom: 2px solid
    ${props => (props.$selected ? props.theme.violet : 'transparent')};
  background: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props =>
    props.$selected ? props.theme.black : props.theme.darkText};
  transition:
    color 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.black};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
  ${focusRing}
`;

export const FactRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  min-width: 0;

  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.black10};
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: grid;
    grid-column: 1 / -1;
    grid-template-columns: subgrid;
    align-items: center;
    column-gap: 16px;
    padding: 12px 0;

    > :last-child {
      min-width: 0;
      padding-right: 20px;
    }
  }
`;

export const FactLabel = styled.span`
  width: 12rem;
  flex-shrink: 0;
  white-space: nowrap;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.darkText};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: auto;
    padding-left: 20px;
  }
`;

export const FactValueRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1;
  flex-wrap: wrap;

  button {
    flex-shrink: 0;
  }
`;

export const FactValue = styled.span`
  flex-shrink: 0;
  white-space: nowrap;
  font-size: 0.875rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: ${props => props.theme.black};
`;

export const FactHash = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: 'Fira Mono', monospace;
  font-size: 0.875rem;
  color: ${props => props.theme.black};
`;

export const WeightText = styled.span`
  flex-shrink: 0;
  white-space: nowrap;
  font-size: 0.875rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: ${props => props.theme.black};
`;

/* On a phone the signer row leaves the two-column grid. That column kept
   its width even when the label was empty, so the address collapsed and
   the rows under the first one showed a hole. The label takes its own
   line, and the address, weight and copy share the card width. */
export const SignerRow = styled(FactRow)`
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    row-gap: 6px;
    padding: 10px 20px;

    > :last-child {
      padding-right: 0;
    }

    ${FactValueRow} {
      flex: 1 0 100%;
      flex-wrap: nowrap;
      width: 100%;
      min-width: 0;
    }
  }
`;

export const SignerLabel = styled(FactLabel)<{ $show: boolean }>`
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: ${props => (props.$show ? 'block' : 'none')};
    flex: 1 0 100%;
    width: 100%;
    padding-left: 0;
  }
`;

/* Balance and rewards stay one group: the total (or the rewards label)
   and the inner box share a single row, instead of one fact row each. */
export const GroupRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 12px 20px;
  min-width: 0;

  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.black10};
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-column: 1 / -1;
    flex-direction: column;
    gap: 8px;
    padding: 12px 20px;
  }
`;

export const GroupBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
  width: 100%;
  flex: 1;
  color: ${props => props.theme.black};
`;

/* The total uses the same two columns as the boxes under it. The box
   border and its row padding are 17px, so the total is inset by that much.
   Below the tablet width the KLV mark sits inside the amount, so this
   grid would push the total off the column. The amount row stays as it
   is there. */
export const FigureRow = styled.div`
  box-sizing: border-box;
  max-width: 100%;

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 0 17px;

    ${AmountContainer} {
      display: grid;
      grid-template-columns: ${FIGURE_LABEL} ${FIGURE_VALUE} auto;
      column-gap: ${FIGURE_GAP};
      align-items: center;
      width: max-content;
      max-width: 100%;
    }

    ${IconContainer} {
      grid-column: 1;
    }

    /* AmountContainer's own second-child rule is as specific as a single
       class on this box, so the child combinator is what wins. */
    ${AmountContainer} > ${BalanceTransferContainer} {
      display: contents;
    }

    ${BalanceTransferContainer} > div {
      grid-column: 2;
      text-align: right;
    }

    ${BalanceKLVValue} {
      justify-content: flex-end;
      width: 100%;
    }

    /* The component's own width is 120px. The rows under this total are
       10rem, from the shared box min-width, so the total bar matches them. */
    ${BalanceKLVValue} [data-testid='skeleton'] {
      width: 10rem !important;
      min-width: 10rem;
    }

    /* The dollar line is a block, so a bar ignores the cell's right
       alignment and sits on the left. Same right edge as the total. */
    ${BalanceTransferContainer} p [data-testid='skeleton'] {
      margin-left: auto;
      width: 4.5rem;
    }

    ${BalanceTransferContainer} button {
      grid-column: 3;
      justify-self: start;
    }
  }
`;

/* Label and amount stay one line, in the same two columns in both boxes.
   The amount stays 1rem, the same size as the total above it. On a phone
   the pair is wider than the card, so the two stack. */
export const AccountBox = styled(FrozenContainer)`
  box-sizing: border-box;
  width: max-content;
  max-width: 100%;

  && > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${FIGURE_GAP};
    box-sizing: border-box;
    max-width: 100%;
    padding: 10px 16px;
  }

  && > div strong {
    flex: 0 0 ${FIGURE_LABEL};
    width: ${FIGURE_LABEL};
    margin-right: 0;
    font-size: 1rem;
    font-weight: 600;
  }

  && > div > span:first-of-type {
    flex: 0 0 ${FIGURE_VALUE};
    width: ${FIGURE_VALUE};
    min-width: 0;
    padding-right: 0;
    text-align: right;
    font-size: 1rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: ${props => props.theme.black};
  }

  /* The bar is a block inside the value column, so text-align does not
     move it. It keeps the right edge the amount uses once it arrives. */
  && > div > span:first-of-type [data-testid='skeleton'] {
    margin-left: auto;
  }

  ${StakingRewards} > [data-testid='skeleton'] {
    flex: 0 0 ${FIGURE_VALUE};
    width: ${FIGURE_VALUE};
    max-width: ${FIGURE_VALUE};
    display: flex;
    justify-content: flex-end;
  }

  ${StakingRewards} > [data-testid='skeleton'] > span {
    width: 10rem !important;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 100%;

    && > div {
      flex-direction: column;
      align-items: flex-start;
      padding: 12px 16px;
    }

    && > div strong,
    && > div > span:first-of-type {
      flex: 0 1 auto;
      width: auto;
      min-width: 0;
      text-align: left;
    }

    && > div > span:first-of-type [data-testid='skeleton'] {
      margin-left: 0;
    }

    ${StakingRewards} > [data-testid='skeleton'] {
      flex: 0 1 auto;
      width: 120px;
      max-width: none;
      justify-content: flex-start;
    }

    /* The desktop bar is 10rem with !important, which is more specific
       than the loader's own width. On a phone the bar is the 120px box. */
    ${StakingRewards} > [data-testid='skeleton'] > span {
      width: 120px !important;
    }
  }
`;

export const PermHeading = styled.h2`
  margin: 0;
  padding: 16px 20px 4px;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.black};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-column: 1 / -1;
  }
`;

export const PermissionBlock = styled.div`
  min-width: 0;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: grid;
    grid-column: 1 / -1;
    grid-template-columns: subgrid;
  }
`;

/* The shared operation row is a 16rem box with the tick above the name,
   and its Expand button is pulled over the last box. Here the names line
   up in equal columns, with no rules between them. The button sits in
   the reserved room on the right, so it does not become a fourth column. */
export const OperationsWrap = styled.div`
  display: grid;
  grid-template-columns: 12rem minmax(0, 1fr);
  column-gap: 16px;
  align-items: start;
  padding: 12px 20px 16px;
  min-width: 0;

  ${ItemContainerPermissions} {
    display: contents;
  }

  ${ItemContainerPermissions} > strong {
    max-width: none;
    min-width: 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: ${props => props.theme.darkText};
  }

  ${ItemContentPermissions} {
    display: block;
    width: auto;
    min-width: 0;
  }

  ${OperationsContainer} {
    position: relative;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-items: center;
    justify-items: start;
    column-gap: 24px;
    row-gap: 16px;
    width: 100%;
    /* The shared rule sets padding to 0 with !important. This keeps a
       track free for the button without giving the names a fourth column. */
    padding: 0 104px 0 0 !important;
  }

  ${OperationsContent} {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    width: auto;
    max-width: 100%;
    min-width: 0;
  }

  ${OperationsContent} p {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: ${props => props.theme.black};
  }

  /* An owner permission shows a tick for every contract and does not pass
     a checked flag, so the shared style fades the name. A tick means it
     is allowed, so the name stays at full strength. */
  ${OperationsContent}:not(:has(input)) p {
    opacity: 1;
  }

  ${ValidOperation} {
    width: 16px;
    height: 16px;
    flex: 0 0 16px;
  }

  ${ButtonExpand} {
    position: absolute;
    top: 0;
    right: 0;
    width: auto;
    margin: 0;
    padding: 8px 16px;
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    ${OperationsContainer} {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-column: 1 / -1;
    grid-template-columns: 1fr;
    row-gap: 8px;

    ${OperationsContainer} {
      grid-template-columns: 1fr;
      padding: 0 !important;
    }

    ${ButtonExpand} {
      position: static;
      margin-top: 4px;
    }
  }
`;

export const StackedLabel = styled.span`
  display: flex;
  flex-direction: column;
  width: 12rem;
  flex-shrink: 0;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.3;
  color: ${props => props.theme.darkText};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: auto;
  }
`;
