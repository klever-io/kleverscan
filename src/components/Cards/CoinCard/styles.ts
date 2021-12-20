import styled, { keyframes } from 'styled-components';

import Image from 'next/image';

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
  width: 22rem;

  display: flex;

  position: relative;

  flex-direction: row;
`;

export const Content = styled.div`
  display: flex;

  overflow-x: auto;
  scroll-behavior: smooth !important;

  gap: 0.75rem;

  border-radius: 1rem;

  &&::-webkit-scrollbar {
    display: none;
  }
`;

export const CardContainer = styled.div`
  padding: 1.5rem;

  width: auto;

  display: flex;
  position: relative;

  flex-direction: row;
  align-items: center;

  background-color: ${props => props.theme.card.background};
  border-radius: 1rem;

  @media (max-width: 768px) {
    width: 100%;
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
