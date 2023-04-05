import { ArrowDown } from '@/assets/icons';
import Chart, { ChartType } from '@/components/Chart';
import { useHomeData } from '@/contexts/mainPage';
import { ICoinInfo } from '@/types/index';
import { getVariation } from '@/utils';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React, { useCallback, useRef, useState } from 'react';
import { IoReloadSharp } from 'react-icons/io5';
import CoinCardSkeleton from '../CoinCardSkeleton';
import {
  ArrowDownDiv,
  CardContainer,
  CardContent,
  CardContentError,
  ChartContainer,
  CoinSelector,
  CoinsSelector,
  Container,
  Content,
  ContentError,
  Description,
  HeaderContainer,
  HeaderContent,
  IconContainer,
  Name,
  NameError,
  TitleDetails,
  ValueContainer,
  ValueContent,
  ValueDetail,
} from './styles';

interface IDropDow {
  shortname: string;
  volume: { price: number; variation: number };
}

const CoinCard: React.FC = () => {
  const [selectedCoin, setSelectedCoin] = useState(0);
  const [loadingError, setLoadingError] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [arrowOpen, setArrowOpen] = useState(false);
  const { t } = useTranslation('common', { keyPrefix: 'Cards' });

  const { assetsData, coins, loadingCoins, getCoins } = useHomeData();

  const handleSelectCoin = useCallback(() => {
    if (carouselRef.current !== null && cardRef.current !== null)
      setSelectedCoin(
        Math.floor(
          carouselRef.current.scrollLeft / cardRef.current.offsetWidth,
        ),
      );
  }, [carouselRef, cardRef]);

  const handleSelection = (index: number) => {
    if (carouselRef.current !== null && cardRef.current !== null)
      carouselRef.current.scrollLeft = index * cardRef.current.offsetWidth;
  };

  const arrowOnClick = () => {
    if (arrowOpen) {
      setArrowOpen(false);
    } else {
      setArrowOpen(true);
    }
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
        (coin.shortname === 'KFI' &&
          typeof assetsData?.kfi?.prices?.todaysPrice !== 'number')
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
        } else if (
          coin.shortname === 'KFI' &&
          typeof assetsData?.kfi?.prices?.todaysPrice === 'number'
        ) {
          totalStakedInDolar = (
            currentCoin.totalStaking * assetsData.kfi.prices.todaysPrice
          ).toLocaleString(undefined, { maximumFractionDigits: 0 });
        }
      }

      return (
        <ValueContent isDropdown={coin.shortname === 'KLV' ? true : false}>
          <TitleDetails positive={getVariation(variation).includes('+')}>
            <p>{t('Total Staked')}</p>
            <span>{getVariation(variation)}</span>
          </TitleDetails>
          <ValueDetail>
            {coin.shortname === 'KLV' ? (
              <span>$ {totalStakedInDolar}</span>
            ) : (
              <span>$ {totalStakedInDolar}</span>
            )}
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

  const renderDropDown: React.FC<IDropDow> = coin => {
    return (
      assetsData && (
        <>
          {assetsData.klv && (
            <ValueContent>
              <TitleDetails
                positive={
                  coin.shortname === 'KLV'
                    ? getVariation(coin.volume.variation).includes('+')
                    : getVariation(0).includes('+')
                }
              >
                <p>{t('Volume')}</p>
                <span>{getVariation(coin.volume.variation)}</span>
              </TitleDetails>
              <ValueDetail>
                {coin.shortname === 'KLV' ? (
                  <>
                    {' '}
                    <span>
                      ${' '}
                      {coin.volume.price.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </>
                ) : (
                  <>
                    {' '}
                    <span>
                      $ {assetsData?.kfi?.volume?.toLocaleString() || '--'}
                    </span>
                  </>
                )}
              </ValueDetail>
            </ValueContent>
          )}
          {assetsData.kfi && (
            <ValueContent isDropdown={coin.shortname === 'KLV' ? true : false}>
              <TitleDetails
                positive={calcPercentageDiff(coin.shortname).includes('+')}
              >
                <p
                  style={
                    coin.shortname === 'KLV'
                      ? { width: '5rem', height: '1rem' }
                      : {}
                  }
                >
                  {t('Estimated APR')}
                </p>
                <span>{calcPercentageDiff(coin.shortname)}</span>
              </TitleDetails>
              <ValueDetail
                positive={calcPercentageDiff(coin.shortname).includes('+')}
              >
                {coin.shortname === 'KLV' ? (
                  <>
                    {' '}
                    <span>
                      {`${
                        assetsData.klv.estimatedAprYesterday?.toFixed(4) || '--'
                      } %`}
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      {`${
                        assetsData.kfi?.estimatedAprYesterday?.toFixed(4) ||
                        '--'
                      } ${t('KLV per KFI')}`}
                    </span>
                  </>
                )}
              </ValueDetail>
            </ValueContent>
          )}
        </>
      )
    );
  };

  const CoinsFetchFails: React.FC = () => {
    if (coins.length === 0) {
      return !loadingError ? (
        <CardContainer>
          <CardContentError>
            <HeaderContainer>
              <NameError>
                <span>Error while fetching data</span>
              </NameError>
            </HeaderContainer>
            <ContentError
              onClick={async () => {
                setLoadingError(true);
                await getCoins();
                setLoadingError(false);
              }}
            >
              <span>Retry</span>
              <IoReloadSharp />
            </ContentError>
          </CardContentError>
        </CardContainer>
      ) : (
        <CoinCardSkeleton />
      );
    }
    return <></>;
  };

  return !loadingCoins ? (
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
                    <Chart
                      data={coin.prices}
                      type={ChartType.Area}
                      hasTooltip={true}
                      strokeWidth={1}
                      yAxis={true}
                      height={'110%'}
                    />
                  </ChartContainer>
                ) : null}

                <ValueContainer isKLV={coin.shortname === 'KLV' ? true : false}>
                  <ValueContent>
                    <TitleDetails
                      positive={
                        coin.shortname === 'KLV'
                          ? getVariation(coin.marketCap.variation).includes('+')
                          : getVariation(0).includes('+')
                      }
                    >
                      <p>{t('Market Cap')}</p>
                      <span>{getVariation(coin.marketCap.variation)}</span>
                    </TitleDetails>
                    <ValueDetail>
                      {coin.shortname === 'KLV' ? (
                        <>
                          {' '}
                          <span>
                            $ {coin.marketCap.price?.toLocaleString()}
                          </span>
                        </>
                      ) : (
                        <>
                          <span>$ {renderKfiMarketCap()}</span>
                        </>
                      )}
                    </ValueDetail>
                  </ValueContent>
                  {renderTotalStaking(coin)}
                  {arrowOpen &&
                    coin.shortname === 'KLV' &&
                    renderDropDown(coin)}
                  {coin.shortname !== 'KLV' ? renderDropDown(coin) : null}
                </ValueContainer>
                {coin.shortname === 'KLV' ? (
                  <ArrowDownDiv open={!arrowOpen} onClick={arrowOnClick}>
                    <ArrowDown />
                  </ArrowDownDiv>
                ) : null}
              </CardContent>
            </CardContainer>
          );
        })}
        <CoinsFetchFails />
      </Content>

      <CoinsSelector>
        {coins.map((_, index) => (
          <CoinSelector
            key={String(index)}
            isSelected={selectedCoin === index}
            onClick={() => {
              handleSelection(index);
              setArrowOpen(false);
            }}
          />
        ))}
      </CoinsSelector>
    </Container>
  ) : (
    <CoinCardSkeleton />
  );
};

export default CoinCard;
