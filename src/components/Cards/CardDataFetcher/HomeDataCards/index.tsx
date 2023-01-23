import { Accounts, Epoch, TPS, Transactions } from '@/assets/cards';
import Tooltip from '@/components/Tooltip';
import { useTheme } from '@/contexts/theme';
import { ICard, IEpochCard } from '@/types';
import { getVariation } from '@/utils/index';
import {
  DataCard,
  DataCardLatest,
  DataCardsContent,
  DataCardsWrapper,
  DataCardValue,
  IconContainer,
  Percentage,
  ProgressContainerSpan,
} from '@/views/home';
import {
  ProgressContainer,
  ProgressContent,
  ProgressIndicator,
  ProgressPercentage,
} from '@/views/validators';
import { useTranslation } from 'next-i18next';
import { IDataCards } from '../../../../types';
import { ValueDetail } from '../../CoinDataFetcher/CoinCard/styles';

const HomeDataCards: React.FC<IDataCards> = ({
  metrics,
  totalAccounts,
  newAccounts,
  totalTransactions,
  newTransactions,
  beforeYesterdayTransactions,
  actualTPS,
  block,
  counterEpoch,
}) => {
  const { t } = useTranslation('common', { keyPrefix: 'Cards' });

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
      Icon: TPS,
      title: t('Live/Peak TPS'),
      value: actualTPS,
    },
    {
      Icon: Epoch,
      title:
        `${t('Epoch')}` +
        (block?.epoch ? ` #${block.epoch + counterEpoch} ` : ' ') +
        `${t('Remaining Time')}`,
      value: metrics.remainingTime,
      progress: metrics.epochLoadPercent,
    },
  ];

  const Progress: React.FC<{ percent: number }> = ({ percent }) => {
    const { theme } = useTheme();

    return (
      <ProgressContainer>
        <ProgressContent>
          <ProgressIndicator percent={percent} />
        </ProgressContent>
        <ProgressPercentage textColor={theme.card.white}></ProgressPercentage>
      </ProgressContainer>
    );
  };

  const PercentageComponent: React.FC<{
    progress: any;
    value: string | number;
  }> = ({ progress, value }) => {
    if (progress) {
      return (
        <Percentage>
          <p>{value?.toLocaleString()}</p>
          {progress >= 0 && (
            <div>
              <ProgressContainerSpan>
                <strong>
                  <Progress percent={metrics.epochLoadPercent} />
                </strong>
                <span>
                  {metrics.epochLoadPercent.toFixed(2)}% to next epoch
                </span>
              </ProgressContainerSpan>
            </div>
          )}
        </Percentage>
      );
    }
    return <p>{value?.toLocaleString()}</p>;
  };

  return (
    <DataCardsWrapper>
      <DataCardsContent>
        {dataCards.map(
          ({ Icon, title, value, variation, percentage }, index) => (
            <DataCard key={String(index)}>
              <IconContainer>
                <Icon viewBox="0 0 70 70" />
              </IconContainer>
              <DataCardValue>
                <span>{title}</span>
                <p>{value.toLocaleString()}</p>
              </DataCardValue>
              {!variation.includes('%') && (
                <DataCardLatest positive={variation.includes('+')}>
                  <span>{t('Last 24h')}</span>
                  <p>{variation}</p>
                  {percentage && (
                    <ValueDetail positive={percentage > 0}>
                      <p>{getVariation(+percentage)}</p>
                    </ValueDetail>
                  )}
                </DataCardLatest>
              )}
            </DataCard>
          ),
        )}
      </DataCardsContent>
      <DataCardsContent>
        {epochCards.map(({ Icon, title, value, progress }, index) => (
          <DataCard key={String(index)}>
            <IconContainer>
              <Icon viewBox="0 0 70 70" />
            </IconContainer>
            <DataCardValue>
              <div>
                <span>{title}</span>
                {index === 0 && (
                  <span style={{ marginTop: '-0.25rem' }}>
                    <Tooltip msg="Transactions per second" />
                  </span>
                )}
              </div>
              {<PercentageComponent progress={progress} value={value} />}
            </DataCardValue>
          </DataCard>
        ))}
      </DataCardsContent>
    </DataCardsWrapper>
  );
};

export default HomeDataCards;
