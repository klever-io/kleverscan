import { ArrowUpRightSquare, ArrowUpSquare, Currency } from '@/assets/icons';
import { TableGradientBorder } from '@/components/TableV2/styles';
import { DefaultCardStyles } from '@/styles/common';
import { DataCardDefaultStyles } from '@/views/home';
import Image from 'next/image';
import styled, { css, keyframes } from 'styled-components';
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
  position: relative;
  width: 100%;

  gap: 16px;

  h1 {
    font-size: 1.6rem;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row;
  }
`;

export const Carousel = styled.div`
  display: flex;
  scroll-behavior: smooth !important;
  border-radius: ${props => (props.theme.dark ? 0 : '1rem')};
  scroll-snap-type: x mandatory;
  scroll-snap-stop: always;

  width: 100%;
  overflow: hidden;
  position: relative;

  flex-direction: row;
  border: none !important;
  background-color: ${props =>
    props.theme.dark ? 'transparent' : props.theme.true.white} !important;
  &&::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none;
  -ms-overflow-style: none;
`;

export const CoinsContainer = styled.div`
  ${TableGradientBorder}
  border-radius: 16px;

  width: 50%;
  position: relative;

  display: flex;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
  }
`;

export const CardContainer = styled.div`
  scroll-snap-align: start;
  position: relative;
  align-items: center;
  min-width: 100%;
  padding: 56px 4px 0;

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 40px 16px 16px;
  }
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  min-width: 100%;
  width: 100%;
  height: 100%;

  animation: 1.5s ease 0s 1 normal none running ${FadeIn};
  a {
    z-index: 0;
  }
`;

export const CardContentError = styled(CardContent)`
  animation: '';
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

export const CardContainerSkeleton = styled(CardContainer)`
  padding: 1.5rem 1.5rem 1.5rem 1.5rem;
  ${props =>
    props.theme.dark
      ? css`
          background-color: ${props.theme.true.newBlack} !important;
        `
      : css`
          ${DefaultCardStyles}
        `};
`;

export const HeaderContainer = styled.div`
  display: flex;
  padding: 16px 0px;
  flex-direction: row;

  z-index: 0;
  ${props =>
    props.theme.dark
      ? css`
          border-bottom: 1px solid #222345;
        `
      : css`
          border-bottom: 1px solid ${props.theme.lightGray};
        `};
`;

export const HeaderContent = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  padding-left: 1rem;

  width: 100%;

  svg {
    path {
      fill: ${props =>
        props.theme.dark ? props.theme.true.white : props.theme.true.black};
    }
  }
`;

export const HeaderContentSkeleton = styled(HeaderContent)`
  gap: 2rem;
`;

export const Name = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: ${props =>
    props.theme.dark ? props.theme.true.white : props.theme.true.black};

  font-weight: 600;

  span {
    font-size: 1.1rem;
    &:first-of-type {
      cursor: pointer;
    }
  }

  p {
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    color: ${props =>
      props.theme.dark ? props.theme.card.text : props.theme.darkText};
  }
`;

export const Description = styled(Name)<IVariation>`
  font-size: 0.95rem;
  font-weight: 400;
  color: ${props => props.theme.card[props.positive ? 'green' : 'red']};
  font-weight: 500;
  div {
    display: flex;
    align-items: center;
    padding-top: 1rem;
    gap: 0.3rem;
  }
  span {
    color: ${props =>
      props.theme.dark ? props.theme.card.text : props.theme.darkText};

    font-size: 0.85rem;
  }
`;

export const ChartContainer = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
  height: 92.79px;
  width: 100%;
`;

export const ChartContainerSkeleton = styled(ChartContainer)`
  height: initial;
  min-height: 92.79px;
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

export const IconContainer = styled(Image).attrs(_ => ({
  alt: 'Coin',
}))`
  cursor: pointer;
  padding-right: 1rem;

  border-radius: 50%;
`;

export const CoinsSelector = styled.div`
  display: flex;
  gap: 0.5rem;

  position: absolute;
  z-index: 1;
  left: 16px;
  top: 16px;

  padding: 4px;

  border-radius: 24px;

  background-color: ${props => props.theme.gray900};

  transition: 0.5s ease;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: calc(100% - 32px);
  }
`;

// prettier-ignore
export const CoinsSlider = styled.div<{ selectedIndex: number }>`
  width: 82px;
  height: 24px;
  position: absolute;

  transition: 0.4s ease-in-out;

  transform: translateX(
    ${props => (props.selectedIndex >= 1 ? props.selectedIndex * 82 + 8 : 0)}px
  );

  background-color: ${props => props.theme.violet};
  border-radius: 24px;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 50%;

    transform: translateX(${props => props.selectedIndex >= 1 ? `calc(${props.selectedIndex * 100}% - 8px)` : '0%'});
  }
`;

export const CoinSelector = styled.button<{ isSelected: boolean }>`
  position: relative;
  width: 82px;
  height: 100%;
  z-index: 2;

  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props =>
    props.isSelected ? props.theme.true.white : props.theme.gray700};
  transition: 0.5s ease-out;
  font-style: normal;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 24px;
  gap: 8px;

  -webkit-user-select: none; /* Safari */
  user-select: none; /* Standard syntax */
  cursor: pointer;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 50%;
  }
`;

export const ContainerLoading = styled.div`
  display: flex;
  height: 60%;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export const ContentError = styled.div`
  display: flex;
  padding: 1rem;
  gap: 0.5rem;
  span {
    :hover {
      opacity: 0.5;
    }
    cursor: pointer;
    color: ${props => props.theme.card.white};
  }
  svg {
    cursor: pointer;
    margin-top: 0.2rem;
    color: ${props => props.theme.darkText};
  }
`;

export const NameError = styled(Name)`
  span {
    &:first-of-type {
      cursor: text !important;
    }
  }
`;

export const ArrowTopRight = styled(ArrowUpRightSquare).attrs(props => ({
  color: props.theme.true.white,
  size: 30,
}))`
  position: absolute;
  right: 0;
`;

export const HeaderGraph = styled.div`
  display: flex;
  gap: 5rem;
  color: ${props => props.theme.true.white};
  padding: 0.5rem 1.5rem 0 1.5rem;
  justify-content: space-between;
  span {
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 3rem;
    background: none;
    color: ${props =>
      props.theme.dark ? props.theme.text.gray : props.theme.darkText};
  }

  p {
    font-style: normal;
    font-weight: 500;
    font-size: 1.2rem;
    line-height: 16px;
    color: ${props =>
      props.theme.dark ? props.theme.true.white : props.theme.true.black};
  }
`;

export const ArrowVariation = styled(ArrowUpSquare).attrs(() => ({
  size: 17,
}))<{ $isPositive: boolean }>`
  rotate: ${props => !props.$isPositive && '180deg'};

  path {
    fill: ${props => props.theme.card[props.$isPositive ? 'green' : 'red']};
  }
`;

export const SetTimeContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: flex-end;
  padding: 1rem;
  padding-right: 1.5rem;
`;

export const SetTimeContainerLoaderWrapper = styled.div`
  position: absolute;
  right: 10rem;
  @media (min-width: ${props => props.theme.breakpoints.mobile}) {
    right: 9.3rem;
  }
`;

export const SpanTime = styled.span<{ selected: boolean }>`
  font-weight: 600;
  font-size: 14px;
  line-height: 16px;
  color: ${props =>
    props.theme.dark ? props.theme.text.gray : props.theme.darkText};
  opacity: ${({ selected }) => (selected ? '1' : ' 0.3')};
  cursor: pointer;
`;

export const ExchangeIconContainer = styled.div`
  display: flex;
  align-items: flex-start;
  height: 100%;

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    align-items: center;
  }
`;

export const ExchangeTextContainer = styled.div``;

export const Button = styled.a<{ borderColor: string }>`
  ${DataCardDefaultStyles}
  display: flex;
  align-items: center;
  text-align: start;
  gap: 16px;

  width: 100%;
  padding: 16px 20px;
  border-radius: 8px;
  color: ${props => props.theme.true.white};

  border: 1px solid ${props => props.borderColor};

  transition: 0.25s ease-in-out;

  text-decoration: none !important;

  :hover,
  :focus {
    box-shadow: inset 350px 0 0 0 ${props => props.borderColor};

    color: ${props => props.theme.true.newBlack};
    svg {
      path {
        fill: ${props => props.theme.true.newBlack};
        fill-opacity: 1;
      }
    }
  }
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    align-items: flex-start;
    flex-direction: column;
    padding: 16px 20px;
  }
  font-size: 1.25rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    margin-top: 0rem;
    align-items: flex-start;
    text-align: start;
    color: ${props => props.theme.black};
  }
`;

export const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    width: 50%;
  }
`;

export const EnchangeLinks = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
  color: ${props => props.theme.true.white};
  font-size: 1rem;
  font-weight: 500;
`;

export const CurrencyIcon = styled(Currency)`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
`;
