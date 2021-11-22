import styled, { keyframes } from 'styled-components';

import { lighten, transparentize } from 'polished';

import { default as DefaultInput } from '@/components/Inputt';

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
  background-color: ${props => props.theme.background};
`;

export const IconContainer = styled.div`
  padding-right: 1rem;
`;

export const Section = styled.section`
  padding: 5rem 10rem 0 10rem;

  h1 {
    margin-bottom: 1rem;
  }

  &:last-child {
    padding-bottom: 10rem;
  }
`;

export const DataContainer = styled(Section)`
  padding: 5rem 10rem;

  background-color: #40274f;
`;

export const Input = styled(DefaultInput)`
  margin: 0 5rem;
  padding: 1.25rem 1rem;

  background-color: ${props => props.theme.white};

  border-color: ${props => props.theme.input.border.home};

  &:focus-within {
    box-shadow: 0 1px 10px ${props => props.theme.input.shadow};
  }

  input {
    &::selection {
      background-color: ${props => lighten(0.4, props.theme.input.border.home)};
    }
  }
`;

export const DataCardsContainer = styled.div`
  margin-top: 4rem;

  display: flex;

  flex-direction: row;
  align-items: center;

  gap: 1rem;
`;

export const DataCardsContent = styled.div`
  width: 100%;

  display: flex;

  flex-direction: column;
  justify-content: center;

  gap: 0.5rem;
`;

export const DataCard = styled.div`
  padding: 1.5rem;

  width: 100%;

  display: flex;

  flex-direction: row;
  align-items: center;

  background-color: ${props => props.theme.card.background};
  border-radius: 1rem;
`;

export const DataCardValue = styled.div`
  width: 100%;

  display: flex;

  flex-direction: column;

  gap: 0.25rem;

  span {
    color: ${props => props.theme.card.text};
    font-size: 0.85rem;
  }

  p {
    color: ${props => props.theme.white};
    font-weight: 600;
    font-size: 1rem;
  }
`;

export const DataCardLatest = styled.div<IVariation>`
  min-width: fit-content;
  display: flex;

  flex-direction: column;
  align-items: flex-end;

  gap: 0.5rem;

  span {
    font-size: 0.85rem;
    color: ${props => props.theme.card.secondaryText};
  }

  p {
    color: ${props => props.theme.card[props.positive ? 'green' : 'red']};
  }
`;

export const CoinDataCard = styled(DataCard)`
  width: auto;
  height: 16rem;

  flex-direction: column;

  position: relative;
`;

export const CoinDataContent = styled.div`
  min-width: 18.5rem;

  display: flex;

  flex-direction: column;

  animation: 1.5s ease 0s 1 normal none running ${FadeIn};
`;

export const CoinDataHeaderContainer = styled.div`
  display: flex;

  flex-direction: row;

  z-index: 3;
`;

export const CoinDataHeader = styled(CoinDataHeaderContainer)`
  width: 100%;

  flex-direction: column;
`;

export const CoinDataName = styled.div`
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

export const CoinDataDescription = styled(CoinDataName)<IVariation>`
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

export const CoinChartContainer = styled.div`
  padding: 0 1.25rem;

  height: 10rem;
  width: 100%;

  top: -1rem;
  left: 0;

  position: absolute;

  z-index: 1;
`;

export const CoinValueContainer = styled.div`
  margin-top: 3rem;
`;

export const CoinValueContent = styled.div`
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

export const CoinValueDetail = styled.div<{ positive?: boolean }>`
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
      if (!props.positive) {
        return props.theme.card.text;
      }

      return props.theme.card[props.positive ? 'green' : 'red'];
    }};
  }
`;

export const CoinSelectorContainer = styled.div`
  bottom: -1.5rem;
  left: 50%;

  position: absolute;

  display: flex;

  flex-direction: row;

  gap: 0.75rem;
`;

export const CoinSelector = styled.div<{ isSelected: boolean }>`
  width: 0.5rem;
  height: 0.5rem;

  background-color: ${props =>
    props.isSelected ? props.theme.white : props.theme.black};

  border-radius: 50%;

  cursor: pointer;
`;

export const BlockCardContainer = styled.div`
  min-width: 17rem;

  padding: 1.5rem;

  background-color: ${props => props.theme.white};

  border-radius: 1rem;
`;

export const BlockCardRow = styled.div`
  width: 100%;

  display: flex;

  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  &:not(:last-child) {
    margin-bottom: 0.5rem;
  }

  &:nth-child(2) {
    margin-bottom: 1rem;
  }

  &:last-child {
    margin-top: 0.25rem;
  }

  strong {
    font-weight: 600;
  }

  p {
    font-weight: 600;
    font-size: 0.95rem;
    color: ${props => props.theme.blockCard.text};
  }

  small {
    font-weight: 400;
    font-size: 0.85rem;
    color: ${props => props.theme.blockCard.text};
  }

  a {
    margin-right: -0.625rem;

    max-width: 5rem;

    overflow: hidden;

    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.85rem;

    color: ${props => props.theme.black};
  }

  span {
    font-size: 0.95rem;
  }
`;

export const TransactionContainer = styled.div`
  display: flex;

  flex-direction: row;

  gap: 1rem;
`;

export const TransactionContent = styled.div`
  max-height: 27.5rem;
  min-width: fit-content;

  overflow-y: auto;

  padding: 1.5rem;

  background-color: ${props => props.theme.white};

  border-radius: 1rem;

  &::-webkit-scrollbar {
    position: absolute;
    width: 0.25rem;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 15px;
  }

  &:hover {
    &::-webkit-scrollbar-thumb {
      background: ${props => transparentize(0.75, props.theme.black)};
    }
  }
`;

export const TransactionRow = styled.div`
  display: flex;

  flex-direction: row;
  align-items: center;

  &:not(:last-child) {
    margin-bottom: 2rem;
  }
`;

export const TransactionData = styled.div`
  margin-right: 2.5rem;

  display: flex;

  flex-direction: column;

  gap: 0.25rem;

  a {
    max-width: 10rem;

    overflow: hidden;

    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 600;

    color: ${props => props.theme.black};
  }

  span {
    font-weight: 400;
    font-size: 0.85rem;

    color: ${props => props.theme.transactionCard.text};
  }

  strong {
    font-weight: 600;

    color: ${props => props.theme.transactionCard.text};
  }

  p {
    max-width: 10rem;

    overflow: hidden;

    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 500;
    font-size: 0.9rem !important;

    color: ${props => props.theme.black};
  }
`;

export const TransactionAmount = styled.div`
  width: 14.5rem;
  margin-left: auto;

  text-align: right;

  span {
    max-width: 100%;

    overflow: hidden;

    text-overflow: ellipsis;
    white-space: nowrap;

    color: ${props => props.theme.transactionCard.amount};
  }
`;

export const TransactionChart = styled(TransactionContent)`
  width: 100%;

  position: relative;
  display: flex;

  flex-direction: column;

  span {
    font-size: 1.25rem;
    font-weight: 600;
    color: ${props => props.theme.black};
  }

  p {
    font-size: 1rem;
    color: ${props => props.theme.transactionCard.text};
  }
`;

export const TransactionChartContent = styled.div`
  position: absolute;

  bottom: 0;
  left: -1rem;

  width: 95%;
  height: 80%;
`;
