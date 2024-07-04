import { Warning } from '@/components/DateFilter/styles';
import { CenteredRow, DefaultCardStyles } from '@/styles/common';
import styled from 'styled-components';
export const GridSales = styled.div`
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(auto-fit, minmax(23rem, 1fr));
  justify-items: center;
  gap: 2rem;
`;
export const ItemsDivWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
export const GridItemFlex = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  gap: 0.5rem;
  span:nth-child(1) {
    color: ${props => props.theme.darkText};
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  span:nth-child(2) {
    color: ${props => props.theme.black};
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

export const GridItemButton = styled.div`
  button {
    width: 100%;
    max-width: initial;
  }
`;

export const LoaderWrapper = styled.div`
  display: grid;
  place-items: center;
  position: relative;
`;

export const TooltipWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  position: absolute;
  width: 100%;
  height: 100%;
`;

export const ImageWrapper = styled.div`
  span {
    border-radius: 50%;
  }
`;

export const MainItemsDiv = styled.div`
  ${DefaultCardStyles};
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 0.5rem;
  justify-self: stretch;
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    max-width: 40rem;
  }
`;
export const SalesCardButton = styled.button`
  background-color: ${props => props.theme.violet};
  padding: 0.75rem 0rem;
  border-radius: 0.4rem;
  color: ${props => props.theme.true.white};
  font:
    500 1rem 'Manrope',
    sans-serif;
  &:hover {
    opacity: 0.8;
  }
`;
export const DefaultReturn = styled.div`
  ${Warning}
  margin: 0 auto;
  display: flex;
  background-color: ${props => props.theme.warning.background};
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  padding-left: 10%;
  padding-right: 10%;
  border-radius: 0.5rem;
  margin-top: 1rem;
  gap: 1rem;
  span {
    font-size: 1.1rem;
    font-weight: 700;
    color: ${props => props.theme.warning.text};
  }
`;

export const MktplaceCenteredRow = styled(CenteredRow)`
  overflow: hidden;
`;

export const SkeletonImg = styled.div`
  display: grid;
  place-items: center;
  border-radius: 50%;
`;
