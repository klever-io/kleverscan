import { ArrowGreen, ArrowPink } from '@/assets/icons';
import { KLV_PRECISION } from '@/utils/globalVariables';
import { getAge } from '@/utils/timeFunctions';
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
import { useTranslation } from 'next-i18next';
import React, { useEffect, useState } from 'react';
import Chart, { ChartType } from '../Chart';
import Skeleton from '../Skeleton';

interface IValidatorCards {
  totalStake: number | undefined;
  commission: number | undefined;
  maxDelegation: number | undefined;
}

const ValidatorCards: React.FC<IValidatorCards> = ({
  totalStake,
  commission,
  maxDelegation,
}) => {
  const { t } = useTranslation('validators');
  const { t: commonT } = useTranslation('common');
  const commissionPercent = (commission || 0) / 10 ** 2;
  const votersPercent = 100 - (commission || 0) / 10 ** 2;
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
    ((maxDelegation || 0) <= 0
      ? 100
      : (totalStake || 0) / (maxDelegation || 1)) * 100;

  const uptime = new Date().getTime();
  const [age, setAge] = useState(getAge(new Date(), commonT));

  useEffect(() => {
    const interval = setInterval(() => {
      const newAge = getAge(new Date(uptime / 1000), commonT);

      setAge(newAge);
    }, 1 * 1000); // 1 sec

    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <AllSmallCardsContainer>
      {typeof totalStake === 'number' ? (
        <Card marginLeft>
          <CardWrapper>
            <VotesHeader>
              <span>
                <strong>{t('CurrentDelegations')}</strong>
              </span>
              <span>
                <p>{`${age} ${commonT('Date.Elapsed Time')}`}</p>
              </span>
            </VotesHeader>
          </CardWrapper>
          <RewardsChart>
            <RewardsChartContent>
              <Chart type={ChartType.Area} data={data} />
            </RewardsChartContent>
            <VotesFooter>
              <span>{(totalStake / 10 ** KLV_PRECISION).toLocaleString()}</span>
              <span>
                <strong>{percentVotes}</strong>
              </span>
            </VotesFooter>
          </RewardsChart>
        </Card>
      ) : (
        <Skeleton width={'100%'} height={150} />
      )}
      {typeof commission === 'number' ? (
        <RewardsCard marginLeft marginRight>
          <RewardsCardHeader>
            <span>
              <strong>{t('RewardsRatio')}</strong>
            </span>
          </RewardsCardHeader>
          <CardSubHeader>
            <span>
              <strong>{t('Voters')}</strong>
            </span>
            <span>
              <strong>{t('Commission')}</strong>
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
      ) : (
        <Skeleton width={'100%'} height={150} />
      )}
      {typeof maxDelegation === 'number' && typeof totalStake === 'number' ? (
        <Card marginRight>
          <CardHeader>
            <span>
              <strong>{t('Delegated')}</strong>
            </span>
            <p>{`(${commonT('Date.Updated')}: ${age} ${commonT(
              'Date.Elapsed Time',
            )})`}</p>
          </CardHeader>
          <EmptyProgressBar>
            <ProgressContent percent={maxDelegation === 0 ? 0 : stakedPercent}>
              <StakedIndicator
                percent={maxDelegation === 0 ? 0 : stakedPercent}
              >
                {(totalStake / 10 ** KLV_PRECISION).toLocaleString()}
              </StakedIndicator>
            </ProgressContent>
            <PercentIndicator percent={maxDelegation === 0 ? 0 : stakedPercent}>
              <p>{maxDelegation === 0 ? 0 : stakedPercent?.toFixed(0)}%</p>
            </PercentIndicator>
          </EmptyProgressBar>
        </Card>
      ) : (
        <Skeleton width={'100%'} height={150} />
      )}
    </AllSmallCardsContainer>
  );
};

export default ValidatorCards;
