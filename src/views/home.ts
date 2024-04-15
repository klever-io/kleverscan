import {
  ArrowDown,
  ArrowDownSquare,
  ArrowDropdown,
  ArrowUpSquare,
  LineArrowUpSquare,
} from '@/assets/icons';
import { default as DefaultInput } from '@/components/InputGlobal';
import { TableGradientBorder } from '@/components/TableV2/styles';
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

  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    gap: 80px;
  }
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
  h1 {
    color: ${props =>
      props.theme.dark ? props.theme.black : props.theme.darkBlue};
    margin-bottom: 1rem;
    width: fit-content;
  }
`;

export const SectionCards = styled(Section)`
  display: flex;
  flex-direction: column;
  gap: 24px;
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    width: 50%;
  }
`;

export const DataContainer = styled(Section)`
  display: flex;
  flex-direction: column;

  gap: 16px;
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    gap: 32px;
  }
`;

export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: row;
    gap: 16px;
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
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  height: auto;

  gap: 16px;

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: row;
    height: 256px;
  }
`;

export const DataCardsWrapper = styled.div`
  width: 100%;
`;

export const DataCardsContent = styled.div`
  width: 100%;
  height: 50%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));

  justify-content: center;

  gap: 16px;

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
      border: 1px solid ${props.theme.darkBlue300};
    `};
  @media screen and (min-width: ${props => props.theme.breakpoints.tablet}) {
    ${DefaultCardStyles}
  }
`;

export const DataCard = styled.div`
  ${TableGradientBorder}
  padding: 1.2rem;
  padding-left: 2rem;
  width: 100%;
  height: 120px;
  align-items: center;
  display: flex;
  border-radius: 1rem;
  ${props => !props.theme.dark && DefaultCardStyles}
  @media
  screen
  and
  (min-width: ${props => props.theme.breakpoints.tablet}) {
    ${DefaultCardStyles}
  }
  background-color: ${({ theme }) =>
    theme.dark && theme.true.newBlack} !important;
  span {
    width: fit-content;

    color: ${props =>
      props.theme.dark ? props.theme.lightGray : props.theme.navbar.text};
    font-weight: 700;
    font-size: 14px;
    line-height: 16px;
  }
  small {
    color: ${props =>
      props.theme.dark
        ? props.theme.lightGray
        : props.theme.navbar.text} !important;
  }
  &.epoch {
    flex-direction: column;
    align-items: flex-start;
    align-content: center;
  }

  @media (min-width: ${props => props.theme.breakpoints.mobile}) {
    padding-left: 1.2rem;
  }
`;

export const DataCardContent = styled.div`
  margin-left: 1rem;
  @media (min-width: ${props => props.theme.breakpoints.mobile}) {
    margin-left: initial;
  }
`;
export const MobileCardsContainer = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
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
  min-width: 15rem;

  justify-content: space-between;
  align-items: center;
  gap: 0.55rem;
  span {
    color: white;
    font-weight: 600;
    font-size: 0.95rem;
    margin-right: 0;
  }
  .epochSeconds {
    font-size: 1.5rem;
    font-weight: 500;
    color: ${props =>
      props.theme.dark ? props.theme.true.white : props.theme.true.black};
  }
  div {
    min-height: 3rem;
  }
`;

export const DataCardValue = styled.div<{ isEpoch?: boolean }>`
  width: 100%;
  display: flex;
  position: relative;
  align-items: center;
  flex-wrap: wrap;
  margin-left: 0;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    ${props =>
      props.isEpoch &&
      css`
        margin-left: 0.77rem;
      `}
  }

  p {
    width: fit-content;
    height: fit-content;
    color: ${props =>
      props.theme.dark ? props.theme.black : props.theme.darkBlue};
    font-weight: 500;
    font-size: 1.75rem;
    padding-right: 0.5rem;
  }
  div {
    display: flex;
    span {
      margin-right: 0.45rem;
      align-self: center;
    }
  }
  small {
    font-style: normal;
    font-weight: 500;
    font-size: 0.7rem;
    color: ${props =>
      props.theme.dark ? props.theme.black : props.theme.darkBlue};
  }
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    div {
      span {
        align-self: flex-start;
      }
    }
  }
`;
export const MobileEpoch = styled.div`
  margin-left: -11.5rem;
  display: flex;
  flex-direction: column;
  span {
    margin-right: 0.45rem;
    height: fit-content;
  }
  small {
    font-size: 0.9rem;
  }
`;
export const DataCardLatest = styled.div<IVariation>`
  min-width: fit-content;
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: flex-end;
  gap: 0.3rem;
  span {
    font-size: 0.85rem;
    color: ${props => props.theme.card.secondaryText};
  }

  p {
    color: ${props =>
      props.positive ? props.theme.green : props.theme.red} !important;
    font-style: normal;
    font-weight: 500 !important;
    line-height: 16px;
    font-size: 0.9rem !important;
  }

  div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
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
  transition:
    1s all ease,
    0.1s filter ease;
  transition:
    color 0.1s ease,
    background-color 0.1s ease;

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
  color: ${props =>
    props.theme.dark ? props.theme.black : props.theme.darkBlue};
  display: flex;
  justify-content: space-between;
  align-items: center;

  strong {
    font-weight: 600;
    text-decoration: underline;
  }
  p {
    font-weight: 400;
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
  div {
    display: flex;
    gap: 0.2rem;
  }
`;

export const BlockCardHash = styled.span`
  width: 100%;
  max-width: 20rem;
  overflow: hidden;
  text-decoration: underline;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.85rem;

  color: ${props =>
    props.theme.dark ? props.theme.black : props.theme.darkBlue};
  cursor: default;
`;

export const TransactionContainer = styled.div``;

export const ChartsContainer = styled(TransactionContainer)`
  ${DataCardDefaultStyles}
  flex-wrap: wrap;
  gap: 1rem;
  border: none;
  background-color: transparent !important;
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

  border-radius: 1rem;

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
  @media (min-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 3rem 1fr;
    padding-left: 1rem;
  }
  grid-template-columns: 1fr;
  overflow: hidden;
  align-items: center;
  border-bottom: 1px solid
    ${props =>
      props.theme.dark ? props.theme.footer.border : props.theme.lightGray};
  .clean-style {
    /* text-decoration: inherit; */
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
`;
export const TransactionContainerContent = styled.div<{ isBlocks?: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: ${({ isBlocks }) => (isBlocks ? '0.88rem' : '1rem')};
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    height: 9rem;
  }
`;
export const TransactionEmpty = styled(TransactionRow)`
  height: 20rem;
  grid-template-columns: initial;
  justify-content: center;
  align-items: center;

  span {
    font-weight: 400;
    color: ${props => transparentize(0.5, props.theme.darkText)};
    text-align: center;
  }
`;

export const TransactionData = styled.div<{ $loading?: boolean }>`
  width: 100%;
  color: ${props =>
    props.theme.dark ? props.theme.black : props.theme.darkBlue};
  display: flex;
  justify-content: space-between;
  align-items: center;
  a {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-weight: 600;
    color: ${props =>
      props.theme.dark ? props.theme.black : props.theme.darkBlue};

    &:hover {
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
    ${props =>
      props.$loading &&
      css`
        max-width: 15rem;
      `}
    font-weight: 500;
    font-size: 0.9rem !important;
    color: ${props =>
      props.theme.dark ? props.theme.black : props.theme.darkBlue};
  }

  div {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
  .status-icon {
    justify-content: flex-start;
  }
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    display: flex;
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
  ${TableGradientBorder}
  width: 100%;
  min-height: 100%;
  height: 320px;
  position: relative;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  background-color: ${props => props.theme.dark && 'transparent'} !important;

  padding: 1rem;

  border-radius: 16px;

  span {
    font-weight: 700;
    font-size: 14px;
    line-height: 16px;
    color: ${props =>
      props.theme.dark ? props.theme.card.text : props.theme.darkText};
  }

  p {
    font-size: 1rem;
    color: ${props => props.theme.darkText};
  }

  @media screen and (min-width: ${props => props.theme.breakpoints.tablet}) {
    height: 100%;
  }
`;

export const FixedTxChart = styled(TransactionChart)`
  height: 22rem;

  ${({ theme }) =>
    !theme.dark &&
    css`
      box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.8);
    `}
`;

export const TransactionChartContent = styled.div`
  overflow: hidden;
  bottom: 0;
  position: absolute;
  width: calc(100% - 2rem);
  height: 68%;
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    position: absolute;
    bottom: 0.3rem;
    left: -0.1rem;
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
  color: ${props => props.theme.darkText};
`;

export const RetryContainer = styled.div`
  gap: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  :hover {
    cursor: pointer;
  }

  > button {
    color: ${props => props.theme.darkText};
  }
`;

export const Main = styled.main`
  position: relative;
  display: block;
  margin: 0 auto;
  padding: 0 16px;
  max-width: ${props => props.theme.maxWidth};
  background-color: ${props => props.theme.background};
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
  padding: 1.5rem;
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
}))<{ $positive: boolean }>`
  color: ${({ $positive, theme }) => ($positive ? theme.green : theme.red)};
  rotate: ${({ $positive }) => ($positive ? '0' : '180deg')};
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
  width: 100%;
  height: 3rem;
  background: linear-gradient(
    360deg,
    rgba(123, 125, 178, 0.3) 0%,
    rgba(123, 125, 178, 0) 83.75%
  );
  border-radius: 0 0 1rem 1rem;
  cursor: pointer;
`;

export const ContainerHide = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;

  > h1 {
    margin: 0;
    font-weight: 500;
    font-size: 1.5rem;
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

  a {
    display: flex;
    align-items: center;
    gap: 4px;
    height: 1rem;

    color: ${({ theme }) => theme.violet};
    font-size: 0.875rem;
    line-height: 1rem;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    div {
      display: none;
    }
  }
`;

export const TransactionAmount = styled.div`
  display: flex;
  padding: 4px 12px;
  align-items: flex-start;
  gap: 10px;
  border-radius: 8px;
  background: ${({ theme }) => (theme.dark ? theme.blue : theme.card.gray)};
  span,
  p {
    color: ${({ theme }) => theme.black};
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
  :hover {
    opacity: 0.55;
  }
`;

export const ArrowDownDataCards = styled(ArrowDropdown)<{
  $expanded: boolean;
}>`
  transition: rotate 0.3s;

  rotate: ${({ $expanded }) => ($expanded ? 180 : 0)}deg;
  path {
    fill: ${({ theme }) => theme.black};
  }
`;

export const ArrowUpSquareHideMenu = styled(LineArrowUpSquare)<{
  $hide: boolean;
}>`
  rotate: ${({ $hide }) => ($hide ? 180 : 0)}deg;

  path {
    fill: ${({ theme }) => theme.black};
  }
`;
export const CardIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 1rem;
  width: 3rem;
  color: ${props => props.theme.black};
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 2.5rem;
  }
`;

export const HeaderGradient = styled.div`
  width: 100%;
  height: 12rem;
  background: ${props =>
    !props.theme.dark &&
    `      radial-gradient(
        circle,
        rgba(170, 51, 181, 0.2),
        rgba(170, 51, 181, 0.1),
        rgba(235, 235, 235, 0.8)
      ),
      linear-gradient(
        to right,
        rgba(255, 255, 255, 0.8),
        rgba(36, 41, 152, 0.2)
      )
      `};
  position: absolute;
  z-index: 1;
`;

export const SpanWithLimit = styled.span`
  max-width: 9rem;
  @media (min-width: ${props => props.theme.breakpoints.mobile}) {
    max-width: initial;
  }
`;

export const Last24hTxs = styled.div`
  color: ${props => props.theme.black};
  font-size: 2rem;
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 2.7rem;
  }
  font-weight: 500;
  display: flex;
`;
export const Last24Text = styled.div`
  display: flex;
  align-items: flex-end;
  transform: translateY(-12%);
  @media (min-width: ${props => props.theme.breakpoints.mobile}) {
    transform: translateY(-15%);
  }
  margin-left: 0.1rem;
`;

export const VariationText = styled.div<{ $positive: boolean }>`
  color: ${props => (props.$positive ? props.theme.green : props.theme.red)};
  display: flex;
  gap: 0.3rem;
  align-items: center;
`;

export const Anchor = styled.a`
  cursor: pointer;
`;

export const NextImageWrapper = styled.div`
  border-radius: 50%;
  border: 2px solid ${props => props.theme.borderLogo};
  display: flex;
`;
