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

  width: calc((100% - 225px) / 2);
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
  padding: 40px 16px 16px;

  /* height: 24rem; */
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 100%;
  width: 100%;

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

  background-color: ${props => props.theme.blue};

  transition: 0.5s ease;
`;

export const CoinSelector = styled.button<{ isSelected: boolean }>`
  width: 82px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.true.white};
  transition: 0.5s ease-out;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 24px;
  gap: 0.5rem;
  background-color: ${props =>
    props.isSelected ? props.theme.violet : 'transaparent'};

  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);

  -webkit-user-select: none; /* Safari */
  user-select: none; /* Standard syntax */
  cursor: pointer;
  border-radius: 24px;
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

export const ArrowVariation = styled(ArrowUpSquare).attrs(props => ({
  size: 17,
}))<{ $isPositive: boolean }>`
  path {
    fill: ${props => props =>
      props.theme.card[props.isPositive ? 'green' : 'red']};
  }
  rotate: ${props => (props.isPositive ? '' : '180deg')};
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

export const Button = styled.a<{ borderColor: string }>`
  ${DataCardDefaultStyles}
  display: flex;
  width: 193px;
  aspect-ratio: 1;

  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: start;
  padding: 16px 52px 16px 20px;
  margin-top: 1rem;
  border-radius: 12px;
  color: ${props => props.theme.true.white};

  border: 1px solid ${props => props.borderColor};

  transition: 0.25s ease-in-out;

  text-decoration: none !important;

  :hover,
  :focus {
    box-shadow: inset 193px 193px 0 0 ${props => props.borderColor};

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

export const EnchangeLinks = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
  color: ${props => props.theme.true.white};
  font-size: 1rem;
  font-weight: 500;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: 8px;
  }
`;

export const CurrencyIcon = styled(Currency)`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
`;
