import { Accounts, Epoch, TPS, Transactions } from '@/assets/cards';
import Skeleton from '@/components/Skeleton';
import { useTheme } from '@/contexts/theme';
import { ICard, IEpochCard } from '@/types';
import {
  DataCard,
  DataCardLatest,
  DataCardsContent,
  DataCardsWrapper,
  DataCardValue,
  IconContainer,
  Percentage,
  ProgressContainerSpanSkeleton,
} from '@/views/home';
import {
  ProgressContainer,
  ProgressContent,
  ProgressIndicator,
  ProgressPercentage,
} from '@/views/validators';
import { useTranslation } from 'next-i18next';
import { ValueDetail } from '../../CoinDataFetcher/CoinCard/styles';

const HomeDataCardsSkeleton: React.FC = () => {
  const { t } = useTranslation('common', { keyPrefix: 'Cards' });

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
  const dataCards: ICard[] = [
    {
      Icon: Accounts,
      title: t('Total Accounts'),
      value: 0,
      variation: '',
    },
    {
      Icon: Transactions,
      title: t('Total Transactions'),
      value: 0,
      variation: '',
      percentage: 0,
    },
  ];

  const epochCards: IEpochCard[] = [
    {
      Icon: TPS,
      title: t('Live/Peak TPS'),
      value: 0,
    },
    {
      Icon: Epoch,
      title: '',
      value: 0,
      progress: 0,
    },
  ];

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
                <p>
                  <Skeleton height={19} />
                </p>
              </DataCardValue>
              {!variation.includes('%') && (
                <DataCardLatest positive={variation.includes('+')}>
                  <span>{t('Last 24h')}</span>
                  <Skeleton height={19} width={60} />

                  {index === 1 && (
                    <ValueDetail positive={true}>
                      <Skeleton height={19} width={40} />
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
              {index === 0 ? (
                <span>{title}</span>
              ) : (
                <span>
                  <Skeleton height={'1rem'} />
                </span>
              )}

              <Percentage>
                <p>
                  <Skeleton height={19} />
                </p>
                {progress >= 0 && (
                  <div>
                    <ProgressContainerSpanSkeleton>
                      <strong>
                        <Skeleton height={22} />
                      </strong>
                      <span>
                        <Skeleton height={15} />
                      </span>
                    </ProgressContainerSpanSkeleton>
                  </div>
                )}
              </Percentage>
            </DataCardValue>
          </DataCard>
        ))}
      </DataCardsContent>
    </DataCardsWrapper>
  );
};

export default HomeDataCardsSkeleton;
