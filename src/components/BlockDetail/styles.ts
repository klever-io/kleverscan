import { accentText, focusRing } from '@/components/DataList/styles';
import { TableGradientBorder } from '@/components/Table/styles';
import Link from 'next/link';
import styled from 'styled-components';

/* Local to the block detail page. views/blocks/detail is also imported by
   the marketplace page, so this skin cannot live there. */

export const FactsCard = styled.section`
  ${TableGradientBorder}
  border-radius: 16px;
  margin-top: 24px;

  /* The open tab's rows share one label column, as wide as its longest
     label. A fixed 12rem column is wider than this screen can spare next
     to the timestamp. */
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
  ${focusRing}

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
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

export const BlockStep = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  border-radius: 4px;
  color: ${props => props.theme.darkText};
  text-decoration: none;
  transition: color 150ms ease-out;

  &:hover {
    color: ${accentText};
  }

  ${focusRing}

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;
