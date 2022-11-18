import { ArrowGreen, ArrowPink } from '@/assets/icons';
import { getAge } from '@/utils/index';
import {
  AllSmallCardsContainer,
  Card,
  CardHeader,
  CardSubHeader,
  CardWrapper,
  CommissionPercent,
  ContainerCircle,
  ContainerPerCentArrow,
  ContainerRewards,
  ContainerVotes,
  EmptyProgressBar,
  HalfCirclePie,
  PercentIndicator,
  PieData,
  ProgressContent,
  RewardCardContentWrapper,
  RewardsCard,
  RewardsCardHeader,
  RewardsChart,
  RewardsChartContent,
  StakedIndicator,
  SubContainerVotes,
  VotersPercent,
  VotesFooter,
  VotesHeader,
} from '@/views/validator';
import { fromUnixTime } from 'date-fns';
import React, { useEffect, useState } from 'react';
import Chart, { ChartType } from '../Chart';

interface IValidatorCards {
  totalStake: number;
  commission: number;
  maxDelegation: number;
}

const ValidatorCards: React.FC<IValidatorCards> = ({
  totalStake,
  commission,
  maxDelegation,
}) => {
  const precision = 6; // default KLV precision
  const commissionPercent = commission / 10 ** 2;
  const votersPercent = 100 - commission / 10 ** 2;
  const rotationPercent = (votersPercent * 180) / 10 ** 2;
  // mocked data:
  const data = [
    { value: 500, date: '12' },
    { value: 300, date: '13' },
    { value: 330, date: '13' },
    { value: 400, date: '13' },
    { value: 350, date: '13' },
    { value: 150, date: '13' },
    { value: 250, date: '13' },
    { value: 350, date: '13' },
    { value: 450, date: '13' },
    { value: 500, date: '13' },
  ];
  const percentVotes = '+3.75%';
  const stakedPercent =
    (maxDelegation <= 0 ? 100 : totalStake / maxDelegation) * 100;

  const uptime = new Date().getTime();
  const [age, setAge] = useState(
    getAge(fromUnixTime(new Date().getTime() / 1000)),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const newAge = getAge(fromUnixTime(uptime / 1000));

      setAge(newAge);
    }, 1 * 1000); // 1 sec

    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <AllSmallCardsContainer>
      <Card marginLeft>
        <CardWrapper>
          <VotesHeader>
            <span>
              <strong>Current Delegations</strong>
            </span>
            <span>
              <p>{`(Updated: ${age} ago)`}</p>
            </span>
          </VotesHeader>
        </CardWrapper>
        <RewardsChart>
          <RewardsChartContent>
            <Chart type={ChartType.Area} data={data} />
          </RewardsChartContent>
          <VotesFooter>
            <span>{(totalStake / 10 ** precision).toLocaleString()}</span>
            <span>
              <strong>{percentVotes}</strong>
            </span>
          </VotesFooter>
        </RewardsChart>
      </Card>
      <RewardsCard marginLeft marginRight>
        <RewardsCardHeader>
          <span>
            <strong>Reward Distribution Ratio</strong>
          </span>
        </RewardsCardHeader>
        <CardSubHeader>
          <span>
            <strong>Voters</strong>
          </span>
          <span>
            <strong>Commission</strong>
          </span>
        </CardSubHeader>
        <RewardCardContentWrapper>
          <ContainerVotes>
            <SubContainerVotes>
              <ContainerPerCentArrow>
                <ArrowGreen />
                <VotersPercent>{votersPercent}%</VotersPercent>
              </ContainerPerCentArrow>
            </SubContainerVotes>
          </ContainerVotes>
          <ContainerCircle>
            <HalfCirclePie rotation={`${rotationPercent}deg`}>
              <PieData></PieData>
              <PieData></PieData>
            </HalfCirclePie>
          </ContainerCircle>
          <ContainerRewards>
            <ContainerPerCentArrow>
              <ArrowPink />
              <CommissionPercent>{commissionPercent}%</CommissionPercent>
            </ContainerPerCentArrow>
          </ContainerRewards>
        </RewardCardContentWrapper>
      </RewardsCard>
      <Card marginRight>
        <CardHeader>
          <span>
            <strong>Delegated</strong>
          </span>
          <p>{`(Updated: ${age} ago)`}</p>
        </CardHeader>
        <EmptyProgressBar>
          <ProgressContent percent={maxDelegation === 0 ? 0 : stakedPercent}>
            <StakedIndicator percent={maxDelegation === 0 ? 0 : stakedPercent}>
              {(totalStake / 10 ** precision).toLocaleString()}
            </StakedIndicator>
          </ProgressContent>
          <PercentIndicator percent={maxDelegation === 0 ? 0 : stakedPercent}>
            <p>{maxDelegation === 0 ? 0 : stakedPercent?.toFixed(0)}%</p>
          </PercentIndicator>
        </EmptyProgressBar>
      </Card>
    </AllSmallCardsContainer>
  );
};

export default ValidatorCards;
