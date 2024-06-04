import { Accounts, TPS, Transactions } from '@/assets/cards';
import {
  NextImageCardWrapper,
  StackedImageWrapper,
} from '@/components/Home/ProposalsAndValidatorsSection/style';
import { useHomeData } from '@/contexts/mainPage';
import { useTheme } from '@/contexts/theme';
import { IDataCard } from '@/types/home';
import {
  ArrowData,
  DataCard,
  DataCardContent,
  DataCardLatest,
  DataCardValue,
  DataCardsContent,
  DataCardsWrapper,
  EpochCardContent,
} from '@/views/home';
import { CircularProgressContainer } from '@/views/validators';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRef } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import HomeDataCardsSkeleton from '../HomeDataCardsSkeleton';
import GradientSVG from './GradientSVG';

const icons = [
  ['/homeCards/transactionsIcon.svg', '/homeCards/transactionsBackground.svg'],
  ['/homeCards/accountsIcon.svg', '/homeCards/accountsBackground.svg'],
  ['/homeCards/tpsIcon.svg', '/homeCards/tpsBackground.svg'],
];

const DefaultCards: React.FC<{ index: number }> = ({ index }) => {
  return (
    <StackedImageWrapper>
      <NextImageCardWrapper>
        <Image
          src={icons[index][0]}
          alt=""
          width={44}
          height={44}
          loader={({ src, width }) => `${src}?w=${width}`}
        />
      </NextImageCardWrapper>
      <NextImageCardWrapper>
        <Image
          src={icons[index][1]}
          alt=""
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
  const { epoch, metrics } = useHomeData();
  const { t } = useTranslation('common', { keyPrefix: 'Cards' });

  return (
    <DataCard className="epoch">
      <Progress percent={metrics.epochLoadPercent} />
      <EpochCardContent>
        <span>{`${t('Epoch')}` + (epoch ? ` #${epoch} ` : ' ')}</span>
        <small>Time remaining</small>
        <DataCardValue isEpoch={true}>
          <p className="epochSeconds">
            {metrics.remainingTime?.toLocaleString()}
          </p>
        </DataCardValue>
      </EpochCardContent>
    </DataCard>
  );
};

const HomeDataCards: React.FC = () => {
  const dataCardsRef = useRef<HTMLDivElement>(null);

  const { t } = useTranslation('common', { keyPrefix: 'Cards' });

  const {
    livePeakTPS,
    newTransactions,
    beforeYesterdayTransactions,
    newAccounts = 0,
    totalAccounts,
    totalTransactions,
    loadingCards,
  } = useHomeData();

  const dataCards: IDataCard[] = [
    {
      Icon: Transactions,
      title: t('Total Transactions'),
      value: totalTransactions ?? 0,
      variation: `+ ${(
        newTransactions + (beforeYesterdayTransactions ?? 0)
      ).toLocaleString()}`,
    },
    {
      Icon: Accounts,
      title: t('Total Accounts'),
      value: totalAccounts ?? 0,
      variation: `+ ${newAccounts === 0 ? '0%' : newAccounts.toLocaleString()}`,
    },
    {
      title: t('Live/Peak TPS'),
      value: livePeakTPS,
      Icon: TPS,
    },
  ];

  return !loadingCards ? (
    <DataCardsWrapper>
      <DataCardsContent ref={dataCardsRef}>
        <EpochCard />
        {dataCards.map(({ title, value, variation }, index) => (
          <DataCard key={String(index)}>
            <DefaultCards index={index} />
            <DataCardContent>
              <span>{title}</span>
              <DataCardValue>
                <p>{value?.toLocaleString()}</p>
              </DataCardValue>
              {variation && !variation.includes('%') && (
                <DataCardLatest positive={variation.includes('+')}>
                  <ArrowData $positive={variation.includes('+')} />
                  <p>{variation}/24h</p>
                </DataCardLatest>
              )}
            </DataCardContent>
          </DataCard>
        ))}
      </DataCardsContent>
    </DataCardsWrapper>
  ) : (
    <HomeDataCardsSkeleton />
  );
};

export default HomeDataCards;
