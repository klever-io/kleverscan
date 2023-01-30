import Image from 'next/image';
import styled, { keyframes } from 'styled-components';

interface IVariation {
  positive: boolean;
}

const FadeIn = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
  }
`;

export const Content = styled.div`
  display: flex;
  box-shadow: 5px 6px 5px 0px rgba(0, 0, 0, 0.1);

  overflow-x: auto;
  scroll-behavior: smooth !important;

  scroll-snap-type: x mandatory;
  scroll-snap-stop: always;

  border-radius: 1rem;
  width: 21rem;
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
  }
  overflow-y: hidden;
  position: relative;

  flex-direction: row;

  &&::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

export const CardContainer = styled.div`
  padding: 1.5rem;
  scroll-snap-align: start;
  position: relative;

  flex-direction: row;
  align-items: center;

  background-color: ${props => props.theme.card.background};
  border-radius: 1rem;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    min-width: 100%;
  }
`;

export const CardContent = styled.div`
  min-width: 18.5rem;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    min-width: 10.5rem;
  }
  display: flex;

  flex-direction: column;

  animation: 1.5s ease 0s 1 normal none running ${FadeIn};
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
  }

  a {
    z-index: 0;
  }
`;

export const CardContainerSkeleton = styled(CardContainer)`
  padding: 1.5rem 1.5rem 1.5rem 1.5rem;
`;

export const HeaderContainer = styled.div`
  display: flex;

  flex-direction: row;

  z-index: 0;
`;

export const HeaderContent = styled(HeaderContainer)`
  padding-left: 1rem;

  width: 100%;

  flex-direction: column;
`;

export const HeaderContentSkeleton = styled(HeaderContent)`
  gap: 0.25rem;
`;

export const Name = styled.div`
  display: flex;

  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  color: ${props => props.theme.card.white};

  font-weight: 600;

  span {
    font-size: 1.1rem;
    &:first-of-type {
      cursor: pointer;
    }
  }
`;

export const Description = styled(Name)<IVariation>`
  font-size: 0.95rem;
  font-weight: 400;

  span {
    color: ${props => props.theme.card.text};
    font-size: 0.85rem;
  }

  p {
    color: ${props => props.theme.card[props.positive ? 'green' : 'red']};
    font-weight: 500;
  }
`;

export const ChartContainer = styled.div`
  width: 18.5rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  height: 92.79px;
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
  }
`;

export const ValueContainer = styled.div<{ isKLV?: boolean }>`
  display: grid;
  margin-top: 0.5rem;
  grid-template-columns: ${props => (props.isKLV ? '1fr 1fr' : '1fr')};
`;

export const ValueContent = styled.div<{ isDropdown?: boolean }>`
  display: flex;
  flex-direction: column;

  font-weight: 400;
  color: ${props => props.theme.lightGray};
  gap: 0.25rem;
  :nth-child(even) {
    align-items: ${props => (props.isDropdown ? 'flex-end' : '')};
  }

  &:not(:last-child) {
    margin-bottom: 0.5rem;
  }

  p {
    font-weight: 500;
    font-size: 0.85rem;
  }
`;

export const TitleDetails = styled.div<{ positive?: boolean }>`
  display: flex;
  flex-direction: row;

  span {
    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      font-size: 0.8rem;
    }
    font-size: 0.59rem;
    padding-left: 0.5rem;
    font-weight: 500;
    color: ${props => {
      if (props.positive === undefined) {
        return props.theme.lightGray;
      }

      return props.theme.card[props.positive ? 'green' : 'red'];
    }};
  }
`;

export const ArrowDownDiv = styled.div<{ open: boolean }>`
  position: absolute;
  left: 46.9%;
  right: 47.78%;
  cursor: pointer;
  bottom: 2.29%;
  path {
    stroke: white !important;
  }
  svg {
    transition: 0.2s ease;
    transform: rotate(${props => (props.open ? 0 : 180)}deg);
  }
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    left: 49%;
  }
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    left: 48%;
  }
`;

export const ValueDetail = styled.div<{ positive?: boolean }>`
  display: flex;

  align-items: center;

  color: ${props => props.theme.card.white};

  span {
    color: ${props => props.theme.card.white};
    font-size: 0.95rem;
    font-weight: 600;
  }

  p {
    color: ${props => {
      if (props.positive === undefined) {
        return props.theme.lightGray;
      }

      return props.theme.card[props.positive ? 'green' : 'red'];
    }};
  }
`;

export const IconContainer = styled(Image).attrs(() => ({
  alt: 'Coin',
  width: 50,
  height: 50,
}))`
  cursor: pointer;
  padding-right: 1rem;
`;

export const CoinsSelector = styled.div`
  position: absolute;
  bottom: -1rem;
  display: flex;
  min-width: 0.5rem;
  height: 0.5rem;
  gap: 0.5rem;
  transition: 0.5s ease;

  border-radius: 50%;
`;

export const CoinSelector = styled.div<{ isSelected: boolean }>`
  min-width: 0.6rem;
  height: 0.6rem;

  transition: 0.5s ease;

  background-color: ${props =>
    props.isSelected ? props.theme.card.background : props.theme.white};

  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);

  filter: ${props => (props.theme.dark ? 'brightness(2)' : 'none')};

  cursor: pointer;
  border-radius: 50%;
`;
