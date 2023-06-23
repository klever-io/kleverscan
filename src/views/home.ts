import {
  ArrowDownSquare,
  ArrowUpSquare,
  LineArrowUpSquare,
} from '@/assets/icons';
import { default as DefaultInput } from '@/components/InputGlobal';
import { DefaultCardStyles } from '@/styles/common';
import { lighten, transparentize } from 'polished';
import { BiChevronDownSquare } from 'react-icons/bi';
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
  position: relative;
`;

export const ProgressContainerSpanSkeleton = styled(ProgressContainerSpan)`
  gap: 3px;
`;

export const Section = styled.section`
  padding: 3rem 0.5rem 0 0.5rem;

  h1 {
    color: ${props =>
      props.theme.dark ? props.theme.black : props.theme.darkBlue};
    margin-bottom: 1rem;
    width: fit-content;
  }

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 0 min(3%, 0.5rem) 5rem;
  }
`;

export const SectionCards = styled(Section)`
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    width: 50%;
  }
`;

export const DataContainer = styled(Section)`
  /* padding: 0 0 5rem; */
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

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    /* padding: 2.5rem 0 0; */
  }
`;

export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: row;
  }
`;

export const Input = styled(DefaultInput)`
  margin: 0 5rem;
  padding: 1.25rem 1rem;

  background-color: ${props => props.theme.white};

  &:focus-within {
    box-shadow: 0 0 10px -4px ${props => props.theme.violet};
  }

  input {
    &::selection {
      background-color: ${props => lighten(0.4, props.theme.input.border.home)};
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    margin: 0;
  }
`;

export const DataCardsContainer = styled.div`
  margin-top: 4rem;

  display: flex;

  flex-direction: row;
  align-items: flex-start;

  gap: 4rem;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
  }
  &:nth-child(2) {
    margin-top: 4rem;
  }
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

export const DataCardsWrapper = styled.div`
  width: 100%;
  height: 17.401rem;

  display: flex;

  flex-direction: column;
  justify-content: center;

  gap: 0.5rem;
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    height: fit-content;
  }
  @media (min-width: 1247px) {
    flex-direction: row;
    height: fit-content;
  }
`;

export const DataCardsContent = styled.div`
  width: 100%;
  height: 50%;

  display: flex;

  flex-direction: row;
  justify-content: center;

  gap: 0.5rem;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    height: auto;
    flex-direction: column;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

export const DataCardDefaultStyles = css`
  ${props => !props.theme.dark && DefaultCardStyles}
  ${props =>
    props.theme.dark &&
    css`
      border: 1px solid ${props.theme.card.background};
    `};
  @media screen and (min-width: ${props => props.theme.breakpoints.tablet}) {
    ${DefaultCardStyles}
  }
`;

export const DataCard = styled.div`
  padding: 1.2rem;
  width: 100%;
  height: 8rem;

  display: flex;
  gap: 0.25rem;
  justify-content: center;
  flex-direction: column;
  border: 1px solid ${props => props.theme.footer.border};
  box-shadow: 5px 6px 5px 0px rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  background-color: none;

  ${DataCardDefaultStyles}
  ${props => !props.theme.dark && DefaultCardStyles}
    @media
    screen
    and
    (min-width: ${props => props.theme.breakpoints.tablet}) {
    ${DefaultCardStyles}
  }
  span {
    width: fit-content;
    height: 2rem;
    color: ${props =>
      props.theme.dark ? props.theme.lightGray : props.theme.darkText};
    font-weight: 700;
    font-size: 14px;
    line-height: 16px;
  }
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

export const Percentage = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: 0.55rem;
  span {
    color: white;
    font-weight: 600;
    font-size: 0.95rem;
    margin-right: 0;
  }
`;

export const DataCardValue = styled.div<{ isEpoch?: boolean }>`
  width: 100%;
  display: flex;
  position: relative;
  flex-direction: ${({ isEpoch }) => (isEpoch ? 'column' : 'row')};

  p {
    width: fit-content;
    height: fit-content;
    color: ${props =>
      props.theme.dark ? props.theme.black : props.theme.darkBlue};
    font-weight: 500;
    font-size: 1.75rem;
  }
  div {
    display: flex;
    span {
      margin-right: 0.45rem;
    }
  }

  small {
    font-style: normal;
    font-weight: 500;
    font-size: 0.7rem;
    color: ${props =>
      props.theme.dark ? props.theme.black : props.theme.darkBlue};
  }
`;

export const DataCardLatest = styled.div<IVariation>`
  min-width: fit-content;
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: flex-end;

  gap: 0.2rem;
  padding-left: 0.5rem;
  span {
    font-size: 0.85rem;
    color: ${props => props.theme.card.secondaryText};
  }

  p {
    color: ${props => (props.positive ? props.theme.green : props.theme.red)};
    font-style: normal;
    font-weight: 500;
    line-height: 16px;
    font-size: 0.9rem;
  }

  div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding-bottom: 0.4rem;
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
  padding: 0.4rem 0 0.4rem 0;
  color: ${props =>
    props.theme.dark ? props.theme.black : props.theme.darkBlue};
  gap: 0.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;

  :nth-child(even) {
    justify-content: end;
  }

  strong {
    font-weight: 600;
  }

  p {
    font-weight: 600;
    font-size: 0.95rem;
    color: ${props =>
      props.theme.dark ? props.theme.black : props.theme.darkBlue};
  }

  small {
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    color: ${props => props.theme.navbar.text};
  }

  span {
    font-size: 0.95rem;
  }
`;

export const BlockCardHash = styled.span`
  margin-right: -0.625rem;

  max-width: 5rem;

  overflow: hidden;

  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.85rem;

  color: ${props =>
    props.theme.dark ? props.theme.black : props.theme.darkBlue};
  cursor: default;
`;

export const TransactionContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  border-radius: 16px;
  flex-direction: column;
  ${DataCardDefaultStyles}
`;

export const ChartsContainer = styled(TransactionContainer)`
  flex-wrap: wrap;
  gap: 1rem;
  border: none;
  ${DataCardDefaultStyles}
`;

export const TransactionContent = styled.div`
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

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    overflow: auto;

    width: 100% !important;
    min-width: unset;
  }
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    min-width: 0;
  }
`;

export const TransactionRow = styled.div<{ isLoading?: boolean }>`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  overflow: hidden;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid
    ${props =>
      props.theme.dark ? props.theme.footer.border : props.theme.lightGray};
  margin-bottom: 0.5rem;

  .clean-style {
    text-decoration: inherit;
    color: inherit;
    font-weight: inherit;
    &:hover {
      text-decoration: underline;
    }
    ${props =>
      props.isLoading &&
      css`
        display: flex;
        justify-content: flex-end !important;
      `}
  }

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    height: 13rem;
  }
`;

export const TransactionEmpty = styled(TransactionRow)`
  width: 27.5rem;
  height: 20rem;

  justify-content: center;
  align-items: center;

  span {
    font-weight: 400;
    color: ${props => transparentize(0.5, props.theme.darkText)};
  }
`;

export const TransactionData = styled.div<{ loading?: boolean }>`
  width: 100%;
  padding: 0.4rem 0 0.4rem 0;
  color: ${props =>
    props.theme.dark ? props.theme.black : props.theme.darkBlue};
  gap: 0.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;

  :nth-child(even) {
    justify-content: flex-end;
  }
  a {
    max-width: 10rem;

    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 600;

    color: ${props =>
      props.theme.dark ? props.theme.black : props.theme.darkBlue};

    svg {
      margin-left: 0.75rem;

      path {
        fill: ${props => props.theme.white};
      }
    }
    &:hover {
      color: ${props =>
        props.theme.dark ? props.theme.black : props.theme.darkBlue};
      filter: brightness(1.2);
      text-decoration: underline;
    }
  }

  span {
    font-weight: 400;
    font-size: 0.9rem;
  }

  strong {
    font-weight: 600;

    color: ${props => props.theme.darkText};
  }

  p {
    max-width: 10rem;
    ${props =>
      props.loading &&
      css`
        max-width: 15rem;
      `}
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 500;
    font-size: 0.9rem !important;
    color: ${props =>
      props.theme.dark ? props.theme.black : props.theme.darkBlue};
  }

  div {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.25rem;
    width: 100%;
  }
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    display: flex;
    :nth-child(even) {
      justify-content: end;
    }
  }
`;

export const TransactionTimer = styled.div`
  display: flex;
  width: 100%;
  margin-left: auto;
  justify-content: end;

  span {
    max-width: 100%;

    overflow: hidden;

    text-overflow: ellipsis;
    white-space: nowrap;

    color: ${props => props.theme.secondaryText};
  }
`;

export const TransactionChart = styled(TransactionContent)`
  ${DataCardDefaultStyles}
  width: 40%;
  min-height: 22rem;
  position: relative;
  display: flex;
  justify-content: space-between;
  flex-direction: column;

  border-radius: 16px;
  padding: 1.5rem;
  span {
    font-size: 1.25rem;
    font-weight: 600;
    color: ${props =>
      props.theme.dark ? props.theme.black : props.theme.darkBlue};
  }

  p {
    font-size: 1rem;
    color: ${props => props.theme.darkText};
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    min-height: 24.5rem;
  }
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
    height: 30rem;
    margin: 0;
    background-color: ${props =>
      props.theme.dark && props.theme.input.searchBar};
  } ;
`;

export const FixedTxChart = styled(TransactionChart)`
  height: 22rem;
`;

export const TransactionChartContent = styled.div`
  position: absolute;
  overflow: hidden;
  bottom: 0;
  left: 1.5rem;
  right: 2rem;

  width: 92%;
  height: 80%;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    bottom: 0.3rem;
    left: -0.1rem;
  }
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
  }
`;

export const DailyTxChartContent = styled(TransactionChartContent)`
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    bottom: 0rem;
  }
`;

export const ErrorContainer = styled.div`
  width: 100%;
  height: 22rem;
  gap: 0.3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const RetryContainer = styled.div`
  gap: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  :hover {
    cursor: pointer;
  }
`;

export const Main = styled.main`
  padding: 3rem min(5vw, 2rem) 5rem;
  display: block;
  margin: 0 auto;
  max-width: ${props => props.theme.maxWidth};
  background-color: ${props => props.theme.background};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 3rem 1rem 5rem;
  }
`;
export const LayoutContainer = styled.div`
  margin: auto;
  background-color: ${props => props.theme.background};

  position: relative;
`;

export const ContainerTimeFilter = styled.div`
  display: flex;
  width: 100%;
  height: fit-content;
  justify-content: space-between;

  span {
    font-weight: 700;
    font-size: 14px;
    line-height: 16px;
    color: ${props =>
      props.theme.dark ? props.theme.card.text : props.theme.darkText};
  }
`;

export const ListItemTimeFilter = styled.ul`
  list-style: none;
  display: flex;
  justify-content: center;
`;
export const ItemTimeFilter = styled.li<{ selected: boolean }>`
  color: ${props =>
    props.theme.dark ? props.theme.card.text : props.theme.darkText};
  height: fit-content;
  padding: 0rem 0.7rem;
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
  opacity: 0.3;
  &:hover {
    cursor: pointer;
    opacity: 0.75;
  }

  &:first-child {
    border-radius: 10px 0 0 10px;
  }

  &:last-child {
    border-radius: 0 10px 10px 0;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 100%;
  }
  ${props =>
    props.selected &&
    css`
      opacity: 1;
    `};
`;

export const HomeLoaderContainer = styled.div`
  width: 100%;
  height: 100%;

  div {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    div {
      margin-bottom: 4rem;
    }
    svg {
      width: 13%;
      height: 13%;
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    div {
      margin-bottom: 6rem;
    }
  }
`;

export const ArrowData = styled(ArrowUpSquare).attrs(props => ({
  size: 17,
}))<{ positive: boolean }>`
  color: ${({ positive, theme }) => (positive ? theme.green : theme.red)};
  rotate: ${({ positive }) => (positive ? '0' : '180deg')};
`;

export const ExpandData = styled.div`
  display: flex;
  width: 100%;
  height: 40px;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.black};

  p {
    font-style: normal;
    font-weight: 500;
    font-size: 1rem;
    line-height: 16px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`;

export const ArrowExpandData = styled(BiChevronDownSquare).attrs(() => ({
  size: 20,
}))``;

export const ButtonExpand = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  width: 152px;
  height: 3rem;
  background: linear-gradient(
    360deg,
    rgba(123, 125, 178, 0.3) 0%,
    rgba(123, 125, 178, 0) 83.75%
  );
  border-radius: 0 0 1rem 1rem;
`;

export const ContainerHide = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  padding-bottom: 1.5rem;
  > h1 {
    margin: 0;
    font-weight: 500;
  }
  div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    height: 100%;
    cursor: pointer;
    color: ${({ theme }) => theme.black};

    svg {
      path {
        fill: ${({ theme }) => theme.black};
      }
    }
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    div {
      display: none;
    }
  }
`;

export const TransactionAmount = styled.div`
  display: flex;
  min-width: 9rem;
  width: 100%;
  max-width: 100%;
  justify-content: end;
  flex-direction: row;
  align-items: flex-start;
  color: white;

  span,
  p {
    border-radius: 8px;
    padding: 4px 12px;
    background: ${({ theme }) => (theme.dark ? theme.blue : theme.violet)};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const TransactionStatus = styled.span<{ isSuccess: boolean }>`
  color: ${({ theme, isSuccess }) => (isSuccess ? theme.green : theme.red)};
  line-height: 16px;
`;

export const ViewMoreContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  height: 3rem;
  margin-top: 1rem;
  color: ${({ theme }) => theme.black};
  p {
    margin-top: 0.2rem;
    height: fit-content;
  }
`;

export const ArrowDownDataCards = styled(ArrowDownSquare)<{
  expanded: boolean;
}>`
  rotate: ${({ expanded }) => (expanded ? 180 : 0)}deg;
  path {
    fill: ${({ theme }) => theme.black};
  }
`;

export const ArrowUpSquareHideMenu = styled(LineArrowUpSquare)<{
  hide: boolean;
}>`
  rotate: ${({ hide }) => (hide ? 180 : 0)}deg;
`;
