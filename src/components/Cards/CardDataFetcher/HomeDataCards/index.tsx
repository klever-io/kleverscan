import { Accounts, Epoch, TPS, Transactions } from '@/assets/cards';
import { useHomeData } from '@/contexts/mainPage';
import { useMobile } from '@/contexts/mobile';
import { useTheme } from '@/contexts/theme';
import { IEpochCard } from '@/types';
import { IDataCard } from '@/types/home';
import {
  ArrowData,
  ArrowDownDataCards,
  ButtonExpand,
  CardBackground,
  CardIcon,
  CardIconContainer,
  DataCard,
  DataCardContent,
  DataCardLatest,
  DataCardsContent,
  DataCardsWrapper,
  DataCardValue,
  ExpandData,
  MobileCardsContainer,
  MobileEpoch,
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
  const { isMobile, isTablet } = useMobile();
  const { isDarkTheme } = useTheme();

  const {
    actualTPS,
    blocks,
    metrics,
    newTransactions,
    beforeYesterdayTransactions,
    newAccounts = 0,
    totalAccounts,
    totalTransactions,
    loadingCards,
  } = useHomeData();

  const icons = [
    [
      '/homeCards/transactionsIcon.svg',
      '/homeCards/transactionsBackground.svg',
    ],
    ['/homeCards/accountsIcon.svg', '/homeCards/accountsBackground.svg'],
    ['/homeCards/tpsIcon.svg', '/homeCards/tpsBackground.svg'],
  ];
  const block = blocks && blocks[0];

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

  const epochCards: IEpochCard[] = [
    {
      Icon: Epoch,
      title: `${t('Epoch')}` + (block?.epoch ? ` #${block.epoch} ` : ' '),
      value: metrics.remainingTime,
      progress: metrics.epochLoadPercent,
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
            trailColor: `${isDarkTheme ? '#404264' : '#F4F4F4'}`,
          })}
        />
      </CircularProgressContainer>
    );
  };

  const PercentageComponent: React.FC<{
    progress?: any;
    value?: string | number;
  }> = ({ progress, value }) => {
    return (
      <Percentage>
        <p className="epochSeconds">{value?.toLocaleString()}</p>
        {progress >= 0 && (
          <div>
            <Progress percent={metrics.epochLoadPercent} />
          </div>
        )}
      </Percentage>
    );
  };

  const displayCards = !isMobile
    ? dataCards
    : expanded
    ? dataCards
    : dataCards.slice(0, 1);
  return !loadingCards ? (
    <DataCardsWrapper>
      <DataCardsContent>
        {isTablet && !isMobile && (
          <>
            <MobileCardsContainer>
              {epochCards.map(({ title, value, progress }, index) => (
                <DataCard key={String(index)} className="epoch">
                  <DataCardValue isEpoch={true}>
                    <PercentageComponent progress={progress} />
                    <MobileEpoch>
                      <span>{title}</span>
                      <PercentageComponent value={value} />
                      {index === 0 && <small>Time remaining</small>}
                    </MobileEpoch>
                  </DataCardValue>
                </DataCard>
              ))}
              {
                <DataCard>
                  <CardIconContainer>
                    <CardIcon src="/homeCards/tpsIcon.svg" />
                    <CardBackground src="/homeCards/tpsBackground.svg" />
                  </CardIconContainer>
                  <div>
                    <span>{dataCards[2].title}</span>
                    <DataCardValue>
                      <p>{dataCards[2].value.toLocaleString()}</p>
                      {dataCards[2].variation &&
                        !dataCards[2].variation.includes('%') && (
                          <DataCardLatest
                            positive={dataCards[2].variation.includes('+')}
                          >
                            <ArrowData
                              $positive={dataCards[2].variation.includes('+')}
                            />
                            <p>{dataCards[2].variation}/24h</p>
                          </DataCardLatest>
                        )}
                    </DataCardValue>
                  </div>
                </DataCard>
              }
            </MobileCardsContainer>
            <MobileCardsContainer>
              {displayCards
                .slice(0, 2)
                .map(({ title, value, variation }, index) => (
                  <DataCard key={String(index)}>
                    <CardIconContainer>
                      <CardIcon src={icons[index][0]} />
                      <CardBackground src={icons[index][1]} />
                    </CardIconContainer>
                    <div>
                      <span>{title}</span>
                      <DataCardValue>
                        <p>{value.toLocaleString()}</p>
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
            </MobileCardsContainer>
          </>
        )}
        {isMobile &&
          epochCards.map(({ title, value, progress }, index) => (
            <>
              <DataCard key={String(index)} className="epoch">
                <DataCardValue isEpoch={true}>
                  <PercentageComponent progress={progress} />
                  <MobileEpoch>
                    <span>{title}</span>
                    <PercentageComponent value={value} />
                    {index === 0 && <small>Time remaining</small>}
                  </MobileEpoch>
                </DataCardValue>
              </DataCard>
              {displayCards.map(({ title, value, variation }, index) => (
                <DataCard key={String(index)}>
                  <CardIconContainer>
                    <CardIcon src={icons[index][0]} />
                    <CardBackground src={icons[index][1]} />
                  </CardIconContainer>
                  <DataCardContent>
                    <span>{title}</span>
                    <DataCardValue>
                      <p>{value.toLocaleString()}</p>
                      {variation && !variation.includes('%') && (
                        <DataCardLatest positive={variation.includes('+')}>
                          <ArrowData $positive={variation.includes('+')} />
                          <p>{variation}/24h</p>
                        </DataCardLatest>
                      )}
                    </DataCardValue>
                  </DataCardContent>
                </DataCard>
              ))}
            </>
          ))}
        {!isTablet &&
          epochCards.map(({ Icon, title, value, progress }, index) => (
            <DataCard key={String(index)} className="epoch">
              <span>{title}</span>
              <DataCardValue isEpoch={true}>
                {<PercentageComponent progress={progress} value={value} />}
              </DataCardValue>
              {index === 0 && <small>Time remaining</small>}
            </DataCard>
          ))}
        {!isTablet &&
          displayCards.map(({ Icon, title, value, variation }, index) => (
            <DataCard key={String(index)}>
              <CardIconContainer>
                <CardIcon src={icons[index][0]} />
                <CardBackground src={icons[index][1]} />
              </CardIconContainer>
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
      <ExpandData>
        <ButtonExpand onClick={() => setExpanded(!expanded)}>
          <ArrowDownDataCards $expanded={expanded} />
          <p>{expanded ? 'Hide Cards' : 'Expand Cards'}</p>
        </ButtonExpand>
      </ExpandData>
    </DataCardsWrapper>
  ) : (
    <HomeDataCardsSkeleton />
  );
};

export default HomeDataCards;
