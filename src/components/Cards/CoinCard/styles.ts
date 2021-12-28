import styled, { keyframes } from 'styled-components';

import Image from 'next/image';

import {
  ArrowLeft as DefaultArrowLeft,
  ArrowRight as DefaultArrowRight,
} from '@/assets/pagination';
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
`;

export const ArrowContainer = styled.div`
  width: 21rem;

  display: flex;

  position: relative;

  flex-direction: row;
  @media (max-width: 768px) {
    width: calc(100vw - 10rem);
  }
  @media (max-width: 425px) {
    min-width: calc(100vw - 5rem);
  }
`;

export const Content = styled.div`
  display: flex;

  overflow-x: auto;
  scroll-behavior: smooth !important;

  scroll-snap-type: x mandatory;
  scroll-snap-stop: always;

  border-radius: 1rem;

  &&::-webkit-scrollbar {
    display: none;
  }
  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const CardContainer = styled.div`
  padding: 1.5rem;
  scroll-snap-align: start;

  width: auto;

  display: flex;
  position: relative;

  flex-direction: row;
  align-items: center;

  background-color: ${props => props.theme.card.background};
  border-radius: 1rem;

  @media (max-width: 768px) {
    min-width: calc(100vw - 10rem);
  }
  @media (max-width: 425px) {
    min-width: calc(100vw - 5rem);
  }
`;

export const CardContent = styled.div`
  min-width: 18.5rem;

  display: flex;

  flex-direction: column;

  animation: 1.5s ease 0s 1 normal none running ${FadeIn};

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const HeaderContainer = styled.div`
  display: flex;

  flex-direction: row;

  z-index: 3;
`;

export const HeaderContent = styled(HeaderContainer)`
  padding-left: 1rem;

  width: 100%;

  flex-direction: column;
`;

export const Name = styled.div`
  display: flex;

  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  color: ${props => props.theme.white};
  font-weight: 600;

  span {
    font-size: 1.1rem;
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
  padding: 0 1.25rem;

  height: 7.5rem;
  width: 100%;

  top: 1.5rem;
  left: 0;

  position: absolute;

  z-index: 1;
`;

export const ValueContainer = styled.div`
  margin-top: 3rem;
`;

export const ValueContent = styled.div`
  display: flex;

  flex-direction: column;

  font-weight: 400;
  color: ${props => props.theme.card.text};

  gap: 0.25rem;

  &:not(:last-child) {
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 0.85rem;
  }
`;

export const ValueDetail = styled.div<{ positive?: boolean }>`
  display: flex;

  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  span {
    color: ${props => props.theme.white};
    font-size: 0.95rem;
    font-weight: 600;
  }

  p {
    color: ${props => {
      if (props.positive === undefined) {
        return props.theme.card.text;
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
  padding-right: 1rem;
`;
export const ArrowRight = styled(DefaultArrowRight)`
  display: none;
  @media (min-width: 768px) {
    display: block;
    position: absolute;

    width: 2rem;
    height: 2rem;
    padding-top: 0.5rem;
    padding-left: 1rem;
    right: -0.25rem;
    bottom: 50%;
    transform: translateY(50%);

    cursor: pointer;

    transition: 0.2s ease;
    filter: brightness(1);
    z-index: 2;

    &:hover {
      filter: brightness(2);
    }
  }
`;

export const ArrowLeft = styled(DefaultArrowLeft)`
  display: none;
  @media (min-width: 768px) {
    display: block;
    position: absolute;
    width: 2rem;
    height: 2rem;
    padding-top: 0.5rem;
    padding-left: 0.25rem;
    left: -0.25rem;
    bottom: 50%;
    transform: translateY(50%);

    cursor: pointer;

    transition: 0.2s ease;
    z-index: 2;
    filter: brightness(1);

    &:hover {
      filter: brightness(2);
    }
  }
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
  @media (min-width: 768px) {
  }
`;

export const CoinSelector = styled.div<{ isSelected: boolean }>`
  min-width: 0.5rem;
  height: 0.5rem;

  transition: 0.5s ease;

  background-color: ${props =>
    props.isSelected ? props.theme.white : props.theme.black};
  cursor: pointer;
  border-radius: 50%;
`;
