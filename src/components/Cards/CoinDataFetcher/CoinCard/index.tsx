import { InfoSquare } from '@/assets/icons';
import Chart, { ChartType } from '@/components/Chart';
import { PriceTooltip } from '@/components/Chart/Tooltips';
import { Loader } from '@/components/Loader/styles';
import { useMobile } from '@/contexts/mobile';
import {
  homeKfiCall,
  homeKfiChartCall,
  homeKfiDataCall,
  homeKfiPriceCall,
  homeKlvCall,
  homeKlvChartCall,
  homeKlvDataCall,
} from '@/services/requests/home';
import {
  IAssetsData,
  ICoinInfo,
  IGeckoChartResponse,
  IGeckoResponse,
} from '@/types';
import { getVariation } from '@/utils';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React, { useCallback, useRef, useState } from 'react';
import { IoReloadSharp } from 'react-icons/io5';
import { useQueries } from 'react-query';
import CoinCardSkeleton from '../CoinCardSkeleton';
import {
  ArrowTopRight,
  ArrowVariation,
  ButtonContainer,
  ButtonInformation,
  CardContainer,
  CardContent,
  CardContentError,
  ChartContainer,
  CoinSelector,
  CoinsSelector,
  Container,
  ContainerDesktop,
  Content,
  ContentDeskTop,
  ContentError,
  CurrencyIcon,
  Description,
  HeaderContainer,
  HeaderContent,
  HeaderGraph,
  IconContainer,
  Name,
  NameError,
  SetTimeContainer,
  SetTimeContainerLoaderWrapper,
  SpanTime,
} from './styles';

interface IDropDow {
  shortname: string;
  volume: { price: number; variation: number };
}
interface IPropsRenderCoinsCard {
  coin: ICoinInfo;
  cardRef: React.RefObject<HTMLDivElement>;
  renderKfiMarketCap: () => string;
  coinDays: React.MutableRefObject<ICoinTimes>;
  assetsData: IAssetsData;
  refetchCoin: () => void;
}

interface ICoinTimes {
  [name: string]: number | string;
}

const RenderCoinsCard: React.FC<IPropsRenderCoinsCard> = props => {
  const {
    coin,
    renderKfiMarketCap,
    coinDays,
    cardRef,
    assetsData,
    refetchCoin,
  } = props;
  const { shortname, name, price, variation, marketCap, prices } = coin;
  const { t } = useTranslation('common', { keyPrefix: 'Cards' });
  const [daysSelected, setSelectedDays] = useState<string | number>(1);
  const [switchCardLoading, setSwitchCardLoading] = useState(false);
  const timeGraph = [1, 30, 180];

  const handleClick = async (time: string | number) => {
    coinDays.current = {
      ...coinDays.current,
      [shortname]: time,
    };
    setSelectedDays(time);
    refetchCoin();
  };

  return (
    <CardContainer ref={cardRef}>
      <CardContent>
        <Link href={`/asset/${shortname}`}>
          <a>
            <HeaderContainer>
              <IconContainer
                src={`/coins/${shortname.toLowerCase()}.png`}
                width={50}
                height={50}
                loader={({ src, width }: { src: string; width: number }) =>
                  `${src}?w=${width}`
                }
              />

              <HeaderContent>
                <Name>
                  <span>{shortname}</span>
                  <p>{name}</p>
                </Name>
                <ArrowTopRight />
              </HeaderContent>
            </HeaderContainer>
          </a>
        </Link>
        <HeaderGraph>
          <div>
            <span>{t('Price')}</span>
            <p>
              ${' '}
              {shortname === 'KLV'
                ? price.toLocaleString(undefined, {
                    maximumFractionDigits: 6,
                  })
                : assetsData?.kfi?.prices?.todaysPrice
                ? assetsData?.kfi?.prices?.todaysPrice.toLocaleString(
                    undefined,
                    { maximumFractionDigits: 6 },
                  )
                : '--'}
            </p>
            <Description
              positive={
                shortname === 'KLV'
                  ? getVariation(variation).includes('+')
                  : getVariation(
                      assetsData?.kfi?.prices?.variation || 0,
                    ).includes('+')
              }
            >
              <div>
                <ArrowVariation
                  $isPositive={
                    shortname === 'KLV'
                      ? getVariation(variation).includes('+')
                      : getVariation(
                          assetsData?.kfi?.prices?.variation || 0,
                        ).includes('+')
                  }
                />
                {shortname === 'KLV'
                  ? getVariation(variation)
                  : getVariation(assetsData?.kfi?.prices?.variation || 0)}
              </div>
            </Description>
          </div>
          <div>
            <span>{t('Market Cap')}</span>
            {shortname === 'KLV' ? (
              <>
                {' '}
                <p>$ {marketCap.price?.toLocaleString()}</p>
              </>
            ) : (
              <>
                <p>$ {renderKfiMarketCap()}</p>
              </>
            )}
          </div>
        </HeaderGraph>
        <ChartContainer>
          <Chart
            data={prices}
            type={ChartType.Area}
            CustomTooltip={PriceTooltip}
            strokeWidth={1}
            yAxis={true}
            height={'130%'}
          />
        </ChartContainer>
        <SetTimeContainer>
          {switchCardLoading && (
            <SetTimeContainerLoaderWrapper>
              <Loader height={22} width={21} />
            </SetTimeContainerLoaderWrapper>
          )}
          {timeGraph.map((time, key) => (
            <SpanTime
              key={String(key)}
              onClick={() => {
                handleClick(time);
              }}
              selected={daysSelected === time}
            >
              {`${time}D`}
            </SpanTime>
          ))}
        </SetTimeContainer>
      </CardContent>
    </CardContainer>
  );
};
const CoinCard: React.FC = () => {
  const { t } = useTranslation('home');
  const coinsName = ['KLV', 'KFI'];
  const [selectedCoin, setSelectedCoin] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const coinDays = useRef<ICoinTimes>({
    KLV: 1,
    KFI: 1,
  });
  const { isTablet } = useMobile();
  const handleSelectCoin = useCallback(() => {
    if (carouselRef.current !== null && cardRef.current !== null)
      setSelectedCoin(
        carouselRef.current.scrollLeft / cardRef.current.offsetWidth,
      );
  }, [carouselRef, cardRef]);

  const handleSelection = (index: number) => {
    if (carouselRef.current !== null && cardRef.current !== null)
      carouselRef.current.scrollLeft = index * cardRef.current.offsetWidth;
  };

  const queryFnKlvChart = () => homeKlvChartCall(coinDays.current);
  const queryFnKfiChart = () => homeKfiChartCall(coinDays.current);

  const [
    klvDataResult,
    klvChartResult,
    kfiDataResult,
    kfiChartResult,
    klvDataInfo,
    kfiDataInfo,
    kfiPricesInfo,
  ] = useQueries([
    {
      queryKey: 'klvData',
      queryFn: homeKlvDataCall,
    },
    {
      queryKey: 'klvChartData',
      queryFn: queryFnKlvChart,
    },
    {
      queryKey: 'kfiData',
      queryFn: homeKfiDataCall,
    },
    {
      queryKey: 'kfiChartData',
      queryFn: queryFnKfiChart,
    },
    {
      queryKey: 'klvDataInfo',
      queryFn: homeKlvCall,
    },
    {
      queryKey: 'kfiDataInfo',
      queryFn: homeKfiCall,
    },
    {
      queryKey: 'klvPricesCall',
      queryFn: homeKfiPriceCall,
    },
  ]);

  const refetchCoinsCall = [klvChartResult.refetch, kfiChartResult.refetch];

  if (kfiDataInfo.data) {
    kfiDataInfo.data.volume = kfiPricesInfo.data?.kfiVolume;
    if (kfiDataInfo.data.prices) {
      kfiDataInfo.data.prices.todaysPrice =
        kfiPricesInfo.data?.kfiPricesTodaysPrice || null;
      kfiDataInfo.data.prices.variation =
        kfiPricesInfo.data?.kfiPricesVariation || null;
      kfiDataInfo.data.prices.yesterdayPrice =
        kfiPricesInfo.data?.kfipricesYesterdayPrice || null;
    }
  }
  const assetsData = {
    klv: { ...klvDataInfo.data },
    kfi: { ...kfiDataInfo.data },
  };

  const coins: ICoinInfo[] = [];

  const addCoins = (
    name: string,
    shortname: string,
    response: IGeckoResponse | undefined,
    chart: IGeckoChartResponse | undefined,
  ) => {
    coins.push({
      name,
      shortname,
      price: response?.market_data?.current_price.usd || 0,
      variation: response?.market_data?.price_change_percentage_24h || 0,
      marketCap: {
        price: response?.market_data?.market_cap.usd || 0,
        variation: response?.market_data?.market_cap_change_percentage_24h || 0,
      },
      volume: {
        price: response?.market_data?.total_volume.usd || 0,
        variation: 0,
      },
      prices: chart?.prices?.map(item => ({ value: item[1] })) || [],
    });
  };

  addCoins('Klever', 'KLV', klvDataResult.data, klvChartResult.data);
  addCoins('Klever Finance', 'KFI', kfiDataResult.data, kfiChartResult.data);

  const coinsLoadingBool = [
    klvDataResult.isLoading,
    klvChartResult.isLoading,
    kfiDataResult.isLoading,
    kfiChartResult.isLoading,
  ];

  const boolChecker = (arr: boolean[]) => arr.some(Boolean);

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

  const CoinsFetchFails: React.FC = () => {
    if (coins.length === 0) {
      return klvChartResult.isError && kfiChartResult.isError ? (
        <CardContainer>
          <CardContentError>
            <HeaderContainer>
              <NameError>
                <span>Error while fetching data</span>
              </NameError>
            </HeaderContainer>
            <ContentError
              onClick={async () => {
                refetchCoinsCall.forEach(refetchCoin => refetchCoin());
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

  return (
    <Container>
      {!isTablet ? (
        <ContainerDesktop>
          {!boolChecker(coinsLoadingBool) && (
            <div>
              {coinsName.map((coin, index) => (
                <ButtonContainer key={index}>
                  <a
                    target="_blank"
                    href={`https://bitcoin.me/us/trade/${coin}-USDT`}
                    rel="noreferrer"
                  >
                    <ButtonInformation>
                      {t('CardBuy', { asset: coin })}
                      <CurrencyIcon />
                    </ButtonInformation>
                  </a>
                </ButtonContainer>
              ))}
            </div>
          )}
          <ContentDeskTop>
            {coins.map((coin, index) => (
              <RenderCoinsCard
                renderKfiMarketCap={renderKfiMarketCap}
                assetsData={assetsData}
                refetchCoin={refetchCoinsCall[index]}
                coinDays={coinDays}
                cardRef={cardRef}
                coin={coin}
                key={index}
              />
            ))}
          </ContentDeskTop>
        </ContainerDesktop>
      ) : (
        <>
          <h1>Featured tokens</h1>
          <CoinsSelector>
            {coins.map((coin, index) => (
              <CoinSelector
                key={String(index)}
                isSelected={selectedCoin === index}
                onClick={() => {
                  handleSelection(index);
                }}
              >
                <IconContainer
                  src={`/coins/${coin.shortname.toLowerCase()}.png`}
                  width={20}
                  height={20}
                  loader={({ src, width }: { src: string; width: number }) =>
                    `${src}?w=${width}`
                  }
                />
                <p>{coin.shortname}</p>
              </CoinSelector>
            ))}
          </CoinsSelector>
          {!boolChecker(coinsLoadingBool) ? (
            <Content ref={carouselRef} onScroll={handleSelectCoin}>
              {coins.map((coin, index) => (
                <RenderCoinsCard
                  renderKfiMarketCap={renderKfiMarketCap}
                  assetsData={assetsData}
                  refetchCoin={refetchCoinsCall[index]}
                  cardRef={cardRef}
                  coinDays={coinDays}
                  coin={coin}
                  key={index}
                />
              ))}
            </Content>
          ) : (
            <CoinCardSkeleton />
          )}
          {!boolChecker(coinsLoadingBool) && (
            <ButtonContainer>
              <a
                target="_blank"
                href={`https://bitcoin.me/en/trade/${
                  selectedCoin === 0 ? 'KLV' : 'KFI'
                }-USDT`}
                rel="noreferrer"
              >
                <ButtonInformation>
                  {selectedCoin === 0
                    ? t('CardBuy', { asset: 'KLV' })
                    : t('CardBuy', { asset: 'KFI' })}
                  <InfoSquare />
                </ButtonInformation>
              </a>
            </ButtonContainer>
          )}
        </>
      )}
      <CoinsFetchFails />
    </Container>
  );
};

export default CoinCard;
