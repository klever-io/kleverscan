import { Accounts, Epoch, TPS, Transactions } from '@/assets/cards';
import Skeleton from '@/components/Skeleton';
import { ICard, IEpochCard } from '@/types';
import {
  DataCard,
  DataCardLatest,
  DataCardsContent,
  DataCardsWrapper,
  DataCardValue,
  Percentage,
} from '@/views/home';
import { CircularProgressContainer } from '@/views/validators';
import { useTranslation } from 'next-i18next';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import GradientSVG from '../HomeDataCards/GradientSVG';

const HomeDataCardsSkeleton: React.FC = () => {
  const { t } = useTranslation('common', { keyPrefix: 'Cards' });

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
        <Skeleton width={20} height={21} />
        {progress >= 0 && (
          <div>
            <Progress percent={0} />
          </div>
        )}
      </Percentage>
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
      Icon: Epoch,
      title: t('Epoch'),
      value: 0,
      progress: 0,
    },
    {
      Icon: TPS,
      title: t('Live/Peak TPS'),
      value: 0,
    },
  ];

  return (
    <DataCardsWrapper>
      <DataCardsContent>
        {dataCards.map(
          ({ Icon, title, value, variation, percentage }, index) => (
            <DataCard key={String(index)}>
              <span>{title}</span>
              <DataCardValue>
                <p>
                  <Skeleton width={60} height={21} />
                </p>
                {!variation.includes('%') && (
                  <DataCardLatest positive={variation.includes('+')}>
                    {
                      <div>
                        <span>
                          <Skeleton width={60} height={21} />
                        </span>
                        <span>
                          <Skeleton width={60} height={21} />
                        </span>
                      </div>
                    }
                  </DataCardLatest>
                )}
              </DataCardValue>
            </DataCard>
          ),
        )}
      </DataCardsContent>
      <DataCardsContent>
        {epochCards.map(({ Icon, title, value, progress }, index) => (
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
    </DataCardsWrapper>
  );
};

export default HomeDataCardsSkeleton;
