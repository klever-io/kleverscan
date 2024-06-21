import { PropsWithChildren } from 'react';
import { Accounts, Epoch, TPS, Transactions } from '@/assets/cards';
import Skeleton from '@/components/Skeleton';
import {
  DataCard,
  DataCardsContent,
  DataCardsWrapper,
  DataCardValue,
} from '@/views/home';
import { useTranslation } from 'next-i18next';

const HomeDataCardsSkeleton: React.FC<PropsWithChildren> = () => {
  const { t } = useTranslation('common', { keyPrefix: 'Cards' });

  const dataCards: any[] = [
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
        {dataCards.map(({ title }, index) => (
          <DataCard
            key={String(index)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}
          >
            <span>{title}</span>
            <DataCardValue>
              {
                <div style={{ width: '100%' }}>
                  <span style={{ margin: '0.5rem', width: '100%' }}>
                    <Skeleton
                      containerCustomStyles={{ width: '100%' }}
                      height={40}
                    />
                  </span>
                </div>
              }
            </DataCardValue>
          </DataCard>
        ))}
      </DataCardsContent>
    </DataCardsWrapper>
  );
};

export default HomeDataCardsSkeleton;
