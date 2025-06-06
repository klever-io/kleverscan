import { DefaultCardStyles } from '@/styles/common';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

export const FungibleContainer = styled.div`
  ${DefaultCardStyles};
  display: flex;
  flex-direction: row;
  border-radius: 5px;
  justify-content: space-between;
  padding: 3rem;

  @media (max-width: 1200px) {
    flex-direction: column;
    align-items: center;
    padding: 1rem;
  }
`;

export const Content = styled.div`
  width: 100%;

  &:first-child {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  @media (max-width: 1200px) {
    width: 90%;
  }
`;

export const AssetName = styled.span`
  color: ${props => props.theme.black};
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

export const Button = styled.div`
  background-color: ${props => props.theme.violet};
  width: 100%;
  padding: 0.75rem 0rem;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 0.3rem;
  cursor: pointer;

  span {
    color: ${props => props.theme.true.white};
    text-align: center;
    font-size: 0.9rem;
  }

  &:hover {
    opacity: 0.8;
  }
`;

export const TotalPrice = styled.div`
  display: flex;
  justify-content: space-between;

  span {
    font-size: 0.9rem;

    &:first-child {
      color: ${props => props.theme.black};
      font-weight: bold;
    }

    &:nth-child(2) {
      color: ${props => props.theme.black};
    }
  }
`;

export const PriceRange = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  /* @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 2rem;
  } */
`;

export const PriceRangeTitle = styled.span`
  color: ${props => props.theme.black};
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

export const Row = styled.div<{ inPriceRange: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border: ${props => (props.inPriceRange ? props.theme.violet : 'none')} 2px
    solid;
  border-radius: 8px;
  padding: 1rem;
  span {
    color: ${props => props.theme.black};
  }
  background-color: #0b0b1e;
`;

export const LoaderWrapper = styled.div`
  margin-top: 0.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ViewMoreButton = styled.div.attrs({ role: 'button', tabIndex: 0 })`
  color: ${props => props.theme.violet};
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  cursor: pointer;
`;
