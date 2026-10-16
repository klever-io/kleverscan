import { focusRing } from '@/components/DataList/styles';
import { TableGradientBorder } from '@/components/Table/styles';
import { CenteredRow, Row, RowContent, Status } from '@/styles/common';
import {
  CenteredRow as DetailCenteredRow,
  ExpandCenteredRow,
  ExpandRow,
  IconsWrapper,
  KappFeeSpan,
  Panel,
  Row as DetailRow,
} from '@/views/transactions/detail';
import Link from 'next/link';
import styled from 'styled-components';

/* Local to the transaction detail page. views/transactions/detail is also
   imported by the multisign page, asset pages, and the contract rows, so
   this skin cannot live there. The account and block cards are 0.875rem.
   This card is 1rem, so the three skins stay separate. */

export const FactsCard = styled.section`
  ${TableGradientBorder}
  border-radius: 16px;
  margin-top: 24px;
  min-width: 0;
  max-width: 100%;

  /* The open section's rows share one label column, as wide as its longest
     label. A fixed 12rem column is wider than a phone can spare next to a
     timestamp. */
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: grid;
    grid-template-columns: max-content minmax(0, 1fr);
  }
`;

export const SectionBar = styled.div`
  display: flex;
  gap: 4px;
  padding: 8px 12px 0;
  border-bottom: 1px solid ${props => props.theme.black10};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-column: 1 / -1;
  }
`;

export const SectionLabel = styled.span`
  padding: 8px 12px;
  border-bottom: 2px solid ${props => props.theme.violet};
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.black};
`;

export const FactRow = styled.div<{ $start?: boolean }>`
  display: flex;
  align-items: ${props => (props.$start ? 'flex-start' : 'center')};
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
    align-items: ${props => (props.$start ? 'start' : 'center')};
    column-gap: 16px;
    padding: 12px 0;

    > :last-child {
      min-width: 0;
      padding-right: 20px;
    }
  }
`;

/* On a phone the shared label column is as wide as "Bandwidth Fee", so a
   hash beside it keeps only a few characters. These rows drop that column
   and put the value on its own line, across the card. */
export const WideFactRow = styled(FactRow)`
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 4px;

    > :last-child {
      padding-left: 20px;
    }
  }
`;

export const FactLabel = styled.span`
  width: 12rem;
  flex-shrink: 0;
  white-space: nowrap;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
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

  button {
    flex-shrink: 0;
  }

  /* From uses the shared link, which does not set its own size. */
  a {
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.4;
  }

  ${Status} span {
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.4;
  }
`;

export const FactValue = styled.span`
  flex-shrink: 0;
  white-space: nowrap;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  font-variant-numeric: tabular-nums;
  color: ${props => props.theme.black};
`;

/* Result codes and the failed-fee note are sentences. They stay fully
   visible and wrap, where a hash is shortened on purpose. */
export const FactWrap = styled.span`
  min-width: 0;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  overflow-wrap: anywhere;
  color: ${props => props.theme.black};
`;

export const FactHash = styled.span`
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: 'Fira Mono', monospace;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.4;
  color: ${props => props.theme.black};
`;

export const FactHashLink = styled(Link)`
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: 'Fira Mono', monospace;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.4;
  color: ${props => props.theme.black};
  text-decoration: none;
  ${focusRing}

  &:hover {
    text-decoration: underline;
  }
`;

export const FeeValue = styled(FactValueRow)`
  flex-wrap: wrap;
  align-items: center;

  /* KappFee renders the amount in a plain paragraph, and the failed amount
     in its own paragraph. Both keep the body size unless this card sets it.
     The shared component stays as it is. */
  p {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.4;
    font-variant-numeric: tabular-nums;
    color: ${props => props.theme.black};
  }

  ${KappFeeSpan} {
    flex-wrap: wrap;
    align-items: center;
    min-width: 0;

    > span {
      font-size: 0.875rem;
      font-weight: 400;
      line-height: 1.4;
    }
  }
`;

export const SignatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  flex: 1;
`;

/* Token transfers keep their own row component. Pull the label onto the
   same 12rem column, and let the sentence wrap instead of clipping. */
export const TokenSlot = styled.div`
  min-width: 0;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-column: 1 / -1;
  }

  ${Row} {
    padding: 12px 20px;
    gap: 16px;
    box-sizing: border-box;
    max-width: 100%;
    font-size: 1rem;

    > span:first-child {
      width: 12rem;
      flex-shrink: 0;
    }

    span,
    strong,
    a,
    p {
      font-size: 1rem;
      line-height: 1.4;
    }

    /* The shared row bolds every link. Addresses here stay regular, same
       weight as the hash and the signature. */
    span a {
      font-weight: 400;
    }
  }

  /* This row is the only child, so the shared :not(:last-child) line never
     paints, and that line is lightGray in the light theme. */
  && ${Row} {
    border-bottom: 1px solid ${props => props.theme.black10};
  }

  ${RowContent} {
    min-width: 0;
    flex: 1;
  }

  ${Row} span {
    white-space: normal;
    overflow: visible;
    text-overflow: unset;
    max-width: 100%;
  }
`;

/* Contract parameter rows stay the shared Row. Only this card tightens
   them onto the fact column and stops an address from widening the page.
   Below the tablet width the shared link sets min-width: fit-content,
   which is what pushed the row past the screen. */
export const ContractsBody = styled.div`
  min-width: 0;
  max-width: 100%;

  /* The line under the Contracts label is black10. The shared row uses
     lightGray in the light theme, so the lines between fields did not match. */
  ${Row}:not(:last-child),
  ${DetailRow}:not(:last-child) {
    border-bottom-color: ${props => props.theme.black10};
  }

  ${Row}, ${DetailRow} {
    box-sizing: border-box;
    min-width: 0;
    max-width: 100%;
    padding: 12px 20px;
    gap: 16px;
    font-size: 1rem;

    span,
    strong,
    a,
    p {
      font-size: 1rem;
      line-height: 1.4;
    }

    /* The shared row bolds every link. Addresses here stay regular, same
       weight as the hash and the signature. */
    span a {
      font-weight: 400;
    }

    > span:first-child {
      width: 12rem;
      flex-shrink: 0;
    }

    > :not(:first-child) {
      min-width: 0;
      max-width: 100%;
    }

    /* The value span was only as wide as its text, so a shorter address
       made the next measurement smaller too. It takes the free column. */
    > span:not(:first-child) {
      flex: 1 1 auto;
      width: auto;
      min-width: 0;
    }
  }

  ${CenteredRow}, ${DetailCenteredRow}, ${ExpandCenteredRow} {
    min-width: 0;
    max-width: 100%;
    flex: 1;

    a,
    span,
    p {
      min-width: 0;
      max-width: 100%;
    }

    /* The text link may shrink. The open-in-new-tab icon must not. */
    > a[target='_blank'] {
      flex: 0 0 20px;
      width: 20px;
      min-width: 20px;
    }
  }

  ${Row} span,
  ${DetailRow} span {
    max-width: 100%;
  }

  /* Metadata rows add an expand button. The shared mobile rule turns that
     row into a grid and parks the value on the third line, under the nav
     on a short screen. Keep the label, the value, and the button on one row. */
  ${DetailRow} {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }

  ${ExpandRow}, ${Panel} {
    box-sizing: border-box;
    max-width: 100%;
    min-width: 0;
  }

  /* The shared panel was padded for a 10rem label. This card's label is
     12rem, after the row's 20px padding and the 16px gap. */
  ${Panel} {
    padding-left: calc(20px + 12rem + 16px);
  }

  ${IconsWrapper} {
    flex-shrink: 0;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    /* The card is a two-column grid for the overview facts. This body is
       one block, so it has to span both columns. In the first column it
       becomes as wide as the longest address and drags the page with it. */
    grid-column: 1 / -1;

    /* The shared row stacks the label above the value. These fields are
       short, so they stay on one line, label then value, like desktop.
       The label column gives way on a narrow phone so the amount, the
       icon, and the ticker stay fully visible. */
    ${Row} {
      flex-direction: row;
      align-items: center;
      flex-wrap: nowrap;

      > span:first-child {
        flex: 0 1 32%;
        width: 32%;
        max-width: 12rem;
        min-width: 5.25rem;
        white-space: normal;
      }
    }

    /* An address needs the full card width, same as From. The short rows
       above stay on one line. */
    ${Row}[data-address-row] {
      flex-direction: column;
      align-items: stretch;
      row-gap: 4px;

      > span:first-child {
        flex: 0 0 auto;
        width: auto;
        max-width: 100%;
        min-width: 0;
      }
    }

    /* A long value, such as a BLS key, has to shrink. The amount row opts
       in below so its number, icon, and ticker stay whole. */
    ${DetailCenteredRow} {
      flex: 1 1 auto;
      width: auto;
      min-width: 0;
    }

    ${DetailCenteredRow}[data-amount] {
      flex: 0 0 auto;
      min-width: max-content;
    }

    ${DetailRow} {
      flex-wrap: wrap;

      > span:first-child {
        flex: 0 1 auto;
        width: auto;
        max-width: 100%;
        min-width: 0;
      }
    }

    ${Panel} {
      padding: 12px 20px;
    }
  }
`;

export const RawBody = styled.div`
  min-width: 0;
  max-width: 100%;
  padding: 12px 20px 20px;
  overflow: auto;
  max-height: 30rem;
  font-size: 0.85rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-column: 1 / -1;
  }
`;
