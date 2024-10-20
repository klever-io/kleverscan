import {
  CardContainer as DefaultCardContainer,
  DefaultCardStyles,
} from '@/styles/common';
import styled from 'styled-components';
import { IFilterItem } from '../../components/Filter';

export const LetterLogo = styled.div`
  width: 3.354rem;
  min-width: 3.354rem;
  height: 3.354rem;
  border-radius: 50%;
  border: 2px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  text-transform: uppercase;
`;

export const CenteredSubTitle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
  gap: 0.6rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    max-width: 100%;
  }

  span {
    font-weight: 400 !important;
    font-size: 0.85rem !important;
    width: 65%;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: fit-content;

    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      max-width: 20rem;
    }
  }

  svg {
    cursor: pointer;
  }
`;

export const Ranking = styled.p`
  padding: 0.5rem 1rem;
  background-color: ${props => props.theme.table.success};
  display: flex;
  align-items: center;
  justify-content: center;

  color: ${props => props.theme.white} !important;
  font-weight: 500;
  border-radius: 2rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    border-radius: 3rem;
    padding: 0.3rem 0.5rem;
  }
`;

export const CopyBackground = styled.div`
  background-color: ${props => props.theme.white};
  border-radius: 100%;
  min-width: 34px;
  padding: 4px 5px 2px 5px;
`;

export const ReceiveBackground = styled.div<{ isOverflow?: boolean }>`
  background-color: ${props => props.theme.white};
  position: ${props => (props.isOverflow ? '' : 'relative')};
  width: 34px;
  min-width: 34px;
  height: 34px;
  border-radius: 100%;
  padding: 4px 5px 2px 5px;
`;

export const HalfRow = styled.div`
  display: flex;
  overflow: hidden;
  align-items: center;
  width: 50%;
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 0.1rem;
    width: 100%;
  }
`;

interface IStatus {
  status: string;
}

export const Status = styled.div<IStatus>`
  display: flex;

  flex-direction: row;

  align-items: center;

  gap: 0.9rem;
  margin-right: 0.5rem;
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    margin: 0;
    span {
      width: 5rem;
      margin: 0;
    }
  }
  path {
    fill: ${props => props.theme.white};
  }
  circle {
    fill: ${props =>
      props.theme.table[props.status as keyof typeof props.theme.table]};
  }
  p {
    color: ${props =>
      props.theme.table[
        props.status as keyof typeof props.theme.table
      ]} !important;
    text-transform: capitalize;
  }
  ${props =>
    props.status === 'inactive' &&
    `
      color: ${props.theme.table.icon} !important;
      
    `}
`;

export const InteractionsValidatorContainer = styled.div`
  display: flex;
  gap: 0.3rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-wrap: wrap;
  }
`;

export const BoldElement = styled.div`
  font-weight: 500;
  color: ${props => props.theme.black};

  p {
    min-width: 5rem;
  }
`;

export interface ITableType {
  type:
    | 'transactions'
    | 'blocks'
    | 'accounts'
    | 'assets'
    | 'transactionDetail'
    | 'buckets'
    | 'accounts'
    | 'assetsPage'
    | 'holders'
    | 'validators'
    | 'nodes'
    | 'networkParams'
    | 'proposals'
    | 'votes'
    | 'delegations';

  filter?: IFilterItem;
  pathname?: string;
}

export const ProgressContainer = styled.div<{ textColor: string }>`
  display: flex;

  flex-direction: row;
  align-items: center;

  span {
    color: ${props => `${props.textColor}`};
  }

  gap: 0.5rem;
`;

export const EmptyProgressBar = styled.div`
  height: 2.3rem;
  width: 100%;
  background-color: ${props =>
    props.theme.dark ? props.theme.background : '#ebf1f7'};
  border-radius: 0.25rem;
`;

export const ProgressContent = styled.div<{ percent: number }>`
  height: 2.3rem;
  width: ${props => `${props.percent}%`};
  display: flex;
  justify-content: left;
  align-items: center;
  background-color: ${props =>
    props.theme.dark ? props.theme.violet : '#D4A2DD'} !important;
  border-radius: 0.25rem;
`;

export const ProgressIndicator = styled.div<{ percent: number }>`
  display: flex;
  align-content: flex-start;
  height: 100%;
  max-width: ${props => `${props.percent}%`};

  border-radius: 0.25rem;

  opacity: 0.6;
  p {
  }
`;

export const AllSmallCardsContainer = styled.section`
  display: flex;
  justify-content: space-around;
  margin: 1.5rem 0;
  flex-direction: row;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
  }
  @media (max-width: 1030px) {
    flex-direction: column;
  }
  @media (max-width: 1252px) {
    flex-direction: column;
  }
`;

export const CardContainer = styled(DefaultCardContainer)`
  position: absolute;
  z-index: 1;
`;

export const Card = styled.div<{ marginLeft?: boolean; marginRight?: boolean }>`
  ${DefaultCardStyles}
  width: 100%;
  padding: 1.2rem;
  overflow: hidden;
  margin-top: 0.5rem;
  margin-left: ${props => (props.marginLeft ? `${0}rem` : `${1}rem`)};
  margin-right: ${props => (props.marginRight ? `${0}rem` : `${1}rem`)};
  margin-bottom: 0;
  display: flex;
  height: 8.5rem;
  justify-content: space-between;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    height: 10.5rem;
    padding: 0.8rem;

    margin: 0;
    margin-top: 1rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    margin-right: 0;
    margin-left: 0;
  }
  @media (max-width: 1252px) {
    margin-left: 0 !important;
  }
`;

interface IRewardsCardProps {
  marginLeft?: boolean;
  marginRight?: boolean;
}

export const RewardsCard = styled.div<IRewardsCardProps>`
  ${DefaultCardStyles}
  width: 100%;
  padding: 1.2rem;
  margin-top: 0.5rem;
  margin-left: ${props => (props.marginLeft ? `${0}rem` : `${1}rem`)};
  margin-right: ${props => (props.marginRight ? `${0}rem` : `${1}rem`)};
  margin-bottom: 0;
  height: 8.5rem;
  gap: 1rem;

  div {
    overflow: hidden;
    /* setting this visible shows the true pie chart */
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 0.8rem;
    margin: 0;
    margin-top: 1rem;
    height: 10.5rem;
    width: 100% !important;
  }
`;

export const CardWrapper = styled.div`
  position: relative;
`;

export const CardHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 0.5rem;
  color: ${props => props.theme.black};

  p {
    text-align: right;
    opacity: 0.4;
    font-size: 0.85rem;
    font-weight: 500;
  }

  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    strong {
      font-weight: 600;
    }

    small {
      font-size: 0.85rem;
      font-weight: 600;
      color: ${props => props.theme.darkText};
    }
  }
`;

export const RewardsCardHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 0.5rem;

  color: ${props => props.theme.black};

  p {
    text-align: right;
    opacity: 0.4;
    font-size: 0.85rem;
    font-weight: 500;
  }

  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    strong {
      font-weight: 600;
    }

    small {
      font-size: 0.85rem;
      font-weight: 600;
      color: ${props => props.theme.darkText};
    }
  }
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding-left: 1.2rem;
  }
`;

export const CardSubHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
  top: 0.4rem;
  color: ${props => props.theme.darkText};
  font-size: 0.85rem;
  font-weight: 500;
  span:nth-child(1) {
    position: relative;
    margin-left: 13%;
  }
  span:nth-child(2) {
    position: relative;
    margin-right: 10%;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    justify-content: center;

    font-size: 0.85rem;
    top: 1.5rem;

    span:nth-child(1) {
      right: 13%;
      margin-left: 0;
    }
    span:nth-child(2) {
      left: 18%;
      margin-right: 0;
    }
  }
`;

interface IRatingProps {
  rate: string;
}

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    right: 1rem;
  }
`;

export const Title = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.7rem;

  div {
    svg {
      height: auto;
      width: auto;

      cursor: pointer;
    }
  }
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 100%;
    position: relative;
    right: 1rem;
  }
`;

export const TitleContent = styled.div`
  display: flex;
  width: 80%;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
`;

export const TitleInformation = styled.div`
  display: flex;
  width: 70%;
  flex-direction: column;
  gap: 0.25rem;
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 90%;
  }
`;

export const ValidatorTitle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;

  div {
    padding: 0.5rem 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.theme.table.success};
    color: ${props => props.theme.white};
    font-weight: 400;
    font-size: 0.85rem;
    border-radius: 1rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const CardContent = styled.div`
  margin: 1.25rem 0;
  background-color: ${props => props.theme.white};
  border-radius: 0.75rem;
`;

export const Row = styled.div`
  width: 100%;
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: row;
  align-items: center;

  color: ${props => props.theme.black};

  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.card.border};
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }

  span {
    text-transform: capitalize;
    &:first-child {
      width: 13rem;
    }

    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      max-width: 100%;
    }

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    strong {
      font-weight: 600;
      font-size: 0.95rem;
      color: ${props => props.theme.darkText};
    }

    small {
      font-weight: 400;
      font-size: 0.95rem;
      color: ${props => props.theme.darkText};
    }

    a {
      text-transform: none;
      color: ${props => props.theme.black};
      font-size: 0.95rem;
      font-weight: 600;
    }

    p {
      color: ${props => props.theme.darkText};
      font-weight: 400;
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  width: 80%;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    justify-content: space-between;
    width: 100%;
  }
`;

export const ElementsWrapper = styled.div`
  display: flex;
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
`;

export const CenteredRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;

  strong {
    font-size: 1rem;
    font-weight: 600;
  }

  p {
    font-weight: 600;
    font-size: 0.85rem;
  }

  span {
    width: 33rem !important;

    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      max-width: 80% !important;
    }
  }

  svg {
    cursor: pointer;
  }

  a {
    color: ${props => props.theme.black};
    font-size: 0.95rem;
    font-weight: 600;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 100%;
  }
`;

export const Rating = styled.p.attrs<IRatingProps>(props => ({
  rate: props.rate,
}))<IRatingProps>`
  padding: 0.5rem 1rem;
  display: flex;

  align-items: center;
  justify-content: center;

  background-color: ${props =>
    props.rate === 'green'
      ? props.theme.table.success
      : props.rate === 'yellow'
        ? props.theme.table.pending
        : props.theme.red};

  color: ${props => props.theme.true.black} !important;
  font-weight: 400;

  border-radius: 1rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 5rem;
    padding: 0.2rem;
  }
`;

interface IStakedIndicatorProps {
  percent: number;
}

export const StakedIndicator = styled.div<IStakedIndicatorProps>`
  display: flex;
  align-items: center;
  height: 100%;
  padding-left: 0.4rem;
  width: ${props => `${props.percent}%`};
  font-weight: 600;
  border-radius: 0.25rem;
  color: ${props => props.theme.black};
`;

export const PercentIndicator = styled.div<{ percent: number }>`
  min-width: 10rem;
  top: 0.25rem;
  color: ${props => props.theme.black};
  position: relative;
  z-index: 1;
  padding-right: 0.3rem;
  float: right;
  top: -26.5px;
  text-align: right;
  font-weight: 700;
  font-size: 1rem;
`;

export const TableContainer = styled.section`
  display: flex;

  flex-direction: column;

  gap: 1.5rem;
  h3 {
    margin-top: 2rem;
  }
`;

export const RewardsChartContent = styled.div`
  position: relative;
  bottom: 0.6rem;
  width: 100%;
  height: 100%;
  @media (max-width: 375px) {
    bottom: 1.3rem;
  }
  @media (max-width: 768px) and (min-width: 376px) {
    bottom: 1.2rem;
  }

  @media (max-width: 1299px) and (min-width: 1253px) {
    bottom: 1rem;
  }
  @media (max-width: 1301px) and (min-width: 1298px) {
    bottom: 0.8rem;
  }
`;

export const VotesFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.black};
`;

export const VotesHeader = styled.div`
  position: relative;
  display: flex;
  padding-left: 0.3rem;
  padding-right: 0.3rem;
  flex-direction: row;
  justify-content: space-between;

  color: ${props => props.theme.black};

  p {
    text-align: right;
    opacity: 0.4;
    font-size: 0.85rem;
    font-weight: 500;
    color: ${props => props.theme.black};
  }
`;

export const HalfCirclePie = styled.div<{ rotation: string }>`
  position: relative;
  overflow: visible;
  width: 8rem;
  height: 4rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 7rem;
    height: 3.5rem;
  }

  &::before,
  &::after {
    position: absolute;
    content: '';
    color: red;
    width: 30px;
    height: 30px;
  }

  &::before {
    content: '';
    width: inherit;
    height: inherit;
    border-bottom: none;
    border-top-left-radius: 17px;
    border-top-right-radius: 17px;
  }

  &::after {
    content: 'Percentage';
    left: 22%;
    top: 55%;
    width: 5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: fit-content;
    font-weight: 300;
    font-size: 0.8rem;
    color: ${props => props.theme.darkText};

    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      left: 17%;
      font-size: 0.8rem;
    }
  }

  div:nth-child(1) {
    z-index: 1;
    border-color: #37dd72;
    animation-name: rotate-one;
    border: 7.5px solid #37dd72;
    border-top: none;
    transform-origin: 50% 0;

    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      transform-origin: 50% 0;
      border: 7.5px solid #37dd72;
      border-top: none;
    }
    overflow: hidden;
  }

  div:nth-child(2) {
    z-index: 0;
    border-color: #ff4681;
    animation-name: rotate-two;
    animation-delay: 0.4s;
    transform-origin: 50% 0;

    border: 7.5px solid #ff4681;
    border-top: none;

    &::before,
    &::after {
      position: absolute;
      content: '';
      left: -10px;
      background-color: red;
      border-radius: 100%;
      width: 8px;
      height: 8px;
    }

    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      border: 7.5px solid #ff4681;
      border-top: none;
    }
  }

  @keyframes rotate-one {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(${props => props.rotation});
    }
  }

  @keyframes rotate-two {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(180deg);
    }
  }
`;

export const PieData = styled.div`
  position: absolute;
  top: 100%;
  width: inherit;
  height: inherit;
  border: 7.5px solid;
  border-top: none;
  border-bottom-left-radius: 175px;
  border-bottom-right-radius: 175px;
  transform-origin: 50% 0;
  animation-fill-mode: forwards;
  animation-duration: 0.4s;
  animation-timing-function: linear;
  transform-style: preserve-3d;
  backface-visibility: hidden;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    border: 7.5px solid;
    border-top: none;
  }
`;

export const ContainerVotes = styled.div`
  height: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  width: 4.5rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    top: -2rem;
    width: 4.5rem;
    min-width: 0;
    strong {
      font-size: 0.95rem !important;
    }
  }
  overflow: hidden;
`;

export const SubContainerVotes = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    justify-content: flex-end !important;
  }
`;

export const ContainerPerCentArrow = styled.div`
  display: flex;
`;

export const ContainerRewards = styled.span`
  display: flex;
  height: 5rem;
  flex-direction: column;
  justify-content: center;
  width: 4.5rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    top: -2rem;
    strong {
      font-size: 0.7rem !important;
    }
  }

  position: relative;
  height: 4rem;
`;

export const VotersPercent = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #37dd72;
  display: block;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1rem;
  }
`;

export const ContainerCircle = styled.span`
  height: 100%;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    margin-left: 0.2rem;
    margin-right: 0.2rem;
    position: relative;
    top: 1rem;
    height: 12rem;

    div,
    span {
      strong {
        font-size: 0.7rem !important;
      }
    }
  }
`;

export const CommissionPercent = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #ff4681;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1rem;
  }
`;

export const RewardCardContentWrapper = styled.div`
  display: flex;
  overflow: visible;
  position: relative;
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-end;

  height: 5rem;
  margin: 0;

  strong {
    font-weight: 600;
    font-size: 0.95rem;
    color: ${props => props.theme.darkText};
  }
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    bottom: 0.5rem;
    height: auto;
    bottom: 2.5rem;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    top: 1rem;
  }
`;
