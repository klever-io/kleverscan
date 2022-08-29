import { default as DefaultInput } from '@/components/Inputt';
import { lighten, transparentize } from 'polished';
import styled, { css, keyframes } from 'styled-components';

interface IVariation {
  positive: boolean;
}

const PushFade = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-17.25rem);
  }

  100% {
    opacity: 1;
    transform: translateX(0rem);
  }
`;

const PullFade = keyframes`
  0% {
    transform: translateX(-17.25rem);
  }

  100% {
    transform: translateX(0rem);
  }
`;

export const Container = styled.div`
  background-color: ${props => props.theme.background};
`;

export const IconContainer = styled.div`
  padding-right: 1rem;
`;

export const ProgressContainerSpan = styled.span`
  @media (max-width: 590px) {
    display: none;
  }
`;

export const Section = styled.section`
  padding: 5rem 10rem 0 10rem;

  h1 {
    color: ${props => props.theme.black};
    margin-bottom: 1rem;
    cursor: pointer;
    width: fit-content;
    &:hover {
      text-decoration: underline;
    }
  }

  &:last-child {
    padding-bottom: 10rem;
  }

  @media (max-width: 768px) {
    padding: 5rem 5rem 0 5rem;
  }

  @media (max-width: 425px) {
    padding: 5rem 2.5rem 0 2.5rem;
  }
`;

export const DataContainer = styled(Section)`
  padding: 5rem 10rem;

  /* background-color: #40274f;
  background-image: radial-gradient(
      at 29% 76%,
      hsla(238, 30%, 34%, 1) 0,
      transparent 50%
    ),
    radial-gradient(at 80% 0%, hsla(261, 87%, 60%, 1) 0, transparent 50%),
    radial-gradient(at 80% 50%, hsla(240, 47%, 9%, 1) 0, transparent 50%),
    radial-gradient(at 0% 100%, hsla(240, 47%, 9%, 1) 0, transparent 50%),
    radial-gradient(at 80% 100%, hsla(255, 47%, 36%, 1) 0, transparent 50%),
    radial-gradient(at 0% 0%, hsla(295, 57%, 46%, 1) 0, transparent 50%); */

  @media (max-width: 768px) {
    padding: 5rem;
  }

  @media (max-width: 425px) {
    padding: 2.5rem;
  }
`;

export const Input = styled(DefaultInput)`
  margin: 0 5rem;
  padding: 1.25rem 1rem;

  background-color: ${props => props.theme.white};

  &:focus-within {
    box-shadow: 0 0 10px -4px ${props => props.theme.input.shadow};
  }

  input {
    &::selection {
      background-color: ${props => lighten(0.4, props.theme.input.border.home)};
    }
  }

  @media (max-width: 1600px) {
    margin: 0;
  }
`;

export const DataCardsContainer = styled.div`
  margin-top: 4rem;

  display: flex;

  flex-direction: row;
  align-items: flex-start;

  gap: 0.5rem;

  @media (max-width: 1600px) {
    flex-direction: column;
  }
  &:nth-child(2) {
    margin-top: 4rem;
  }
`;

export const DataCardsWrapper = styled.div`
  width: 100%;

  display: flex;

  flex-direction: column;
  justify-content: center;

  gap: 0.5rem;
`;

export const DataCardsContent = styled.div`
  width: 100%;

  display: flex;

  flex-direction: row;
  justify-content: center;

  gap: 0.5rem;

  @media (max-width: 1600px) {
    flex-direction: column;
  }
`;

export const DataCard = styled.div`
  padding: 1.2rem;

  width: 100%;

  display: flex;
  gap: 0.5rem;
  flex-direction: row;
  align-items: center;

  background-color: ${props => props.theme.card.background};
  box-shadow: 5px 6px 5px 0px rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
`;

export const EpochCard = styled.div`
  padding: 1.2rem;

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
    color: ${props => props.theme.card.white};
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

interface BlockCardContainerProps {
  blockIndex: number;
}

export const BlockCardContainer = styled.div<BlockCardContainerProps>`
  min-width: 17rem;

  padding: 1.5rem;

  cursor: pointer;
  user-select: none;

  background-color: ${props => props.theme.white};

  ${props =>
    !props.theme.dark &&
    css`
      box-shadow: 0 0 0.5rem - 0.125rem
        ${props => lighten(0.6, props.theme.card.background)};
    `}

  border-radius: 1rem;
  transition: 1s all ease, 0.1s filter ease;
  transition: color 0.1s ease, background-color 0.1s ease;

  animation: ${PullFade} 1s ease-in-out;

  animation-fill-mode: forwards;
  :first-child {
    animation: ${PushFade} 1s ease-in-out;
    animation-fill-mode: forwards;
  }
  &:hover {
    filter: brightness(0.97);
  }
`;

export const BlockCardRow = styled.div`
  width: 100%;

  color: ${props => props.theme.black};

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
    cursor: default;
  }

  span {
    font-size: 0.95rem;
  }
`;

export const TransactionContainer = styled.div`
  display: flex;

  flex-direction: row;

  gap: 2rem;

  @media (max-width: 1700px) {
    flex-direction: column;
  }
`;

export const TransactionContent = styled.div`
  max-height: 27.5rem;
  min-width: fit-content;

  overflow-y: auto;

  padding: 1.5rem;

  background-color: ${props => props.theme.white};

  ${props =>
    !props.theme.dark &&
    css`
      box-shadow: 0 0 0.5rem - 0.125rem
        ${props => lighten(0.6, props.theme.card.background)};
    `}
  border-radius: 1rem;

  &::-webkit-scrollbar {
    position: absolute;
    width: 0.25rem;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
    margin: 0.75rem;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 15px;
  }

  &:hover {
    &::-webkit-scrollbar-thumb {
      background: ${props => transparentize(0.75, props.theme.black)};
    }
  }

  @media (max-width: 768px) {
    overflow: auto;

    width: 100% !important;
    min-width: unset;
  }
  @media (max-width: 1024px) {
    min-width: 0;
  }
`;

export const TransactionRow = styled.div`
  display: flex;

  flex-direction: row;
  align-items: center;

  gap: 2.5rem;

  &:not(:last-child) {
    margin-bottom: 2rem;
  }
  .clean-style {
    text-decoration: inherit;
    color: inherit;
    font-weight: inherit;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const TransactionEmpty = styled(TransactionRow)`
  width: 27.5rem;
  height: 20rem;

  justify-content: center;
  align-items: center;

  span {
    font-weight: 400;
    color: ${props => transparentize(0.5, props.theme.transactionCard.text)};
  }
`;

export const TransactionData = styled.div`
  margin-right: 2.5rem;

  display: flex;

  flex-direction: column;

  gap: 0.25rem;

  a {
    max-width: 10rem;

    /* overflow: hidden; */

    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 600;

    color: ${props => props.theme.black};

    svg {
      margin-left: 0.75rem;

      path {
        fill: ${props => props.theme.white};
      }
    }
    &:hover {
      color: ${props => props.theme.black};
      filter: brightness(1.2);
      text-decoration: underline;
    }
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
  width: 12.5rem;
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
  min-height: 22rem;

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
  overflow: hidden;
  bottom: 0;
  left: 1.5rem;
  right: 2rem;

  width: 92%;
  height: 80%;
`;

export const Main = styled.main`
  display: block;
  margin: 0 auto;
  max-width: ${props => props.theme.maxWidth};
`;
export const LayoutContainer = styled.div`
  margin: auto;
  background-color: ${props => props.theme.background};
`;
