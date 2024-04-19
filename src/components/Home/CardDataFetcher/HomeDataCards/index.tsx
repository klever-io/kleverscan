import { Accounts, TPS, Transactions } from '@/assets/cards';
import {
  NextImageCardWrapper,
  StackedImageWrapper,
} from '@/components/Home/ProposalsAndValidatorsSection/style';
import { useHomeData } from '@/contexts/mainPage';
import { useMobile } from '@/contexts/mobile';
import { useTheme } from '@/contexts/theme';
import { IDataCard } from '@/types/home';
import {
  ArrowData,
  ArrowDownDataCards,
  ButtonExpand,
  DataCard,
  DataCardContent,
  DataCardLatest,
  DataCardsContent,
  DataCardsWrapper,
  DataCardValue,
  EpochCardContent,
  ExpandData,
  MobileCardsContainer,
  MobileEpoch,
  Percentage,
} from '@/views/home';
import { CircularProgressContainer } from '@/views/validators';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import HomeDataCardsSkeleton from '../HomeDataCardsSkeleton';
import GradientSVG from './GradientSVG';

const DefaultCards: React.FC<{ index: number }> = ({ index }) => {
  const icons = [
    [
      '/homeCards/transactionsIcon.svg',
      '/homeCards/transactionsBackground.svg',
    ],
    ['/homeCards/accountsIcon.svg', '/homeCards/accountsBackground.svg'],
    ['/homeCards/tpsIcon.svg', '/homeCards/tpsBackground.svg'],
  ];

  return (
    <StackedImageWrapper>
      <NextImageCardWrapper>
        <Image
          src={icons[index][0]}
          alt="tps icon background"
          width={44}
          height={44}
          loader={({ src, width }) => `${src}?w=${width}`}
        />
      </NextImageCardWrapper>
      <NextImageCardWrapper>
        <Image
          src={icons[index][1]}
          alt="tps icon background"
          width={44}
          height={44}
          loader={({ src, width }) => `${src}?w=${width}`}
        />
      </NextImageCardWrapper>
    </StackedImageWrapper>
  );
};

const Progress: React.FC<{ percent: number }> = ({ percent }) => {
  const { isDarkTheme } = useTheme();
  const idCSS = 'gradient';

  return (
    <CircularProgressContainer>
      <GradientSVG />
      <CircularProgressbar
        counterClockwise
        strokeWidth={5}
        value={percent}
        styles={buildStyles({
          pathColor: `url(#gradient)`,
          trailColor: `${isDarkTheme ? '#404264' : '#F4F4F4'}`,
        })}
      />
    </CircularProgressContainer>
  );
};

const EpochCard: React.FC = () => {
  const { blocks, metrics } = useHomeData();
  const { t } = useTranslation('common', { keyPrefix: 'Cards' });
  const block = blocks && blocks[0];

  return (
    <DataCard className="epoch">
      <EpochCardContent>
        <span>
          {`${t('Epoch')}` + (block?.epoch ? ` #${block.epoch} ` : ' ')}
        </span>
        <DataCardValue isEpoch={true}>
          <p className="epochSeconds">
            {metrics.remainingTime?.toLocaleString()}
          </p>
        </DataCardValue>
        <small>Time remaining</small>
      </EpochCardContent>
      <Progress percent={metrics.epochLoadPercent} />
    </DataCard>
  );
};

const HomeDataCards: React.FC = ({}) => {
  const { t } = useTranslation('common', { keyPrefix: 'Cards' });
  const { isMobile, isTablet } = useMobile();

  const dataCardsRef = useRef<HTMLDivElement>(null);

  const {
    actualTPS,
    blocks,
    metrics,
    newTransactions,
    newAccounts = 0,
    totalAccounts,
    totalTransactions,
    loadingCards,
  } = useHomeData();

  const dataCards: IDataCard[] = [
    {
      Icon: Transactions,
      title: t('Total Transactions'),
      value: totalTransactions || 0,
      variation: `+ ${newTransactions.toLocaleString()}`,
    },
    {
      Icon: Accounts,
      title: t('Total Accounts'),
      value: totalAccounts || 0,
      variation: `+ ${newAccounts === 0 ? '0%' : newAccounts.toLocaleString()}`,
    },
    { title: t('Live/Peak TPS'), value: actualTPS, Icon: TPS },
  ];

  return !loadingCards ? (
    <DataCardsWrapper>
      <DataCardsContent ref={dataCardsRef}>
        <EpochCard />
        {dataCards.map(({ title, value, variation }, index) => (
          <DataCard key={String(index)}>
            <DefaultCards index={index} />
            <div>
              <span>{title}</span>
              <DataCardValue>
                <p>{value?.toLocaleString()}</p>
                {variation && !variation.includes('%') && (
                  <DataCardLatest positive={variation.includes('+')}>
                    <ArrowData $positive={variation.includes('+')} />
                    <p>{variation}/24h</p>
                  </DataCardLatest>
                )}
              </DataCardValue>
            </div>
          </DataCard>
        ))}
      </DataCardsContent>
    </DataCardsWrapper>
  ) : (
    <HomeDataCardsSkeleton />
  );
};

export default HomeDataCards;
