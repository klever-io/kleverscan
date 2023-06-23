import { Accounts, Epoch, TPS, Transactions } from '@/assets/cards';
import { useHomeData } from '@/contexts/mainPage';
import { useMobile } from '@/contexts/mobile';
import { ICard, IEpochCard } from '@/types';
import {
  ArrowData,
  ArrowDownDataCards,
  ButtonExpand,
  DataCard,
  DataCardLatest,
  DataCardsContent,
  DataCardsWrapper,
  DataCardValue,
  ExpandData,
  Percentage,
} from '@/views/home';
import { CircularProgressContainer } from '@/views/validators';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import HomeDataCardsSkeleton from '../HomeDataCardsSkeleton';
import GradientSVG from './GradientSVG';

const HomeDataCards: React.FC = ({}) => {
  const { t } = useTranslation('common', { keyPrefix: 'Cards' });
  const [expanded, setExpanded] = useState(false);
  const { isMobile } = useMobile();
  const {
    actualTPS,
    blocks,
    metrics,
    newTransactions,
    beforeYesterdayTransactions,
    newAccounts,
    totalAccounts,
    totalTransactions,
    counterEpoch,
    loadingCards,
  } = useHomeData();

  const block = blocks[0];
  const dataCards: ICard[] = [
    {
      Icon: Accounts,
      title: t('Total Accounts'),
      value: totalAccounts,
      variation: `+ ${newAccounts === 0 ? '0%' : newAccounts.toLocaleString()}`,
    },
    {
      Icon: Transactions,
      title: t('Total Transactions'),
      value: totalTransactions,
      variation: `+ ${newTransactions.toLocaleString()}`,
      percentage: (newTransactions * 100) / beforeYesterdayTransactions - 100,
    },
  ];

  const epochCards: IEpochCard[] = [
    {
      Icon: Epoch,
      title:
        `${t('Epoch')}` +
        (block?.epoch ? ` #${block.epoch + counterEpoch} ` : ' '),
      value: metrics.remainingTime,
      progress: metrics.epochLoadPercent,
    },
    {
      Icon: TPS,
      title: t('Live/Peak TPS'),
      value: actualTPS,
    },
  ];

  const Progress: React.FC<{ percent: number }> = ({ percent }) => {
    const idCSS = 'gradient';
    return (
      <CircularProgressContainer>
        <GradientSVG />
        <CircularProgressbar
          counterClockwise
          value={percent}
          styles={buildStyles({
            pathColor: `url(#${idCSS})`,
            trailColor: '#404264',
          })}
        />
      </CircularProgressContainer>
    );
  };

  const PercentageComponent: React.FC<{
    progress: any;
    value: string | number;
  }> = ({ progress, value }) => {
    return (
      <Percentage>
        <p>{value?.toLocaleString()}</p>
        {progress >= 0 && (
          <div>
            <Progress percent={metrics.epochLoadPercent} />
          </div>
        )}
      </Percentage>
    );
  };

  const displayCards = !isMobile
    ? epochCards
    : expanded
    ? epochCards
    : epochCards.slice(0, 1);
  return !loadingCards ? (
    <DataCardsWrapper>
      <DataCardsContent>
        {dataCards.map(
          ({ Icon, title, value, variation, percentage }, index) => (
            <DataCard key={String(index)}>
              <span>{title}</span>
              <DataCardValue>
                <p>{value.toLocaleString()}</p>
                {!variation.includes('%') && (
                  <DataCardLatest positive={variation.includes('+')}>
                    <div>
                      <ArrowData positive={variation.includes('+')} />
                      <p>{variation}/24h</p>
                    </div>
                  </DataCardLatest>
                )}
              </DataCardValue>
            </DataCard>
          ),
        )}
      </DataCardsContent>
      <DataCardsContent>
        {displayCards.map(({ Icon, title, value, progress }, index) => (
          <DataCard key={String(index)}>
            <DataCardValue isEpoch={true}>
              <div>
                <span>{title}</span>
              </div>
              {<PercentageComponent progress={progress} value={value} />}
              {index === 0 && <small>Time remaining</small>}
            </DataCardValue>
          </DataCard>
        ))}
      </DataCardsContent>
      <ExpandData>
        <ButtonExpand onClick={() => setExpanded(!expanded)}>
          <ArrowDownDataCards expanded={expanded} />
          <p>{expanded ? 'Hide Cards' : 'Expand Cards'}</p>
        </ButtonExpand>
      </ExpandData>
    </DataCardsWrapper>
  ) : (
    <HomeDataCardsSkeleton />
  );
};

export default HomeDataCards;
