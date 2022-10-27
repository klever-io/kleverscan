import Chart from '@/components/Chart';
import { IAssetsData, ICoinInfo } from '@/types/index';
import { getVariation } from '@/utils/index';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React, { useCallback, useRef, useState } from 'react';
import {
  CardContainer,
  CardContent,
  ChartContainer,
  CoinSelector,
  CoinsSelector,
  Container,
  Content,
  Description,
  HeaderContainer,
  HeaderContent,
  IconContainer,
  Name,
  ValueContainer,
  ValueContent,
  ValueDetail,
} from './styles';

interface ICoinCard {
  coins: ICoinInfo[];
  actualTPS: string;
  assetsData: IAssetsData;
}

const CoinCard: React.FC<ICoinCard> = ({ coins, actualTPS, assetsData }) => {
  const [selectedCoin, setSelectedCoin] = useState(0);
  const carouselRef = useRef<any>(null);
  const cardRef = useRef<any>(null);

  const { t } = useTranslation('common', { keyPrefix: 'Cards' });

  const handleSelectCoin: any = useCallback(() => {
    setSelectedCoin(
      Math.floor(carouselRef.current.scrollLeft / cardRef.current.offsetWidth),
    );
  }, [carouselRef, cardRef]);

  const handleSelection = (index: number) => {
    carouselRef.current.scrollLeft = index * cardRef.current.offsetWidth;
  };

  const calcPercentageDiff = (coin: string) => {
    if (coin === 'KLV') {
      return getVariation(
        (assetsData.klv.estimatedAprYesterday -
          assetsData.klv.estimatedAprBeforeYesterday) /
          assetsData.klv.estimatedAprBeforeYesterday,
      );
    }
    return getVariation(
      (assetsData.kfi.estimatedAprYesterday -
        assetsData.kfi.estimatedAprBeforeYesterday) /
        assetsData.kfi.estimatedAprBeforeYesterday,
    );
  };

  const renderTotalStaking = useCallback(
    (coin: ICoinInfo) => {
      const currentCoin =
        coin.shortname === 'KLV'
          ? assetsData?.klv?.staking
          : assetsData?.kfi?.staking;

      let totalStakedInDolar;
      let variation;
      if (
        typeof currentCoin?.totalStaking !== 'number' ||
        typeof currentCoin?.dayBeforeTotalStaking !== 'number' ||
        typeof assetsData?.kfi?.prices?.todaysPrice !== 'number'
      ) {
        totalStakedInDolar = '--';
        variation = 0;
      } else {
        const todayPercent =
          (currentCoin.totalStaking * 100) / currentCoin.dayBeforeTotalStaking;
        const yesterdayPercent = 100;
        variation = todayPercent - yesterdayPercent;
        if (coin.shortname === 'KLV') {
          totalStakedInDolar = (
            currentCoin.totalStaking * coin.price
          ).toLocaleString(undefined, { maximumFractionDigits: 0 });
        } else {
          totalStakedInDolar = (
            currentCoin.totalStaking * assetsData.kfi.prices.todaysPrice
          ).toLocaleString(undefined, { maximumFractionDigits: 0 });
        }
      }

      return (
        <ValueContent>
          <p>{t('Total Staked')}</p>
          <ValueDetail positive={getVariation(variation).includes('+')}>
            {coin.shortname === 'KLV' ? (
              <span>$ {totalStakedInDolar}</span>
            ) : (
              <span>$ {totalStakedInDolar}</span>
            )}

            <p>{getVariation(variation)}</p>
          </ValueDetail>
        </ValueContent>
      );
    },
    [assetsData],
  );

  const renderKfiMarketCap = () => {
    if (
      typeof assetsData?.kfi?.circulatingSupply == 'number' &&
      typeof assetsData?.kfi?.prices?.todaysPrice == 'number'
    ) {
      return (
        assetsData?.kfi?.circulatingSupply *
        assetsData?.kfi?.prices?.todaysPrice
      ).toLocaleString();
    }
    return '--';
  };

  return (
    <Container>
      <Content ref={carouselRef} onScroll={handleSelectCoin}>
        {coins.map((coin, index) => {
          return (
            <CardContainer key={String(index)} ref={cardRef}>
              <CardContent>
                <Link href={`/asset/${coin.shortname}`}>
                  <a>
                    <HeaderContainer>
                      <IconContainer
                        src={`/coins/${coin.shortname.toLowerCase()}.png`}
                      />

                      <HeaderContent>
                        <Name>
                          <span>{coin.shortname}</span>
                          <span>
                            U${' '}
                            {coin.shortname === 'KLV'
                              ? coin.price.toLocaleString(undefined, {
                                  maximumFractionDigits: 6,
                                })
                              : assetsData?.kfi?.prices?.todaysPrice
                              ? assetsData?.kfi?.prices?.todaysPrice.toLocaleString(
                                  undefined,
                                  { maximumFractionDigits: 6 },
                                )
                              : '--'}
                          </span>
                        </Name>
                        <Description
                          positive={
                            coin.shortname === 'KLV'
                              ? getVariation(coin.variation).includes('+')
                              : getVariation(
                                  assetsData?.kfi?.prices?.variation || 0,
                                ).includes('+')
                          }
                        >
                          <span>{coin.name}</span>
                          <p>
                            {coin.shortname === 'KLV'
                              ? getVariation(coin.variation)
                              : getVariation(
                                  assetsData?.kfi?.prices?.variation || 0,
                                )}
                          </p>
                        </Description>
                      </HeaderContent>
                    </HeaderContainer>
                  </a>
                </Link>
                {coin.shortname === 'KLV' ? (
                  <ChartContainer>
                    <Chart data={coin.prices} />
                  </ChartContainer>
                ) : null}

                <ValueContainer>
                  <ValueContent>
                    <p>{t('Market Cap')}</p>
                    <ValueDetail
                      positive={
                        coin.shortname === 'KLV'
                          ? getVariation(coin.marketCap.variation).includes('+')
                          : getVariation(0).includes('+')
                      }
                    >
                      {coin.shortname === 'KLV' ? (
                        <>
                          {' '}
                          <span>$ {coin.marketCap.price.toLocaleString()}</span>
                          <p>{getVariation(coin.marketCap.variation)}</p>
                        </>
                      ) : (
                        <>
                          <span>$ {renderKfiMarketCap()}</span>
                          <p>{getVariation(0)}</p>
                        </>
                      )}
                    </ValueDetail>
                  </ValueContent>
                  <ValueContent>
                    <p>{t('Volume')}</p>
                    <ValueDetail
                      positive={
                        coin.shortname === 'KLV'
                          ? getVariation(coin.volume.variation).includes('+')
                          : getVariation(0).includes('+')
                      }
                    >
                      {coin.shortname === 'KLV' ? (
                        <>
                          {' '}
                          <span>
                            ${' '}
                            {coin.volume.price.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}
                          </span>
                          <p>{getVariation(coin.volume.variation)}</p>
                        </>
                      ) : (
                        <>
                          {' '}
                          <span>
                            ${' '}
                            {assetsData?.kfi?.volume?.toLocaleString() || '--'}
                          </span>
                          <p>{getVariation(0)}</p>
                        </>
                      )}
                    </ValueDetail>
                  </ValueContent>
                  {renderTotalStaking(coin)}
                  <ValueContent>
                    <p>{t('Estimated APR')}</p>
                    <ValueDetail
                      positive={calcPercentageDiff(coin.shortname).includes(
                        '+',
                      )}
                    >
                      {coin.shortname === 'KLV' ? (
                        <>
                          {' '}
                          <span>
                            {`${
                              assetsData.klv.estimatedAprYesterday?.toFixed(
                                4,
                              ) || '--'
                            } %`}
                          </span>
                          <p>{calcPercentageDiff(coin.shortname)}</p>
                        </>
                      ) : (
                        <>
                          <span>
                            {`${
                              assetsData.kfi?.estimatedAprYesterday?.toFixed(
                                4,
                              ) || '--'
                            } ${t('KLV per KFI')}`}
                          </span>
                          <p>{calcPercentageDiff(coin.shortname)}</p>
                        </>
                      )}
                    </ValueDetail>
                  </ValueContent>
                </ValueContainer>
              </CardContent>
            </CardContainer>
          );
        })}
      </Content>

      <CoinsSelector>
        {coins.map((_, index) => (
          <CoinSelector
            key={String(index)}
            isSelected={selectedCoin === index}
            onClick={() => {
              handleSelection(index);
            }}
          />
        ))}
      </CoinsSelector>
    </Container>
  );
};

export default CoinCard;
